import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const ActivityDetailPage = () => {
  return (
    
    <div className="bg-white">
        <Navbar />
        <div className="bg-[url('/images/party.jpg')]">
            <button></button>
        </div>
        <div className="bg-white">
            <div className="border-gray-500 rounded-lg m-5">
                <div className="flex flex-row">
                    <h2>กิจกรรมสมาชิกสัมพันธ์</h2>
                    <button></button>
                    <button></button>
                    <img src="" alt="" />
                </div>
                <div className="flex flex-col w-1/3">
                    <h4>วัน</h4>
                    <h4>เวลา</h4>
                    <h4>สถานที่</h4>
                    <p>26 พฤศจิกายน 2566</p>
                    <p>12:30 - 16:00 น</p>
                    <p>ศูนย์ประสานงาน พรรคก้าวไกล - กรุงเทพ เขต18.</p>
                </div>
                <div>
                    <h2>รายละเอียด</h2>
                    <p>
                    กิจกรรมสมาชิกสัมพันธ์ “ประชาชนก้าวไกล”กรุงเทพมหานคร เขต 18 (หนองจอก มีนบุรี ลาดกระบัง)
                    .
                    ร่วมเสวนาพบปะพูดคุยกับ รองหัวหน้าพรรคก้าวไกล คุณพิจารณ์ เชาวพัฒนวงศ์, ส.ส.ธีรัจชัย พันธุมาศ เขต18 , ส.ส.ศศินันท์ ธรรมนิฐินันท์ (ทนายแจม)ที่จะมาร่วมพูดคุยถึงความสำคัญของการสมัครสมาชิกพรรค การสร้างฐานสมาชิก การสมัครรับเลือกตั้งในทุกระดับ ทั้งระดับชาติ/ระดับท้องถิ่น ติดอาวุธทางการเมือง สิทธิพื้นฐานของประชาชน ร่วมกันตรวจสอบการทำงานของรัฐ หน่วยงานราชการ
                    .
                    ร่วมสมัครสมาชิกพรรค ร่วมเป็นเจ้าของพรรค ร่วมคิด ร่วมตัดสินใจ ให้พรรคก้าวไกลเป็นพรรคของมวลชน เพื่อให้หนองจอก มีนบุรี ลาดกระบัง และประเทศไทยเปลี่ยนแปลง ไม่เหมือนเดิมอีกต่อไป
                    .
                    </p>
                </div>
                <h2>รูปภาพเพิ่มเติม</h2>
                <img src="" alt="main pic" />
                <h2>แผนที่</h2>
                //google map api
            </div>
            <div className="w-1/3 bg-blue-500">

            </div>
            <div className="w-2/3 flex bg-purple-500">
                <div>
                    <h2>งบประมาณที่ใช้</h2>
                </div>
                <div className="w-2/3">
                    //graph
                </div>
                <div className="w-1/3 flex flex-col">
                    <p>จัดกิจกรรม</p>
                    <p>สาธารณูปโภค</p>
                    <p>บุคลากร</p>
                    <p>ลงทุน</p>
                </div>
                <div className="flex jsutify-end">
                    <button>สนับสนุน</button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default ActivityDetailPage;