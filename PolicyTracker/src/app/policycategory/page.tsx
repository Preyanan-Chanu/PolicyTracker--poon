"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Heart } from "lucide-react";

const categories = [
  { name: "เศรษฐกิจ", image: "/เศรษฐกิจ.jpg" },
  { name: "สังคม คุณภาพชีวิต", image: "/สังคม.jpg" },
  { name: "การเกษตร", image: "/การเกษตร.jpg" },
  { name: "สิ่งแวดล้อม", image: "/สิ่งแวดล้อม.jpg" },
  { name: "รัฐธรรมนูญ กฏหมาย", image: "/รัฐธรรมนูญ.jpg" },
  { name: "บริหารงานภาครัฐ", image: "/บริหารงานภาครัฐ.jpg" },
  { name: "การศึกษา", image: "/การศึกษา.jpg" },
  { name: "ความสัมพันธ์ระหว่างประเทศ", image: "/ความสัมพันธ์ระหว่างประเทศ.jpg" },
];

const statuses = ["ทั้งหมด", "เริ่มนโยบาย", "วางแผน", "ตัดสินใจ", "ดำเนินการ", "ประเมินผล"];

const PolicyCategoryPage = () => {
  const router = useRouter();
  const [policies, setPolicies] = useState<any[]>([]);
  const [partyList, setPartyList] = useState<string[]>(["ทั้งหมด"]);
  const [showAllPolicies, setShowAllPolicies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedParty, setSelectedParty] = useState("ทั้งหมด");
  const [selectedStatus, setSelectedStatus] = useState("ทั้งหมด");
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedState, setLikedState] = useState<Record<string, boolean>>({});
  

  const handleCategoryClick = (category: string) => {
    router.push(`/policycategory/${encodeURIComponent(category)}`);
  };

  const fetchPolicies = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/policycategory");

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();
      setPolicies(data || []);
      setShowAllPolicies(true);

      const rawParties = data.map((p: any) => p.partyName || "ไม่ระบุพรรค");
      const uniqueParties: string[] = Array.from(
        new Set(rawParties.map((p: unknown) => String(p ?? "").trim()))
      );
      setPartyList(["ทั้งหมด", ...uniqueParties]);


      const initialLiked: Record<string, boolean> = {};
      const initialLikes: Record<string, number> = {};

      await Promise.all(
        data.map(async (p: any) => {
          const isLiked = localStorage.getItem(`liked_${p.policyName}`) === "true";
          initialLiked[p.policyName] = isLiked;

          try {
            const res = await fetch(`/api/policylike?name=${encodeURIComponent(p.policyName)}`);
            const result = await res.json();
            const raw = result.like;
            const count =
              typeof raw === "number"
                ? raw
                : typeof raw?.toNumber === "function"
                ? raw.toNumber()
                : Number(raw) || 0;
            initialLikes[p.policyName] = count;
          } catch {
            initialLikes[p.policyName] = 0;
          }
        })
      );

      setLikedState(initialLiked);
      setLikesMap(initialLikes);
    } catch (error) {
      console.error("⚠️ Error fetching policies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (policyName: string) => {
    const isLiked = likedState[policyName];
    const action = isLiked ? "decrement" : "increment";

    try {
      const res = await fetch("/api/policylike", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: policyName, action }),
      });

      if (!res.ok) throw new Error("like failed");

      const data = await res.json();
      const raw = data.like;
      const newCount =
        typeof raw === "number"
          ? raw
          : typeof raw?.toNumber === "function"
          ? raw.toNumber()
          : Number(raw) || 0;

      setLikesMap((prev) => ({ ...prev, [policyName]: newCount }));
      localStorage.setItem(`liked_${policyName}`, (!isLiked).toString());
      setLikedState((prev) => ({ ...prev, [policyName]: !isLiked }));
    } catch (err) {
      console.error("❌ handleLike error:", err);
    }
  };


  return (
    <div className="font-prompt bg-[#9795B5] min-h-screen">
      <Navbar />

      <div className="flex justify-between mt-10 mx-20">
        <h2 className="text-white text-[50px] font-bold">นโยบาย</h2>
        <div className="flex gap-6">
          <select
            className="h-12 px-4 rounded-full text-gray-700"
            value={selectedParty}
            onChange={(e) => setSelectedParty(e.target.value)}
          >
            {partyList.map((party) => (
              <option key={party} value={party}>{party}</option>
            ))}
          </select>
          <select
            className="h-12 px-4 rounded-full text-gray-700"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      {!showAllPolicies ? (
        <>
          <div className="flex justify-center">
            <div className="grid grid-cols-8 grid-rows-2 gap-6 m-10 w-[80%] items-center">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className="bg-white col-span-2 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all"
                >
                  <img className="rounded-xl" src={category.image} alt={category.name} />
                  <h3 className="text-center">{category.name}</h3>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mb-10">
            <button 
              className="py-2 px-4 bg-[#5D5A88] rounded-md text-white"
              onClick={fetchPolicies}
            >
              ดูนโยบายทั้งหมด
            </button>
          </div>
        </>
      ) : (
        <div className="mx-20 pb-10">
          <div className="flex justify-between items-center mb-6">
            <button
              className="text-white underline"
              onClick={() => setShowAllPolicies(false)}
            >
              ← กลับไปเลือกหมวดหมู่
            </button>
          </div>

          {isLoading ? (
            <p className="text-white">กำลังโหลด...</p>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {policies
                .filter((policy) =>
                  (selectedParty === "ทั้งหมด" || policy.partyName === selectedParty) &&
                  (selectedStatus === "ทั้งหมด" || policy.status === selectedStatus)
                )
                .map((policy, idx) => {
                  const encodedPartyName = encodeURIComponent(policy.partyName);
                  const logoUrl = `https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/party%2Flogo%2F${encodedPartyName}.png?alt=media`;

                  return (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-lg relative flex flex-col justify-between h-full">
                      <img
                        src={logoUrl}
                        alt={`โลโก้ของ ${policy.partyName}`}
                        className="absolute top-4 right-4 w-12 h-12 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-logo.jpg";
                        }}
                      />
                      <div>
                        <h3 className="font-bold text-xl mb-2">{policy.policyName}</h3>
                        <p>{policy.description}</p>
                        <div className="grid grid-cols-2 gap-2 mt-6">
                          <p><strong>พรรค:</strong> {policy.partyName}</p>
                          <p><strong>งบประมาณ:</strong> {policy.budget}</p>
                          <p><strong>หมวดหมู่:</strong> {policy.categoryName}</p>
                          <p><strong>ความคืบหน้า:</strong> {policy.progress}</p>
                          <p><strong>สถานะ:</strong> {policy.status}</p>
                        </div>
                      </div>
                      <div className="text-right mt-4">
                        <button
                          onClick={() =>
                            router.push(`/policydetail/${encodeURIComponent(policy.policyName)}`)
                          }
                          className="text-[#5D5A88] hover:underline"
                        >
                          ดูเพิ่มเติม →
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1">
                        <button
                          onClick={() => handleLike(policy.policyName)}
                          className="hover:opacity-75 focus:outline-none"
                        >
                          <Heart
                            size={20}
                            fill={likedState[policy.policyName] ? "currentColor" : "none"}
                            className={likedState[policy.policyName] ? "text-[#EF4444]" : "text-gray-400"}
                          />
                        </button>
                        <span className="text-sm font-semibold text-gray-700">
                          {likesMap[policy.policyName] ?? 0}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PolicyCategoryPage;
