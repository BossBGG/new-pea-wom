import { ApiResponse } from "@/app/api/Api";
import { TableListApi, TableResponse, ListTableData } from "@/app/api/TableApiHelper";
import axios from "axios";

export interface NotificationObj {
  id: string;
  uuid: string;
  createdAt: string;
  title: string;
  type: string;
  detail: string;
  isRead: boolean;
  workOrderNo?: string;
  requestNo?: string;
}


interface NotificationFilterParams extends ListTableData {
  type?: string;
  search?: string;
  from?: string;
  to?: string;
}


const mockNotifications: NotificationObj[] = [
  {
    id: "1",
    uuid: "uuid-001",
    createdAt: "2566-12-28T09:30:00",
    title: "ขอฝ่าเครื่องจักรเดินสายไฟฟ้า",
    type: "ใบสั่งงานใหม่",
    detail: "คำร้อง Y3 ติดตั้งระบบผลิตไฟฟ้าทางพลังงานแสงอาทิตย์",
    isRead: false,
    workOrderNo: "WO2023001",
    requestNo: "I1OMN2305670"
  },
  {
    id: "2",
    uuid: "uuid-002",
    createdAt: "2566-12-21T13:50:00",
    title: "สำรวจพื้นที่สำเร็จ",
    type: "สำรวจงานสำเร็จ",
    detail: "สำรวจพื้นที่เสร็จสมบูรณ์แล้ว สามารถดำเนินการต่อได้",
    isRead: false,
    workOrderNo: "WO2023002",
    requestNo: "I1OMN2305671"
  },
  {
    id: "3",
    uuid: "uuid-003",
    createdAt: "2566-12-19T11:45:00",
    title: "สำรวจไม่สำเร็จ",
    type: "สำรวจไม่สำเร็จ",
    detail: "สำรวจไม่สำเร็จเนื่องจากผู้ยื่นคำร้อง",
    isRead: true,
    workOrderNo: "WO2023003",
    requestNo: "I1OMN2305672"
  },
  {
    id: "4",
    uuid: "uuid-004",
    createdAt: "2566-12-17T09:20:00",
    title: "ส่งใบเสนอราคา",
    type: "ส่งใบเสนอราคา",
    detail: "แจ้งส่งราคา/วัสดุ อุปกรณ์ไฟฟ้าทางพลังงานแสงอาทิตย์",
    isRead: true,
    workOrderNo: "WO2023004",
    requestNo: "I1OMN2305673"
  },
  {
    id: "5",
    uuid: "uuid-005",
    createdAt: "2566-12-17T09:20:00",
    title: "อนุมัติใบสั่งงาน",
    type: "อนุมัติใบสั่งงาน",
    detail: "อนุมัติงานติดตั้งระบบผลิตไฟฟ้าแสงอาทิตย์แล้ว",
    isRead: false,
    workOrderNo: "WO2023005",
    requestNo: "I1OMN2305674"
  },
  {
    id: "6",
    uuid: "uuid-006",
    createdAt: "2566-12-15T14:20:00",
    title: "รายงานการใช้วัสดุ",
    type: "รายงานการใช้วัสดุ",
    detail: "ส่งรายงานการใช้วัสดุอุปกรณ์ให้รับทราบ",
    isRead: true,
    workOrderNo: "WO2023006",
    requestNo: "I1OMN2305675"
  },
  {
    id: "7",
    uuid: "uuid-007",
    createdAt: "2566-12-10T17:40:00",
    title: "ประเมินผลการดำเนินงาน",
    type: "ประเมินผลการดำเนินงาน",
    detail: "แจ้งส่งการประเมินผลการดำเนินงาน/รับรู้คุณภาพงานให้ดีกว่าเดิม",
    isRead: false,
    workOrderNo: "WO2023007",
    requestNo: "I1OMN2305676"
  },
  {
    id: "8",
    uuid: "uuid-008",
    createdAt: "2566-12-05T14:00:00",
    title: "อนุมัติใบสั่งงาน",
    type: "อนุมัติใบสั่งงาน",
    detail: "อนุมัติบำรุงรักษาระบบปันไฟฟ้าและเสนอเอกสารแล้ว",
    isRead: true,
    workOrderNo: "WO2023008",
    requestNo: "I1OMN2305677"
  },
  {
    id: "9",
    uuid: "uuid-009",
    createdAt: "2566-12-03T12:10:00",
    title: "รายงานการใช้วัสดุ",
    type: "รายงานการใช้วัสดุ",
    detail: "ส่งรายงานการใช้วัสดุสำหรับใบชุดไปใช้งาน",
    isRead: true,
    workOrderNo: "WO2023009",
    requestNo: "I1OMN2305678"
  },
  {
    id: "10",
    uuid: "uuid-010",
    createdAt: "2566-11-30T17:40:00",
    title: "ปิดงานและส่งรายงาน",
    type: "ปิดงานและส่งรายงาน",
    detail: "แบบประเมินความพึงพอใจระบบปันไฟฟ้าและเสนอเอกสารแล้ว",
    isRead: false,
    workOrderNo: "WO2023010",
    requestNo: "I1OMN2305679"
  },
  {
    id: "11",
    uuid: "uuid-011",
    createdAt: "2566-11-25T10:05:00",
    title: "ปิดงานและส่งรายงาน",
    type: "ปิดงานและส่งรายงาน",
    detail: "ติดตั้งอุปกรณ์ระบบผลิตเสร็จสมบูรณ์",
    isRead: true,
    workOrderNo: "WO2023011",
    requestNo: "I1OMN2305680"
  }
];


const filterNotifications = (
  data: NotificationFilterParams
): NotificationObj[] => {
  let filtered = [...mockNotifications];


  if (data.type && data.type !== "all") {
    filtered = filtered.filter((item) => item.type === data.type);
  }


  if (data.search) {
    const searchLower = data.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.detail.toLowerCase().includes(searchLower) ||
        item.type.toLowerCase().includes(searchLower)
    );
  }


  filtered.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return filtered;
};


export const NotificationList: TableListApi<NotificationObj> = {
  callApi: (data: ListTableData) => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();


    const filterData = data as NotificationFilterParams;

    return Promise.resolve({
      api: new Promise<ApiResponse<TableResponse<NotificationObj>>>((resolve) => {
        setTimeout(() => {
          const filtered = filterNotifications(filterData);
          const start = (filterData.page - 1) * filterData.limit;
          const end = start + filterData.limit;
          const paginatedData = filtered.slice(start, end);

          resolve({
            data: {
              status_code: 200,
              message: "Success",
              data: {
                items: paginatedData,
                data: paginatedData,
                meta: {
                  limit: filterData.limit,
                  page: filterData.page,
                  totalCount: filtered.length,
                },
                pagination: {
                  limit: filterData.limit,
                  page: filterData.page,
                  totalCount: filtered.length,
                },
                total: filtered.length,
                draw: 1,
                limit: filterData.limit,
                page: filterData.page,
              },
              error: undefined,
            },
            status: 200,
            statusText: "OK",
            headers: {},
            config: {} as any,
          });
        }, 500); 
      }),
      cancelToken: source,
    });
  },
};


export const markAsRead = (id: string): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notification = mockNotifications.find((n) => n.id === id);
      if (notification) {
        notification.isRead = true;
      }
      resolve({
        data: {
          status_code: 200,
          message: "Marked as read successfully",
          data: null,
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });
    }, 300);
  });
};

export const deleteNotification = (id: string): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockNotifications.findIndex((n) => n.id === id);
      if (index > -1) {
        mockNotifications.splice(index, 1);
      }
      resolve({
        data: {
          status_code: 200,
          message: "Deleted successfully",
          data: null,
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });
    }, 300);
  });
};

export const deleteMultipleNotifications = (ids: string[]): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      ids.forEach((id) => {
        const index = mockNotifications.findIndex((n) => n.id === id);
        if (index > -1) {
          mockNotifications.splice(index, 1);
        }
      });
      resolve({
        data: {
          status_code: 200,
          message: "Deleted successfully",
          data: null,
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });
    }, 300);
  });
};

export const markAllAsRead = (): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockNotifications.forEach((n) => {
        n.isRead = true;
      });
      resolve({
        data: {
          status_code: 200,
          message: "All notifications marked as read",
          data: null,
        },
        status: 200,
        statusText: "OK",
        headers: {},
        config: {} as any,
      });
    }, 300);
  });
};


export const getUnreadCount = (): number => {
  return mockNotifications.filter((n) => !n.isRead).length;
};