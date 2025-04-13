import { NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";

export async function GET() {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (p:Policy)-[:BELONGS_TO]->(party:Party)
      RETURN p.name AS policyName,
             p.description AS description,
             p.budget AS budget,
             p.progress AS progress,
             party.name AS partyName
    `);

    const policies = result.records.map((record) => ({
      policyName: record.get("policyName"),
      description: record.get("description"),
      budget: record.get("budget")?.toNumber?.() ?? "-",
      progress: record.get("progress")?.toString?.() ?? "-",
      partyName: record.get("partyName") || "ไม่ระบุพรรค",
    }));

    return NextResponse.json(policies);
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  } finally {
    await session.close();
  }
}
