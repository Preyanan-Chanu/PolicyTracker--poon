"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/app/lib/firebase";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(firestore, "users", user.uid));
      if (!userDoc.exists()) {
        setErrorMsg("ไม่พบข้อมูลผู้ใช้ในระบบ");
        return;
      }

      const { role, partyName, partyId } = userDoc.data();

      localStorage.setItem("role", role);
    if (role === "pr") {
      localStorage.setItem("partyName", partyName);
      localStorage.setItem("partyId", String(partyId));
      router.push("/pr");

    } else if (role === "admin") {
      router.push("/admin");

    } else {
      setErrorMsg("❌ คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
    }
    } catch (error: any) {
      console.error("Login error:", error.message);
      setErrorMsg("เข้าสู่ระบบไม่สำเร็จ: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#9795B5]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-[#5D5A88] text-center">เข้าสู่ระบบ</h1>

        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

        <button
          type="submit"
          className="w-full bg-[#5D5A88] text-white p-2 rounded hover:bg-[#46426b]"
        >
          เข้าสู่ระบบ
        </button>
        <div className="pt-3 text-center">
        <a href="/">กลับไปหน้าหลัก</a>
        </div>

        

      </form>
    </div>
  );
}
