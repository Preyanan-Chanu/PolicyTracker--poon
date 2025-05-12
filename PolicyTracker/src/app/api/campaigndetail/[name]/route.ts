// src/app/api/campaigndetail/[name]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import driver from '@/app/lib/neo4j'
import { storage } from '@/app/lib/firebase'
import { ref, getDownloadURL } from 'firebase/storage'

export async function GET(
  req: NextRequest,
  context: { params: { name?: string } }
) {
  const name = context.params.name; // ✅ ใช้แบบนี้แทน

  if (!name) {
    return NextResponse.json({ error: 'Missing name param' }, { status: 400 })
  }

  const session = driver.session()
  try {
    // 1) ดึงข้อมูล Campaign + relatedPolicies + party
    const result = await session.run(
      `
          MATCH (c:Campaign {name: $name})-[:PART_OF]->(p:Policy)
    
    // หา campaign อื่นๆ ที่อยู่ใน policy เดียวกัน ยกเว้นตัวเอง
    OPTIONAL MATCH (p)<-[:PART_OF]-(other:Campaign)
      WHERE other.name <> $name
    WITH c, p, collect({ name: other.name, description: other.description }) AS relatedProjects

    // ดึงพรรค
    OPTIONAL MATCH (p)-[:BELONGS_TO]->(party:Party)
    WITH c, p, relatedProjects, head(collect(party)) AS partyNode

    // ✅ ดึง Event ที่เชื่อมกับ Campaign ผ่าน UNDER_CAMPAIGN
    OPTIONAL MATCH (e:Event)-[:UNDER_CAMPAIGN]->(c)
    WITH c, p, relatedProjects, partyNode,
         collect({ name: e.name, description: e.description }) AS relatedEvents

    RETURN {
      name: c.name,
      description: c.description,
      status: c.status,
      relatedProjects: relatedProjects,
      relatedEvents: relatedEvents,
      policy: {
        name: p.name,
        description: p.description,
        status: p.status
      },
      party: CASE WHEN partyNode IS NULL THEN null ELSE {
        name: partyNode.name,
        description: partyNode.description,
        link: partyNode.link
      } END
    } AS campaign
  `,
  { name }
)

    if (result.records.length === 0) {
      return NextResponse.json({ error: `ไม่พบข้อมูลโครงการ: ${name}` }, { status: 404 })
    }

    const campaign = result.records[0].get('campaign')

    // 2) ดึง banner จาก Firebase Storage (jpg, png)
    let bannerUrl: string | null = null
    for (const ext of ['jpg', 'png'] as const) {
      try {
        bannerUrl = await getDownloadURL(
          ref(storage, `campaign/banner/${name}.${ext}`)
        )
        break
      } catch { }
    }

    // 3) ส่งกลับ JSON พร้อม campaign data และ banner URL (ถ้ามี)
    return NextResponse.json({
      ...campaign,
      banner: bannerUrl
    })
  } catch (error: any) {
    console.error('Neo4j Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  } finally {
    await session.close()
  }
}