import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";

export async function GET(
  req: NextRequest,
  context: { params: { partyName: string } }
) {
  let { partyName } = context.params;
  partyName = partyName.replace(/^พรรค\s*/g, "").trim();

  const session = driver.session();
  try {
    const query = `
      MATCH (p:Party {name: $partyName})
      RETURN p.description AS description, p.link AS link
    `;
    const result = await session.run(query, { partyName });

    if (result.records.length === 0) {
      return NextResponse.json({ error: "ไม่พบข้อมูลพรรค" }, { status: 404 });
    }

    const record = result.records[0];
    return NextResponse.json({
      description: record.get("description"),
      link: record.get("link"),
    });
  } catch (error) {
    console.error("Error fetching party info:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  } finally {
    await session.close();
  }
}
