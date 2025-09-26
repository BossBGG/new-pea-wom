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
  faChevronDown,
  faChevronLeft,
  faFileExport,
  faHistory,
  faPlus,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";
import WorkOrderInfo from "../../component/workorder-details/WorkOrderInfo";
import WorkOrderStep from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStep";
import WorkOrderStepMobile from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStepMobile";
import WorkerList from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerList";
import MaterialEquipmentChecklistPage from "../../component/material_equipment_checklist/material_equipment_checklist";
import WorkExecution from "../../component/work_execution/work_execution";
import AddImages from "../../component/work_execution/add_images";
import AddFile from "../../component/work_execution/add_file";
import Comment from "../../component/work_execution/comment";
import SatisfactionAssessment from "../../component/work_execution/satisfaction_assessment";
import RecordKeeper from "../../component/work_execution/record_keeper";
import RatingAndComment from "../../component/work_execution/RatingAndComment ";
import SignatureSection from "../../component/work_execution/signature_section";
import CardCollapse from "../../component/CardCollapse";
import { stepsExecution } from "@/app/config/work_order_steps";
import ResponsiblePersonComponent from "../../component/material_equipment_checklist/ResponsiblePersonComponent";
import CustomerInfo from "../../component/CustomerInfo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BusinessType from "../../component/work_execution/business_type";
import EnergyRequirement from "../EnergyRequirement";
import EnergySource from "../EnergySource";
import SurveyPeriod from "../SurveyPeriod";

const WorkOrderDetailsCompleted = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const router = useRouter();
  const screenSize = useAppSelector((state) => state.screen_size);
  const [currentStep, setCurrentStep] = useState(3);
  const [isMounted, setIsMounted] = useState(false);

  const [data] = useState<WorkOrderObj>({} as WorkOrderObj);

  // States for completed work data
  const [rating] = useState<number>(5);
  const [comment] = useState<string>("เจ้าหน้าที่ทำงานดี ");
  const [customerSignature] = useState<string>("data:image/png;base64,...");
  const [recordKeeperSignature] = useState<string>("data:image/png;base64,...");

  useEffect(() => {
    setIsMounted(true);
    setBreadcrumb(
      <WorkOrderBreadcrumb
        title={"รายละเอียดใบสั่งงานที่เสร็จสิ้น"}
        path={"s329-completed"}
      />
    );
  }, [setBreadcrumb]);

  const handleGoBack = () => {
    if (!isMounted) return;

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleHistory = () => {
    console.log("Show history");
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        // แสดง loading หรือ placeholder จนกว่า component จะ mount เสร็จ
        if (!isMounted) {
          return (
            <div className="min-h-screen bg-white flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">กำลังโหลด...</p>
              </div>
            </div>
          );
        }

        return (
          <div>
            <CustomerInfo data={data} updateData={() => {}} />

            {/*<EnergyRequirement />*/}
            {/*<EnergySource />*/}
            {/*<SurveyPeriod />*/}
          </div>
        );

      case 1:
        return (
          <div>
            {/*<WorkerList
              data={data.assignees || []}
              options={{
                isReadOnly: true,
                showAddButton: false,
                showDeleteAllButton: false,
                showActionColumn: false,
              }}
            />*/}
          </div>
        );

      case 2:
        return (
          <div>
            {/*<ResponsiblePersonComponent
              options={{
                isReadOnly: true,
              }}
            />*/}
            <MaterialEquipmentChecklistPage
              options={{
                showCardCollapse: true,
                showAddButton: false,
                showDeleteAllButton: false,
                showActionColumn: false,
                isReadOnly: true,
              }}
            />
          </div>
        );

      case 3:
        return (
          <div>
            <WorkExecution
              options={{
                isReadOnly: true,
              }}
            />

            {/*<EnergyRequirement />*/}
            {/*<EnergySource />*/}
            {/*<SurveyPeriod />*/}

            <AddImages
              options={{
                isCompleted: true,
                isReadOnly: true,
              }}
            />

            <AddFile
              options={{
                isCompleted: true,
                isReadOnly: true,
                showOnlySave: true,
              }}
            />

            <Comment
              options={{
                isReadOnly: true,
              }}
            />

            {/* Render different components based on screen size */}
            {screenSize === "mobile" ? (
              <>
                {/* Mobile version */}
                <CardCollapse title="ความพึงพอใจต่อการให้บริการ">
                  <div className="p-4">
                    <RatingAndComment
                      rating={rating}
                      comment={comment}
                      onRatingChange={() => {}}
                      onCommentChange={() => {}}
                      //   isReadOnly={true}
                    />
                  </div>
                </CardCollapse>

                <CardCollapse title="ลายเซ็นลูกค้า (ส่งมอบงาน)">
                  <div className="p-4">
                    <SignatureSection
                      title="ภาพลายเซ็นลูกค้า"
                      signature={customerSignature}
                      onSignatureChange={() => {}}
                      //   isReadOnly={true}
                    />
                  </div>
                </CardCollapse>

                <CardCollapse title="ลายเซ็นผู้บันทึกปฏิบัติงาน">
                  <div className="p-4">
                    <SignatureSection
                      title="ภาพลายเซ็นผู้บันทึกปฏิบัติงาน"
                      signature={recordKeeperSignature}
                      onSignatureChange={() => {}}
                      isReadOnly={true}
                    />
                  </div>
                </CardCollapse>
              </>
            ) : (
              <>
                {/* Desktop version */}
                <SatisfactionAssessment
                  options={{
                    isReadOnly: true,
                    initialRating: rating,
                    initialComment: comment,
                  }}
                />
                <RecordKeeper
                  options={{
                    isReadOnly: true,
                    initialCustomerSignature: customerSignature,
                    initialRecordKeeperSignature: recordKeeperSignature,
                  }}
                />
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Custom Action Buttons for Completed Work Order
  const renderActionButtons = () => {
    if (screenSize === "mobile") {
      // Mobile layout
      return (
        <div className="flex flex-col space-y-3 mt-6 px-4">
          <div className="flex space-x-3">
            <Button
              className="cancel-button h-[44px] flex-1"
              variant="outline"
              onClick={handleGoBack}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              ย้อนกลับ
            </Button>

            <Button
              className="pea-button-outline h-[44px] flex-1"
              variant="outline"
              onClick={handlePrint}
            >
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              พิมพ์เอกสาร
            </Button>
          </div>
        </div>
      );
    } else {
      // Desktop layout
      return (
        <div className="flex justify-between items-center mt-6 px-6">
          <Button
            className="cancel-button h-[44px] px-6"
            variant="outline"
            onClick={handleGoBack}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            ย้อนกลับ
          </Button>

          <Button
            className="pea-button-outline h-[44px] px-6"
            variant="outline"
            onClick={handlePrint}
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2" />
            พิมพ์เอกสาร
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {data.order_no}
              </h1>
              <p className="text-gray-600">
                ปิดงานเมื่อ : 20 ธันวาคม 2566, 16:30 น.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="pea-button h-[44px] px-6"
                    variant="outline"
                  >
                    แสดงความสัมพันธ์ใบสั่งงาน
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>ดูใบสั่งงานที่เกี่ยวข้อง</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                className="pea-button-outline h-[44px] px-6"
                variant="outline"
                onClick={handlePrint}
              >
                <FontAwesomeIcon icon={faFileExport} />
                ดาวน์โหลด
              </Button>

              <Button
                className="bg-[#E1D2FF] rounded-full justify-center items-center h-[44px] w-[44px] p-0"
                variant="outline"
                onClick={handleHistory}
              >
                <FontAwesomeIcon icon={faHistory} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="pea-button h-[44px] px-6"
                    variant="outline"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    สร้าง/อ้างอิง ใบคำร้อง
                    <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>สร้างใบคำร้องใหม่</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4">
          <WorkOrderInfo data={data} status="อยู่ระหว่างดำเนินงาน" />
        </div>
        {/* Step Navigation */}
        {screenSize === "desktop" ? (
          <WorkOrderStep
            steps={stepsExecution}
            currentStep={currentStep}
            updateStep={setCurrentStep}
          />
        ) : (
          <WorkOrderStepMobile
            steps={stepsExecution}
            currentStep={currentStep}
            updateStep={setCurrentStep}
          />
        )}

        {/* Content */}
        {renderCurrentStep()}

        {/* Action Buttons */}
        {renderActionButtons()}
      </div>
    </div>
  );
};

export default WorkOrderDetailsCompleted;
