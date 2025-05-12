import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";
import { ref, deleteObject, listAll } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import pg from "@/app/lib/postgres"; // ✅ เพิ่มสำหรับ PostgreSQL

// ✅ GET
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
  return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
}

  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Policy)-[:HAS_CATEGORY]->(c:Category)
       WHERE p.id = toInteger($id)
       RETURN p.name AS name, p.description AS description, c.name AS category`,
      { id: idNumber }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: "ไม่พบนโยบาย" }, { status: 404 });
    }

    const record = result.records[0];
    return NextResponse.json({
       id: idNumber,
      name: record.get("name"),
      description: record.get("description"),
      category: record.get("category"),
    });
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  } finally {
    await session.close();
  }
}

// ✅ DELETE
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
  return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
}

  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Policy) WHERE p.id = toInteger($id) RETURN p.name AS name`,
      { id: idNumber }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: "ไม่พบนโยบาย" }, { status: 404 });
    }

    const name = result.records[0].get("name");

    // 🔥 ลบไฟล์ Firebase: banner และ PDF
    for (const ext of ["jpg", "png"]) {
      try {
        const fileRef = ref(storage, `policy/banner/${name}.${ext}`);
        await deleteObject(fileRef);
      } catch {
        console.warn(`⚠️ ไม่พบแบนเนอร์ ${ext}`);
      }
    }

    try {
      const pdfRef = ref(storage, `policy/reference/${name}.pdf`);
      await deleteObject(pdfRef);
    } catch {
      console.warn(`⚠️ ไม่พบ PDF`);
    }

    // ❌ ลบจาก Neo4j
    await session.run(`MATCH (p:Policy) WHERE p.id = toInteger($id) DETACH DELETE p`, { id: idNumber });

    // ✅ ลบจาก PostgreSQL
    await pg.query(`DELETE FROM policies WHERE id = $1`, [idNumber]);

    try {
  const folderRef = ref(storage, `policy/picture/${name}`);
  const result = await listAll(folderRef);
  const deletePromises = result.items.map((item) => deleteObject(item));
  await Promise.all(deletePromises);
} catch (err) {
  console.warn(`⚠️ ลบรูปเพิ่มเติมไม่สำเร็จบางส่วน:`, err);
}

    return NextResponse.json({ message: "ลบนโยบายสำเร็จ" });
  } catch (err) {
    console.error("❌ DELETE error:", err);
    return NextResponse.json({ error: "ลบไม่สำเร็จ" }, { status: 500 });
  } finally {
    await session.close();
  }
}
