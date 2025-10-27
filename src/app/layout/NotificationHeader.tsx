"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faCircle,
  faEnvelope,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatJSDateTH } from "@/app/helpers/DatetimeHelper";
import { useRouter } from "next/navigation";

interface NotificationItem {
  id: string;
  title: string;
  request_sap_no: string;
  type: string;
  detail: string;
  createdAt: string;
  notificationDate: string;
  isRead: boolean;
}

const NotificationHeader = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const mockNotifications: NotificationItem[] = [
      {
        id: "1",
        title: "ขอฝ่าเครื่องจักรเดินสายไฟฟ้า",
        request_sap_no: "I1OMN2305670",
        type: "ใบสั่งงานใหม่",
        detail: "คำร้อง Y3 ติดส่งระบบผลิตไฟฟ้าทางพลังงานแสงอาทิตย์",
        createdAt: "2566-12-14T14:30:00",
        notificationDate: "22 นาที",
        isRead: false,
      },
      {
        id: "2",
        title: "ขอฝ่าเครื่องจักรเดินสายไฟฟ้า",
        request_sap_no: "I1OMN2305670",
        type: "ใบสั่งงานใหม่",
        detail: "คำร้อง Y3 ติดส่งระบบผลิตไฟฟ้าทางพลังงานแสงอาทิตย์",
        createdAt: "2566-12-14T14:30:00",
        notificationDate: "22 นาที",
        isRead: false,
      },
      {
        id: "3",
        title: "ปิดใบงานเรียบร้อย",
        request_sap_no: "I1OMN2305670",
        type: "อนุมัติใบสั่งงาน",
        detail: "คำร้อง Y3 ติดส่งระบบผลิตไฟฟ้าทางพลังงานแสงอาทิตย์",
        createdAt: "2566-12-14T14:30:00",
        notificationDate: "22 นาที",
        isRead: false,
      },
      {
        id: "4",
        title: "ขอฝ่าเครื่องจักรเดินสายไฟฟ้า",
        request_sap_no: "I1OMN2305670",
        type: "ใบสั่งงานใหม่",
        detail: "คำร้อง Y3 ติดส่งระบบผลิตไฟฟ้าทางพลังงานแสงอาทิตย์",
        createdAt: "2566-12-14T14:30:00",
        notificationDate: "22 นาที",
        isRead: false,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.isRead).length);
  }, []);

  const handleViewAll = () => {
    setOpen(false);
    router.push("/notification");
  };

  return (
    <>
      <div
        className="hover:bg-[#E1D2FF]  px-4 py-3 rounded-full relative mr-3 cursor-pointer transform duration-150 "
        onClick={() => setOpen(true)}
      >
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-[#FF3700] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
            {unreadCount}
          </div>
        )}
        <FontAwesomeIcon icon={faBell} size="lg" color="#671FAB" />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[500px] max-h-[80vh] p-0"
          showCloseButton={false}
        >
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-[20px] font-bold text-[#160C26]">
                รายการแจ้งเตือน
                {unreadCount > 0 && (
                  <span className="ml-2 bg-[#FF3700] text-white rounded-full px-2 py-[1] text-[12px]">
                    {unreadCount}
                  </span>
                )}
              </DialogTitle>
              <button
                onClick={() => setOpen(false)}
                className="hover:bg-gray-100 rounded-full px-2 py-1"
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            <div className="flex flex-row text-[14px] text-[#4A4A4A] font-normal mt-2 justify-between">
              ข้อความใหม่
              <button className="flex text-[#671FAB] underline gap-2">
                อ่านทั้งหมด

                <FontAwesomeIcon icon={faEnvelope} color="#671FAB" size="lg" className="mt-1"/>
              </button>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[500px] px-6">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border-b rounded-lg last:border-b-0 hover:bg-gray-50 cursor-pointer transform duration-100"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-[14px]">
                    {notification.title}
                  </div>
                  <div className="text-[12px] text-[#4A4A4A] whitespace-nowrap ml-2">
                    {notification.notificationDate}
                  </div>
                </div>
                <div className="text-[12px] text-[#4A4A4A] mb-2">
                  เลขที่คำร้อง : {notification.request_sap_no}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-[12px] text-[#4A4A4A]">
                    ประเภท : {notification.type}
                  </div>
                </div>
                <div className="text-[12px] text-[#4A4A4A] mt-2">
                  วันที่เวลานัดหมาย :
                </div>
                <div className="text-[14px] font-medium">
                  {formatJSDateTH(
                    new Date(notification.createdAt),
                    "dd MMMM yyyy, HH:mm น."
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t">
            <button
              onClick={handleViewAll}
              className="w-full bg-[#671FAB] hover:bg-[#671FAB]/90 text-white rounded-full py-3 font-medium"
            >
              ดูแจ้งเตือนทั้งหมด
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationHeader;
