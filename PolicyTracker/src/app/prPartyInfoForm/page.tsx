"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function PRPartyInfoForm() {
  const router = useRouter();

  const [partyList, setPartyList] = useState<string[]>([]);
  const [partyName, setPartyName] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [existingLogoUrl, setExistingLogoUrl] = useState("");

  // โหลดรายชื่อพรรคจาก Neo4j
  useEffect(() => {
    const fetchPartyList = async () => {
      try {
        const res = await fetch("/api/party");
        const data = await res.json();
        const names = data.map((p: any) => p.name);
        setPartyList(names);
      } catch (err) {
        console.error("Error fetching party list:", err);
      }
    };
    fetchPartyList();
  }, []);

  // ดึงข้อมูลพรรคเมื่อเลือกจาก dropdown
  useEffect(() => {
    if (!partyName) return;

    const fetchPartyInfo = async () => {
      try {
        const res = await fetch(`/api/party/${encodeURIComponent(partyName)}`);
        if (res.ok) {
          const data = await res.json();
          setDescription(data.description || "");
          setLink(data.link || "");
          setExistingLogoUrl(data.logo || "");
        } else {
          // ถ้าไม่มีข้อมูลพรรคนี้ ให้เคลียร์ค่า
          setDescription("");
          setLink("");
          setExistingLogoUrl("");
        }
      } catch (err) {
        console.error("Error loading party:", err);
      }
    };

    fetchPartyInfo();
  }, [partyName]);

  // บันทึก
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let logoUrl = existingLogoUrl;
    
    const payload = {
      name: partyName,
      description,
      link,
      logo: logoUrl,
    };

    try {
      const res = await fetch(`/api/party/${encodeURIComponent(partyName)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("✅ บันทึกสำเร็จ");
        router.push("/pr_party_info");
      } else {
        alert("❌ บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#9795B5] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 p-6 fixed h-full hidden md:block">
        <ul className="space-y-4">
          <li><Link href="/pr_policy" className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md">นโยบาย</Link></li>
          <li><Link href="/pr_campaign" className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md">โครงการ</Link></li>
          <li><Link href="/pr_event" className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md">กิจกรรม</Link></li>
          <li><Link href="/pr_party_info" className="block text-[#5D5A88] bg-[#E3E1F1] p-3 rounded-md">ข้อมูลพรรค</Link></li>
        </ul>
      </aside>

      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-[#5D5A88]">จัดการข้อมูลพรรค</h1>
          <Link href="/login" className="text-[#5D5A88]">ออกจากระบบ</Link>
        </header>

        {/* Form */}
        <h1 className="text-3xl text-white mt-6 mb-4 text-center">ฟอร์มข้อมูลพรรค</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
          <div className="mb-4">
            <label className="block text-[#5D5A88] font-semibold mb-1">เลือกพรรค (หรือตั้งชื่อใหม่)</label>
            <select
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
            >
              <option value="">-- เลือกพรรค --</option>
              {partyList.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="หรือพิมพ์ชื่อพรรคใหม่"
              value={partyName}
              onChange={(e) => setPartyName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#5D5A88] mb-2 font-semibold">รายละเอียด</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              rows={4}
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#5D5A88] mb-2 font-semibold">เว็บไซต์</label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#5D5A88] mb-2 font-semibold">โลโก้พรรค</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            {existingLogoUrl && (
              <img src={existingLogoUrl} alt="โลโก้พรรค" className="mt-4 h-32 rounded shadow-md" />
            )}
          </div>

          <button
            type="submit"
            className="bg-[#5D5A88] text-white px-6 py-2 rounded-md hover:bg-[#46426b]"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}
