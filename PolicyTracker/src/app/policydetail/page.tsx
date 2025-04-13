// import next from "next";
// import Image from "next/image";
// import Navbar from "@/app/components/Navbar";
// import Footer from "@/app/components/Footer";
// import Step from "@/app/components/step";



// const PolicyDetailPage = () => {
//   return (
//     <div className="bg-white">
//         <Navbar />
//         <div className="grid grid-cols-4 grid-rows-4 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e] h-[60svh]">
//             <div className="flex items-center ml-10">
//                 <button className="text-[#5D5A88] bg-[#FFFFFF] hover:bg-[#5D5A88] hover:text-[#FFFFFF] rounded-full px-4 py-2 ">ย้อนกลับ</button>
//             </div>
//             <div className="text-center col-span-2 row-span-2"> 
//                 <h1 className="text-white p-10 font-bold text-[3rem]">แก้ปัญหาน้ำท่วม-น้ำแล้ง</h1>
//                 <p className="text-white text-[28px] m-0">พัฒนาระบบน้ำในพื้นที่กว่า 8.21 ล้านไร่ ทำระบบป้องกันน้ำท่วมอีกกว่า 2.12 ล้านไร่ และสำหรับพื้นที่อีสานซึ่งเป็นแหล่งเพราะปลูกสำคัญและมักเจอปัญหาน้ำแล้ง รัฐบาลจะเพิ่มแหล่งน้ำกว่า 320,000 ไร่  ทั้งหมดนี้ จะมีประชาชนกว่ากว่า 6.1 ล้านครัวเรือนทั่วประเทศ ได้รับประโยชน์จากโครงการนี้ และจะทำให้สำเร็จใน 3 ปี </p>
//             </div>
//             <div className="row-start-3 col-start-2 flex justify-end items-end p-4">
//             <Step />
//             </div>
//             <div className="flex items-end row-start-3 col-start-3">
//             <p className="text-white text-[24px] pl-4">ผลักดันร่างพระราชบัญญัติการบริหารจัดการระบบตั๋วร่วม เพื่อให้อำนาจดำเนินนโยบายได้</p>
//             </div>
//             <div className="row-start-4 col-start-3 p-4">
//                 <button className="bg-[#FFFFFF] hover:bg-orange-700 px-5 py-2 rounded-md text-[#5D5A88] hover:text-[#FFFFFF] text-[18px]">
//                     ดูเพิ่มเติม
//                 </button>
//             </div>
//             <div className="row-start-4 col-start-4 flex items-end justify-end p-10">
//                 <button className="border-slate-300 p-2.5 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20">
//                 <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
//                 </svg>
//                 </button>
//             </div>
//         </div>
            
//         <div className="bg-[url(/dam.jpg)] bg-cover bg-center p-10 bg-black bg-opacity-50 bg-blend-overlay">
//             <div className="flex justify-between mb-4">
//                 <h2 className="pt-2 text-white">นโยบายจากพรรคเพื่อไทย</h2>
//                 <div className="flex justify-center items-center bg-white p-4 rounded-full">
//                 <img className="h-10" src="/PheuThai.png" alt="" />
//                 </div>
//             </div>
//             <p className="text-white">พรรคเพื่อไทย ก่อตั้งขึ้นในปี 2552 หลังจากที่พรรคไทยรักไทยถูกยุบพรรค เพื่อไทยมีอุดมการณ์ในการพัฒนาเศรษฐกิจและสังคม</p>
//             <button className="bg-[#5D5A88] text-white px-4 py-2.5 rounded-md">อ่านเพิ่มเติมเกี่ยวกับพรรค</button>
//         </div>
//         <div className="w-5/6 mx-auto">
//         <h2 className="text-[#5D5A88] my-10">ลำดับเหตุการณ์</h2>
//         <ol className="items-center sm:flex bg-white mb-0">
//             <li className="relative mb-6 sm:mb-0">
//                 <div className="flex items-center">
//                     <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
//                         <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                             <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
//                         </svg>
//                     </div>
//                     <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
//                 </div>
//                 <div className="mt-3 sm:pe-8">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Flowbite Library v1.0.0</h3>
//                     <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on December 2, 2021</time>
//                     <p className="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements.</p>
//                 </div>
//             </li>
//             <li className="relative mb-6 sm:mb-0">
//                 <div className="flex items-center">
//                     <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
//                         <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                             <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
//                         </svg>
//                     </div>
//                     <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
//                 </div>
//                 <div className="mt-3 sm:pe-8">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Flowbite Library v1.2.0</h3>
//                     <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on December 23, 2021</time>
//                     <p className="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements.</p>
//                 </div>
//             </li>
//             <li className="relative mb-6 sm:mb-0">
//                 <div className="flex items-center">
//                     <div className="z-10 flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full ring-0 ring-white dark:bg-blue-900 sm:ring-8 dark:ring-gray-900 shrink-0">
//                         <svg className="w-2.5 h-2.5 text-blue-800 dark:text-blue-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
//                             <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
//                         </svg>
//                     </div>
//                     <div className="hidden sm:flex w-full bg-gray-200 h-0.5 dark:bg-gray-700"></div>
//                 </div>
//                 <div className="mt-3 sm:pe-8">
//                     <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Flowbite Library v1.3.0</h3>
//                     <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Released on January 5, 2022</time>
//                     <p className="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements.</p>
//                 </div>
//             </li>
//         </ol>


//         <h2 className="text-[#5D5A88] my-10">ความสำเร็จ</h2>
//         <div className="flex justify-center bg-white">
//             <div className="grid grid-cols-3 gap-6 w-1/2 mt-10 mb-10">
//                 <div className="border-1 border-gray-300 rounded-xl p-4 text-center">
//                     <h2 className="text-[#5D5A88]">01</h2>
//                     <h3 className="text-[#5D5A88]">เชิงโครงการ</h3>
//                     <p className="text-[#5D5A88]">รถไฟฟ้า 20 บาทตลอดสายภายใน 2 ปี(เดือน ก.ย. 2568)</p>
//                 </div>
//                 <div className="border-1 border-gray-300 rounded-xl p-4 text-center">
//                     <h2 className="text-[#5D5A88]">01</h2>
//                     <h3 className="text-[#5D5A88]">เชิงกระบวนการ</h3>
//                     <p className="text-[#5D5A88]">เร่งผลักดันกฎหมายรองรับ ต้องออกพระราชบัญญัติการบริหารจัดการระบบตั๋วร่วม</p>
//                 </div>
//                 <div className="border-1 border-gray-300 rounded-xl p-4 text-center">
//                     <h2 className="text-[#5D5A88]">01</h2>
//                     <h3 className="text-[#5D5A88]">เชิงนโยบาย</h3>
//                     <p className="text-[#5D5A88]">ลดต้นทุนและค่าครองชีพของประชาชน กำหนดอัตราราคาค่าบริการในราคาถูก</p>
//                 </div>
//             </div>
//         </div>
//         <h2 className="text-[#5D5A88] mt-10">โครงการที่เกี่ยวข้อง</h2>
//             <div className="grid grid-cols-2 gap-6 mt-10 mb-20">
//                 <div className="border-1 border-gray-300 rounded-xl p-4">
//                     <h3 className="text-[#5D5A88]">พัฒนาการขุดลอกคูคลอง</h3>
//                     <p className="text-[#5D5A88]">โดยให้กรมเจ้าท่า และหน่วยงานที่เกี่ยวข้อง ศึกษาแก้กฎหมายอนุญาตให้ประชาชน สามารถนำดินจากการขุดลอกคูคลอง ไปใช้ประโยชน์ หรือนำไปขาย สร้างอาชีพ เพิ่มรายได้ โดยเสียค่าใช้จ่ายในการขุดเอง ภายใต้เงื่อนไขที่ไม่สร้างผลกระทบต่อสิ่งแวดล้อม</p>
//                 </div>
//                 <div className="border-1 border-gray-300 rounded-xl p-4">
//                     <h3 className="text-[#5D5A88]">สร้าง Floodway ขนาดใหญ่</h3>
//                     <p className="text-[#5D5A88]">เพื่อให้สมาชิคพรรคและประชาชนทั่วไปได้รับรู้และเข้าใจอย่างแท้จริง โดยเฉพาะอย่างยิ่งการนำเสนออุดมการณ์ นโยบายพรรค ตลอดจนแผนปฏิบัติการที่จะทำให้แนวคิดต่างๆเป็นจริง และเป็นรูปธรรม</p>
//                 </div>
//             </div>
//             <h2 className="text-[#5D5A88]">กิจกรรมที่เกี่ยวข้อง</h2>
            
//         </div>
//         <img className="w-full h-72 object-cover my-5" src="/train.jpg" alt="" />
//         <div className="flex justify-center mb-10"> 
//             <button className="px-4 py-2 bg-black text-white rounded-md text-center">กิจกรรมที่เกี่ยวข้อง</button>
//         </div>
//         <Footer />
//     </div>
    
//   );
// }

// export default PolicyDetailPage;