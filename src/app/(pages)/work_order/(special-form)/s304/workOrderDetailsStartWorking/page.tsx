"use client";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import { useEffect, useState } from "react";
import { Customer, Electrical, WorkerObj, WorkOrderObj } from "@/types";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/(special-form)/component/breadcrumb";
import { useAppSelector } from "@/app/redux/hook";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHistory,
  faPrint,
  faEdit,
  faSave,
  faTimes,
  faChevronDown,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import WorkOrderInfo from "../../component/workorder-details/WorkOrderInfo";
import CustomerAndWorkerInfo from "../../component/workorder-details/CustomerAndWorkerInfo";
import { EndWorkPopup } from "@/components/ui/popup";
import CardCollapse from "../../component/CardCollapse";
import MaterialEquipmentChecklistPage from "../../component/material_equipment_checklist/material_equipment_checklist";
import BusinessType from "../../component/work_execution/business_type";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";

const WorkOrderDetailsStartWorking = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const router = useRouter();
  const screenSize = useAppSelector((state) => state.screen_size);

  const [data] = useState<WorkOrderObj>({} as WorkOrderObj);

  const [showEndWorkPopup, setShowEndWorkPopup] = useState(false);

  useEffect(() => {
    setBreadcrumb(
      <WorkOrderBreadcrumb
        title={"รายละเอียดใบสั่งงาน"}
        path={"work-order-details"}
      />
    );
  }, [setBreadcrumb]);

  const handleSaveResult = () => {
    setShowEndWorkPopup(true);
  };

  const handleEndWorkConfirm = () => {
    setShowEndWorkPopup(false);
    // Navigate ไปที่ Execution page
    router.push("/work_order/s304/Execution");
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    router.push("/work_order/s304");
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

        <Button className="pea-button h-[44px] px-6" onClick={handleSaveResult}>
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
            {/* Mobile Header */}
            {screenSize === "mobile" ? (
              <div className="flex flex-row justify-between items-center w-full">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {data.order_no}
                  </h1>
                  <p className="text-gray-600">รายละเอียดใบสั่งงาน</p>
                </div>

                <Button
                  className="bg-[#E1D2FF] rounded-full justify-center items-center h-[44px] w-[44px] p-0"
                  variant="outline"
                  onClick={handleHistory}
                >
                  <FontAwesomeIcon icon={faHistory} />
                </Button>
              </div>
            ) : (
              /* Desktop Header */
              <>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {data.order_no}
                  </h1>
                  <p className="text-gray-600">รายละเอียดใบสั่งงาน</p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="pea-button h-[44px] px-6"
                        variant="outline"
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2" />
                        สร้าง/อ้างอิง ใบคำร้อง
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className="ml-2"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem></DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    className="bg-[#E1D2FF] rounded-full justify-center items-center h-[44px] w-[44px] p-0"
                    variant="outline"
                    onClick={handleHistory}
                  >
                    <FontAwesomeIcon icon={faHistory} />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Work Order Detail */}
        {/*<WorkOrderInfo data={data} status="อยู่ระหว่างดำเนินงาน" />*/}

        {/* Customer and Worker Info */}
        {/*<CustomerAndWorkerInfo
          customerInfo={data.customer_info}
          workers={data.workers}
          latitude={parseFloat(data.customer_info.customer_latitude || "0")}
          longitude={parseFloat(data.customer_info.customer_longitude || "0")}
        />*/}

        {/*<CardCollapse title={"ข้อมูลคำร้อง"}>
          <BusinessType />
        </CardCollapse>*/}

        {/*<MaterialEquipmentChecklistPage
          options={{
            showCardCollapse: true,
            showAddButton: false,
            showDeleteAllButton: false,
            showActionColumn: false,
            isReadOnly: true,
          }}
        />*/}
      </div>

      {/* Action Buttons */}
      {screenSize === "mobile" ? renderMobileActions() : renderDesktopActions()}

      {/* End Work Popup */}
      <EndWorkPopup
        open={showEndWorkPopup}
        onClose={() => setShowEndWorkPopup(false)}
        onConfirm={handleEndWorkConfirm}
      />
    </div>
  );
};

export default WorkOrderDetailsStartWorking;
