"use client";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cards = [1, 2, 3, 4, 5, 6, 7, 8];

  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 3) setCurrentIndex(currentIndex + 1);
  };

  return (
    <div className="min-h-screen bg-[#9795B5] flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 bg-white p-4 shadow-md z-10">
        <nav className="max-w-6xl mx-auto flex justify-between items-center">
          <a className="text-2xl font-bold text-[#5D5A88]">PolicyTracker</a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl focus:outline-none"
          >
            ☰
          </button>
          <ul className="hidden md:flex space-x-6 text-[#5D5A88] font-semibold">
            <li><a href="#" className="hover:text-[#3f3c62]">หน้าหลัก</a></li>
            <li><a href="#" className="hover:text-[#3f3c62]">นโยบาย</a></li>
            <li><a href="#" className="hover:text-[#3f3c62]">กิจกรรม</a></li>
            <li><a href="#" className="hover:text-[#3f3c62]">เกี่ยวกับเรา</a></li>
            <li><a href="#" className="hover:text-[#3f3c62]">เข้าสู่ระบบ</a></li>
          </ul>
        </nav>
      </header>

      {/* Sidebar for Mobile */}
      {menuOpen && (
        <div className="md:hidden bg-gray-200 p-4 absolute top-16 left-0 w-full shadow-md">
          <ul className="space-y-2 text-[#5D5A88] font-semibold">
            <li><a href="#" className="block">หน้าหลัก</a></li>
            <li><a href="#" className="block">นโยบาย</a></li>
            <li><a href="#" className="block">กิจกรรม</a></li>
            <li><a href="#" className="block">เกี่ยวกับเรา</a></li>
            <li><a href="#" className="block">เข้าสู่ระบบ</a></li>
          </ul>
        </div>
      )}

      {/* Dashboard Section */}
      <section className="h-80 flex flex-col items-center justify-center bg-[#9795B5] text-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold">พรรค</h1>
      </section>

      {/* Example Section */}
      <section className="h-96 flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-6 text-center mt-6">
        <h2 className="text-2xl font-bold text-[#3f3c62]">สัญลักษณ์แทนขั้นความคืบหน้า</h2>
        <div className="w-full h-20 flex items-center justify-center"></div>

        <h2 className="text-2xl font-bold text-[#3f3c62] mt-6">ตัวอย่างนโยบายต่างๆแบ่งตามหมวดหมู่</h2>
        <div className="w-full h-80 flex items-center justify-center gap-4">
          <button onClick={prevCard} className="text-3xl text-[#5D5A88] hover:text-[#3f3c62]">&#9664;</button>
          <div className="flex gap-4">
            {cards.slice(currentIndex, currentIndex + 3).map((card, index) => (
              <div key={index} className="w-40 h-40 bg-white flex items-center justify-center text-lg font-bold shadow-lg rounded-lg border-2 border-[#5D5A88] transition-transform duration-300 hover:scale-105">
                {card}
              </div>
            ))}
          </div>
          <button onClick={nextCard} className="text-3xl text-[#5D5A88] hover:text-[#3f3c62]">&#9654;</button>
        </div>
      </section>

      {/* Popular Section */}
      <section className="h-[420px] flex flex-col items-center justify-center bg-[#9795B5] shadow-lg p-6 text-center text-white mt-6">
        <h3 className="text-2xl font-bold">นโยบายที่นิยม</h3>
        <div className="flex gap-6 mt-4">
          <div className="w-48 h-48 bg-white flex items-center justify-center text-lg font-bold shadow-lg rounded-lg border-2 border-[#5D5A88] transition-transform duration-300 hover:scale-105">
            1
          </div>
          <div className="w-48 h-48 bg-white flex items-center justify-center text-lg font-bold shadow-lg rounded-lg border-2 border-[#5D5A88] transition-transform duration-300 hover:scale-105">
            2
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
        © 2025 PolicyTracker. สงวนลิขสิทธิ์.
      </footer>
    </div>
  );
}
