"use client";
import {
  Assignee,
  BusinessTypeObj,
  Electrical,
  Insulator,
  MaterialEquipmentObj,
  MeterEquipment,
  Options, RequestServiceDetail,
  RequestServiceItem, ResolvedData, StepWorkOrderObj,
  Transformer,
  User,
  WorkOrderObj
} from "@/types";
import WorkOrderInfo from "@/app/(pages)/work_order/(special-form)/component/WorkOrderInfo";
import {useEffect, useState} from "react";
import WorkOrderStep from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStep";
import {stepsWorkOrder} from "@/app/config/work_order_steps";
import WorkOrderStepMobile from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStepMobile";
import {useAppSelector} from "@/app/redux/hook";
import WorkOrderActionButtons from "@/app/(pages)/work_order/(special-form)/component/WorkOrderActionBunttons";
import {
  dismissAlert,
  showError,
  showProgress,
  showSuccess,
} from "@/app/helpers/Alert";
import _ from "lodash";
import {
  getWorkOrderDetailById,
  updateWorkOrder, updateWorkOrderStatus,
} from "@/app/api/WorkOrderApi";
import {useRouter, useSearchParams} from "next/navigation";
import {useBreadcrumb} from "@/app/context/BreadcrumbContext";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/(special-form)/component/breadcrumb";
import CustomerInfo from "@/app/(pages)/work_order/(special-form)/component/CustomerInfo";
import ElectricalList from "@/app/(pages)/work_order/(special-form)/s301/electrical-list";
import TransFormerList315 from "@/app/(pages)/work_order/(special-form)/s315/electrical-list";
import ElectricGenerator from "@/app/(pages)/work_order/(special-form)/s316/electric-generator";
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
import {
  mapRequestServiceOptions,
  mapEventOptions,
  mapWorkCenterOptions,
  mapTransformerBrandOptions,
  mapTransformerPhaseOptions,
  mapTransformerTypeOptions,
  mapTransformerSizeOptions, mapTransformerVoltageOptions,
} from "@/app/(pages)/work_order/create_or_update/mapOptions";
import handleSearchBusinessType from "@/app/helpers/SearchBusinessType";
import {format} from "date-fns";
import {handleSearchRenewableSource, handleSearchRenewableType} from "@/app/helpers/SearchRenewable";
import {getWorkerListOptions} from "@/app/helpers/WorkerOptions";
import {
  handleSearchTransformerBrands,
  handleSearchTransformerPhase, handleSearchTransformerSize, handleSearchTransformerType,
  handleSearchTransformerVoltage
} from "@/app/helpers/SearchTransformer.";
import InverterComponent from "@/app/(pages)/work_order/(special-form)/s332-solar-battery/Inverter";
import AddImagesSolarBattery from "@/app/(pages)/work_order/(special-form)/s332-solar-battery/AddImagesSolarBattery ";
import AddImagesSolarAirCondition
  from "@/app/(pages)/work_order/(special-form)/s332-solar-air-conditioner/AddImagesSolarBattery ";
import DistanceComponent from "@/app/(pages)/work_order/(special-form)/s332-solar-air-conditioner/Distance";
import {handleSearchRequestService} from "@/app/helpers/SearchRequestService";
import {handleSearchServiceType} from "@/app/helpers/SearchServiceType";
import {renderWorkOrderBreadcrumbTitle} from "@/app/(pages)/work_order/breadcrumb-title";
import {faFile} from "@fortawesome/free-solid-svg-icons";
import {ExecuteWorkOrder} from "@/app/(pages)/work_order/execute/ExecuteWorkOrder";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import { getMeterEquipmentOptions } from "@/app/api/MaterialEquipmentApi";

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
  const isExecute = params.get("isExecute") as string;
  const requestCode = params.get("requestCode") as string;
  const peaOfficeOptions: Options[] = useAppSelector(
    (state) => state.options.peaOfficeOptions || []
  );
  const user: User = useAppSelector((state) => state.user);
  const customerRequest = useAppSelector((state) => state.customer_request_data)
  const [eventOptions, setEventOptions] = useState<Options[]>([]);
  const [mainWorkCenterOptions, setMainWorkCenterOptions] = useState<Options[]>(
    []
  );
  const [serviceEquipmentOptions, setServiceEquipmentOptions] = useState<
    Options[]
  >([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState<Options[]>([]);
  const [voltagesOptions, setVoltagesOptions] = useState<Options[]>([]);
  const [renewableSourceOptions, setRenewableSourceOptions] = useState<Options[]>([]);
  const [renewableTypeOptions, setRenewableTypeOptions] = useState<Options[]>([]);
  const [workerOptions, setWorkerOptions] = useState<Options[]>([]);
  const [transformerBrandOptions, setTransformerBrandOptions] = useState<Options[]>([]);
  const [transformerPhaseOptions, setTransformerPhaseOptions] = useState<Options[]>([]);
  const [transformerTypeOptions, setTransformerTypeOptions] = useState<Options[]>([]);
  const [transformerSizeOptions, setTransformerSizeOptions] = useState<Options[]>([]);
  const [requestServiceOptions, setRequestServiceOptions] = useState<Options[]>([]);
  const [serviceTypesOptions, setServiceTypesOptions] = useState<Options[]>([]);
  const [materialEquipments, setMaterialEquipments] = useState<
    MaterialEquipmentObj[]
  >([]);
  const [workOrderStep, setWorkOrderStep] = useState<Array<StepWorkOrderObj>>(stepsWorkOrder);
  const [meterEquipmentOptions, setMeterEquipmentOptions] = useState<Options[]>([]);

  console.log('customerRequest >>>> ', customerRequest);
  useEffect(() => {
    showProgress()
    setBreadcrumb(
      <WorkOrderBreadcrumb
        title={`${
          isEdit === "true" ? "แก้ไข" : "สร้าง"
        }ใบสั่งงาน ${renderWorkOrderBreadcrumbTitle(requestCode)}`}
        path={requestCode}
      />
    );

    const requests: { [K in keyof ResolvedData]?: Promise<Options[]> } = {
      respEventOptions: handleSearchEvent(),
      resMainWorkCenter: handleSearchMainWorkCenter(),
      resWorkerOptions: getWorkerListOptions()
    }

    if (['s301', 's312'].includes(requestCode)) {
      requests.resServiceEquipmentOptions = handleSearchServiceEquipmentType("", requestCode)
    }

    if (requestCode === 's318') {
    requests.resMeterEquipmentOptions = getMeterEquipmentOptions("", requestCode).then(response => {
      if (response.status === 200 && response.data.data) {
        return response.data.data.map(equipment => ({
          label: equipment.option_title,
          value: equipment.id,
          data: equipment
        }));
      }
      return [];
    });
    }

    if (["s312", "s315", "s318", "s302", "s303", "s304", "s306", "s307",
      "s309", "s310", "s311", "s317", "s319", "s320", "s322", "s323", "s399"].includes(requestCode)) {
      requests.resBusinessType = handleSearchBusinessType()
    }

    if (['s307', 's305', 's308'].includes(requestCode)) {
      requests.resVoltages = handleSearchTransformerVoltage("", requestCode)
    }

    if (requestCode === 's329') {
      requests.resRenewableSource = handleSearchRenewableSource("", requestCode);
      requests.resRenewableType = handleSearchRenewableType("", requestCode);
    }

    if (['s305', 's308'].includes(requestCode)) {
      requests.resTransformerBrands = handleSearchTransformerBrands("", requestCode);
      requests.resTransformerPhase = handleSearchTransformerPhase("", requestCode);
      requests.resTransformerType = handleSearchTransformerType("", requestCode);
      requests.resTransformerSize = handleSearchTransformerSize("", requestCode);
    }

    if (requestCode === 's305') {
      requests.resReqService = handleSearchRequestService("", requestCode);
      requests.resServiceTypes = handleSearchServiceType("", requestCode);
    }

    const promiseKeys = Object.keys(requests) as Array<keyof ResolvedData>;
    const promiseValues = Object.values(requests);

    Promise.all(promiseValues)
      .then(results => {
        const resolvedData = promiseKeys.reduce((acc, key, index) => {
          acc[key] = results[index];
          return acc;
        }, {} as ResolvedData);

        const {
          respEventOptions, resMainWorkCenter, resServiceEquipmentOptions,
          resBusinessType, resVoltages, resRenewableSource,
          resRenewableType, resWorkerOptions, resTransformerBrands,
          resTransformerPhase, resTransformerType, resTransformerSize,
          resReqService, resServiceTypes, resMeterEquipmentOptions
        } = resolvedData;

        setEventOptions(respEventOptions || [])
        setMainWorkCenterOptions(resMainWorkCenter || [])
        setServiceEquipmentOptions(resServiceEquipmentOptions || [])
        setBusinessTypeOptions(resBusinessType || [])
        setVoltagesOptions(resVoltages || [])
        setRenewableSourceOptions(resRenewableSource || [])
        setRenewableTypeOptions(resRenewableType || [])
        setWorkerOptions(resWorkerOptions || [])
        setTransformerBrandOptions(resTransformerBrands || [])
        setTransformerPhaseOptions(resTransformerPhase || [])
        setTransformerTypeOptions(resTransformerType || [])
        setTransformerSizeOptions(resTransformerSize || [])
        setRequestServiceOptions(resReqService || [])
        setServiceTypesOptions(resServiceTypes || [])
        setMeterEquipmentOptions(resMeterEquipmentOptions || [])

        if (Boolean(isEdit) || Boolean(isView) || Boolean(isExecute)) {
          getWorkOrderDetailById(id).then(async (res) => {
            if (res.status === 200) {
              let items = res.data.data as WorkOrderObj;
              if ((items.workOrderStatusCode === 'O' || Boolean(isExecute)) && !Boolean(isEdit)) {
                //กำลังปฏิบัติงานหรือกำลังบันทึกผล
                let steps: StepWorkOrderObj[] = stepsWorkOrder
                steps.push({ name: "ผลปฏิบัติงาน", icon: faFile })
                setWorkOrderStep(steps)
              }
              if (items.materialEquipments) {
                setMaterialEquipments(items.materialEquipments);
              }
              items.appointmentDate = items.appointmentDate ? new Date(items.appointmentDate) : new Date()
              if (typeof items.requestServiceDetail === "string") {
                items.requestServiceDetail = JSON.parse(items.requestServiceDetail as string)
                if(typeof items.requestServiceDetail === 'object') {
                  if(items.requestServiceDetail.items) {
                    if(['s301', 's312'].indexOf(requestCode) > -1) {
                      const reqService = items.requestServiceDetail.items as RequestServiceItem[];
                      const newServiceEqOptions = await mapRequestServiceOptions(reqService, resServiceEquipmentOptions || [], requestCode)
                      setServiceEquipmentOptions(newServiceEqOptions)
                    }
                  }
                }
              }

              if(items.assignees?.length > 0) {
                let assignees = items.assignees;
                const newEventOpts = await mapEventOptions(assignees, respEventOptions || [])
                setEventOptions(newEventOpts)
                const newWorkCenterOptions = await mapWorkCenterOptions(assignees, resMainWorkCenter || [])
                setMainWorkCenterOptions(newWorkCenterOptions)
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
            appointmentDate: new Date(),
            requestServiceDetail: {} as RequestServiceDetail,
            materialEquipments: [],
            // request_no: customerRequest?.customerRequestNo || "",
            // request_status: customerRequest?.status || "",
            // customerName: customerRequest?.customerName || "",
            // customerMobileNo: customerRequest?.customerMobileNo || "",
            // customerAddress: customerRequest?.customerAddress || "",
          }
          setData(newData)
          setMaterialEquipments([]);
        }

      }).catch(error => {
      console.error("An error occurred while fetching data:", error);
    }).finally(() => {
      dismissAlert()
    })
  }, [setBreadcrumb]);

  useEffect(() => {
    if (screenSize !== "desktop") {
      let newData = data;
      if (newData && typeof newData.requestServiceDetail === "object") {
        newData.requestServiceDetail.items =
          newData.requestServiceDetail.items?.map((item) => {
            return {...item, isUpdate: false};
          }) as RequestServiceItem[] | Transformer[];

        setData(newData);
      }

      if (newData.assignees?.length > 0) {
        newData.assignees = newData.assignees.map((item) => {
          return {...item, isUpdate: false};
        });

        setData(newData);
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
    if (currentStep < workOrderStep.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleCancel = () => {
    // Logic สำหรับยกเลิกใบสั่งงาน
    router.push("/work_order");
  };

  const handleConfirm = () => {
    handleSave("M")
    // router.push("/work_order/s301/workOrderDetailsWaiting");
  }

  const handleComplete = () => {
    // Logic สำหรับจบงาน
    console.log("Complete work order");
  };

  const handleSave = async (status: string | null = null) => {
    showProgress();
    let item = _.cloneDeep(data) as any;
    let itemDel: string[] = [
      "customer_info",
      "electrical",
      "workers",
      "cost_center",
      "pea_office",
      "workOrderNo",
      "id",
      "mainWorkCenterId",
      "workOrderCreateDate",
      "createdAt",
      "createdBy",
      "updatedAt",
      "updatedBy",
      // "assignees", //remove later when api available
      "responsible", //remove later when api available
      "participants",
      "serviceName",
      "costCenter",
      "peaNameFull",
      "plantCode",
      "materialEquipments",
      "packageId",
      "requestCode"
    ]
    itemDel.map((key: string) => {
      delete item[key]
    })

    if (item.requestServiceDetail?.start_date) {
      item.requestServiceDetail.start_date = format(item.requestServiceDetail.start_date, "yyyy-MM-dd HH:mm:ss")
    }

    if (item.requestServiceDetail?.end_date) {
      item.requestServiceDetail.end_date = format(item.requestServiceDetail.end_date, "yyyy-MM-dd HH:mm:ss")
    }

    item.requestServiceDetail = JSON.stringify(item.requestServiceDetail)
    item.customerLatitude = item.customerLatitude ? parseFloat(item.customerLatitude) : 0
    item.customerLongitude = item.customerLongitude ? parseFloat(item.customerLongitude) : 0
    item.appointmentDate = format(item.appointmentDate, "yyyy-MM-dd HH:mm:ss")

    if (data.materialEquipments && data.materialEquipments.length > 0) {
      item.equipments  = data.materialEquipments.map((material) => ({
        code: material.code,
        name: material.name,
        quantity: Number(material.quantity),
        unit: material.unit,
        price: Number(material.price) || 0,
      }));
    }

    let assignees: Assignee[] = []
    item.assignees?.map((assignee: Assignee) => {
      const assigneeKeyDel: (keyof Assignee)[] = ['isUpdate', 'index', 'id', 'workOrderId', 'sequenceNo', 'isRead']
      assigneeKeyDel.map((key) => {
        delete assignee[key]
      })

      assignee = {
        ...assignee,
        workCenterId: assignee.workCenterId.toString(),
        workActivityTypeId: assignee.workActivityTypeId.toString(),
      }

      assignees.push(assignee)
    })

    item.assignees = assignees

    const res = await updateWorkOrder(id, item);
    if (res.status === 200) {
      if(status && status === "M") {
        await updateWorkOrderStatus(id, status)
      }

      showSuccess().then(async (res) => {
        if(status && status === "M") {
          router.push(`/work_order/${id}`);
        }else {
          router.push('/work_order')
        }
      })
    } else {
      showError(res.data.message || '')
    }
  };

  useEffect(() => {
    console.log("data >>> ", data);
  }, [data]);

  const updateElectrical315 = (value: Electrical[]) => {
    data.electrical = value;
    setData(data);
  };

  const updateMaterialEquipments = (materials: MaterialEquipmentObj[]) => {
    setMaterialEquipments(materials);
    setData(prevState => ({
      ...prevState,
      materialEquipments: materials
    }));
  };

  const updateMeterEquipment = (value: MeterEquipment[]) => {
    data.meterequipment = value;
    setData(data);
  };

  /* const updateTransformers = (value: Transformer[]) => {
     data.transformer = value;
     setData(data);
   };*/

  const updateInsulators = (value: Insulator[]) => {
    data.insulators = value;
    setData(data);
  };

  const updateBusinessType = (item: BusinessTypeObj) => {
    setData((prevState) => ({
      ...prevState,
      businessTypeId: item.id,
      businessTypeName: item.name,
    }));
  };

  const updateAppointment = (date: Date | undefined) => {
    setData((prevState) => ({
      ...prevState,
      appointmentDate: date,
    }));
  };

  const renderBusinessType = () => {
    return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md ">
        <BusinessType
          onChange={updateBusinessType}
          value={data.businessTypeId}
          onUpdateOptions={setBusinessTypeOptions}
          businessOptions={businessTypeOptions}
        />
      </div>
    );
  };

  const renderElectrical = () => {
    return (
      <ElectricalList
        data={data || {} as WorkOrderObj}
        updateData={setData}
        serviceEquipmentOptions={serviceEquipmentOptions}
        onUpdateOptions={setServiceEquipmentOptions}
        requestCode={requestCode}
      />
    );
  };

  const renderTransformerList = () => {
    return (
      <TransformerList
        data={data || {} as WorkOrderObj}
        updateData={setData}
        brandOptions={transformerBrandOptions}
        phaseOptions={transformerPhaseOptions}
        typeOptions={transformerTypeOptions}
        sizeOptions={transformerSizeOptions}
        voltageOptions={voltagesOptions}
        onUpdateBrandOptions={setTransformerBrandOptions}
        onUpdatePhaseOptions={setTransformerPhaseOptions}
        onUpdateTypeOptions={setTransformerTypeOptions}
        onUpdateSizeOptions={setTransformerSizeOptions}
        onUpdateVoltageOptions={setVoltagesOptions}
        reqCode={requestCode}
      />
    )
  }

  const renderByService = () => {
    switch (requestCode) {
      case "s301":
        return renderElectrical();
      case "s302":
      case "s303":
      case "s304":
      case "s306":
      case "s309":
      case "s310":
      case "s311":
      case "s317":
      case "s319":
      case "s320":
      case "s323":
      case "s399":
        return renderBusinessType();
      case "s305":
        return (
          <div>
            <RequestServiceTypeSelector
              data={data}
              updateData={setData}
              requestServiceOptions={requestServiceOptions}
              onUpdateRequestServiceOptions={setRequestServiceOptions}
              serviceTypesOptions={serviceTypesOptions}
              onUpdateServiceTypesOptions={setServiceTypesOptions}
              reqCode={requestCode}
            />

            {renderTransformerList()}
          </div>
        );
      case "s307":
        return (
          <VoltageLevel
            businessTypeOptions={businessTypeOptions}
            voltagesOptions={voltagesOptions}
            onUpdateBusinessTypeOptions={setBusinessTypeOptions}
            data={data}
            onUpdateData={setData}
          />
        );
      case "s308":
        return renderTransformerList()
      case "s312":
        return (
          <div>
            {renderBusinessType()}

            {renderElectrical()}
          </div>
        );
      case "s314":
        return (
          <div>
            <TransformerDateSelector data={data || {} as WorkOrderObj}
                                     updateData={setData}
                                     label={"วันที่เช่าฉนวนครอบสายไฟฟ้า"}
            />

            <InsulatorList
              data={data}
              updateData={setData}
            />
          </div>
        );
      case "s315":
        return (
          <div>
            {renderBusinessType()}

            <TransformerDateSelector data={data || {} as WorkOrderObj}
                                     updateData={setData}
            />

            <TransFormerList315
              data={data || {} as WorkOrderObj}
              updateData={setData}
            />
          </div>
        );
      case "s316":
        return (
          <div>
            <TransformerDateSelector data={data || {} as WorkOrderObj}
                                     updateData={setData}/>

            <ElectricGenerator
              data={data}
              updateData={setData}
            />
          </div>
        );
      case "s318":
        return (
          <div>
            {renderBusinessType()}

            <MeterEquipmentList
              data={data || {} as WorkOrderObj}
              updateData={setData}
              meterEquipmentOptions={meterEquipmentOptions}
              onUpdateOptions={setMeterEquipmentOptions}
              requestCode={requestCode}
            />
          </div>
        );
      case "s322":
        return (
          <BusinessTypePackage
            currentStep={currentStep}
            businessTypeOptions={businessTypeOptions}
            onUpdateBusinessTypeOptions={setBusinessTypeOptions}
            updateData={setData}
            data={data || {} as WorkOrderObj}
          />
        );
      case "s332-solar-battery":
        return (
          <div>
            <InverterComponent data={data}
                               updateData={setData}
            />

            <AddImagesSolarBattery
              onImagesChange={(images) => {
                console.log("Images updated:", images);
              }}
            />
          </div>
        )
      case "s332-solar-air-condition":
        return (
          <div>
            <DistanceComponent data={data}
                               updateData={setData}
            />

            <AddImagesSolarAirCondition
              onImagesChange={(images) => {
                console.log("Images updated:", images);
              }}
            />
          </div>
        )
      case "s329":
        return (
          <div>
            <EnergyRequirement options={renewableSourceOptions}
                               data={data || {} as WorkOrderObj}
                               onUpdate={setData}
            />

            <EnergySource options={renewableTypeOptions}
                          data={data || {} as WorkOrderObj}
                          onUpdate={setData}
            />

            <SurveyPeriod data={data || {} as WorkOrderObj}
                          onUpdate={setData}/>
          </div>
        );
      default:
        return null;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <CustomerInfo
              data={data || {} as WorkOrderObj}
              updateData={setData}
            />

            {renderByService()}
          </div>
        );

      case 1:
        return <WorkerList data={data || {} as WorkOrderObj}
                           updateData={setData}
                           updateAppointment={updateAppointment}
                           eventOptions={eventOptions}
                           workCenterOptions={mainWorkCenterOptions}
                           workerOptions={workerOptions}
                           setEventOptions={setEventOptions}
                           setMainWorkCenterOptions={setMainWorkCenterOptions}
                           setWorkerOptions={setWorkerOptions}
                           appointment_date={data.appointmentDate as Date}
        />;

      case 2:
        return (
          <div>
            <ResponsiblePersonComponent onUpdateData={setData}
                                        data={data || {} as WorkOrderObj}
                                        workerOptions={workerOptions}
            />
            <MaterialEquipmentChecklistPage
              data={materialEquipments}
              updateData={updateMaterialEquipments}
            />
          </div>
        );
      case 3:
        return <ExecuteWorkOrder requestCode={requestCode}/>
      default:
        return null;
    }
  };

  return (
    <div>
      <WorkOrderInfo data={data || {} as WorkOrderObj}/>

      {screenSize === "desktop" ? (
        <WorkOrderStep
          steps={workOrderStep}
          currentStep={currentStep}
          updateStep={setCurrentStep}
        />
      ) : (
        <WorkOrderStepMobile
          steps={workOrderStep}
          currentStep={currentStep}
          updateStep={setCurrentStep}
        />
      )}

      {renderCurrentStep()}

      <WorkOrderActionButtons
        currentStep={currentStep}
        totalSteps={workOrderStep.length}
        onNext={handleNext}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        onComplete={handleComplete}
        onSave={handleSave}
        workOrderStatusCode={data.workOrderStatusCode}
        isEdit={Boolean(isEdit)}
        isExecute={Boolean(isExecute)}
      />
    </div>
  );
};

export default CreateOrUpdateWorkOrder;
