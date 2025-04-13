"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { storage } from "@/app/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface FinanceRecord {
  id: number;
  name: string;
  type: string;
  amount: number;
}

export default function PRPolicyForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [policyName, setPolicyName] = useState("");
  const [policyCategory, setPolicyCategory] = useState("เศรษฐกิจ");
  const [policyDes, setPolicyDes] = useState("");
  const [policyBanner, setPolicyBanner] = useState<File | null>(null);
  const [policyRef, setPolicyRef] = useState<File | null>(null);
  const [policyBannerUrl, setPolicyBannerUrl] = useState<string | null>(null);
  const [policyRefUrl, setPolicyRefUrl] = useState<string | null>(null);
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([]);
  const searchParams = useSearchParams();
  const policyId = searchParams.get("policy_id");
  const partyName = "ตัวอย่างพรรค"; // เปลี่ยนให้ดึงจาก API

  // จำลองการดึงข้อมูลนโยบายเมื่อมี policyId
  useEffect(() => {
    if (policyId) {
      setPolicyName("ตัวอย่างนโยบาย");
      setPolicyCategory("เศรษฐกิจ");
      setPolicyDes("รายละเอียดของนโยบายตัวอย่าง");
      setPolicyBannerUrl("/path/to/banner.jpg");
      setPolicyRefUrl("/path/to/document.pdf");
    }

    // จำลองข้อมูลการเงิน
    setFinanceRecords([
      { id: 1, name: "งบประมาณโครงการ A", type: "งบประมาณ", amount: 50000 },
      { id: 2, name: "ค่าใช้จ่ายโครงการ B", type: "ค่าใช้จ่าย", amount: 30000 },
    ]);
  }, [policyId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    let bannerUrl = "";
  
    try {
      // ✅ Upload banner to Firebase Storage
      if (policyBanner) {
        const bannerRef = ref(storage, `policy/banner/${policyName}/${policyBanner.name}`);
        await uploadBytes(bannerRef, policyBanner);
        bannerUrl = await getDownloadURL(bannerRef);
      }
  
      // ✅ Create policy in Neo4j
      const payload = {
        name: policyName,
        description: policyDes,
        banner: bannerUrl,
        category: policyCategory,
      };
  
      const res = await fetch("/api/prPolicyForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (res.ok) {
        alert("✅ บันทึกนโยบายสำเร็จ");
      } else {
        const text = await res.text();
        alert("❌ บันทึกไม่สำเร็จ: " + text);
      }
    } catch (err) {
      console.error("Error saving policy:", err);
      alert("❌ เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  const addFinanceRow = () => {
    const newRecord: FinanceRecord = {
      id: financeRecords.length + 1,
      name: `รายการที่ ${financeRecords.length + 1}`,
      type: "งบประมาณ",
      amount: 0,
    };
    setFinanceRecords([...financeRecords, newRecord]);
  };

  const deleteFinanceRow = (id: number) => {
    setFinanceRecords((prev) => prev.filter((record) => record.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#9795B5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-6 fixed h-full hidden md:block">
        <ul className="space-y-4">
          <li>
            <Link href="/pr_policy" className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md hover:bg-[#D0CEF0]">
              นโยบาย
            </Link>
          </li>
          <li>
            <Link href="/pr_campaign" className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md hover:bg-[#D0CEF0]">
              โครงการ
            </Link>
          </li>
          <li>
            <Link href="/pr_event" className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md hover:bg-[#D0CEF0]">
              กิจกรรม
            </Link>
          </li>
          <li>
            <Link href="/pr_party_info" className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md hover:bg-[#D0CEF0]">
              ข้อมูลพรรค
            </Link>
          </li>
        </ul>
      </aside>

      <div className="flex-1 md:ml-64">
        {/* Navbar */}
        <header className="bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-[#5D5A88]">PR พรรค {partyName}</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl text-[#5D5A88] focus:outline-none"
          >
            ☰
          </button>
          <ul className="hidden md:flex space-x-4">
            <li>
              <Link href="/login" className="text-[#5D5A88] px-4 py-2 hover:bg-gray-200 rounded-md">
                ออกจากระบบ
              </Link>
            </li>
          </ul>
        </header>

        {/* Main Content */}
        <main className="p-6">
          <h2 className="text-3xl text-white text-center">ฟอร์มสำหรับกรอกข้อมูลนโยบาย</h2>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block font-bold">ชื่อนโยบาย:</label>
              <input
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-bold">หมวดหมู่นโยบาย:</label>
              <select
                value={policyCategory}
                onChange={(e) => setPolicyCategory(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {["เศรษฐกิจ", "สังคม คุณภาพชีวิต", "การเกษตร", "สิ่งแวดล้อม", "รัฐธรรมนูญกฏหมาย", "บริหารงานภาครัฐ", "การศึกษา", "ความสัมพันธ์ระหว่างประเทศ", "อื่นๆ"].map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <label className="block font-bold">รายละเอียดนโยบาย:</label>
              <textarea
                value={policyDes}
                onChange={(e) => setPolicyDes(e.target.value)}
                rows={5}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-bold">อัปโหลดแบนเนอร์ใหม่ (PNG, JPG):</label>
              <input type="file" accept="image/png, image/jpeg" onChange={(e) => handleFileChange(e, setPolicyBanner)} />

              <label className="block font-bold">อัปโหลดเอกสารอ้างอิงใหม่ (PDF):</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setPolicyRef)} />

              <button type="submit" className="w-full bg-[#5D5A88] text-white p-3 rounded-md hover:bg-[#46426b] mt-4">
                บันทึก
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
