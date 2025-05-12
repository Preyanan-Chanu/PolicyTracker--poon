"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PRSidebar from "../components/PRSidebar";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/app/lib/firebase";

interface PartyInfo {
  party_des: string;
  party_link: string;
  party_logo: string;
}

interface Member {
  id: string;
  name: string;
  surname: string;
  role: string;
  image: string;
}

export default function PRPartyInfo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [partyInfo, setPartyInfo] = useState<PartyInfo | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [partyName, setPartyName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedParty = localStorage.getItem("partyName");
    const cleanedParty = storedParty?.replace(/^\u0e1e\u0e23\u0e23\u0e04\s*/g, "").trim() || null;
    setPartyName(cleanedParty);
  }, []);

  useEffect(() => {
    if (!partyName) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/pr-partyinfo/${encodeURIComponent(partyName)}`);
        const data = await res.json();

        const logoUrl = `https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/party%2Flogo%2F${encodeURIComponent(partyName)}.png?alt=media`;

        setPartyInfo({
          party_des: data.description ?? "-",
          party_link: data.link ?? "-",
          party_logo: logoUrl,
        });

        const memberSnapshot = await getDocs(collection(firestore, "Party", partyName, "Member"));

        const memberData = await Promise.all(
          memberSnapshot.docs.map(async (docSnap) => {
            const member = docSnap.data();
            const firstName: string = member.FirstName || "ไม่ระบุชื่อ";
            const lastName: string = member.LastName || "ไม่ระบุนามสกุล";

            const nameParts = firstName.trim().split(" ");
            let fullName = nameParts.length > 1 ? `${nameParts[0]}_${nameParts.slice(1).join("_")}_${lastName}` : `${firstName}_${lastName}`;

            const basePath = `party/member/${partyName}/${fullName}`;
            let pictureUrl = "/default-profile.png";

            try {
              const jpg = await fetch(`https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/${encodeURIComponent(basePath)}.jpg?alt=media`);
              if (jpg.ok) pictureUrl = jpg.url;
              else {
                const png = await fetch(`https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/${encodeURIComponent(basePath)}.png?alt=media`);
                if (png.ok) pictureUrl = png.url;
              }
            } catch {}

            return {
              id: docSnap.id,
              name: member.FirstName,
              surname: member.LastName,
              role: member.Role,
              image: pictureUrl,
            };
          })
        );

        setMembers(memberData);
      } catch (error) {
        console.error("Error fetching party info:", error);
      }
    };

    fetchData();
  }, [partyName]);

  const goToPartyInfoForm = () => router.push("/prPartyInfoForm");
  const goToMemberForm = () => router.push("/prMemberForm");

  const deleteMember = async (id: string) => {
    if (!partyName || !confirm("คุณต้องการลบสมาชิกคนนี้หรือไม่?")) return;
    try {
      await deleteDoc(doc(firestore, "Party", partyName, "Member", id));
      setMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Error deleting member:", err);
    }
  };

  if (!partyName) {
    return <div className="text-center text-white py-10">กำลังโหลดข้อมูลพรรค...</div>;
  }

  return (
    <div className="min-h-screen bg-[#9795B5] flex">
      <PRSidebar />
      <div className="flex-1 md:ml-64">
        <header className="bg-white p-4 shadow-md flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-[#5D5A88]">PR พรรค {partyName}</h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-3xl text-[#5D5A88]">☰</button>
        </header>

        <main className="p-6">
          <div className="flex justify-end mb-4">
            <button onClick={goToPartyInfoForm} className="bg-[#5D5A88] text-white px-4 py-2 rounded-md hover:bg-[#46426b]">
              ✏ แก้ไขข้อมูลพรรค
            </button>
          </div>

          <h2 className="text-3xl text-white text-center">ข้อมูลพรรค</h2>
          {partyInfo && (
            <div className="bg-white p-6 rounded-lg shadow-lg mt-4">
              <p><strong>รายละเอียด:</strong> {partyInfo.party_des}</p>
              <p><strong>เว็บไซต์:</strong> <a href={partyInfo.party_link} target="_blank" className="text-blue-600 underline">{partyInfo.party_link}</a></p>
              <img src={partyInfo.party_logo} alt="โลโก้พรรค" className="mt-4 h-32 rounded shadow-md" />
            </div>
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
                <button onClick={() => deleteMember(member.id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-700">
                  ❌ ลบ
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
