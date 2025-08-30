// (pages)/work_order/(special-form)/s301/page.tsx
"use client";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import { useEffect, useState } from "react";
import WorkOrderInfo from "@/app/(pages)/work_order/(special-form)/component/WorkOrderInfo";
import { Customer, Electrical, WorkerObj, WorkOrderObj } from "@/types";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/(special-form)/component/breadcrumb";
import WorkOrderStep from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStep";
import CustomerInfo from "@/app/(pages)/work_order/(special-form)/component/CustomerInfo";
import ElectricalList from "@/app/(pages)/work_order/(special-form)/s301/electrical-list";
import { useAppSelector } from "@/app/redux/hook";
import WorkOrderStepMobile from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStepMobile";
import WorkerList from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerList";
import MaterialEquipmentChecklistPage from "../component/material_equipment_checklist/material_equipment_checklist";
import { useRouter } from "next/navigation";
import WorkOrderActionButtons from "../component/WorkOrderActionBunttons";
import {stepsWorkOrder} from "@/app/config/work_order_steps";
import ResponsiblePersonComponent from "../component/material_equipment_checklist/ResponsiblePersonComponent";

const ElectricalRepairOrderS301 = () => {
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
        title={"สร้างใบสั่งงาน ขอซ่อมแซมอุปกรณ์ไฟฟ้า"}
        path={"s301"}
      />
    );
  }, [setBreadcrumb]);

  const updateCustomerInfo = (value: Customer) => {
    data.customer_info = value;
    setData(data);
  };

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
    if (currentStep < stepsWorkOrder.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCancel = () => {
    // Logic สำหรับยกเลิกใบสั่งงาน
    router.push("/work_order");
  };

  const handleConfirm = () => {
    // Logic สำหรับยืนยันสร้างใบสั่งงาน - Navigate to waiting page
    console.log("Confirm create work order");
    router.push("/work_order/s301/workOrderDetailsWaiting");
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

            <ElectricalList
              data={data.electrical}
              updateData={updateElectrical}
            />
          </div>
        );

      case 1:
        return <WorkerList data={data.workers} />;

      case 2:
        return (
          <div>
            <ResponsiblePersonComponent />
            <MaterialEquipmentChecklistPage />
          </div>
        );

      

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

      {/* แทนที่ {renderActionButtons()} ด้วย WorkOrderActionButtons */}
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

export default ElectricalRepairOrderS301;