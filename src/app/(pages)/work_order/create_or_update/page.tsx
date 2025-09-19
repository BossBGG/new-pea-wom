"use client";
import {
  Assignee,
  BusinessTypeObj,
  Electrical,
  Insulator,
  MeterEquipment,
  Options,
  RequestServiceItem, ResponsiblePersonObj,
  Transformer,
  User,
  WorkerObj,
  WorkOrderObj
} from "@/types";
import WorkOrderInfo from "@/app/(pages)/work_order/(special-form)/component/WorkOrderInfo";
import {useEffect, useState} from "react";
import WorkOrderStep from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStep";
import {stepsWorkOrder} from "@/app/config/work_order_steps";
import WorkOrderStepMobile from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStepMobile";
import {useAppSelector} from "@/app/redux/hook";
import WorkOrderActionButtons from "@/app/(pages)/work_order/(special-form)/component/WorkOrderActionBunttons";
import {dismissAlert, showError, showProgress, showSuccess} from "@/app/helpers/Alert";
import _ from "lodash";
import {getWorkOrderDetailById, updateWorkOrder} from "@/app/api/WorkOrderApi";
import {useRouter, useSearchParams} from "next/navigation";
import {useBreadcrumb} from "@/app/context/BreadcrumbContext";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/(special-form)/component/breadcrumb";
import CustomerInfo from "@/app/(pages)/work_order/(special-form)/component/CustomerInfo";
import ElectricalList from "@/app/(pages)/work_order/(special-form)/s301/electrical-list";
import ElectricalList315 from "@/app/(pages)/work_order/(special-form)/s315/electrical-list"
import ElectricalList316 from "@/app/(pages)/work_order/(special-form)/s316/electrical-list"
import WorkerList from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerList";
import ResponsiblePersonComponent
  from "@/app/(pages)/work_order/(special-form)/component/material_equipment_checklist/ResponsiblePersonComponent";
import MaterialEquipmentChecklistPage
  from "@/app/(pages)/work_order/(special-form)/component/material_equipment_checklist/material_equipment_checklist";
import BusinessType from "@/app/(pages)/work_order/(special-form)/component/work_execution/business_type";
import RequestServiceTypeSelector from "@/app/(pages)/work_order/(special-form)/s305/RequestServiceTypeSelector";
import TransformerList from "@/app/(pages)/work_order/(special-form)/s305/transformer-list";
import VoltageLevel from "@/app/(pages)/work_order/(special-form)/s307/Voltagelevel";
import TransformerSize from "@/app/(pages)/work_order/(special-form)/s308/TransformerSize";
import TypeElectricalList from "@/app/(pages)/work_order/(special-form)/s312/type-electrical-list";
import InsulationDateSelector from "@/app/(pages)/work_order/(special-form)/s314/InsulationDateSelector";
import InsulatorList from "@/app/(pages)/work_order/(special-form)/s314/insulator-list";
import TransformerDateSelector from "@/app/(pages)/work_order/(special-form)/s315/TransformerDateSelector";
import MeterEquipmentList from "@/app/(pages)/work_order/(special-form)/s318/electrical-list";
import BusinessTypePackage from "@/app/(pages)/work_order/(special-form)/s322/BusinessTypePackage";
import EnergyRequirement from "@/app/(pages)/work_order/(special-form)/s329/EnergyRequirement";
import EnergySource from "@/app/(pages)/work_order/(special-form)/s329/EnergySource";
import SurveyPeriod from "@/app/(pages)/work_order/(special-form)/s329/SurveyPeriod";
import handleSearchEvent from "@/app/helpers/SearchEvent";
import handleSearchMainWorkCenter from "@/app/helpers/SearchMainWorkCenter";
import {handleSearchMaterial} from "@/app/helpers/SearchMaterial";
import handleSearchServiceEquipmentType from "@/app/helpers/SearchServiceEquipmentType";
import {mapRequestServiceOptions, mapEventOptions, mapWorkCenterOptions} from "@/app/(pages)/work_order/create_or_update/mapOptions"
import handleSearchBusinessType from "@/app/helpers/SearchBusinessType";
import getVoltagesOptions from "@/app/helpers/VoltageOptions";
import {format} from "date-fns";

const CreateOrUpdateWorkOrder = () => {
  const {setBreadcrumb} = useBreadcrumb();
  const router = useRouter();
  const [data, setData] = useState<WorkOrderObj>({} as WorkOrderObj);
  const screenSize = useAppSelector((state) => state.screen_size);
  const [currentStep, setCurrentStep] = useState(0);
  const params = useSearchParams();
  const id = params.get("id") as string;
  const workOrderNo = params.get("workOrderNo") as string;
  const isEdit = params.get("isEdit") as string;
  const isView = params.get("isView") as string;
  const requestCode = params.get("requestCode") as string;
  const peaOfficeOptions: Options[] = useAppSelector((state) => state.options.peaOfficeOptions || [])
  const user: User = useAppSelector((state) => state.user)
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [eventOptions, setEventOptions] = useState<Options[]>([]);
  const [mainWorkCenterOptions, setMainWorkCenterOptions] = useState<Options[]>([]);
  const [materialNameOptions, setMaterialNameOptions] = useState<Options[]>([]);
  const [serviceEquipmentOptions, setServiceEquipmentOptions] = useState<Options[]>([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState<Options[]>([]);
  const [voltagesOptions, setVoltagesOptions] = useState<Options[]>([]);

  useEffect(() => {
    Promise.all([
      handleSearchEvent(),
      handleSearchMainWorkCenter(),
      handleSearchMaterial("", "name", "id"),
      handleSearchServiceEquipmentType("", requestCode),
      handleSearchBusinessType(),
      getVoltagesOptions(requestCode)
    ]).then((
      [
        respEventOptions,
        resMainWorkCenter,
        resMaterial,
        resServiceEquipmentOptions,
        resBusinessType,
        resVoltages,
      ]) => {
      setEventOptions(respEventOptions)
      setMainWorkCenterOptions(resMainWorkCenter)
      setMaterialNameOptions(resMaterial)
      setServiceEquipmentOptions(resServiceEquipmentOptions)
      setBusinessTypeOptions(resBusinessType)
      setVoltagesOptions(resVoltages)

      if (isEdit === "true" || isView === "true") {
        getWorkOrderDetailById(id).then(res => {
          if (res.status === 200) {
            let items = res.data.data as WorkOrderObj;
            items.responsible = items.responsible || [{isUpdate: true} as ResponsiblePersonObj]
            items.appointmentDate = items.appointmentDate ? new Date(items.appointmentDate) : new Date()
            if (typeof items.requestServiceDetail === "string") {
              items.requestServiceDetail = JSON.parse(items.requestServiceDetail as string)
              if(typeof items.requestServiceDetail === 'object' && items.requestServiceDetail.items) {
                const reqService = items.requestServiceDetail.items;
                setServiceEquipmentOptions(mapRequestServiceOptions(reqService, resServiceEquipmentOptions, requestCode))
              }
            }

            if(items.assignees?.length > 0) {
              let assignees = items.assignees;
              setEventOptions(mapEventOptions(assignees, respEventOptions))
              setMainWorkCenterOptions(mapWorkCenterOptions(assignees, resMainWorkCenter))
            }
            setData(items)
          }
        })
      } else {
        let userPeaOffice = peaOfficeOptions.find((office) => office.data?.office === user.selectedPeaOffice)
        let newData: WorkOrderObj = {
          ...data,
          cost_center: userPeaOffice?.data.peaNameFull || '',
          pea_office: userPeaOffice?.data.peaNameFull || '',
          workOrderNo: workOrderNo,
          responsible: [{isUpdate: true} as ResponsiblePersonObj],
          appointmentDate: new Date()
        }
        setData(newData)
      }
    })

    setBreadcrumb(
      <WorkOrderBreadcrumb
        title={`${isEdit === 'true' ? "แก้ไข" : "สร้าง"}ใบสั่งงาน ขอซ่อมแซมอุปกรณ์ไฟฟ้า`}
        path={"s301"}
      />
    );
  }, [setBreadcrumb]);

  useEffect(() => {
    if (screenSize !== 'desktop') {
      let newData = data;
      if(newData && typeof newData.requestServiceDetail === 'object') {
        newData.requestServiceDetail.items = newData.requestServiceDetail.items.map((item) => {
          return { ...item, isUpdate: false }
        })

        setData(newData)
      }

      if(newData.assignees?.length > 0) {
        newData.assignees = newData.assignees.map((item) => {
          return { ...item, isUpdate: false }
        })

        setData(newData)
      }
    }
  }, [screenSize]);

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

  const handleSave = async () => {
    showProgress()
    let item = _.cloneDeep(data) as any
    let itemDel: string[] = [
      "customer_info", "electrical", "workers",
      "cost_center", "pea_office", "workOrderNo",
      "id", "mainWorkCenterId", "workOrderCreateDate",
      "createdAt", "createdBy", "updatedAt",
      "updatedBy",
      "assignees", //remove later when api available
      "responsible", //remove later when api available
      "participants"
    ]
    itemDel.map((key: string) => { delete item[key] })

    item.requestServiceDetail = JSON.stringify(item.requestServiceDetail)
    item.customerLatitude = item.customerLatitude ? parseFloat(item.customerLatitude) : 0
    item.customerLongitude = item.customerLongitude ? parseFloat(item.customerLongitude) : 0
    item.appointmentDate = format(item.appointmentDate, "yyyy-MM-dd HH:mm:ss")

    const res = await updateWorkOrder(id, item);
    if (res.status === 200) {
      showSuccess().then(res => {
        router.push('/work_order')
      })
    } else {
      showError(res.data.message || '')
    }
  };

  useEffect(() => {
    console.log('data >>> ', data)
  }, [data]);

  const updateElectrical = (value: RequestServiceItem[]) => {
    console.log('updateElectrical >>> ', value)
    data.requestServiceDetail = {
      items: value
    }
    setData(data);
  };

  const updateElectrical315 = (value: Electrical[]) => {
    data.electrical = value;
    setData(data);
  };

  const updateMeterEquipment = (value: MeterEquipment[]) => {
    data.meterequipment = value;
    setData(data);
  };

  const updateTransformers = (value: Transformer[]) => {
    data.transformer = value;
    setData(data);
  };

  const updateInsulators = (value: Insulator[]) => {
    data.insulators = value;
    setData(data);
  };

  const updateBusinessType = (item: BusinessTypeObj) => {
    setData(prevState => ({
      ...prevState,
      businessTypeId: item.id,
      businessTypeName: item.name
    }))
  }

  const updateResponsible = (dataResponsible: ResponsiblePersonObj[]) => {
    setData(prevState => ({
      ...prevState,
      responsible: dataResponsible
    }))
  }

  const updateAssignee = (assignees: Assignee[]) => {
    setData(prevState => ({
      ...prevState,
      assignees: assignees
    }))
  }

  const updateAppointment = (date: Date | undefined) => {
    setData(prevState => ({
      ...prevState,
      appointmentDate: date
    }))
  }

  const renderBusinessType = () => {
    return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md ">
        <BusinessType onChange={updateBusinessType}
                      value={data.businessTypeId}
                      onUpdateOptions={setBusinessTypeOptions}
                      businessOptions={businessTypeOptions}
        />
      </div>
    )
  }

  const renderElectrical = () => {
    return (
      <ElectricalList
        data={
          data.requestServiceDetail ?
            typeof data.requestServiceDetail === 'string'
              ? JSON.parse(data.requestServiceDetail)
              : data.requestServiceDetail?.items
            : []
        }
        updateData={updateElectrical}
        serviceEquipmentOptions={serviceEquipmentOptions}
        onUpdateOptions={setServiceEquipmentOptions}
        requestCode={requestCode}
      />
    )
  }

  const renderByService = () => {
    switch (requestCode) {
      case 's301':
        return renderElectrical()
      case 's302':
      case 's303':
      case 's304':
      case 's306':
      case 's309':
      case 's310':
      case 's311':
      case 's317':
      case 's319':
      case 's320':
      case 's323':
      case 's399':
        return renderBusinessType()
      case 's305':
        return (
          <div>
            <RequestServiceTypeSelector/>

            <TransformerList
              data={data.transformer}
              updateData={updateTransformers}
            />
          </div>
        )
      case 's307':
        return <VoltageLevel businessTypeOptions={businessTypeOptions}
                             voltagesOptions={voltagesOptions}
                             onUpdateBusinessTypeOptions={setBusinessTypeOptions}
                             data={ typeof data.requestServiceDetail === 'string'
                               ? JSON.parse(data.requestServiceDetail)
                               : data.requestServiceDetail }
                             onUpdateData={(d) => {
                               setData(prevState => ({
                                 ...prevState,
                                 requestServiceDetail: d
                               }))
                             }}
        />
      case '308':
        return (
          <div>
            <TransformerSize/>

            <TransformerList
              data={data.transformer}
              updateData={updateTransformers}
            />
          </div>
        )
      case 's312':
        return (
          <div>
            {renderBusinessType()}

            {renderElectrical()}
          </div>
          )
      case 's314':
        return (
          <div>
            <InsulationDateSelector />

            <InsulatorList
              data={data.insulators}
              updateData={updateInsulators}
            />
          </div>
        )
      case 's315':
        return (
          <div>
            {renderBusinessType()}

            <TransformerDateSelector/>

            <ElectricalList315
              data={data.electrical}
              updateData={updateElectrical315}
            />
          </div>
        )
      case 's316':
        return (
          <div>
            <TransformerDateSelector/>

            <ElectricalList316
              data={data.electrical}
              updateData={updateElectrical315}
            />
          </div>
        )
      case 's318':
        return (
          <div>
            {renderBusinessType()}

            <MeterEquipmentList
              data={data.meterequipment}
              updateData={updateMeterEquipment}
            />
          </div>
        )
      case 's322':
        return (
          <div>
            <BusinessTypePackage
              currentStep={currentStep}
              value={selectedPackage}
              onChange={(value) => setSelectedPackage(value)}
            />
          </div>
        )
      case '329':
        return (
          <div>
            <EnergyRequirement/>
            <EnergySource />
            <SurveyPeriod />
          </div>
        )
      default:
        return null
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <CustomerInfo
              data={data}
              updateData={setData}
            />

            {renderByService()}
          </div>
        );

      case 1:
        return <WorkerList data={data.assignees || []}
                           updateData={updateAssignee}
                           updateAppointment={updateAppointment}
                           eventOptions={eventOptions}
                           workCenterOptions={mainWorkCenterOptions}
                           setEventOptions={setEventOptions}
                           setMainWorkCenterOptions={setMainWorkCenterOptions}
                           appointment_date={data.appointmentDate as Date}
        />;

      case 2:
        return (
          <div>
            <ResponsiblePersonComponent assignees={data.assignees || []}
                                        onUpdateData={updateResponsible}
                                        data={data.responsible || []}
            />
            <MaterialEquipmentChecklistPage/>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <WorkOrderInfo data={data}/>

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
  )
}

export default CreateOrUpdateWorkOrder;
