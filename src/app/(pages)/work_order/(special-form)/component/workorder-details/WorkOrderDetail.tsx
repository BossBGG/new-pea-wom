import React from "react";
import { WorkOrderObj } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/app/components/list/Badge";
import { useAppSelector } from "@/app/redux/hook";

interface WorkOrderDetailProps {
  data: WorkOrderObj;
  status: string;
}

const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({ data, status }) => {
  const screenSize = useAppSelector((state) => state.screen_size);

  // Check if essential data is missing
  const isDataIncomplete =
    !data.request_no || !data.request_sap_no || !data.request_status;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "รอเริ่มปฏิบัติงาน":
        return "warning";
      case "อยู่ระหว่างดำเนินงาน":
        return "info";
      case "เสร็จสิ้น":
        return "success";
      default:
        return "info";
    }
  };

  if (screenSize === "mobile") {
    return (
      <Card className="bg-[#F4EEFF] shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-center items-center text-center mb-6">
            <div>
              <h2 className=" bg-[#9538EA] text-xl w-[240px] py-2 rounded-lg text-white">
                {status}
              </h2>
            </div>
          </div>

          {isDataIncomplete ? (
            <div className="text-center py-8">
              <p className="text-gray-500">ไม่มีรายละเอียดคำร้อง</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">เลขที่คำร้อง :</span>
                <span className="font-medium">{data.request_no}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">เลขที่คำร้อง SAP :</span>
                <span className="font-medium">{data.request_sap_no}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">สถานะคำร้อง :</span>
                <span className="bg-yellow-100 px-2 py-1 rounded text-sm font-medium">
                  {data.request_status}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">ประเภทใบสั่งงาน :</span>
                <span className="font-medium">{data.request_type}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">กอง/กฟฟ. :</span>
                <span className="font-medium">{data.organization?.[0] || data.pea_office || "-"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">คำอธิบายการทำงาน :</span>
                <span className="font-medium">{data.work_description}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">ลำดับความสำคัญของงาน :</span>
                <span className="bg-red-100 px-2 py-1 rounded text-sm font-medium text-red-700">
                  สำคัญมาก (24 ชม.)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">ประเภทงานบริการ :</span>
                <span className="font-medium">{data.serviceType || 'งานบริการ Y3'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">ช่องทางรับคำร้อง :</span>
                <span className="font-medium">-</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">วันที่รับคำร้อง :</span>
                <span className="font-medium">
                  {data.payment_received_date}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  ศูนย์งาน/ศูนย์บริการ :
                </span>
                <span className="font-medium">{data.main_work_center || '-'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">ศูนย์เงินทุน :</span>
                <span className="font-medium">{data.cost_center || '-'}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  รหัสโรงงาน Plant :
                </span>
                <span className="font-medium">{data.plant_code}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#F4EEFF] shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-center items-center text-center mb-6">
          <div>
            <h2 className=" bg-[#9538EA] text-xl w-[500px] py-2 rounded-lg text-white">
              {status}
            </h2>
          </div>
        </div>

        {isDataIncomplete ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่มีรายละเอียดคำร้อง</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">เลขที่คำร้อง</label>
                <p className="mt-1 text-gray-900">{data.request_no}</p>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">เลขที่คำร้อง SAP</label>
                <p className="mt-1 text-gray-900">{data.request_sap_no}</p>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">สถานะคำร้อง</label>
                <div className="mt-1">
                  <span className="bg-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
                    {data.request_status}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">ประเภทใบสั่งงาน</label>
                <p className="mt-1 text-gray-900">{data.request_type}</p>
              </div>

              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">กอง/กฟฟ.</label>
                <p className="mt-1 text-gray-900">{data.organization?.[0] || data.pea_office || '-'}</p>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">คำอธิบายการทำงาน</label>
                <p className="mt-1 text-gray-900">{data.work_description}</p>
              </div>
            </div>


            <div className="space-y-4">
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">ลำดับความสำคัญของงาน</label>
                <div className="mt-1">
                  <span className="bg-red-100 px-3 py-1 rounded-full text-sm font-medium text-red-700">
                    สำคัญมาก (24 ชม.)
                  </span>
                </div>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">ประเภทงานบริการ</label>
                <p className="mt-1 text-gray-900">{data.serviceType || 'งานบริการ Y3'}</p>
              </div>

              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">ช่องทางรับคำร้อง</label>
                <p className="mt-1 text-gray-900">-</p>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">วันที่รับคำร้อง</label>
                <p className="mt-1 text-gray-900">{data.payment_received_date}</p>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">ศูนย์งาน/ศูนย์บริการ (Work Center)</label>
                <p className="mt-1 text-gray-900">{data.main_work_center || '-'}</p>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">ศูนย์เงินทุน</label>
                <p className="mt-1 text-gray-900">{data.cost_center || '-'}</p>
              </div>
              
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">รหัสโรงงาน โรงงานที่วางแผน หรือศูนย์รวมงาน (Plant)</label>
                <p className="mt-1 text-gray-900">{data.plant_code}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkOrderDetail;
