"use client"
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import Navbar from '@/app/components/Navbar';

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#9795B5] font-['Prompt']">
      <Head>
        <title>PolicyTracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"  />
        <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300&display=swap" rel="stylesheet" />
      </Head>

        <Navbar />

      {/* Map Container */}
      <div className="text-center mt-5">
        <div className="flex items-center justify-center relative w-full py-2.5">
          <a 
            href="#"
            className="text-base py-2 px-3 bg-white text-[#5D5A88] rounded absolute left-2.5 transition-all duration-300 hover:bg-[#5D5A88] hover:text-white"
          >
            &lt; กลับ
          </a>
          <h1 className="text-white m-0 text-center flex-grow flex justify-center">
            มีกิจกรรมที่ไหนบ้าง ??
          </h1>
          <div className="relative inline-block mr-5">
            <button 
              className="bg-[#5D5A88] text-white py-2.5 px-4 text-base border-none rounded cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              ภูมิภาค ⌄
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 bg-white min-w-[180px] shadow-md rounded z-[1000]">
                <a href="#" className="text-[#5D5A88] py-3 px-4 no-underline block text-left border-b border-[#ddd] hover:bg-[#f1f1f1]">
                  ภาคเหนือ
                </a>
                <a href="#" className="text-[#5D5A88] py-3 px-4 no-underline block text-left border-b border-[#ddd] hover:bg-[#f1f1f1]">
                  ภาคตะวันออกเฉียงเหนือ
                </a>
                <a href="#" className="text-[#5D5A88] py-3 px-4 no-underline block text-left border-b border-[#ddd] hover:bg-[#f1f1f1]">
                  ภาคกลาง
                </a>
                <a href="#" className="text-[#5D5A88] py-3 px-4 no-underline block text-left border-b border-[#ddd] hover:bg-[#f1f1f1]">
                  ภาคตะวันออก
                </a>
                <a href="#" className="text-[#5D5A88] py-3 px-4 no-underline block text-left border-b border-[#ddd] hover:bg-[#f1f1f1]">
                  ภาคตะวันตก
                </a>
                <a href="#" className="text-[#5D5A88] py-3 px-4 no-underline block text-left hover:bg-[#f1f1f1]">
                  ภาคใต้
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Thailand Map */}
        <div className="relative w-[500px] h-[708px] mx-auto">
          {/* Since we're only focusing on frontend, we'll use a regular img tag here */}
          <img 
            src="/Thai.png" 
            alt="Thailand Map" 
            width="500" 
            height="708" 
            useMap="#thailand-map"
            className="mx-auto"
          />
          <map name="thailand-map">
            <area shape="poly" coords="184,27,151,47,101,60,91,127,116,152,154,147,220,112,238,69" href="#" alt="ภาคเหนือ" />
            <area shape="poly" coords="225,138,167,169,158,257,199,322,219,324,243,260,247,196" href="#" alt="ภาคกลาง" />
            <area shape="poly" coords="149,452,115,560,250,668,271,665,175,538,150,530,162,457,154,454" href="#" alt="ภาคใต้" />
            <area shape="poly" coords="237,322,233,368,296,385,290,345,307,317,277,310,262,301,247,318" href="#" alt="ภาคตะวันออก" />
            <area shape="poly" coords="115,166,143,159,155,181,147,265,176,293,180,398,167,435,158,359,145,307,116,271,135,223" href="#" alt="ภาคตะวันตก" />
            <area shape="poly" coords="239,161,343,111,427,271,322,296,257,288,271,197" href="#" alt="ภาคตะวันออกเฉียงเหนือ" />
          </map>
        </div>
      </div>

      {/* Activities Container */}
      <div className='mx-auto bg-white p-5 text-[#3f3c62]'>
            <h2 className='text-center mb-10'>มีทั้งหมด 20 กิจกรรม</h2>
            <div className='flex flex-wrap w-[50%] '>
                <div className='w-[450px] h-[300px] bg-white shadow-md rounded-lg transition-transform duration-300 border-2 border-[#5D5A88] hover:scale-105 p-4'>
                    <div className='flex justify-between'>
                        <h3 className='font-bold'>กิจกรรมสมาชิกสัมพันธ์</h3>
                        <img className="w-12 h-6" src="/PheuThai.png" alt="" />
                    </div>
                    <p className='text-gray-500'>ร่วมเสวนาพบปะพูดคุยกับ รองหัวหน้าพรรคก้าวไกล คุณพิจารณ์ เชาวพัฒนวงศ์, ส.ส.ธีรัจชัย พันธุมาศ เขต18 , ส.ส.ศศินันท์ ธรรมนิฐินันท์ (ทนายแจม)ที่จะมาร่วมพูดคุยถึงความสำคัญของการสมัครสมาชิกพรรค...</p>
                    <p>26 พฤศจิกายน 2566</p>
                    <div>
                        <img src="" alt="" />
                        <p>ศูนย์ประสานงาน พรรคก้าวไกล - กรุงเทพ เขต18.</p>
                    </div>
                    <div className='flex justify-end'>
                        <button>ดูเพิ่มเติม</button>
                    </div>
                </div>
                <div className='w-[450px] h-[300px] bg-white shadow-md rounded-lg transition-transform duration-300 border-2 border-[#5D5A88] hover:scale-105 p-4'>
                    <div className='flex justify-between'>
                        <h3 className='font-bold'>กิจกรรมสมาชิกสัมพันธ์</h3>
                        <img className="w-12 h-6" src="/PheuThai.png" alt="" />
                    </div>
                    <p className='text-gray-500'>ร่วมเสวนาพบปะพูดคุยกับ รองหัวหน้าพรรคก้าวไกล คุณพิจารณ์ เชาวพัฒนวงศ์, ส.ส.ธีรัจชัย พันธุมาศ เขต18 , ส.ส.ศศินันท์ ธรรมนิฐินันท์ (ทนายแจม)ที่จะมาร่วมพูดคุยถึงความสำคัญของการสมัครสมาชิกพรรค...</p>
                    <p>26 พฤศจิกายน 2566</p>
                    <div>
                        <img src="" alt="" />
                        <p>ศูนย์ประสานงาน พรรคก้าวไกล - กรุงเทพ เขต18.</p>
                    </div>
                    <div className='flex justify-end'>
                        <button>ดูเพิ่มเติม</button>
                    </div>
                </div>
                <div className='w-[450px] h-[300px] bg-white shadow-md rounded-lg transition-transform duration-300 border-2 border-[#5D5A88] hover:scale-105 p-4'>
                    <div className='flex justify-between'>
                        <h3 className='font-bold'>กิจกรรมสมาชิกสัมพันธ์</h3>
                        <img className="w-12 h-6" src="/PheuThai.png" alt="" />
                    </div>
                    <p className='text-gray-500'>ร่วมเสวนาพบปะพูดคุยกับ รองหัวหน้าพรรคก้าวไกล คุณพิจารณ์ เชาวพัฒนวงศ์, ส.ส.ธีรัจชัย พันธุมาศ เขต18 , ส.ส.ศศินันท์ ธรรมนิฐินันท์ (ทนายแจม)ที่จะมาร่วมพูดคุยถึงความสำคัญของการสมัครสมาชิกพรรค...</p>
                    <p>26 พฤศจิกายน 2566</p>
                    <div>
                        <img src="" alt="" />
                        <p>ศูนย์ประสานงาน พรรคก้าวไกล - กรุงเทพ เขต18.</p>
                    </div>
                    <div className='flex justify-end'>
                        <button>ดูเพิ่มเติม</button>
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
}