import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";
import pg from "@/app/lib/postgres";

export async function POST(req: NextRequest) {
  const { name, description, banner, category, party } = await req.json();
  const session = driver.session();

  if (!party || party === "ไม่ทราบชื่อพรรค") {
    return new NextResponse(JSON.stringify({ error: "ไม่พบข้อมูลพรรค" }), {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }

  try {
    // ✅ Clean ชื่อพรรค
    const cleanedParty = party.replace(/^พรรค\s*/g, "").trim();

    // ✅ ดึง party_id จาก PostgreSQL
    const partyResult = await pg.query(
      `SELECT id FROM parties WHERE name = $1`,
      [cleanedParty]
    );

    if (partyResult.rows.length === 0) {
      return NextResponse.json({ error: "ไม่พบ party ใน PostgreSQL" }, { status: 404 });
    }

    const party_id = partyResult.rows[0].id;

    const existing = await pg.query(
      `SELECT id FROM policies WHERE name = $1`,
      [name]
    );

    if ((existing?.rowCount ?? 0) > 0) {
      return NextResponse.json({ error: "ชื่อนโยบายนี้ถูกใช้ไปแล้ว" }, { status: 400 });
    }


    // ✅ INSERT ลง PostgreSQL แล้ว RETURNING id
    const pgResult = await pg.query(
      `
      INSERT INTO policies (name, total_budget, created_at, party_id)
      VALUES ($1, 0, NOW(), $2)
      RETURNING id
      `,
      [name, party_id]
    );

    const id = pgResult.rows[0].id; // ✅ ใช้ id จาก PostgreSQL

    // ✅ สร้าง Policy node ใน Neo4j โดยใช้ id นี้
    await session.run(
      `
      MERGE (p:Policy {id: toInteger($id)})
      SET p.name = $name,
          p.description = $description,
          p.banner = $banner,
          p.status = "เริ่มนโยบาย",
          p.like = 0,
          p.progress = "0%"

      WITH p
      MERGE (cat:Category {name: $category})
      MERGE (p)-[:HAS_CATEGORY]->(cat)

      WITH p
      MATCH (pt:Party {name: $party})
      MERGE (p)-[:BELONGS_TO]->(pt)
      `,
      { id, name, description, banner, category, party: cleanedParty }
    );



    return NextResponse.json({ message: "สร้างนโยบายสำเร็จ" });
  } catch (err) {
    console.error("❌ POST error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" }, { status: 500 });
  } finally {
    await session.close();
  }
}



// ✅ PUT: อัปเดตนโยบายจาก id
export async function PUT(req: NextRequest) {
  const { id, name, description, banner, category } = await req.json();
  const session = driver.session();

  if (!id) {
    return NextResponse.json({ error: "Missing policy ID" }, { status: 400 });
  }

  try {
    // ✅ 1. อัปเดต Neo4j
    await session.run(
      `
      MATCH (p:Policy {id: toInteger($id)})
      SET p.name = $name,
          p.description = $description,
          p.banner = $banner
      `,
      { id, name, description, banner }
    );

    // ✅ 2. ลบและเชื่อม HAS_CATEGORY ใหม่
    await session.run(
      `
      MATCH (p:Policy {id: toInteger($id)})-[r:HAS_CATEGORY]->()
      DELETE r
      `,
      { id }
    );

    await session.run(
      `
      MATCH (p:Policy {id: toInteger($id)})
      MERGE (cat:Category {name: $category})
      MERGE (p)-[:HAS_CATEGORY]->(cat)
      `,
      { id, category }
    );

    // ✅ 3. อัปเดต PostgreSQL
    await pg.query(
      `UPDATE policies SET name = $1 WHERE id = $2`,
      [name, id]
    );

    return NextResponse.json({ message: "แก้ไขนโยบายสำเร็จ" });
  } catch (err) {
    console.error("❌ PUT error:", err);
    return NextResponse.json({ error: "ไม่สามารถแก้ไขนโยบายได้" }, { status: 500 });
  } finally {
    await session.close();
  }
}

