"use client";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import { useEffect, useState } from "react";
import { Customer, Electrical, WorkerObj, WorkOrderObj } from "@/types";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/(special-form)/component/breadcrumb";
import { useAppSelector } from "@/app/redux/hook";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faPrint, faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import WorkOrderDetail from "../../component/workorder-details/WorkOrderDetail";
import CustomerAndWorkerInfo from "../../component/workorder-details/CustomerAndWorkerInfo";

import CardCollapse from "../../component/CardCollapse";
import ElectricalList from "../electrical-list";
import MaterialEquipmentChecklistPage from "../../component/material_equipment_checklist/material_equipment_checklist";

const WorkOrderDetailsStartWorking = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const router = useRouter();
  const screenSize = useAppSelector((state) => state.screen_size);
  
  // Mock data - ในระบบจริงจะได้จาก API หรือ state management
  const [data] = useState<WorkOrderObj>({
    order_no: "IIOMN2305670",
    request_no: "123456789",
    request_sap_no: "123456789",
    request_type: "ขอซ่อมแซมอุปกรณ์ไฟฟ้า",
    request_status: "อนุมัติแล้ว",
    job_priority: "1",
    payment_received_date: "14 ธันวาคม 2566",
    work_description: "Lorem ipsum mattis rutrum euismod pharetra.",
    division: "กอง",
    plant_code: "XXX-000",
    operation_center: "พนักงาน PEA",
    cost_center: "งานบริการ Y3",
    customer_info: {
      name: "นายสมชาย จิตใสงาม",
      tel: "098-3459086",
      address: "โดยใจต้องตรวจโดยเฉพาะ นฉ.เมืองเพชรบูรณ์ จ.เพชรบูรณ์ 76000",
      bp: "-",
      ca: "-",
      latitude: "12.988092",
      longitude: "100.008234",
      email: "sujinda_yuda@email.co.th"
    } as Customer,
    electrical: [] as Electrical[],
    workers: [] as WorkerObj[],
  } as WorkOrderObj);

  useEffect(() => {
    setBreadcrumb(
      <WorkOrderBreadcrumb
        title={"รายละเอียดใบสั่งงาน"}
        path={"work-order-details"}
      />
    );
  }, [setBreadcrumb]);

  const handleSaveResult = () => {
    console.log("Save work result");
    // Logic สำหรับบันทึกผลงาน
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    router.push("/work_order/s301");
  };

  const handleHistory = () => {
    console.log("Show history");
  };

  const handleCreateReference = () => {
    console.log("Create reference");
  };

  // Desktop Action Buttons
  const renderDesktopActions = () => (
    <div className="flex justify-between items-center mt-6 px-6">
      <Button
        className="cancel-button h-[44px] px-6"
        variant="outline"
        onClick={handleCancel}
      >
    
        ยกเลิก
      </Button>

      <div className="flex items-center space-x-3">
        <Button
          className="pea-button-outline h-[44px] px-6"
          variant="outline"
          onClick={handlePrint}
        >
          <FontAwesomeIcon icon={faPrint} className="mr-2" />
          พิมพ์เอกสาร
        </Button>

        <Button
          className="pea-button-outline h-[44px] px-6"
          variant="outline"
          onClick={handleEdit}
        >
    
          แก้ไข
        </Button>

        <Button
          className="pea-button h-[44px] px-6"
          onClick={handleSaveResult}
        >
          
          บันทึกผล
        </Button>
      </div>
    </div>
  );

  // Mobile Action Buttons
  const renderMobileActions = () => (
    <div className="flex flex-col space-y-3 mt-6 px-4">
      <div className="flex space-x-3">
        <Button
          className="cancel-button h-[44px] flex-1"
          variant="outline"
          onClick={handleCancel}
        >
          ยกเลิก
        </Button>

        <Button
          className="pea-button h-[44px] flex-1"
          onClick={handleSaveResult}
        >
          บันทึกผล
        </Button>
      </div>

      <div className="flex space-x-3">
        <Button
          className="pea-button-outline h-[44px] flex-1"
          variant="outline"
          onClick={handlePrint}
        >
          พิมพ์เอกสาร
        </Button>

        <Button
          className="pea-button-outline h-[44px] flex-1"
          variant="outline"
          onClick={handleEdit}
        >
          แก้ไข
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {data.order_no}
              </h1>
              <p className="text-gray-600">รายละเอียดใบสั่งงาน</p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button
                className="${commonButtonClass} pea-button-outline h-[44px] px-6"
                variant="outline"
                onClick={handleCreateReference}
              >
                สร้าง/อ้างอิง ใบคำร้อง
              </Button>
              
              <Button
                className="pea-button-outline h-[44px] px-6"
                variant="outline"
                onClick={handleHistory}
              >
                <FontAwesomeIcon icon={faHistory} className="mr-2" />
                History
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Work Order Detail */}
        <WorkOrderDetail 
          data={data} 
          status="อยู่ระหว่างดำเนินงาน"
        />

        {/* Customer and Worker Info */}
        <CustomerAndWorkerInfo 
          customerInfo={data.customer_info}
          workers={data.workers}
          latitude={parseFloat(data.customer_info.latitude || "0")}
          longitude={parseFloat(data.customer_info.longitude || "0")}
        />

        <CardCollapse title={"ข้อมูลคำร้อง"}>
          <ElectricalList
              data={data.electrical}
              updateData={updateElectrical}
            />
        </CardCollapse>

        <MaterialEquipmentChecklistPage />
      </div>

      {/* Action Buttons */}
      {screenSize === "mobile" ? renderMobileActions() : renderDesktopActions()}
    </div>
  );
};

export default WorkOrderDetailsStartWorking;