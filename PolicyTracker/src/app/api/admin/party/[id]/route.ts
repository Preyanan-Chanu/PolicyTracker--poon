import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";
import { pool } from "@/app/lib/postgres";
import { storage } from "@/app/lib/firebase"; // firebase client you’ve set up
import { ref, deleteObject } from "firebase/storage";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ ต้อง await
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (p:Party {id: $id})
      RETURN p.name AS name, p.description AS description, p.link AS link
      `,
      { id }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: "ไม่พบพรรค" }, { status: 404 });
    }

    const record = result.records[0];
    return NextResponse.json({
      name: record.get("name"),
      description: record.get("description"),
      link: record.get("link"),
    });
  } catch (err) {
    console.error("❌ โหลดพรรคล้มเหลว:", err);
    return NextResponse.json({ error: "โหลดข้อมูลไม่สำเร็จ" }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ ต้อง await
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const { name, description, link } = await req.json();
  const session = driver.session();
  const client = await pool.connect();

  try {
    // 🔸 แก้ไขใน PostgreSQL
    await client.query("UPDATE parties SET name = $1 WHERE id = $2", [name, id]);

    // 🔹 แก้ไขใน Neo4j
    await session.run(
      `
      MATCH (p:Party {id: $id})
      SET p.name = $name,
          p.description = $description,
          p.link = $link
      `,
      { id, name, description, link }
    );

    return NextResponse.json({ message: "อัปเดตพรรคสำเร็จ" });
  } catch (err) {
    console.error("❌ อัปเดตพรรคล้มเหลว:", err);
    return NextResponse.json({ error: "อัปเดตไม่สำเร็จ" }, { status: 500 });
  } finally {
    await session.close();
    client.release();
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ ต้อง await
  const numericId = parseInt(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const session = driver.session();
  const client = await pool.connect();

  try {
    // ✅ ดึงชื่อพรรคก่อนลบ เพื่อใช้ลบ logo
    const result = await client.query("SELECT name FROM parties WHERE id = $1", [numericId]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "ไม่พบพรรคนี้" }, { status: 404 });
    }
    const name = result.rows[0].name;

    // ✅ ลบใน PostgreSQL
    await client.query("DELETE FROM parties WHERE id = $1", [numericId]);

    // ✅ ลบใน Neo4j
    await session.run("MATCH (p:Party {id: $id}) DETACH DELETE p", { id: numericId });

    // ✅ ลบไฟล์ logo จาก Firebase
    try {
      const logoRef = ref(storage, `party/logo/${name}.png`);
      await deleteObject(logoRef);
    } catch (err) {
  if (err instanceof Error) {
    console.warn("⚠️ ลบโลโก้จาก Firebase ไม่สำเร็จ:", err.message);
  } else {
    console.warn("⚠️ ลบโลโก้จาก Firebase ไม่สำเร็จ:", err);
  }
}

    return NextResponse.json({ message: "ลบพรรคสำเร็จ" });
  } catch (err) {
    console.error("❌ ลบพรรคล้มเหลว:", err);
    return NextResponse.json({ error: "ลบพรรคไม่สำเร็จ" }, { status: 500 });
  } finally {
    await session.close();
    client.release();
  }
}

