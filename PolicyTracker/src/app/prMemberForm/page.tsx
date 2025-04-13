"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PRMemberForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [memberSurname, setMemberSurname] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberPic, setMemberPic] = useState<File | null>(null);
  const [memberPicUrl, setMemberPicUrl] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const memberId = searchParams.get("member_id");
  const partyName = "ตัวอย่างพรรค"; // เปลี่ยนให้ดึงจาก API

  // จำลองการดึงข้อมูลสมาชิกเมื่อมี `memberId`
  useEffect(() => {
    if (memberId) {
      setMemberName("สมชาย");
      setMemberSurname("ใจดี");
      setMemberRole("หัวหน้าพรรค");
      setMemberPicUrl("/path/to/current-image.jpg"); // เปลี่ยนให้ดึงจาก API จริง
    }
  }, [memberId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setMemberPic(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("บันทึกสมาชิก:", { memberName, memberSurname, memberRole, memberPic });
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
          <h2 className="text-3xl text-white text-center">
            {memberId ? "แก้ไข" : "เพิ่ม"} ข้อมูลสมาชิกพรรค
          </h2>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block font-bold">ชื่อ:</label>
              <input
                type="text"
                value={memberName}
                onChange={(e) => setMemberName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-bold">นามสกุล:</label>
              <input
                type="text"
                value={memberSurname}
                onChange={(e) => setMemberSurname(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-bold">ตำแหน่ง:</label>
              <input
                type="text"
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              {/* แสดงรูปสมาชิกปัจจุบัน */}
              {memberId && memberPicUrl && (
                <div>
                  <label className="block font-bold">รูปสมาชิกปัจจุบัน:</label>
                  <img src={memberPicUrl} alt="Member" className="w-40 rounded-md shadow-md" />
                </div>
              )}

              <label className="block font-bold">อัปโหลดรูปใหม่:</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />

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
