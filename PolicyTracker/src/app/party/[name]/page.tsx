"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // ✅ ใช้อันนี้แทน useRouter
import { doc, collection, getDoc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/app/lib/firebase";
import { firestore } from "@/app/lib/firebase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Member {
  id: string;
  FirstName: string;
  LastName: string;
  Role?: string;
  Picture?: string;
}

const PartyPage = () => {
  const params = useParams();
  const name = decodeURIComponent(params.name as string); // ✅ ดึงชื่อจาก params
  
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [logo, setLogo] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [leader, setLeader] = useState<Member | null>(null);
  const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

  // ✅ ดึงข้อมูลพรรคจาก Neo4j
  useEffect(() => {
    if (!name) return;
  
    const fetchPartyData = async () => {
      try {
        const res = await fetch(`/api/party/${encodeURIComponent(name)}`);
        if (!res.ok) {
          const text = await res.text();
          console.error("API Error:", res.status, text);
          return;
        }

        const data = await res.json();
        setDescription(data.description || "");
        setLink(data.link || "");
  
        const tryLoadLogo = async () => {
          try {
            const jpgRef = ref(storage, `party/logo/${name}.jpg`);
            return await getDownloadURL(jpgRef);
          } catch {
            const pngRef = ref(storage, `party/logo/${name}.png`);
            return await getDownloadURL(pngRef);
          }
        };
    
        const logoUrl = await tryLoadLogo();
        setLogo(logoUrl);
      } catch (error) {
        console.error("Error loading party from Neo4j or Storage:", error);
      }
    };
  
    fetchPartyData();
  }, [name]);
  
  

  // ✅ ดึงข้อมูลสมาชิกจาก Firebase
  useEffect(() => {
    if (!name) return;
    const membersRef = collection(firestore, "Party", name, "Member");
  
    const unsubscribe = onSnapshot(membersRef, async (snapshot) => {
      const membersData: Member[] = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const imagePathBase = `party/member/${name}/${doc.id}`;

            let imageUrl = "/default-profile.png";
            try {
              // ลองโหลด .jpg
              imageUrl = await getDownloadURL(ref(storage, `${imagePathBase}.jpg`));
            } catch (errJpg) {
              try {
                // ถ้าไม่เจอ .jpg ลอง .png
                imageUrl = await getDownloadURL(ref(storage, `${imagePathBase}.png`));
              } catch (errPng) {
                console.warn(`❌ ไม่พบรูปสำหรับสมาชิก ${doc.id} (ทั้ง .jpg และ .png)`);
              }
            }
  
          return {
            id: doc.id,
            FirstName: data.FirstName || "ไม่ระบุชื่อ",
            LastName: data.LastName || "ไม่ระบุนามสกุล",
            Role: data.Role || "ไม่ระบุตำแหน่ง",
            Picture: imageUrl,
          };
        })
      );
  
      const leaderMember = membersData.find((m) => m.Role === "หัวหน้าพรรค") || null;
      setMembers(membersData);
      setLeader(leaderMember);
    });
  
    return () => unsubscribe();
  }, [name]);
  

  return (
    <div className="">
      <Navbar />
      {/* ข้อมูลพรรค */}
      <div className="flex flex-row bg-[#9795B5] mb-10">
        <div className="grid grid-rows-3 p-12 w-2/3">
          <div className="flex gap-20 items-center mb-10">
            <h1 className="text-white text-[4rem] m-0 font-bold">{name}</h1>
            {isMounted && (
              <img className="h-[70px]" src={logo || "/default-logo.png"} alt="โลโก้พรรค" />
            )}
          </div>
          <p className="text-white max-w-[80%] text-[1.5rem]">
            {description || "กำลังโหลดข้อมูล..."}
          </p>
          <div className="mt-20">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <button className="w-[200px] px-4 py-3 bg-white mr-4 text-[#5D5A88] text-[20px] rounded-lg">
                เว็บไซต์พรรค
              </button>
            </a>
          </div>
        </div>

        {/* แสดงหัวหน้าพรรค */}
        <div className="flex flex-col items-center justify-center w-1/3 bg-[#827FAF] p-8 rounded-lg shadow-md gap-10">
          {leader ? (
            <>
              <h2 className="text-white text-center text-[2rem] font-bold">{leader.Role}</h2>
              {isMounted && (
                <img src={leader.Picture} alt={leader.Role} className="w-[400px] h-[400px] rounded-full mt-4 shadow-lg" />
              )}
              <p className="text-white text-[32px] font-semibold">{`${leader.FirstName} ${leader.LastName}`}</p>
            </>
          ) : (
            <p className="text-white text-center">ไม่พบข้อมูลหัวหน้าพรรค</p>
          )}
        </div>
      </div>

      {/* สมาชิกพรรค */}
      <div className="flex flex-col justify-center w-[95%] mx-auto">
        <h3 className="font-bold text-[#5D5A88] text-[2rem] mb-10">กรรมการบริหารพรรค</h3>
        <div className="grid grid-cols-4 grid-rows-auto gap-4 mb-10">
          {members.length > 0 ? (
            members
              .filter((m) => m.Role !== "หัวหน้าพรรค")
              .map((member) => (
                <div key={member.id} className="flex flex-row justify-center border-2 border-gray-200 rounded-xl pt-4 pl-6">
                  <div className="w-1/2">
                    <h4 className="text-[#5D5A88] text-[1.5rem]">{member.Role}</h4>
                    <p className="text-[#5D5A88]">{`${member.FirstName} ${member.LastName}`}</p>
                  </div>
                  <div className="w-1/2">
                    {isMounted && (
                      <img className="w-[200px]" src={member.Picture} alt={member.FirstName} />
                    )}

                  </div>
                </div>
              ))
          ) : (
            <p className="text-[#5D5A88]">กำลังโหลดข้อมูลสมาชิก...</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PartyPage;
