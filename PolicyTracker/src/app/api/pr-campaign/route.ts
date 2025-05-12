import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";
import pg from "@/app/lib/postgres";

export async function POST(req: NextRequest) {
  const { partyName } = await req.json();
  if (!partyName) return NextResponse.json({ error: "Missing partyName" }, { status: 400 });

  const cleanedName = partyName.replace(/^พรรค\s*/g, "").trim();
  const session = driver.session();

  try {
    // ✅ 1. ดึงจาก Neo4j และแปลง Neo4j Integer
    const neoResult = await session.run(
      `
      MATCH (c:Campaign)-[:PART_OF]->(p:Policy)-[:BELONGS_TO]->(party:Party {name: $partyName})
      RETURN 
      c.id AS id,
  c.name AS name,
  c.description AS description,
  c.progress AS progress,
  c.status AS status,
  p.name AS policy
      `,
      { partyName: cleanedName }
    );

    const neoCampaigns = neoResult.records.map((r) => {
  const rawId = r.get("id");
  const rawProgress = r.get("progress");

  return {
    id: typeof rawId?.toNumber === "function" ? rawId.toNumber() : null,
    name: r.get("name"),
    description: r.get("description") || "-",
    progress: typeof rawProgress?.toNumber === "function" ? rawProgress.toNumber() : rawProgress ?? 0,
    policy: r.get("policy") || "-",
    status: r.get("status") || "-"
  };
});


    // ✅ กรอง id ที่เป็น number และไม่เกิน PostgreSQL int
    const validIds = neoCampaigns
      .map((c) => c.id)
      .filter((id): id is number => typeof id === "number" && id <= 2147483647);

    // ✅ 2. ดึงข้อมูลจาก PostgreSQL
    let pgCampaigns: Record<number, any> = {};
    if (validIds.length > 0) {
      const pgResult = await pg.query(
        `SELECT id, allocated_budget, created_at FROM campaigns WHERE id = ANY($1::int[])`,
        [validIds]
      );

      pgCampaigns = pgResult.rows.reduce((acc, row) => {
        acc[row.id] = row;
        return acc;
      }, {} as Record<number, any>);
    }

    // ✅ 3. รวมข้อมูล
    const combined = neoCampaigns
  .filter((c) => c.id !== null)
  .map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    progress: c.progress,
    policy: c.policy,
    status: c.status,
    budget: pgCampaigns[c.id]?.allocated_budget ?? null,
    created_at: pgCampaigns[c.id]?.created_at ?? null,
  }));


    console.log("✅ Neo4j campaigns:", combined);

    return NextResponse.json(combined);
  } catch (error) {
    console.error("❌ Error fetching campaigns:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  } finally {
    await session.close();
  }
}

export async function GET() {
  return NextResponse.json({ message: "This API expects a POST request." });
}
