"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Party {
  name: string;
  logo: string;
}

const PartiesPage = () => {
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => setParties(data));
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#5D5A88]">พรรคการเมืองทั้งหมด</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {parties.map((party, index) => (
          <Link href={`/party/${party.name}`} key={index} className="bg-white p-4 rounded-lg shadow hover:shadow-lg">
            <div className="flex items-center gap-4">
              <img src={party.logo} alt={party.name} className="h-[50px]" />
              <span className="font-semibold text-[#5D5A88]">{party.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PartiesPage;
