"use client";

import { useState } from "react";
import Link from "next/link";

export default function PRPolicyForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignDes, setCampaignDes] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [campaignStatus, setCampaignStatus] = useState("เริ่มนโยบาย");
  const [campaignBanner, setCampaignBanner] = useState<File | null>(null);
  const [campaignRef, setCampaignRef] = useState<File | null>(null);
  const partyName = "ตัวอย่างพรรค"; // เปลี่ยนให้ดึงจาก API

  const policies = ["โครงการพิเศษ", "นโยบาย A", "นโยบาย B"]; // จำลองข้อมูลจาก API

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | null) => void) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("บันทึกโครงการ:", { campaignName, campaignDes, policyName, campaignStatus, campaignBanner, campaignRef });
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

        {/* Mobile Sidebar */}
        {menuOpen && (
          <div className="md:hidden bg-gray-100 p-4 absolute top-16 left-0 w-full shadow-md">
            <ul className="space-y-2">
              <li>
                <Link href="/pr_policy" className="block text-[#5D5A88] px-4 py-2 hover:bg-gray-200">
                  นโยบาย
                </Link>
              </li>
              <li>
                <Link href="/pr_campaign" className="block text-[#5D5A88] px-4 py-2 hover:bg-gray-200">
                  โครงการ
                </Link>
              </li>
              <li>
                <Link href="/pr_event" className="block text-[#5D5A88] px-4 py-2 hover:bg-gray-200">
                  กิจกรรม
                </Link>
              </li>
              <li>
                <Link href="/pr_party_info" className="block text-[#5D5A88] px-4 py-2 hover:bg-gray-200">
                  ข้อมูลพรรค
                </Link>
              </li>
              <li>
                <Link href="/login" className="block text-[#5D5A88] px-4 py-2 hover:bg-gray-200">
                  ออกจากระบบ
                </Link>
              </li>
            </ul>
          </div>
        )}

        {/* Main Content */}
        <main className="p-6">
          <h2 className="text-3xl text-white text-center">ฟอร์มสำหรับกรอกข้อมูลโครงการ</h2>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block font-bold">ชื่อโครงการ:</label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-bold">รายละเอียดโครงการ:</label>
              <textarea
                value={campaignDes}
                onChange={(e) => setCampaignDes(e.target.value)}
                rows={5}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-bold">นโยบายที่เกี่ยวข้อง:</label>
              <select
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {policies.map((policy) => (
                  <option key={policy} value={policy}>
                    {policy}
                  </option>
                ))}
              </select>

              <label className="block font-bold">ลำดับขั้นสถานะ:</label>
              <select
                value={campaignStatus}
                onChange={(e) => setCampaignStatus(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="เริ่มนโยบาย">เริ่มนโยบาย</option>
                <option value="วางแผน">วางแผน</option>
                <option value="ตัดสินใจ">ตัดสินใจ</option>
                <option value="ดำเนินงาน">ดำเนินงาน</option>
              </select>

              <label className="block font-bold">อัปโหลดแบนเนอร์:</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCampaignBanner)} />

              <label className="block font-bold">อัปโหลดเอกสารอ้างอิง (PDF):</label>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setCampaignRef)} />

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
