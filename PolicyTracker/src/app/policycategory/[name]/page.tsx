"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface Policy {
  policyName: string;
  description: string;
  partyName: string;
  budget: string | number;
  categoryName: string;
  progress: string;
}

const PolicyCategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const category = decodeURIComponent(params.name as string);

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch(`/api/policycategory/${encodeURIComponent(category)}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`เกิดข้อผิดพลาด ${res.status}: ${text}`);
        }
        const data = await res.json();
        console.log("✅ ได้ข้อมูลจาก API:", data);
        setPolicies(data || []);
      } catch (err) {
        console.error("❌ Error fetching:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [category]);

  return (
    <div className="font-prompt">
      <Navbar />
      <div className="px-10 py-6 bg-[#9795B5]">

        <div className="flex justify-between items-center mt-6 mx-20 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/policycategory")}
              className="bg-white text-[#5D5A88] px-4 py-2 rounded-full shadow hover:bg-[#e5e5f7] transition"
            >
              &larr; กลับ
            </button>
            <h1 className="text-[2.5rem] font-bold text-white">
              นโยบายในหมวด: {category}
            </h1>
          </div>

          <div className="flex gap-3">
            <input className="h-12 px-4 rounded-full" type="text" placeholder="ค้นหาพรรค" />
            <input className="h-12 px-4 rounded-full" type="text" placeholder="ความคืบหน้า" />
          </div>
        </div>

        {loading ? (
          <p className="text-gray-600 mx-20">กำลังโหลด...</p>
        ) : policies.length === 0 ? (
          <p className="text-[#ffffff] mx-20">ไม่พบนโยบายในหมวดนี้</p>
        ) : (
          <div className="mx-20 pb-10 grid grid-cols-3 gap-6">
            {policies.map((policy, idx) => {
              const encodedPartyName = encodeURIComponent(policy.partyName);
              const logoUrl = `https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/party%2Flogo%2F${encodedPartyName}.png?alt=media`;

              return (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-lg relative flex flex-col justify-between h-full">
                  <div>
                    <img
                      src={logoUrl}
                      alt={`โลโก้ของ ${policy.partyName}`}
                      className="absolute top-4 right-4 w-12 h-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default-logo.jpg";
                      }}
                    />
                    <h3 className="font-bold text-xl mb-2">{policy.policyName}</h3>
                    <br />
                    <p className="mb-2">{policy.description}</p>

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
      <Footer />
    </div>
  );
};

export default PolicyCategoryPage;
