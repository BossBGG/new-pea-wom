"use client";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import { useEffect, useState } from "react";
import WorkOrderInfo from "@/app/(pages)/work_order/(special-form)/component/WorkOrderInfo";
import { Customer, Electrical, WorkerObj, WorkOrderObj } from "@/types";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/(special-form)/component/breadcrumb";
import WorkOrderStep from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStep";
import CustomerInfo from "@/app/(pages)/work_order/(special-form)/component/CustomerInfo";
import { useAppSelector } from "@/app/redux/hook";
import WorkOrderStepMobile from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStepMobile";
import { stepsExecution } from "@/app/config/work_order_steps";
import WorkerList from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerList";
import MaterialEquipmentChecklistPage from "../../component/material_equipment_checklist/material_equipment_checklist";
import WorkExecution from "../../component/work_execution/work_execution";
import AddImages from "../../component/work_execution/add_images";
import AddFile from "../../component/work_execution/add_file";
import Comment from "../../component/work_execution/comment";
import SatisfactionAssessment from "../../component/work_execution/satisfaction_assessment";
import RecordKeeper from "../../component/work_execution/record_keeper";
import { useRouter } from "next/navigation";
import RatingAndComment from "../../component/work_execution/RatingAndComment ";
import SignatureSection from "../../component/work_execution/signature_section";
import CardCollapse from "../../component/CardCollapse";
import WorkOrderActionButtons from "../../component/WorkOrderActionBunttons";
import TypeElectricalList from "@/app/(pages)/work_order/(special-form)/s312/type-electrical-list";
import BusinessType from "../../component/work_execution/business_type";
import ResponsiblePersonComponent from "../../component/material_equipment_checklist/ResponsiblePersonComponent";
import { Button } from "@/components/ui/button";
import { EndWorkPopup } from "@/components/ui/popup";

const ElectricalRepairOrderS318 = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const router = useRouter();
  const [data, setData] = useState<WorkOrderObj>({
    customer_info: {} as Customer,
    electrical: [] as Electrical[],
    workers: [] as WorkerObj[],
  } as WorkOrderObj);
  const screenSize = useAppSelector((state) => state.screen_size);
  const [currentStep, setCurrentStep] = useState(0);

  // States for mobile satisfaction assessment
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [customerSignature, setCustomerSignature] = useState<string>("");
  const [recordKeeperSignature, setRecordKeeperSignature] =
    useState<string>("");
  const [showEndWorkPopup, setShowEndWorkPopup] = useState(false);

  useEffect(() => {
    setBreadcrumb(
      <WorkOrderBreadcrumb
        title={"สร้างใบสั่งงาน ขอซื้อมิเตอร์/อุปกรณ์ไฟฟ้า"}
        path={"s318-execution"}
      />
    );
  }, [setBreadcrumb]);

  const updateElectrical = (value: Electrical[]) => {
    data.electrical = value;
    setData(data);
    console.log("data >>> ", data);
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (currentStep < stepsExecution.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCancel = () => {
    // Logic สำหรับยกเลิกใบสั่งงาน
    router.push("/work_order");
  };

  const handleConfirm = () => {
    // Logic สำหรับยืนยันสร้างใบสั่งงาน
    console.log("Confirm create work order");
  };

  const handleComplete = () => {
    setShowEndWorkPopup(true);
  };

  const handleEndWorkConfirm = () => {
    setShowEndWorkPopup(false);
    // Navigate ไปที่หน้า completed
    router.push("/work_order/s318/workOrderDetailsCompleted");
  };

  const handleSave = () => {
    // Logic สำหรับบันทึก
    console.log("Save work order");
  };

  // Handlers for mobile satisfaction assessment
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newComment = e.target.value;
    // Limit to 50 words for mobile
    const words = newComment.trim().split(/\s+/);
    if (words.length <= 50) {
      setComment(newComment);
    }
  };

  const handleCustomerSignatureChange = (newSignature: string) => {
    setCustomerSignature(newSignature);
  };

  const handleRecordKeeperSignatureChange = (newSignature: string) => {
    setRecordKeeperSignature(newSignature);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <CustomerInfo
              data={data}
              updateData={setData}
            />

            {/*<BusinessType />*/}

            <TypeElectricalList
              data={data.electrical}
              updateData={updateElectrical}
            />
          </div>
        );

      case 1:
        // return <WorkerList data={data.assignees || []} />;

      case 2:
        return (
          <div>
            {/*<ResponsiblePersonComponent />*/}
            <MaterialEquipmentChecklistPage />
          </div>
        );

      case 3:
        return (
          <div>
            <WorkExecution />
            {/*<BusinessType />*/}
            <TypeElectricalList
              data={data.electrical}
              updateData={updateElectrical}
            />
            <AddImages />
            <AddFile />
            <Comment />

            {/* Render different components based on screen size */}
            {screenSize === "mobile" ? (
              <>
                {/* Mobile version - separate components with CardCollapse */}
                <CardCollapse title="ผลการประเมินความพึงพอใจของลูกค้าต่อการปฏิบัติงาน">
                  <div className="p-4">
                    <RatingAndComment
                      rating={rating}
                      comment={comment}
                      onRatingChange={handleRatingChange}
                      onCommentChange={handleCommentChange}
                    />

                    {/* Show word count for mobile (max 50 words) */}
                    <div className="flex justify-end mt-2">
                      <span
                        className={`text-sm ${
                          comment.trim().split(/\s+/).length > 45
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {
                          comment
                            .trim()
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        }
                        /50 คำ
                      </span>
                    </div>
                  </div>
                </CardCollapse>

                <CardCollapse title="ลายเซ็นลูกค้า">
                  <div className="p-4">
                    <SignatureSection
                      title="ภาพลายเซ็นลูกค้า"
                      signature={customerSignature}
                      onSignatureChange={handleCustomerSignatureChange}
                    />
                  </div>
                </CardCollapse>

                <CardCollapse title="ลายเซ็นผู้บันทึกปฏิบัติงาน">
                  <div className="p-4">
                    <SignatureSection
                      title="ภาพลายเซ็นผู้บันทึกปฏิบัติงาน"
                      signature={recordKeeperSignature}
                      onSignatureChange={handleRecordKeeperSignatureChange}
                    />
                  </div>
                </CardCollapse>
              </>
            ) : (
              <>
                {/* Desktop version - keep original components */}
                <SatisfactionAssessment />
                <RecordKeeper />
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const renderActionButtons = () => {
    if (screenSize === "mobile") {
      // Mobile layout
      return (
        <div className="flex flex-col space-y-3 mt-6 px-4">
          {currentStep === 3 ? (
            <>
              <div className="flex space-x-3">
                <Button
                  className="cancel-button h-[44px] flex-1"
                  variant="outline"
                  onClick={handleGoBack}
                >
                  ย้อนกลับ
                </Button>

                <Button
                  className="pea-button h-[44px] flex-1"
                  onClick={handleComplete}
                >
                  จบงาน
                </Button>
              </div>

              <Button
                className="pea-button-outline h-[44px] w-full"
                variant="outline"
                onClick={handleSave}
              >
                บันทึก
              </Button>
            </>
          ) : (
            <>
              <div className="flex space-x-3">
                <Button
                  className="cancel-button h-[44px] flex-1"
                  variant="outline"
                  onClick={handleGoBack}
                >
                  ย้อนกลับ
                </Button>

                <Button
                  className="pea-button h-[44px] flex-1"
                  onClick={handleNext}
                >
                  ถัดไป
                </Button>
              </div>

              <Button
                className="pea-button-outline h-[44px] w-full"
                variant="outline"
                onClick={handleSave}
              >
                บันทึก
              </Button>
            </>
          )}
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
            ย้อนกลับ
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              className="pea-button-outline h-[44px] px-6"
              variant="outline"
              onClick={handleSave}
            >
              บันทึก
            </Button>

            {currentStep === 3 ? (
              <Button
                className="pea-button h-[44px] px-6"
                onClick={handleComplete}
              >
                จบงาน
              </Button>
            ) : (
              <Button className="pea-button h-[44px] px-6" onClick={handleNext}>
                ถัดไป
              </Button>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {/*<WorkOrderInfo data={data} />*/}

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

      {renderCurrentStep()}

      {renderActionButtons()}

      {/* End Work Popup */}
      <EndWorkPopup
        open={showEndWorkPopup}
        onClose={() => setShowEndWorkPopup(false)}
        onConfirm={handleEndWorkConfirm}
      />
    </div>
  );
};

export default ElectricalRepairOrderS318;
