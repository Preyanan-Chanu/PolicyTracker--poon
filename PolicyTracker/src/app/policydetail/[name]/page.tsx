"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { firestore } from "@/app/lib/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";
import Step from "@/app/components/step";
import { useRouter } from "next/navigation";

interface TimelineItem {
  date: string;
  name: string;
  description: string;
}

interface AchievementItem {
  name: string;
  description: string;
}

interface Achievements {
  [key: string]: AchievementItem | null;
}

const PolicyDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const name = decodeURIComponent(params.name as string);

  const [policyName, setPolicyName] = useState("");
  const [description, setDescription] = useState("");
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [achievement, setAchievement] = useState<{
    project?: { name: string; description: string };
    process?: { name: string; description: string };
    policy?: { name: string; description: string };
  }>({});
  const [status, setStatus] = useState<number | null>(null); // เก็บสถานะจาก Neo4j
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const stepMap: Record<string, { label: string; color: string; step: number }> = {
    "เสนอ": { label: "เสนอ", color: "#F59E0B", step: 1 },
    "พิจารณา": { label: "พิจารณา", color: "#3B82F6", step: 2 },
    "ตัดสินใจ": { label: "ตัดสินใจ", color: "#F97316", step: 3 },
    "ดำเนินการ": { label: "ดำเนินการ", color: "#10B981", step: 4 },
    "สำเร็จ": { label: "สำเร็จ", color: "#8B5CF6", step: 5 },
  };
  const [relatedProjects, setRelatedProjects] = useState<{ name: string; description: string }[]>([]);


  

  useEffect(() => {
    console.log("✅ Status จาก Neo4j:", status);
  }, [status]);

  useEffect(() => {

    type AchievementData = { name: string; description: string };

    const fetchNeo4j = async () => {
      try {
        const res = await fetch(`/api/policydetail/${encodeURIComponent(name)}`);
        const data = await res.json();
        setPolicyName(data.name || name);
        setDescription(data.description || "");
        setStatus(data.status || null);
        setRelatedProjects(data.relatedProjects || []); // ✅ set โครงการ
    
        if (Array.isArray(data.relatedProjects)) {
          setRelatedProjects(data.relatedProjects);
        }
      } catch (error) {
        console.error("Neo4j error:", error);
      }
    };
  
    const fetchTimeline = () => {
        const timelineRef = collection(firestore, "Policy", name, "sequence");
        onSnapshot(timelineRef, (snapshot) => {
          const items: TimelineItem[] = snapshot.docs.map((doc) => doc.data() as TimelineItem);
      
          // ✅ เรียงลำดับวันที่ใหม่ (จากล่าสุด -> เก่าสุด)
          const sorted = items.sort((a, b) => {
            // แปลง date string → Date object แล้วเปรียบเทียบ
            const dateA = new Date(a.date.replace(/(\d+)\s([^\d]+)\s(\d+)/, (_, d, m, y) => {
              const thMonths = {
                "ม.ค.": "Jan", "ก.พ.": "Feb", "มี.ค.": "Mar", "เม.ย.": "Apr",
                "พ.ค.": "May", "มิ.ย.": "Jun", "ก.ค.": "Jul", "ส.ค.": "Aug",
                "ก.ย.": "Sep", "ต.ค.": "Oct", "พ.ย.": "Nov", "ธ.ค.": "Dec",
              };
              return `${d} ${thMonths[m as keyof typeof thMonths] || m} ${parseInt(y) - 543}`; // แปลง พ.ศ. → ค.ศ.
            }));
      
            const dateB = new Date(b.date.replace(/(\d+)\s([^\d]+)\s(\d+)/, (_, d, m, y) => {
              const thMonths = {
                "ม.ค.": "Jan", "ก.พ.": "Feb", "มี.ค.": "Mar", "เม.ย.": "Apr",
                "พ.ค.": "May", "มิ.ย.": "Jun", "ก.ค.": "Jul", "ส.ค.": "Aug",
                "ก.ย.": "Sep", "ต.ค.": "Oct", "พ.ย.": "Nov", "ธ.ค.": "Dec",
              };
              return `${d} ${thMonths[m as keyof typeof thMonths] || m} ${parseInt(y) - 543}`;
            }));
      
            return dateB.getTime() - dateA.getTime(); // ✅ เรียงจากใหม่ → เก่า
          });
      
          setTimeline(sorted);
        });
      };
      
  
    const fetchAchievements = async () => {
      const processRef = doc(firestore, "Policy", name, "achievement", "เชิงกระบวนการ");
      const policyRef = doc(firestore, "Policy", name, "achievement", "เชิงการเมือง");
      const projectRef = doc(firestore, "Policy", name, "achievement", "เชิงโครงการ");
  
      const [processSnap, policySnap, projectSnap] = await Promise.all([
        getDoc(processRef),
        getDoc(policyRef),
        getDoc(projectRef),
      ]);
  
      setAchievement({
        process: processSnap.exists() ? (processSnap.data() as AchievementData) : undefined,
        policy: policySnap.exists() ? (policySnap.data() as AchievementData) : undefined,
        project: projectSnap.exists() ? (projectSnap.data() as AchievementData) : undefined,
      });
      
    };

    const fetchPolicy = async () => {
        const res = await fetch(`/api/policydetail/${encodeURIComponent(name)}`);
        const data = await res.json();
        setPolicyName(data.name || "name");
        setDescription(data.description || "");
        setStatus(data.status || null); // เก็บค่า status
    };

    fetchNeo4j();
    fetchTimeline();
    fetchAchievements();
  }, [name]);
  

  return (
    <div className="bg-white">
      <Navbar />
      <div className="grid grid-rows-[auto_auto_1fr_1fr] grid-cols-4 grid-rows-4 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] h-[60svh]">
        <div className="flex items-start ml-10 mt-10">
        <button
            onClick={() => router.back()}
            className="text-[#5D5A88] bg-[#FFFFFF] hover:bg-[#5D5A88] hover:text-[#FFFFFF] rounded-full px-4 py-2"
          >
            ย้อนกลับ
        </button>
        </div>
        <div className="col-start-2 row-start-1 row-end-2 text-center col-span-2 row-span-2 overflow-hidden">
          <h1 className="text-white p-10 font-bold text-[2.5rem]">{policyName}</h1>
          <p className="text-white text-[1rem] m-0">{description}</p>
        </div>
        <div className="row-start-3 col-start-2 flex justify-end items-end p-10">
        {status && stepMap[status] && (
            <Step
                step={stepMap[status].step}
                label={stepMap[status].label}
                bgColor={stepMap[status].color}
            />
            )}
        </div>
    </div>

      <div className="w-5/6 mx-auto">
        <h2 className="text-[#5D5A88] my-10">ลำดับเหตุการณ์</h2>
        {/* ✅ สร้าง State เพื่อดูว่าจะแสดงทั้งหมดไหม */}
{timeline.length > 0 && (
  <>
    <ol className="items-center sm:flex bg-white mb-0 flex-wrap">
      {(showAllTimeline ? timeline : timeline.slice(0, 4)).map((item, idx) => (
        <li key={idx} className="relative mb-6 sm:mb-0 w-full sm:w-auto">
          <div className="flex items-center">
            <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full"></div>
            <div className="hidden sm:flex w-full bg-gray-200 h-0.5"></div>
          </div>
          <div className="mt-3 sm:pe-8">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <time className="block mb-2 text-sm text-gray-400">{item.date}</time>
            <p className="text-base text-gray-500">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>

    {/* ✅ ปุ่มดูเพิ่มเติม */}
    {timeline.length > 4 && (
      <div className="text-center mt-4">
        <button
          className="px-4 py-2 bg-[#5D5A88] text-white rounded-md"
          onClick={() => setShowAllTimeline(!showAllTimeline)}
        >
          {showAllTimeline ? "แสดงน้อยลง" : "ดูเพิ่มเติม"}
        </button>
      </div>
    )}
  </>
)}

        <h2 className="text-[#5D5A88] my-10">ความสำเร็จ</h2>
        <div className="flex justify-center bg-white h-[300px]">
        <div className="grid grid-cols-3 gap-6 w-1/2 mt-10 mb-10 max-w-[900px] w-full">
        <div className="border border-gray-300 rounded-xl p-4 text-center max-w-[300px]">
            <h3 className="text-[#5D5A88] mb-3">เชิงโครงการ</h3>
            <p className="text-[#5D5A88]">{achievement.project?.description || "-"}</p>
        </div>
        <div className="border border-gray-300 rounded-xl p-4 text-center max-w-[300px]">
            <h3 className="text-[#5D5A88] mb-3">เชิงกระบวนการ</h3>
            <p className="text-[#5D5A88]">{achievement.process?.description || "-"}</p>
        </div>
        <div className="border border-gray-300 rounded-xl p-4 text-center max-w-[300px]">
            <h3 className="text-[#5D5A88] mb-3">เชิงนโยบาย</h3>
            <p className="text-[#5D5A88]">{achievement.policy?.description || "-"}</p>
        </div>
        </div>
        </div>
        <h2 className="text-[#5D5A88] my-10">โครงการที่เกี่ยวข้อง</h2>
          {relatedProjects.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 mt-4 mb-20">
              {relatedProjects.map((project, idx) => (
                <Link
                href={`/campaign/${encodeURIComponent(project.name)}`}
                key={project.name || idx} // ใช้ name ถ้ามี หรือ fallback เป็น index
                className="no-underline"
              >
                <div className="border border-gray-300 rounded-xl p-4 hover:shadow-md transition cursor-pointer h-full">
                  <h3 className="text-[#5D5A88] mb-2">{project.name}</h3>
                  <p className="text-[#5D5A88]">{project.description}</p>
                </div>
              </Link>
              ))}
            </div>
          ) : (
            <p className="text-[#5D5A88] mb-10">ไม่มีโครงการที่เกี่ยวข้อง</p>
          )}
        
      </div>
      <Footer />
    </div>
  );
};

export default PolicyDetailPage;