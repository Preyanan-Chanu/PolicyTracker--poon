"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Campaign {
  id: number;
  campaign_name: string;
  campaign_des: string;
}

export default function PRPolicyPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const partyName = "ตัวอย่างพรรค"; // ควรเปลี่ยนให้ดึงจาก API

  // ดึงข้อมูลโครงการ (จำลอง API)
  useEffect(() => {
    // ตัวอย่างข้อมูลจำลองแทน API
    setCampaigns([
      { id: 1, campaign_name: "โครงการ A", campaign_des: "รายละเอียดของโครงการ A" },
      { id: 2, campaign_name: "โครงการ B", campaign_des: "รายละเอียดของโครงการ B" },
    ]);
  }, []);

  const goToCampaignForm = () => {
    console.log("ไปยังหน้าสร้างโครงการ");
  };

  const editCampaign = (id: number) => {
    console.log("แก้ไขโครงการ ID:", id);
  };

  const deleteCampaign = (id: number) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#9795B5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-6 fixed h-full hidden md:block">
        <ul className="space-y-4">
          <li>
            <Link
              href="/pr_policy"
              className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md hover:bg-[#D0CEF0]"
            >
              นโยบาย
            </Link>
          </li>
          <li>
            <Link
              href="/pr_campaign"
              className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md hover:bg-[#D0CEF0]"
            >
              โครงการ
            </Link>
          </li>
          <li>
            <Link
              href="/pr_event"
              className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md hover:bg-[#D0CEF0]"
            >
              กิจกรรม
            </Link>
          </li>
          <li>
            <Link
              href="/pr_party_info"
              className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md hover:bg-[#D0CEF0]"
            >
              ข้อมูลพรรค
            </Link>
          </li>
        </ul>
      </aside>

      <div className="flex-1 md:ml-64">
        {/* Navbar */}
        <header className="bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-[#5D5A88]">
            PR พรรค {partyName}
          </h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-3xl text-[#5D5A88] focus:outline-none"
          >
            ☰
          </button>
          <ul className="hidden md:flex space-x-4">
            <li>
              <Link
                href="/login"
                className="text-[#5D5A88] px-4 py-2 hover:bg-gray-200 rounded-md"
              >
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
          <div className="flex justify-end mb-4">
            <button
              onClick={goToCampaignForm}
              className="bg-[#5D5A88] text-white px-4 py-2 rounded-md hover:bg-[#46426b]"
            >
              ➕ เพิ่มโครงการ
            </button>
          </div>

          <h2 className="text-3xl text-white text-center">โครงการที่บันทึกไว้</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold">{campaign.campaign_name}</h3>
                  <p className="text-gray-600 mt-2">{campaign.campaign_des}</p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => editCampaign(campaign.id)}
                      className="bg-[#5D5A88] text-white px-3 py-1 rounded-md hover:bg-[#46426b]"
                    >
                      ✏ แก้ไข
                    </button>
                    <button
                      onClick={() => deleteCampaign(campaign.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      ❌ ลบ
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-center">ยังไม่มีโครงการในระบบ</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
