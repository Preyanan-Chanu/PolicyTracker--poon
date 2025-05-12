"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import PRSidebar from "@/app/components/PRSidebar";

export default function PRCampaignForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDes, setCampaignDes] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [campaignStatus, setCampaignStatus] = useState("เริ่มโครงการ");
  const [campaignBudget, setCampaignBudget] = useState("");
  const [expenses, setExpenses] = useState([{ description: "", amount: "" }]);
  const [campaignBanner, setCampaignBanner] = useState<File | null>(null);
  const [campaignRef, setCampaignRef] = useState<File | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);
  const [refPreviewUrl, setRefPreviewUrl] = useState<string | null>(null);
  const [partyName, setPartyName] = useState("ไม่ทราบชื่อพรรค");
  const [policies, setPolicies] = useState<string[]>([]);
  const [area, setArea] = useState("เขตเดียว");
  const [impact, setImpact] = useState("ต่ำ");
  const [size, setSize] = useState("เล็ก");

  const searchParams = useSearchParams();
  const campaignId = searchParams.get("campaign_id");

  const router = useRouter();

  useEffect(() => {
  type Area = "เขตเดียว" | "หลายเขต" | "ทั่วประเทศ";
  type Impact = "ต่ำ" | "ปานกลาง" | "สูง";
  type Size = "เล็ก" | "กลาง" | "ใหญ่";

  const mapSize: Record<`${Area}-${Impact}`, Size> = {
    "เขตเดียว-ต่ำ": "เล็ก",
    "เขตเดียว-ปานกลาง": "เล็ก",
    "เขตเดียว-สูง": "กลาง",
    "หลายเขต-ต่ำ": "เล็ก",
    "หลายเขต-ปานกลาง": "กลาง",
    "หลายเขต-สูง": "ใหญ่",
    "ทั่วประเทศ-ต่ำ": "กลาง",
    "ทั่วประเทศ-ปานกลาง": "ใหญ่",
    "ทั่วประเทศ-สูง": "ใหญ่",
  };

  const key = `${area}-${impact}` as `${Area}-${Impact}`;
  setSize(mapSize[key] || "เล็ก");
}, [area, impact]);


  useEffect(() => {
    const stored = localStorage.getItem("partyName");
    if (stored) {
      setPartyName(stored);
      fetch(`/api/prCampaignForm?party=${encodeURIComponent(stored)}`)
        .then((res) => res.json())
        .then((data) => {
          const unique = Array.from(new Set(["โครงการพิเศษ", ...(data.policies || [])]));
          setPolicies(unique);
        });
    }
  }, []);

  useEffect(() => {
    if (!campaignId) return;

    const fetchCampaign = async () => {
      const res = await fetch(`/api/pr-campaign/${campaignId}`);
      const data = await res.json();



      setCampaignName(data.name || "");
      setCampaignDes(data.description || "");
      setPolicyName(data.policy || "");
      setCampaignStatus(data.status || "เริ่มโครงการ");
      setCampaignBudget(data.budget?.toString() || "");
      setArea(data.area || "เขตเดียว");
      setImpact(data.impact || "ต่ำ");
      setSize(data.size || "เล็ก");
      setExpenses(data.expenses || [{ description: "", amount: "" }]);

      // preview
      const cleanName = data.name?.trim();
      if (cleanName) {
        try {
          const bannerRef = ref(storage, `campaign/banner/${cleanName}.jpg`);
          setBannerPreviewUrl(await getDownloadURL(bannerRef));
        } catch { }
        try {
          const pdfRef = ref(storage, `campaign/reference/${cleanName}.pdf`);
          setRefPreviewUrl(await getDownloadURL(pdfRef));
        } catch { }
      }
    };

    fetchCampaign();
  }, [campaignId]);



  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    if (event.target.files) setFile(event.target.files[0]);
  };

  const handleExpenseChange = (index: number, field: "description" | "amount", value: string) => {
    const updated = [...expenses];
    updated[index][field] = value;
    setExpenses(updated);
  };

  const addExpenseRow = () => {
    setExpenses([...expenses, { description: "", amount: "" }]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const cleanName = campaignName.trim();
    let bannerUrl = "";

    try {
      if (campaignBanner) {
        const bannerRef = ref(storage, `campaign/banner/${cleanName}.jpg`);
        await uploadBytes(bannerRef, campaignBanner);
        bannerUrl = await getDownloadURL(bannerRef);
      }

      if (campaignRef) {
        const refFile = ref(storage, `campaign/reference/${cleanName}.pdf`);
        await uploadBytes(refFile, campaignRef);
      }

      const payload = {
        ...(campaignId && !isNaN(Number(campaignId)) && { id: Number(campaignId) }),
        name: campaignName,
        description: campaignDes,
        status: campaignStatus,
        policy: policyName,
        budget: Number(campaignBudget),
        expenses: expenses.map((e) => ({ ...e, amount: Number(e.amount) })),
        banner: bannerUrl,
        partyName,
        area,
  impact,
  size, 
      };

      const res = await fetch(campaignId ? `/api/pr-campaign/${campaignId}` : `/api/prCampaignForm`, {
        method: campaignId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(campaignId ? "✅ แก้ไขโครงการสำเร็จ" : "✅ สร้างโครงการสำเร็จ");
        router.push("/prCampaign");
      } else {
        const text = await res.text();
        alert("❌ ไม่สำเร็จ: " + text);
      }
    } catch (err) {
      console.error("Error saving campaign:", err);
      alert("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  return (
    <div className="min-h-screen bg-[#9795B5] flex">
      <PRSidebar />
      <div className="flex-1 md:ml-64">
        <header className="bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-[#5D5A88]">PR พรรค {partyName}</h1>
        </header>

        <main className="p-6">
          <h2 className="text-3xl text-white text-center">ฟอร์มสำหรับกรอกข้อมูลโครงการ</h2>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block font-bold">ชื่อโครงการ:</label>
              <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />

              <label className="block font-bold">รายละเอียดโครงการ:</label>
              <textarea value={campaignDes} onChange={(e) => setCampaignDes(e.target.value)} rows={5} required className="w-full p-2 border border-gray-300 rounded-md" />

              <label className="block font-bold">นโยบายที่เกี่ยวข้อง:</label>
              <select value={policyName} onChange={(e) => setPolicyName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md">
                <option value="">-- เลือกนโยบาย --</option>
                {policies.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>

              <label className="block font-bold">สถานะโครงการ:</label>
              <select value={campaignStatus} onChange={(e) => setCampaignStatus(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md">
                {["เริ่มโครงการ", "วางแผน", "ตัดสินใจ", "ดำเนินการ", "ประเมินผล"].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>

              <label className="block font-bold">พื้นที่ดำเนินการ:</label>
              <select value={area} onChange={(e) => setArea(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md">
                {["เขตเดียว", "หลายเขต", "ทั่วประเทศ"].map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>

              <label className="block font-bold">ระดับผลกระทบ:</label>
              <select value={impact} onChange={(e) => setImpact(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md">
                {["ต่ำ", "ปานกลาง", "สูง"].map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>

              <label className="block font-bold">ขนาดโครงการ (อัตโนมัติ):</label>
              <input value={size} readOnly className="w-full p-2 border border-gray-300 rounded-md bg-gray-100" />

              <label className="block font-bold">งบประมาณที่ได้รับ (บาท):</label>
              <input type="number" value={campaignBudget} onChange={(e) => setCampaignBudget(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md" />

              <label className="block font-bold">รายการรายจ่าย:</label>
              {expenses.map((exp, idx) => (
                <div key={idx} className="flex space-x-2">
                  <input type="text" value={exp.description} onChange={(e) => handleExpenseChange(idx, "description", e.target.value)} placeholder="รายละเอียด" className="w-2/3 p-2 border rounded" />
                  <input type="number" value={exp.amount} onChange={(e) => handleExpenseChange(idx, "amount", e.target.value)} placeholder="จำนวนเงิน" className="w-1/3 p-2 border rounded" />
                </div>
              ))}
              <button type="button" onClick={addExpenseRow} className="text-sm text-blue-500">+ เพิ่มรายการ</button>

              <p className="text-gray-500">
                รวมรายจ่ายทั้งหมด: {expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0).toLocaleString()} บาท
              </p>

              <label className="block font-bold">แบนเนอร์โครงการ:</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCampaignBanner)} />
              {bannerPreviewUrl && <img src={bannerPreviewUrl} alt="Banner" className="w-full rounded-md mt-2" />}

              <label className="block font-bold">เอกสารอ้างอิง (PDF):</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setCampaignRef)} />
              {refPreviewUrl && (
                <a href={refPreviewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline block mt-2">ดูเอกสาร (PDF)</a>
              )}

              <button type="submit" className="w-full bg-[#5D5A88] text-white p-3 rounded-md hover:bg-[#46426b] mt-4">
                {campaignId ? "บันทึกการแก้ไข" : "บันทึกโครงการ"}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
