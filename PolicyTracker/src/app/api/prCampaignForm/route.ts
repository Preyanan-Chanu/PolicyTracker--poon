import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";
import pg from "@/app/lib/postgres";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}

export async function POST(req: NextRequest) {
  const {
    name,
    description,
    status,
    policy,
    banner,
    budget,
    expenses,
    partyName,
    area,
    impact,
    size,
  } = await req.json();

  const session = driver.session();
const client = await pg.connect();
  try {
    await client.query('BEGIN');
    const existing = await client.query("SELECT id FROM campaigns WHERE name = $1", [name]);
    if ((existing?.rowCount ?? 0) > 0) {
      await client.query('ROLLBACK');
    client.release();
      return new NextResponse(JSON.stringify({ error: "ชื่อโครงการนี้ถูกใช้ไปแล้ว" }), { status: 400 });
    }

    const progressMap: Record<string, number> = {
      "เริ่มโครงการ": 20,
      "วางแผน": 40,
      "ตัดสินใจ": 60,
      "ดำเนินการ": 80,
      "ประเมินผล": 100,
    };
    const progress = progressMap[status];

    // ✅ 1. สร้าง policy node ถ้ายังไม่มีใน Neo4j
    await session.run(
      `MERGE (p:Policy {name: $policy})
       ON CREATE SET 
         p.description = "โครงการพิเศษที่ไม่ได้ระบุนโยบายในระบบ",
         p.status = "เริ่มนโยบาย",
         p.like = 0`,
      { policy }
    );

    // ✅ 2. เชื่อม policy กับพรรคใน Neo4j
    if (partyName) {
      await session.run(
        `MATCH (p:Policy {name: $policy})
         MERGE (party:Party {name: $party})
         MERGE (p)-[:BELONGS_TO]->(party)`,
        { policy, party: partyName }
      );
    }

    // ✅ 3. ดึง party_id จาก PostgreSQL
    const partyRes = await client.query(`SELECT id FROM parties WHERE name = $1`, [partyName]);
    const partyId = partyRes.rows[0]?.id;
    if (!partyId) throw new Error("❌ ไม่พบพรรคใน PostgreSQL");

    // ✅ 4. สร้าง policy ใน PostgreSQL ถ้ายังไม่มี พร้อมแนบ party_id
    await client.query(
      `INSERT INTO policies (name, total_budget, created_at, party_id)
       VALUES ($1, 0, NOW(), $2)
       ON CONFLICT (name) DO NOTHING`,
      [policy, partyId]
    );

    // ✅ 5. ดึง policy_id มาใช้
    const checkPolicy = await client.query(`SELECT id FROM policies WHERE name = $1`, [policy]);
    if (checkPolicy.rows.length === 0) {
      throw new Error("❌ ไม่พบ policy ใน PostgreSQL");
    }
    const policy_id = checkPolicy.rows[0].id;

    // ✅ 6. สร้าง campaign
    const pgResult = await client.query(
      `INSERT INTO campaigns (name, policy_id, allocated_budget, area, impact, size, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [name, policy_id, budget, area, impact, size]
    );

    const campaign_id = pgResult.rows[0]?.id;
    if (!campaign_id) {
      throw new Error("ไม่สามารถสร้าง campaign ใน PostgreSQL ได้");
    }

    // ✅ 7. บันทึกลง Neo4j
    await session.run(
      `MERGE (c:Campaign {id: toInteger($id)})
       SET c.name = $name,
           c.description = $description,
           c.status = $status,
           c.progress = toInteger($progress),
           c.banner = $banner,
           c.area = $area,
           c.impact = $impact,
           c.size = $size
       WITH c
       MATCH (p:Policy {name: $policy})
       MERGE (c)-[:PART_OF]->(p)`,
      { id: Number(campaign_id), name, description, status, progress, banner, policy, area, impact, size }
    );

    // ✅ 8. บันทึกรายจ่าย
    if (Array.isArray(expenses)) {
      for (const exp of expenses) {
        const amount = Number(exp.amount);
        if (exp.description && !isNaN(amount)) {
          await client.query(
            `INSERT INTO expenses (campaign_id, description, amount, category)
             VALUES ($1, $2, $3, $4)`,
            [campaign_id, exp.description, amount, "ไม่ระบุ"]
          );
        }
      }
    }
await client.query('COMMIT');
  client.release();
    return new NextResponse(JSON.stringify({ message: "สร้างโครงการสำเร็จ" }), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("❌ Neo4j/PG Error:", err);
    await client.query("ROLLBACK");
    client.release();
    return new NextResponse(JSON.stringify({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } finally {
    await session.close();
  }
}



export async function GET(req: NextRequest) {
  const party = req.nextUrl.searchParams.get("party");
  if (!party) {
    return NextResponse.json({ policies: [] });
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Policy)-[:BELONGS_TO]->(:Party {name: $party})
       RETURN p.name AS name`,
      { party }
    );

    const policies = result.records.map((r) => r.get("name"));
    return NextResponse.json({ policies });
  } catch (err) {
    console.error("Error fetching policies:", err);
    return NextResponse.json({ policies: [] }, { status: 500 });
  } finally {
    await session.close();
  }
}
