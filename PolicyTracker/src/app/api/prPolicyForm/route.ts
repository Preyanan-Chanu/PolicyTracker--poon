import { NextRequest, NextResponse } from "next/server";
import driver from "@/app/lib/neo4j";

export async function POST(req: NextRequest) {
  const { name, description, banner, category } = await req.json();

  const session = driver.session();

  try {
    await session.run(
      `
      MERGE (p:Policy {name: $name})
      SET p.description = $description,
          p.status = "เริ่มนโยบาย",
          p.like = 0,
          p.banner = $banner
      MERGE (c:Category {name: $category})
      MERGE (p)-[:IN_CATEGORY]->(c)
      `,
      { name, description, banner, category }
    );

    return NextResponse.json({ message: "Policy created successfully" });
  } catch (error) {
    console.error("Neo4j Error:", error);
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  } finally {
    await session.close();
  }
}
