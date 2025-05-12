"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "70%",
  height: "400px",
};

const EventDetailPage = () => {
  const { name } = useParams();

  const decodedName = decodeURIComponent(name as string);

  const [eventData, setEventData] = useState<any>(null);

  const router = useRouter();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["marker"], // ใช้สำหรับ AdvancedMarkerElement
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/eventdetail/${encodeURIComponent(decodedName)}`);
      const data = await res.json();
      setEventData(data);
    };
    fetchData();
  }, [decodedName]);

  if (!eventData) return <div className="text-center py-20">กำลังโหลดข้อมูล...</div>;

  const [lat, lng] = eventData.map?.split(",").map(Number) || [];
  const center = {
    lat: !isNaN(lat) ? lat : 13.75,
    lng: !isNaN(lng) ? lng : 100.5,
  };

  const handleMapLoad = (map: google.maps.Map) => {
    if ((window as any).google?.maps?.marker?.AdvancedMarkerElement) {
      const marker = new (window as any).google.maps.marker.AdvancedMarkerElement({
        map,
        position: center,
        title: eventData.name,
      });
    } else {
      console.warn("AdvancedMarkerElement ยังไม่พร้อมใช้งาน");
    }
  };

  return (
    <div className="bg-white text-[#5D5A88]">
      <Navbar />
      <div className="bg-[url('/สมาชิกสัมพันธ์.jpg')] h-[400px] flex bg-cover bg-center">
      <button
        onClick={() => router.back()}
        className="bg-white py-2 px-4 rounded-full h-[50px] m-4"
      >
        ย้อนกลับ
      </button>
      </div>

      <div className="border-2 border-gray-300 rounded-lg m-4 p-10">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{eventData.name}</h2>
          <div className="flex gap-4">
          {eventData.relatedPolicy && (
            <button
              onClick={() => router.push(`/policydetail/${encodeURIComponent(eventData.relatedPolicy.name)}`)}
              className="bg-theme3 rounded-full px-4 py-2 text-white"
            >
              นโยบายที่เกี่ยวข้อง
            </button>
          )}
            <img src={`/party/logo/${eventData.party}.png`} alt="" className="h-[40px]" />
          </div>
        </div>

        <div className="flex gap-10 ml-5 mb-5">
          <div className="font-bold">
            <p>วัน</p>
            <p>เวลา</p>
            <p>สถานที่</p>
            <p>สถานะ</p>
          </div>
          <div>
            <p>{eventData.date}</p>
            <p>{eventData.time}</p>
            <p>{eventData.location}</p>
            <p>เสร็จสิ้นแล้ว</p>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-3">รายละเอียด</h2>
        <p className="ml-5 mb-5">{eventData.description}</p>

        <h2 className="mb-3">แผนที่</h2>
        <div className="flex justify-center">
        {isLoaded ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
              options={{ mapId: "91a816168c37298d" }}
              onLoad={handleMapLoad}
            />
          ) : (
            <div>กำลังโหลดแผนที่...</div>
          )}
        </div>

        <div className="flex justify-center my-5">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-theme3 text-white no-underline rounded-full px-4 py-2 text-lg"
          >
            แสดงเส้นทาง
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetailPage;
