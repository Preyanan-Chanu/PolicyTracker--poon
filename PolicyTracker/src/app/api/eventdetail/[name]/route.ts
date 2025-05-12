import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";

export async function GET(
  req: NextRequest,
  context: { params: { name: string } }
) {
  const name = decodeURIComponent(context.params.name);

  const session = driver.session();
  try {
    const result = await session.run(
      `
      MATCH (e:Event {name: $name})
      OPTIONAL MATCH (e)-[:LOCATED_IN]->(p:Province)
      OPTIONAL MATCH (e)-[:ORGANIZED_BY]->(party:Party)
      OPTIONAL MATCH (e)-[:RELATED_POLICY]->(po:Policy)
      RETURN e.name AS name,
             e.description AS description,
             e.date AS date,
             e.time AS time,
             e.location AS location,
             e.map AS map,
             p.name AS province,
             party.name AS party,
             po.name AS relatedPolicyName,
             po.description AS relatedPolicyDescription
      `,
      { name }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: "ไม่พบกิจกรรม" }, { status: 404 });
    }

    const record = result.records[0];
    const data = {
      name: record.get("name"),
      description: record.get("description"),
      date: record.get("date"),
      time: record.get("time"),
      location: record.get("location"),
      map: record.get("map"),
      province: record.get("province"),
      party: record.get("party"),
      relatedPolicy: record.get("relatedPolicyName")
        ? {
            name: record.get("relatedPolicyName"),
            description: record.get("relatedPolicyDescription"),
          }
        : null,
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error("Neo4j error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  } finally {
    await session.close();
  }
}
