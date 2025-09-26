import React from "react";
import { WorkOrderObj } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import Badge from "@/app/components/list/Badge";
import { useAppSelector } from "@/app/redux/hook";
import {renderStatusWorkOrder} from "@/app/(pages)/work_order/[id]/work-order-status";

interface WorkOrderDetailProps {
  data: WorkOrderObj;
  status: string;
}

const WorkOrderInfo: React.FC<WorkOrderDetailProps> = ({ data, status }) => {
  // Check if essential data is missing
  // const isDataIncomplete = !data.request_no || !data.request_sap_no || !data.request_status;
  const isDataIncomplete = false

  const WorkOrderInform = ({title, value}: {
    title: string,
     value: string
  }) => (
    <div className="flex flex-wrap items-center justify-between mb-3">
      <div className="text-wrap text-[#4A4A4A]">{title} : </div>
      <div className="text-wrap text-[#160C26]">{value}</div>
    </div>
  )

  return (
    <Card className="bg-[#F4EEFF] shadow-[#A6AFC366] mb-3">
      <CardContent className="p-5">
        <div className="flex justify-center items-center text-center -mt-5 mb-6 w-full">
          <div className="bg-[#9538EA] font-medium text-[20px] py-2 rounded-bl-md rounded-br-md text-white w-full">
            {status}
          </div>
        </div>

        {isDataIncomplete ? (
          <div className="text-center py-10">
            <div className="text-[#ED3241]">ไม่มีรายละเอียดคำร้อง</div>
          </div>
        ) : (
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 px-2 md:border-r-1 md:border-r-[#AAAAAA]">
              <WorkOrderInform title="เลขที่คำร้อง" value={data.workOrderNo}/>
              <WorkOrderInform title="เลขที่คำร้องจาก SAP" value={data.request_sap_no as string}/>

              <div className="flex flex-row justify-between mb-3">
                <label className="text-[#4A4A4A]">สถานะคำร้อง</label>
                <div>
                  <span className="bg-[#F9AC12] px-3 py-1 rounded-sm text-white text-sm font-medium">
                    {renderStatusWorkOrder(data.workOrderStatusCode)}
                  </span>
                </div>
              </div>

              <WorkOrderInform title="ประเภทใบสั่งงาน" value={data.request_type as string}/>
              <WorkOrderInform title="กอง/กฟฟ." value={data.organization?.[0] || data.pea_office || '-'}/>
              <WorkOrderInform title="คำอธิบายการทำงาน" value={data.work_description}/>
            </div>

            <div className="w-full md:w-1/2 px-2">
              <div className="flex flex-row justify-between mb-3">
                <label className="text-[#4A4A4A]">ลำดับความสำคัญของงาน</label>
                <div>
                  <span className="bg-red-100 px-3 py-1 rounded-full text-sm font-medium text-red-700">
                    สำคัญมาก (24 ชม.)
                  </span>
                </div>
              </div>

              <WorkOrderInform title="ประเภทงานบริการ" value={data.serviceType}/>
              <WorkOrderInform title="ช่องทางรับคำร้อง" value={""}/>
              <WorkOrderInform title="วันที่รับคำร้อง" value={data.payment_received_date}/>
              <WorkOrderInform title="ศูนย์งาน/ศูนย์บริการ (Work Center)" value={data.main_work_center}/>
              <WorkOrderInform title="ศูนย์เงินทุน" value={data.cost_center}/>
              <WorkOrderInform title="รหัสโรงงาน โรงงานที่วางแผน หรือศูนย์รวมงาน (Plant)" value={data.plant_code}/>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkOrderInfo;
