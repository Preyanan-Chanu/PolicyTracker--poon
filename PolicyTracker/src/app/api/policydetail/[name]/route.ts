import { NextRequest, NextResponse } from 'next/server';
import driver from '@/app/lib/neo4j'; // 🔹 นำเข้า Neo4j driver จาก config ของคุณ

export async function GET(req: NextRequest, context: { params: { name?: string } }) {
    const name = context?.params?.name;
    if (!name) {
      return NextResponse.json({ error: "Missing name param" }, { status: 400 });
    }
  
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
        return NextResponse.json({ error: `ไม่พบข้อมูลนโยบาย: ${name}` }, { status: 404 });
      }
  
      const record = result.records[0];
      const policy = record.get("policy");
      return NextResponse.json(policy); 
  } catch (error) {
    console.error("Neo4j Error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    await session.close();
  }
}
  
