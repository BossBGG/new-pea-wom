import {useState} from "react";
import {NotificationObj} from "@/app/api/NotificationApi";
import {Card} from "@/components/ui/card";
import {renderStatusWorkOrder} from "@/app/(pages)/work_order/[id]/work-order-status";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar} from "@fortawesome/free-solid-svg-icons";
import {format} from "date-fns";
import {th} from "date-fns/locale";

const NotificationList = () => {
  const [notifications, setNotifications] = useState<NotificationObj[]>([
    {
      workOrderStatus: "W",
      title: "คำร้อง Y3  ขอติดตั้งระบบผลิตไฟฟ้าจากพลังงานแสงอาทิตย์"
    } as NotificationObj,
    {
      workOrderStatus: "C",
      title: "ติดตั้งระบบผลิตไฟฟ้าจากพลังงานแสงอาทิตย์"
    } as NotificationObj,
  ])

  return (
    <Card className="mt-3 p-4">
      <div className="w-full flex justify-between">
        <div className="font-semibold">
          รายการแจ้งเตือนใหม่
          <span className="text-[#671FAB]">({notifications.length || 0})</span>
        </div>
        <div className="text-[#671FAB] text-[14px]">ทั้งหมด</div>
      </div>

      <div className="w-full">
        {
          notifications.length > 0 ?
            notifications.map((notification: NotificationObj, index) => (
              <div className="border-1 p-3 rounded-md mb-3"
                   key={index}
                   style={{
                     borderColor: notification.workOrderStatus === 'W' ? "#2097F4" : "#671FAB",
                     backgroundColor: notification.workOrderStatus === 'W' ? "#E3F2FF" : "#F4EEFF"
                  }}
              >
                <div className="border-1 rounded-full text-white w-fit px-2 py-1 mb-2"
                     style={{
                       backgroundColor: notification.workOrderStatus === 'W' ? "#2097F4" : "#671FAB"
                     }}
                >
                  {renderStatusWorkOrder(notification.workOrderStatus as string)}
                </div>
                {notification.title}
                <div>
                  <FontAwesomeIcon icon={faCalendar} color={notification.workOrderStatus === "W" ? "#03A9F4" : "#671FAB"}/>
                  <span className="ms-2">{format(new Date(), 'dd MMMM yyyy', {locale: th})}</span>
                </div>
              </div>
            ))
            :
            <div className="flex items-center justify-center text-gray-400 text-[18px] font-semibold">
              ไม่พบรายการแจ้งเตือน
            </div>
        }
      </div>
    </Card>
  )
}

export default NotificationList;
