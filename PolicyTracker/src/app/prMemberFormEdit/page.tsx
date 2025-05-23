// src/app/prMemberFormEdit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "@/app/lib/firebase";
import PRSidebar from "../components/PRSidebar";

export default function EditMemberForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
const memberId = searchParams.get("editId");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [role, setRole] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [partyName, setPartyName] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);


    
    useEffect(() => {
  const storedParty = localStorage.getItem("partyName") || "";
  setPartyName(storedParty.replace(/^พรรค\s*/, "").trim());
}, []);

useEffect(() => {
  if (!partyName || !memberId) return;

  const fetchMember = async () => {
    try {
      const docRef = doc(firestore, "Party", partyName, "Member", memberId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setFirstName(data.FirstName || "");
        setLastName(data.LastName || "");
        setRole(data.Role || "");

        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/party%2Fmember%2F${encodeURIComponent(partyName)}%2F${memberId}.jpg?alt=media`;
        setPreviewUrl(imageUrl);
      } else {
        console.warn("❌ ไม่พบสมาชิก:", memberId);
      }
    } catch (err) {
      console.error("❌ Error fetching member:", err);
    }
  };

  fetchMember();
}, [partyName, memberId]);


    


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partyName || !memberId) return;

        const fullName = `${firstName}_${lastName}`.replace(/\s+/g, "_");
        const basePath = `party/member/${partyName}/${memberId}`;
setImageUrl(`https://firebasestorage.googleapis.com/v0/b/policy-tracker-kp.firebasestorage.app/o/party%2Fmember%2F${encodeURIComponent(partyName)}/${fullName}.jpg?alt=media`);

        if (imageFile) {
            const imageRef = ref(storage, `${basePath}.jpg`);
            await uploadBytes(imageRef, imageFile);
        }

        const docRef = doc(firestore, "Party", partyName, "Member", memberId);
await updateDoc(docRef, {
  FirstName: firstName,
  LastName: lastName,
  Role: role,
});


        alert("✅ อัปเดตข้อมูลสำเร็จ");
        router.push("/prPartyInfo");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // แสดง preview รูปใหม่
  }
};


    return (
        <div className="min-h-screen bg-[#9795B5] flex">
            <PRSidebar />
            <div className="flex-1 md:ml-64 p-8">
                <h1 className="text-3xl text-white mb-6">แก้ไขข้อมูลสมาชิก</h1>
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="ชื่อ"
                        className="w-full border p-2 rounded mb-4"
                    />

                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="นามสกุล"
                        className="w-full border p-2 rounded mb-4"
                    />

                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="ตำแหน่ง"
                        className="w-full border p-2 rounded mb-4"
                    />

                    <div className="mb-4">
  <label className="block font-bold mb-1">เลือกรูปใหม่ (ถ้ามี):</label>
  <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="mb-2"
  />

  {/* แสดงรูปเก่า */}
  {previewUrl && !imageFile && (
    <div>
      <p className="text-sm text-gray-600 mb-1">รูปปัจจุบัน:</p>
      <img
        src={previewUrl}
        alt="รูปเดิม"
        className="w-32 h-32 object-cover rounded shadow border"
      />
    </div>
  )}

  {/* แสดงรูปใหม่ที่เลือก */}
  {imageFile && (
    <div>
      <p className="text-sm text-gray-600 mb-1">รูปที่เลือกใหม่:</p>
      <img
        src={URL.createObjectURL(imageFile)}
        alt="รูปใหม่"
        className="w-32 h-32 object-cover rounded shadow border"
      />
    </div>
  )}
</div>


                    <button type="submit" className="bg-[#5D5A88] text-white px-4 py-2 rounded hover:bg-[#46426b]">
                        บันทึก
                    </button>
                </form>

            </div>
        </div>
    );
}
