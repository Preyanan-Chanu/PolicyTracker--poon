import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";

export async function GET(
  req: NextRequest,
  context: { params: { name: string } }
) {
  const name = decodeURIComponent(context.params.name); // ✅


  const session = driver.session();

  try {
    const result = await session.run(
      `
    MATCH (p:Policy {name: $name})
    OPTIONAL MATCH (c:Campaign)-[:PART_OF]->(p)
    WITH p, collect({ name: c.name, description: c.description }) AS relatedProjects
    RETURN {
      name: p.name,
      description: p.description,
      status: p.status,
      relatedProjects: relatedProjects
    } AS policy
    `,
  { name }
);

    if (result.records.length === 0) {
      return NextResponse.json({ error: "ไม่พบข้อมูลนโยบาย" }, { status: 404 });
    }

    const policy = result.records[0].get("policy");
    return NextResponse.json(policy);
  } catch (err) {
    console.error("Neo4j Error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" }, { status: 500 });
  } finally {
    await session.close();
  }
}
