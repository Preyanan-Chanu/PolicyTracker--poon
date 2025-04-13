import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";

export async function GET(
  req: NextRequest,
  context: { params: { name: string } }
) {
  const session = driver.session();
  const { name } = context.params;

  try {
    const result = await session.run(
      `
      MATCH (p:Party {name: $name})
      RETURN {
        name: p.name,
        description: p.description,
        link: p.link,
        logo: p.logo
      } AS party
      `,
      { name }
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: `ไม่พบพรรค ${name}` }, { status: 404 });
    }

    const party = result.records[0].get("party");
    return NextResponse.json(party);
  } catch (err) {
    console.error("Neo4j error:", err);
    return NextResponse.json({ error: "Failed to fetch party" }, { status: 500 });
  } finally {
    await session.close();
  }
}
