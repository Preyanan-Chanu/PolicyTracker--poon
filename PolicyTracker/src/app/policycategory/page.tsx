"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const categories = [
  { name: "เศรษฐกิจ", image: "/เศรษฐกิจ.jpg" },
  { name: "สังคม คุณภาพชีวิต", image: "/สังคม.jpg" },
  { name: "การเกษตร", image: "/การเกษตร.jpg" },
  { name: "สิ่งแวดล้อม", image: "/สิ่งแวดล้อม.jpg" },
  { name: "รัฐธรรมนูญกฏหมาย", image: "/รัฐธรรมนูญ.jpg" },
  { name: "บริหารงานภาครัฐ", image: "/บริหารงานภาครัฐ.jpg" },
  { name: "การศึกษา", image: "/การศึกษา.jpg" },
  { name: "ความสัมพันธ์ระหว่างประเทศ", image: "/ความสัมพันธ์ระหว่างประเทศ.jpg" },
];

const PolicyPage = () => {
  const router = useRouter();
  const [policies, setPolicies] = useState<any[]>([]);
  const [showAllPolicies, setShowAllPolicies] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParty, setSearchParty] = useState("");
  const [searchProgress, setSearchProgress] = useState("");


  const handleCategoryClick = (category: string) => {
    router.push(`/policycategory/${encodeURIComponent(category)}`);
  };

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/policycategory");
      const data = await res.json();
      setPolicies(data || []);
      setShowAllPolicies(true);
    } catch (error) {
      console.error("Error fetching all policies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-prompt bg-[#9795B5] min-h-screen">
      <Navbar />

      <div className="flex justify-between mt-10 mx-20">
        <h2 className="text-white text-[50px] font-bold">นโยบาย</h2>
        <div className="flex gap-10">
        <input
            className="h-12 p-4 rounded-full"
            type="text"
            placeholder="ค้นหาพรรค"
            value={searchParty}
            onChange={(e) => setSearchParty(e.target.value)}
            />

            <input
            className="h-12 p-4 rounded-full"
            type="text"
            placeholder="ความคืบหน้า"
            value={searchProgress}
            onChange={(e) => setSearchProgress(e.target.value)}
            />
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
                    policy.partyName.toLowerCase().includes(searchParty.toLowerCase()) &&
                    policy.progress.toLowerCase().includes(searchProgress.toLowerCase())
                  )
                .map((policy, idx) => {
                const encodedPartyName = encodeURIComponent(policy.partyName);
                const logoUrl = `https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/party%2Flogo%2F${encodedPartyName}.png?alt=media`;

                return (
                  <div key={idx} className="bg-white rounded-xl p-4 shadow-lg relative flex flex-col justify-between h-full">
                    {/* ✅ โลโก้พรรคมุมขวาบน */}
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
                        <p><strong>ความคืบหน้า:</strong> {policy.progress}</p>
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

export default PolicyPage;
