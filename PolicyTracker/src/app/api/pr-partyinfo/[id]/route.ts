import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";

// 👉 GET: ดึงข้อมูลพรรคตาม id
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const idRaw = context.params.id;
  const id = parseInt(idRaw);

  if (isNaN(id)) {
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
      return NextResponse.json({ error: "ไม่พบข้อมูลพรรค" }, { status: 404 });
    }

    const record = result.records[0];
    return NextResponse.json({
      name: record.get("name"),
      description: record.get("description"),
      link: record.get("link"),
    });
  } catch (error) {
    console.error("❌ Error fetching party by id:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการโหลดข้อมูล" }, { status: 500 });
  } finally {
    await session.close();
  }
}

// 👉 POST: แก้ไขข้อมูลพรรค (name, description, link)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const idNumber = parseInt(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const session = driver.session();
  const { name, description, link } = await req.json();

  try {
    await session.run(
      `
      MERGE (p:Party {id: $id})
      SET p.name = $name,
          p.description = $description,
          p.link = $link
      `,
      { id, name, description, link }
    );

    return NextResponse.json({ message: "✅ บันทึกสำเร็จ" });
  } catch (error) {
    console.error("❌ Error saving party:", error);
    return NextResponse.json({ error: "บันทึกไม่สำเร็จ" }, { status: 500 });
  } finally {
    await session.close();
  }
}

// 👉 DELETE: ลบพรรคตาม id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const idNumber = parseInt(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const session = driver.session();

  try {
    await session.run(`MATCH (p:Party {id: $id}) DETACH DELETE p`, { id });
    return NextResponse.json({ message: "✅ ลบสำเร็จ" });
  } catch (error) {
    console.error("❌ Error deleting party:", error);
    return NextResponse.json({ error: "ไม่สามารถลบได้" }, { status: 500 });
  } finally {
    await session.close();
  }
}
