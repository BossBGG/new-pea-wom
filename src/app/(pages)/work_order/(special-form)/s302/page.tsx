"use client";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import { useEffect, useState } from "react";
import WorkOrderInfo from "@/app/(pages)/work_order/(special-form)/component/WorkOrderInfo";
import {Customer, Electrical, Options, WorkerObj, WorkOrderObj} from "@/types";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/(special-form)/component/breadcrumb";
import WorkOrderStep from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStep";
import CustomerInfo from "@/app/(pages)/work_order/(special-form)/component/CustomerInfo";
import { useAppSelector } from "@/app/redux/hook";
import WorkOrderStepMobile from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStepMobile";
import WorkerList from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerList";
import MaterialEquipmentChecklistPage from "../component/material_equipment_checklist/material_equipment_checklist";
import {useRouter, useSearchParams} from "next/navigation";
import WorkOrderActionButtons from "../component/WorkOrderActionBunttons";
import BusinessType from "../component/work_execution/business_type";
import {stepsWorkOrder} from "@/app/config/work_order_steps";
import ResponsiblePersonComponent from "../component/material_equipment_checklist/ResponsiblePersonComponent";
import {getWorkOrderDetailById} from "@/app/api/WorkOrderApi";

const ElectricalRepairOrderS302 = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const router = useRouter();
  const [data, setData] = useState<WorkOrderObj>({
    customer_info: {} as Customer,
    electrical: [] as Electrical[],
    workers: [] as WorkerObj[],
  } as WorkOrderObj);
  const screenSize = useAppSelector((state) => state.screen_size);
  const user = useAppSelector((state) => state.user);
  const [currentStep, setCurrentStep] = useState(0);

  // States for mobile satisfaction assessment
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [customerSignature, setCustomerSignature] = useState<string>("");
  const [recordKeeperSignature, setRecordKeeperSignature] = useState<string>("");
  const params = useSearchParams();
  const peaOfficeOptions: Options[] = useAppSelector((state) => state.options.peaOfficeOptions || [])
  const id = params.get("id") as string;
  const workOrderNo = params.get("workOrderNo") as string;
  const isEdit = params.get("isEdit") as string;
  const isView = params.get("isView") as string;

  useEffect(() => {
    setBreadcrumb(
      <WorkOrderBreadcrumb
        title={`${isEdit === 'true' ? "แก้ไข" : "สร้าง" }ใบสั่งงาน ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร`}
        path={"s302"}
      />
    );

    if(isEdit === "true" || isView === "true") {
      getWorkOrderDetailById(id).then(res => {
        if(res.status === 200) {
          let items = res.data.data as WorkOrderObj;
          if(typeof items.requestServiceDetail === "string") {
            items.requestServiceDetail = JSON.parse(items.requestServiceDetail as string)
          }
          setData(items)
        }
      })
    }else {
      let userPeaOffice = peaOfficeOptions.find((office) => office.data?.office === user.selectedPeaOffice)
      let newData: WorkOrderObj = {
        ...data,
        cost_center: userPeaOffice?.data.peaNameFull || '',
        pea_office: userPeaOffice?.data.peaNameFull || '',
        workOrderNo: workOrderNo,
      }
      setData(newData)
    }
  }, [setBreadcrumb]);


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
    router.push("/work_order/s302/workOrderDetailsWaiting");
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
              data={data}
              updateData={setData}
            />

            {/*<BusinessType

            />*/}
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

export default ElectricalRepairOrderS302;
