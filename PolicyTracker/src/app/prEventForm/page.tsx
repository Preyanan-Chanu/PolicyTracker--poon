"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PREventForm() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [eventName, setEventName] = useState("");
  const [policyName, setPolicyName] = useState("");
  const [eventDes, setEventDes] = useState("");
  const [eventStatus, setEventStatus] = useState("ยังไม่เริ่ม");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const searchParams = useSearchParams();
  const eventId = searchParams.get("event_id");
  const partyName = "ตัวอย่างพรรค"; // ควรเปลี่ยนให้ดึงจาก API

  const policies = ["นโยบาย A", "นโยบาย B", "นโยบาย C"]; // จำลองข้อมูลจาก API

  // แสดง Google Maps ตามสถานที่ที่ป้อน
  useEffect(() => {
    const mapFrame = document.getElementById("google-map") as HTMLIFrameElement;
    if (mapFrame) {
      mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(eventLocation)}`;
    }
  }, [eventLocation]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("บันทึกกิจกรรม:", { eventName, policyName, eventDes, eventStatus, eventDate, eventTime, eventLocation });
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
          <h2 className="text-3xl text-white text-center">ฟอร์มสำหรับกรอกข้อมูลกิจกรรม</h2>
          <div className="mt-6 bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block font-bold">ชื่อกิจกรรม:</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-bold">ชื่อนโยบายที่เกี่ยวข้อง (ถ้ามี):</label>
              <select
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">-- ไม่เลือก --</option>
                {policies.map((policy) => (
                  <option key={policy} value={policy}>
                    {policy}
                  </option>
                ))}
              </select>

              <label className="block font-bold">รายละเอียดกิจกรรม:</label>
              <textarea
                value={eventDes}
                onChange={(e) => setEventDes(e.target.value)}
                rows={5}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              <label className="block font-bold">สถานะกิจกรรม:</label>
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="ยังไม่เริ่ม">ยังไม่เริ่ม</option>
                <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                <option value="เสร็จสิ้น">เสร็จสิ้น</option>
              </select>

              <label className="block font-bold">สถานที่จัดกิจกรรม:</label>
              <input
                type="text"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md"
              />

              {/* Google Maps */}
              <div id="map-container" className="mt-4">
                <iframe id="google-map" width="100%" height="300" style={{ border: "0" }} allowFullScreen loading="lazy"></iframe>
              </div>

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
