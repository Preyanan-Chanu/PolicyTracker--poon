import Link from "next/link";



const Navbar = () => {
    return (
        
        <nav className="bg-white p-3 z-1">
          <div className="flex justify-between items-center">
            <a href="" className="no-underline font-bold text-[30px] text-[#5D5A88]">PolicyTracker</a>
            <ul className="flex flex-row no-underline gap-4 m-0">
              <li><Link className="text-[18px] no-underline bg-none text-[#5D5A88] transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation hover:bg-[rgba(51,51,51,0.12)] text-[#3f3c62] px-3 py-2.5 transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation" href="/">หน้าหลัก</Link></li>
              <li><Link className="text-[18px] no-underline bg-none text-[#5D5A88] transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation hover:bg-[rgba(51,51,51,0.12)] text-[#3f3c62] px-3 py-2.5 transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation" href="/policy">นโยบาย</Link></li>
              <li><Link className="text-[18px] no-underline bg-none text-[#5D5A88] transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation hover:bg-[rgba(51,51,51,0.12)] text-[#3f3c62] px-3 py-2.5 transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation" href="/activity">กิจกรรม</Link></li>
              <li><Link className="text-[18px] no-underline bg-none text-[#5D5A88] transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation hover:bg-[rgba(51,51,51,0.12)] text-[#3f3c62] px-3 py-2.5 transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation" href="/party">พรรค</Link></li>
              <li><Link className="text-[18px] no-underline bg-none text-[#5D5A88] transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation hover:bg-[rgba(51,51,51,0.12)] text-[#3f3c62] px-3 py-2.5 transition-all duration-200 align-baseline whitespace-nowrap select-none touch-manipulation" href="/login">เข้าสู่ระบบ</Link></li>
            </ul>
          </div>
          
        </nav>
        


    )    
};

export default Navbar;
