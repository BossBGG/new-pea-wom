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
import WorkerList from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerList";
import MaterialEquipmentChecklistPage from "../component/material_equipment_checklist/material_equipment_checklist";
import WorkExecution from "../component/work_execution/work_execution";
import AddImages from "../component/work_execution/add_images";
import AddFile from "../component/work_execution/add_file";
import Comment from "../component/work_execution/comment";
import SatisfactionAssessment from "../component/work_execution/satisfaction_assessment";
import RecordKeeper from "../component/work_execution/record_keeper";
import { useRouter } from "next/navigation";


import RatingAndComment from "../component/work_execution/RatingAndComment ";
import SignatureSection from "../component/work_execution/signature_section";
import CardCollapse from "../component/CardCollapse";
import WorkOrderActionButtons from "../component/WorkOrderActionBunttons";
import BusinessType from "../component/work_execution/business_type";
import {stepsWorkOrder} from "@/app/config/work_order_steps";

const ElectricalRepairOrderS304 = () => {
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
  const [recordKeeperSignature, setRecordKeeperSignature] = useState<string>("");

  useEffect(() => {
    setBreadcrumb(
      <WorkOrderBreadcrumb
        title={"สร้างใบสั่งงาน ขอตรวจสอบและบำรุงรักษารีเลย์"}
        path={"s304"}
      />
    );
  }, [setBreadcrumb]);

  const updateCustomerInfo = (value: Customer) => {
    data.customer_info = value;
    setData(data);
  };

  const handleGoBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleNext = () => {
    if (currentStep < stepsWorkOrder.length - 1) {
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
    // Logic สำหรับจบงาน
    console.log("Complete work order");
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
              data={data.customer_info}
              updateData={updateCustomerInfo}
            />

            <BusinessType/>
          </div>
        );

      case 1:
        return <WorkerList data={data.workers} />;

      case 2:
        return <MaterialEquipmentChecklistPage />;

      default:
        return null;
    }
  };

  return (
    <div>
      <WorkOrderInfo data={data} />

      {screenSize === "desktop" ? (
        <WorkOrderStep
          steps={stepsWorkOrder}
          currentStep={currentStep}
          updateStep={setCurrentStep}
        />
      ) : (
        <WorkOrderStepMobile
          steps={stepsWorkOrder}
          currentStep={currentStep}
          updateStep={setCurrentStep}
        />
      )}

      {renderCurrentStep()}


      <WorkOrderActionButtons
        currentStep={currentStep}
        totalSteps={stepsWorkOrder.length}
        onGoBack={handleGoBack}
        onNext={handleNext}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onComplete={handleComplete}
        onSave={handleSave}
      />
    </div>
  );
};

export default ElectricalRepairOrderS304;
