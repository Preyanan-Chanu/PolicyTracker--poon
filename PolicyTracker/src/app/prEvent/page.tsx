"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Event {
  id: number;
  event_name: string;
  event_des: string;
  event_status: string;
  event_date: string;
  event_time: string;
  event_location: string;
}

export default function PRActivitiesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const partyName = "ตัวอย่างพรรค"; // ควรเปลี่ยนให้ดึงจาก API
  const router = useRouter();

  // ดึงข้อมูลกิจกรรม (จำลอง API)
  useEffect(() => {
    setEvents([
      {
        id: 1,
        event_name: "กิจกรรม A",
        event_des: "รายละเอียดกิจกรรม A",
        event_status: "กำลังดำเนินการ",
        event_date: "2025-03-10",
        event_time: "10:00",
        event_location: "กรุงเทพฯ",
      },
      {
        id: 2,
        event_name: "กิจกรรม B",
        event_des: "รายละเอียดกิจกรรม B",
        event_status: "เสร็จสิ้น",
        event_date: "2025-02-28",
        event_time: "14:30",
        event_location: "เชียงใหม่",
      },
    ]);
  }, []);

  const goToEventForm = () => {
    router.push("/pr_event_form");
  };

  const editEvent = (id: number) => {
    router.push(`/pr_event_form?event_id=${id}`);
  };

  const deleteEvent = (id: number) => {
    if (!confirm("คุณต้องการลบกิจกรรมนี้หรือไม่?")) return;
    setEvents((prev) => prev.filter((event) => event.id !== id));
    alert("✅ ลบกิจกรรมสำเร็จ");
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
            <button
              onClick={goToEventForm}
              className="bg-[#5D5A88] text-white px-4 py-2 rounded-md hover:bg-[#46426b]"
            >
              ➕ เพิ่มกิจกรรม
            </button>
          </div>

          <h2 className="text-3xl text-white text-center">กิจกรรมที่บันทึกไว้</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="bg-white p-4 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold">{event.event_name}</h3>
                  <p className="text-gray-600"><strong>สถานะ:</strong> {event.event_status}</p>
                  <p className="text-gray-600"><strong>วันที่:</strong> {event.event_date} <strong>เวลา:</strong> {event.event_time}</p>
                  <p className="text-gray-600"><strong>สถานที่:</strong> {event.event_location}</p>
                  <p className="text-gray-500 mt-2">{event.event_des}</p>
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => editEvent(event.id)}
                      className="bg-[#5D5A88] text-white px-3 py-1 rounded-md hover:bg-[#46426b]"
                    >
                      ✏ แก้ไข
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700"
                    >
                      ❌ ลบ
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white text-center">ยังไม่มีกิจกรรมในระบบ</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
