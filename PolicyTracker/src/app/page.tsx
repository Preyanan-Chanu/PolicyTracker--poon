import Announcements from "@/app/components/Announcements";
import AttendanceChart from "@/app/components/AttendanceChart";
import CountChart from "@/app/components/CountChart";
import EventCalendar from "@/app/components/EventCalendar";
import FinanceChart from "@/app/components/FinanceChart";
import UserCard from "@/app/components/UserCard";
import Navbar from "./components/Navbar";

const HomePage = () => {
    return (
        <div>
          <Navbar />
        <div className="p-4 flex gap-4 flex-col md:flex-row bg-[#9795B5]">
            {/* LEFT */}
            <div className="w-full lg:w-2/3 flex flex-col gap-8">
            {/*USER CARD */}
            <div className="flex gap-4 justify-between flex-wrap">
                <UserCard type="โครงการทั้งหมด"/>
                <UserCard type="โครงการที่กำลังดำเนินงาน"/>
                <UserCard type="โครงงานที่เสร็จสิ้น"/>
                <UserCard type="กิจกรรม"/>
            </div>
            {/* MIDDLE CHART */}
                <div className="flex gap-4 flex-col lg:flex-row">
                    {/* COUNTCHART1 */}
                    <div className="w-full lg:w-1/3 h-[430px]">
                        <CountChart />
                    </div>
                     {/* COUNTCHART2 */}
                     <div className="w-full lg:w-2/3 h-[430px]">
                        <AttendanceChart />
                     </div>
                </div>
            {/* BOTTOM CHART */}
            <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
        <Announcements/>
      </div>
    </div>
    </div>
  );
};

export default HomePage