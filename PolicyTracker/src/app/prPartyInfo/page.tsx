"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PartyInfo {
  party_des: string;
  party_link: string;
  party_logo: string;
}

interface Member {
  id: number;
  name: string;
  surname: string;
  role: string;
  image: string;
}

export default function PRPartyInfo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [partyInfo, setPartyInfo] = useState<PartyInfo | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const router = useRouter();
  const partyName = "ตัวอย่างพรรค"; // ควรเปลี่ยนให้ดึงจาก API

  // ดึงข้อมูลพรรคและสมาชิก (จำลอง API)
  useEffect(() => {
    setPartyInfo({
      party_des: "พรรคนี้เน้นนโยบายเพื่อประชาชน",
      party_link: "https://www.example.com",
      party_logo: "/path/to/logo.jpg",
    });

    setMembers([
      { id: 1, name: "สมชาย", surname: "ใจดี", role: "หัวหน้าพรรค", image: "/path/to/member1.jpg" },
      { id: 2, name: "สมหญิง", surname: "ใจดี", role: "รองหัวหน้าพรรค", image: "/path/to/member2.jpg" },
    ]);
  }, []);

  const goToPartyInfoForm = () => {
    router.push("/pr_party_info_form");
  };

  const deleteParty = () => {
    if (!confirm("คุณต้องการลบข้อมูลพรรคหรือไม่?")) return;
    setPartyInfo(null);
    alert("✅ ลบข้อมูลพรรคสำเร็จ");
  };

  const goToMemberForm = () => {
    router.push("/pr_member_form");
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
          <div className="flex justify-end mb-4">
            <button onClick={goToPartyInfoForm} className="bg-[#5D5A88] text-white px-4 py-2 rounded-md hover:bg-[#46426b]">
              ➕ เพิ่มข้อมูลพรรค
            </button>
          </div>

          <h2 className="text-3xl text-white text-center">ข้อมูลพรรค</h2>
          <br />

          {partyInfo ? (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p><strong>รายละเอียด:</strong> {partyInfo.party_des}</p>
              <p>
                <strong>เว็บไซต์:</strong>{" "}
                <a href={partyInfo.party_link} target="_blank" className="text-blue-600 underline">
                  {partyInfo.party_link}
                </a>
              </p>
              {partyInfo.party_logo && (
                <div>
                  <p><strong>โลโก้พรรค:</strong></p>
                  <img src={partyInfo.party_logo} width="150" alt="Party Logo" className="rounded-md shadow-md" />
                </div>
              )}
              <div className="flex gap-4 mt-4">
                <button onClick={goToPartyInfoForm} className="bg-[#5D5A88] text-white px-3 py-1 rounded-md hover:bg-[#46426b]">
                  ✏ แก้ไขข้อมูลพรรค
                </button>
                <button onClick={deleteParty} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700">
                  ❌ ลบข้อมูลพรรค
                </button>
              </div>
            </div>
          ) : (
            <p className="text-white text-center">ยังไม่มีข้อมูลพรรคในระบบ</p>
          )}

          <div className="flex justify-end mt-6">
            <button onClick={goToMemberForm} className="bg-[#5D5A88] text-white px-4 py-2 rounded-md hover:bg-[#46426b]">
              ➕ เพิ่มข้อมูลสมาชิก
            </button>
          </div>

          <h2 className="text-3xl text-white text-center mt-6">สมาชิกพรรค</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            {members.map((member) => (
              <div key={member.id} className="bg-white p-4 rounded-lg shadow-lg text-center">
                <img src={member.image} alt={member.name} className="w-24 h-24 mx-auto rounded-full shadow-md" />
                <p className="mt-2 font-semibold">{member.name} {member.surname}</p>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
