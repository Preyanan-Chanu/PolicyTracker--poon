import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";

export async function GET(req: NextRequest) {
  try {
    const pathParts = req.nextUrl.pathname.split("/");
    const encodedCategory = pathParts[pathParts.length - 1];
    const category = decodeURIComponent(encodedCategory);

    const session = driver.session();

    const result = await session.run(
      `
      MATCH (p:Policy)-[:IN_CATEGORY]->(c:Category {name: $category})
      OPTIONAL MATCH (p)-[:BELONGS_TO]->(party:Party)
      RETURN p.name AS policyName,
             p.description AS description,
             p.budget AS budget,
             p.progress AS progress,
             c.name AS categoryName,
             party.name AS partyName
      `,
      { category }
    );

    const policies = result.records.map((record) => ({
      policyName: record.get("policyName"),
      description: record.get("description"),
      budget: record.get("budget")?.toNumber?.() ?? "-",
      progress: record.get("progress")?.toString?.() ?? "-",
      categoryName: record.get("categoryName"),
      partyName: record.get("partyName") || "ไม่ระบุพรรค",
    }));

    return NextResponse.json(policies);
  } catch (error) {
    console.error("Neo4j error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  } finally {
    const session = driver.session();
    await session.close();
  }
}
