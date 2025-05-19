"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Heart } from "lucide-react";
import { ArrowLeft } from "lucide-react";


interface Policy {
  policyName: string;
  description: string;
  partyName: string;
  budget: string;
  categoryName: string;
  progress: string;
}

const PolicyCategoryPage = () => {
  const { name } = useParams() as { name: string };
  const router = useRouter();
  const party = decodeURIComponent(name);
  const [showAll, setShowAll] = useState(false); 
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  // ค้นหาพรรค
  const [partyList, setPartyList] = useState<string[]>([]);
  const [selectedParty, setSelectedParty] = useState<string>("");
    // ค้นหาสถานะ
    const [selectedStatus, setSelectedStatus] = useState<string>("");
  // เก็บจำนวน like ปัจจุบัน
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  // เก็บสถานะว่า เคยกด like หรือยัง
  const [likedState, setLikedState] = useState<Record<string, boolean>>({});

  // ดึงข้อมูล policies กรองตามพรรค
  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(
          `/api/partycategory/${encodeURIComponent(party)}`
        );
        const data: Policy[] = await res.json();
        setPolicies(data || []);
      } catch (err) {
        console.error("❌ Error fetching policies:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [party]);

  // Init likedState และ fetch like count
  useEffect(() => {
    const init: Record<string, boolean> = {};
    policies.forEach((p) => {
      init[p.policyName] =
        localStorage.getItem(`liked_${p.policyName}`) === "true";

      fetch(
        `/api/policylike?name=${encodeURIComponent(p.policyName)}`
      )
        .then((res) => res.json())
        .then((data) => {
          const raw = data.like;
          const count =
            typeof raw === "number"
              ? raw
              : typeof raw?.toNumber === "function"
              ? raw.toNumber()
              : Number(raw) || 0;
          setLikesMap((m) => ({ ...m, [p.policyName]: count }));
        })
        .catch((err) => console.error("❌ fetch like GET error:", err));
    });
    setLikedState(init);
  }, [policies]);

  // Toggle like
  const handleLike = async (policyName: string) => {
    const isLiked = likedState[policyName];
    const action = isLiked ? "decrement" : "increment";

    try {
      const res = await fetch("/api/policylike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: policyName, action }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);

      const data = await res.json();
      const raw = data.like;
      const newCount =
        typeof raw === "number"
          ? raw
          : typeof raw?.toNumber === "function"
          ? raw.toNumber()
          : Number(raw) || 0;
      setLikesMap((m) => ({ ...m, [policyName]: newCount }));

      const newVal = !isLiked;
      localStorage.setItem(`liked_${policyName}`, newVal.toString());
      setLikedState((s) => ({ ...s, [policyName]: newVal }));
    } catch (err) {
      console.error("❌ handleLike error:", err);
    }
  };

  
 // ดึงรายชื่อพรรคตอนหน้าโหลด
 useEffect(() => {
  async function fetchParties() {
    try {
      const res = await fetch("/api/parties");
      const data: string[] = await res.json();
      setPartyList(data);
    } catch (err) {
      console.error("Error fetching parties:", err);
    }
  }
  fetchParties();
}, []);

// เมื่อเลือกพรรคจาก dropdown
const handlePartyChange = (party: string) => {
  setSelectedParty(party);
  if (party) {
    router.push(`/partycategory/${encodeURIComponent(party)}`);
  }
};

// Handle status selection
const handleStatusChange = (status: string) => {
  setSelectedStatus(status);
  if (status) {
    router.push(`/policycategory/${encodeURIComponent(status)}`);
  }
};
 

  return (
    <div className="font-prompt">
      <Navbar />
      
         <div
      className="px-10 py-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/bg/หัวข้อ.png')"
      }}
    > 
        <div className="flex justify-between items-center mt-6 mx-20 mb-6">

              {/* ฝั่งซ้าย: ปุ่มกลับ + ชื่อหัวเรื่อง */}
    <div className="flex items-center gap-4">
      <button
              onClick={() => router.push("/policy")}
              className="
                flex items-center gap-2
                px-6 py-3
                bg-white text-[#2C3E50] font-medium
                rounded-full
                shadow-md hover:shadow-lg
               hover:!bg-[#316599] hover:!text-white
                transform hover:-translate-y-0.5
                transition-all duration-200 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5D5A88]/50
              "
            >
              <ArrowLeft className="w-5 h-5" />
              กลับ
            </button>
      <h1 className="text-[2.5rem] font-bold text-white">
        นโยบายของพรรค: {party}
      </h1>
    </div>

    {/* ฝั่งขวา: ค้นหาจากพรรค + ช่องความคืบหน้า */}
    <div className="flex items-center gap-6">
      <div className="relative inline-block w-64">
        {!selectedParty && (
          <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
            ค้นหาจากพรรค
          </span>
        )}
        <select
          value={selectedParty}
          onChange={(e) => handlePartyChange(e.target.value)}
          className="h-12 w-full pl-4 pr-4 rounded-full bg-white appearance-none"
        >
          <option value="" disabled hidden />
          {partyList.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown ความคืบหน้า */}
      <div className="relative inline-block w-64">
              {!selectedStatus && (
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 pointer-events-none">
                  ความคืบหน้า
                </span>
              )}
              <select
                value={selectedStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="h-12 w-full pl-4 pr-4 rounded-full bg-white text-gray-800 leading-none"
              >
                <option value="" disabled hidden />
                <option value="เริ่มนโยบาย">เริ่มนโยบาย</option>
                <option value="วางแผน">วางแผน</option>
                <option value="ตัดสินใจ">ตัดสินใจ</option>
                <option value="ดำเนินการ">ดำเนินการ</option>
                <option value="ประเมินผล">ประเมินผล</option>
              </select>
            </div>
    </div>
  </div>
          


        {loading ? (
          <p className="text-gray-600">กำลังโหลด...</p>
        ) : policies.length === 0 ? (
          <p className="text-white">ไม่พบนโยบายของพรรคนี้</p>
        ) : (
          <div className="mx-20 pb-10 grid grid-cols-3 gap-6">
            {(showAll ? policies : policies.slice(0, 6)).map((policy, idx) => {
              const encodedPartyName = encodeURIComponent(policy.partyName);
              const logoUrl = `https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/party%2Flogo%2F${encodedPartyName}.png?alt=media`;

              return (
                <div
                  key={idx}
                  className="relative bg-white rounded-xl p-4 shadow-lg flex flex-col justify-between h-full"
                >
                  <img
                    src={logoUrl}
                    alt={`โลโก้ของ ${policy.partyName}`}
                    className="absolute top-4 right-4 w-12 h-12 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/default-logo.jpg";
                    }}
                  />

                  <div>
                    <h3 className="font-bold text-xl mb-2">
                      {policy.policyName}
                    </h3>
                    <p className="mb-2">{policy.description}</p>
                    <div className="grid grid-cols-2 gap-2 mt-6">
                      <p><strong>พรรค:</strong> {policy.partyName}</p>
                      <p><strong>งบประมาณ:</strong> {policy.budget}</p>
                      <p><strong>หมวดหมู่:</strong> {policy.categoryName}</p>
                      <p><strong>ความคืบหน้า:</strong> {policy.progress}</p>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1">
                    <button
                      onClick={() => handleLike(policy.policyName)}
                      className="hover:opacity-75 focus:outline-none"
                    >
                      <Heart
                        size={20}
                        fill={
                          likedState[policy.policyName]
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          likedState[policy.policyName]
                            ? "text-[#EF4444]"
                            : "text-gray-400"
                        }
                      />
                    </button>
                    <span className="font-medium">
                      {likesMap[policy.policyName] ?? 0}
                    </span>
                  </div>

                  <div className="text-right mt-4">
                    <button
                      onClick={() =>
                        router.push(
                          `/policydetail/${encodeURIComponent(policy.policyName)}`
                        )
                      }
                      className="text-[#5D5A88] hover:underline"
                    >
                      ดูเพิ่มเติม →
                    </button>
                  </div>
                </div>
              );
            })}
               {policies.length > 6 && !showAll && (
              <div className="col-span-3 flex justify-center mt-6">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
                >
                  ดูเพิ่มเติม
                </button>
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default PolicyCategoryPage;
