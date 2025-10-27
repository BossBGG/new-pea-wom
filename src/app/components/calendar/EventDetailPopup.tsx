import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faUser,
  faPhone,
  faMapPin,
  faCog,
  faTimes, faFile
} from "@fortawesome/free-solid-svg-icons";
import EventDetailItem from "./EventDetailItem";

interface EventDetailPopupProps {
  event: {
    fullTitle: string;
    appointmentTime: string;
    customerName: string;
    customerPhone: string;
    location: string;
    serviceType: string;
    details: string;
    requestNumber: string;
    date: string;
  };
  onClose: () => void;
}

const EventDetailPopup: React.FC<EventDetailPopupProps> = ({ event, onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>

      <h3 className="text-xl font-bold text-gray-900 mb-4 pr-6">
        {event.fullTitle}
      </h3>

      <div className="space-y-3">
        <EventDetailItem icon={faCalendar} label="วันที่" value={event.date} />
        <EventDetailItem icon={faClock} label="เวลาที่นัดหมาย" value={event.appointmentTime} />
        <EventDetailItem icon={faUser} label="ข้อมูลลูกค้า" value={event.customerName} />
        <EventDetailItem icon={faPhone} label="เบอร์ติดต่อมือถือ" value={event.customerPhone} />
        <EventDetailItem icon={faMapPin} label="สถานที่" value={event.location} />
        <EventDetailItem icon={faCog} label="ประเภทงานบริการ" value={event.serviceType} />
      </div>

      <button className="w-full bg-purple-600 text-white py-3 rounded-full mt-6 hover:bg-purple-700 transition-colors">
        เริ่มปฏิบัติงาน
      </button>

      <div className="mt-4 space-y-1">
        <div className="text-[14px]">
          <div className="text-[#57595B]">รายละเอียด: </div>
          <div className="text-[#160C26]">{event.details}</div>
        </div>

        <EventDetailItem icon={faFile} label={"เลขที่คำร้อง:"} value={event.requestNumber}/>
      </div>
    </div>
  );
};

export default EventDetailPopup;
