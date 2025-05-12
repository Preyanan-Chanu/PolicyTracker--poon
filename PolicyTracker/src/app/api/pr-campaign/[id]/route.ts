// ✅ /api/pr-campaign/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";
import pg from "@/app/lib/postgres";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/app/lib/firebase";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const session = driver.session();

  try {
    // 1. ดึงจาก PostgreSQL
    const campaignResult = await pg.query(
      `SELECT c.id, c.name, c.allocated_budget, p.name as policy, c.area, c.impact, c.size
       FROM campaigns c
       JOIN policies p ON c.policy_id = p.id
       WHERE c.id = $1`,
      [idNumber]
    );

    if (campaignResult.rows.length === 0) {
      return NextResponse.json({ error: "ไม่พบโครงการ" }, { status: 404 });
    }

    const campaign = campaignResult.rows[0];

    // 2. ดึง description และ status จาก Neo4j
    const neoResult = await session.run(
  `MATCH (c:Campaign {id: toInteger($id)})
   RETURN c.name AS name, c.description AS description, c.status AS status, c.progress AS progress, c.area AS area, c.impact AS impact, c.size AS size`,
  { id: idNumber }
);

const neo = neoResult.records[0];

const name = neo?.get("name") ?? campaign.name;
const description = neo?.get("description") ?? "";
const status = neo?.get("status") ?? "";
const progress = neo?.get("progress") ?? 0;
const area = neo?.get("area") ?? campaign.area ?? "เขตเดียว";
    const impact = neo?.get("impact") ?? campaign.impact ?? "ต่ำ";
    const size = neo?.get("size") ?? campaign.size ?? "เล็ก";

if (neoResult.records.length === 0) {
  console.warn("⚠️ ไม่พบ Campaign ใน Neo4j");
}


    // 3. ดึงรายจ่ายจาก PostgreSQL
    const expensesResult = await pg.query(
      `SELECT description, amount FROM expenses WHERE campaign_id = $1`,
      [idNumber]
    );

    return NextResponse.json({
  id: campaign.id,
  name, // <- ใช้ name จาก Neo4j หรือ fallback PostgreSQL
  policy: campaign.policy,
  description,
  status,
  progress,
  budget: campaign.allocated_budget,
  area,
      impact,
      size,
  expenses: expensesResult.rows,
});

  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  } finally {
    await session.close();
  }
}




export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNumber = parseInt(id);
  if (isNaN(idNumber)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const session = driver.session();
  try {
    const result = await pg.query(`SELECT name FROM campaigns WHERE id = $1`, [idNumber]);
    const campaignName = result.rows[0].name; // แยกชัดเจน

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "ไม่พบโครงการ" }, { status: 404 });
    }

    const name = result.rows[0].name;

    try {
      const bannerRef = ref(storage, `campaign/banner/${name}.jpg`);
      await deleteObject(bannerRef);
    } catch (err) {
      console.warn("⚠️ ไม่พบแบนเนอร์หรือลบไม่ได้");
    }

    try {
      const pdfRef = ref(storage, `campaign/reference/${name}.pdf`);
      await deleteObject(pdfRef);
    } catch (err) {
      console.warn("⚠️ ไม่พบ PDF หรือลบไม่ได้");
    }

    await session.run(`MATCH (c:Campaign {id: $id}) DETACH DELETE c`, { id: idNumber });


    await pg.query(`DELETE FROM expenses WHERE campaign_id = $1`, [idNumber]);
await pg.query(`DELETE FROM campaigns WHERE id = $1`, [idNumber]);


    return NextResponse.json({ message: "ลบโครงการสำเร็จ" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "ลบโครงการไม่สำเร็จ" }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const idNumber = parseInt(id);

  if (isNaN(idNumber)) {
    console.error("❌ Invalid ID:", id);
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const {
    name,
    description,
    status,
    policy,
    budget,
    expenses,
    banner,
    area,
    impact,
    size
  } = await req.json();

  

  const session = driver.session();

  try {
    const progressMap: Record<string, number> = {
      "เริ่มโครงการ": 20,
      "วางแผน": 40,
      "ตัดสินใจ": 60,
      "ดำเนินการ": 80,
      "ประเมินผล": 100,
    };
    const progress = progressMap[status] ?? 0;

    // ✅ UPDATE Neo4j: ใช้ id property
    await session.run(
      `
      MATCH (c:Campaign {id: $id})
      OPTIONAL MATCH (c)-[r:PART_OF]->()
      DELETE r
      WITH c
      MATCH (p:Policy {name: $policy})
      MERGE (c)-[:PART_OF]->(p)
      SET c.name = $name,
          c.description = $description,
          c.status = $status,
          c.progress = $progress,
          c.banner = $banner,
          c.area = $area,
           c.impact = $impact,
           c.size = $size
      `,
      { id: idNumber, name, description, status, progress, banner, policy, area, impact, size }
    );

    console.log("✅ Neo4j campaign updated");

    // ✅ UPDATE PostgreSQL campaign budget
    await pg.query(
  `UPDATE campaigns SET allocated_budget = $1, name = $2, area = $3, impact = $4, size = $5 WHERE id = $6`,
  [budget, name, area, impact, size, idNumber]
);


    console.log("✅ PostgreSQL budget updated");

    // ✅ DELETE old expenses
    await pg.query(`DELETE FROM expenses WHERE campaign_id = $1`, [idNumber]);
    console.log("🗑️ Deleted old expenses");

    // ✅ INSERT new expenses
    if (Array.isArray(expenses)) {
      for (const exp of expenses) {
        const amount = Number(exp.amount);
        if (exp.description && !isNaN(amount)) {
          await pg.query(
            `INSERT INTO expenses (campaign_id, description, amount, category)
             VALUES ($1, $2, $3, $4)`,
            [idNumber, exp.description, amount, "ไม่ระบุ"]
          );
        }
      }
    }

    console.log("✅ Expenses inserted");

    return NextResponse.json({ message: "แก้ไขโครงการสำเร็จ" });
  } catch (err) {
    console.error("❌ PUT error:", err);
    return NextResponse.json({ error: "ไม่สามารถแก้ไขโครงการได้" }, { status: 500 });
  } finally {
    await session.close();
  }
}

