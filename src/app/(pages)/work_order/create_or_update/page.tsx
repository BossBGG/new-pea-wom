"use client";
import {
  Assignee,
  CustomerRequest,
  MaterialEquipmentObj,
  Options,
  RequestServiceDetail,
  RequestServiceItem,
  ResolvedData,
  S301ServiceData, S316ServiceData,
  S318ServiceData,
  StepWorkOrderObj,
  Transformer,
  User,
  WorkOrderObj,
} from "@/types";
import WorkOrderInfo from "@/app/(pages)/work_order/(special-form)/component/WorkOrderInfo";
import React, { useEffect, useMemo, useState, useRef } from "react";
import WorkOrderStep from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStep";
import { stepsWorkOrder } from "@/app/config/work_order_steps";
import WorkOrderStepMobile from "@/app/(pages)/work_order/(special-form)/component/WorkOrderStepMobile";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import WorkOrderActionButtons from "@/app/(pages)/work_order/(special-form)/component/WorkOrderActionBunttons";
import {
  dismissAlert,
  showError,
  showProgress,
  showSuccess,
} from "@/app/helpers/Alert";
import _ from "lodash";
import {
  executeWorkOrder,
  getServiceRequestDetail,
  getWorkOrderDetailById,
  updateWorkOrder,
  updateWorkOrderStatus,
} from "@/app/api/WorkOrderApi";
import { useRouter, useSearchParams } from "next/navigation";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/(special-form)/component/breadcrumb";
import CustomerInfo from "@/app/(pages)/work_order/(special-form)/component/CustomerInfo";
import ElectricalList from "@/app/(pages)/work_order/(special-form)/s301/electrical-list";
import TransFormerList315 from "@/app/(pages)/work_order/(special-form)/s315/electrical-list";
import ElectricGenerator from "@/app/(pages)/work_order/(special-form)/s316/electric-generator";
import WorkerList from "@/app/(pages)/work_order/(special-form)/component/worker/WorkerList";
import ResponsiblePersonComponent from "@/app/(pages)/work_order/(special-form)/component/material_equipment_checklist/ResponsiblePersonComponent";
import MaterialEquipmentChecklistPage from "@/app/(pages)/work_order/(special-form)/component/material_equipment_checklist/material_equipment_checklist";
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
import { handleSearchMaterial } from "@/app/helpers/SearchMaterial";
import handleSearchServiceEquipmentType from "@/app/helpers/SearchServiceEquipmentType";
import {
  mapRequestServiceOptions,
  mapEventOptions,
  mapWorkCenterOptions,
  mapTransformerBrandOptions,
  mapTransformerPhaseOptions,
  mapTransformerTypeOptions,
  mapTransformerSizeOptions,
  mapTransformerVoltageOptions,
  mapMeterEquipmentOptions, mapWorkerOptions, mapParticipantOptions,
} from "@/app/(pages)/work_order/create_or_update/mapOptions";
import handleSearchBusinessType from "@/app/helpers/SearchBusinessType";
import { format } from "date-fns";
import {
  handleSearchRenewableSource,
  handleSearchRenewableType,
} from "@/app/helpers/SearchRenewable";
import { getWorkerListOptions } from "@/app/helpers/WorkerOptions";
import {
  handleSearchTransformerBrands,
  handleSearchTransformerPhase,
  handleSearchTransformerSize,
  handleSearchTransformerType,
  handleSearchTransformerVoltage,
} from "@/app/helpers/SearchTransformer.";
import InverterComponent from "@/app/(pages)/work_order/(special-form)/s332-solar-battery/Inverter";
import AddImagesSolarBattery from "@/app/(pages)/work_order/(special-form)/s332-solar-battery/AddImagesSolarBattery ";
import AddImagesSolarAirCondition from "@/app/(pages)/work_order/(special-form)/s332-solar-air-conditioner/AddImagesSolarBattery ";
import DistanceComponent from "@/app/(pages)/work_order/(special-form)/s332-solar-air-conditioner/Distance";
import { handleSearchRequestService } from "@/app/helpers/SearchRequestService";
import { handleSearchServiceType } from "@/app/helpers/SearchServiceType";
import { renderWorkOrderBreadcrumbTitle } from "@/app/(pages)/work_order/breadcrumb-title";
import {
  faFile,
  faPen,
  faUser,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { ExecuteWorkOrder } from "@/app/(pages)/work_order/execute/ExecuteWorkOrder";
import { searchMeterEquipmentOptions } from "@/app/helpers/SearchMeterEquipment";
import InvolvedPersonsListComponent from "../(special-form)/component/worker/InvolvedPersonsListComponent";
import { formatJSDate, timeStringToDateTime } from "@/app/helpers/DatetimeHelper";
import { clearCustomerRequestData } from "@/app/redux/slices/CustomerRequestSlice";
import { DESKTOP_SCREEN } from "@/app/redux/slices/ScreenSizeSlice";
import { workerMinMaxWorkDate } from "@/app/(pages)/work_order/(special-form)/component/WorkDateSyncHelper";

const CreateOrUpdateWorkOrder = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const router = useRouter();
  const [data, setData] = useState<WorkOrderObj>({} as WorkOrderObj);
  const screenSize = useAppSelector((state) => state.screen_size);
  const [currentStep, setCurrentStep] = useState(0);
  const params = useSearchParams();
  const id = params.get("id") as string;
  // const workOrderNo = params.get("workOrderNo") as string;
  const isEdit =
    (params.get("isEdit") as string) && params.get("isEdit") === "true";
  const isExecute =
    (params.get("isExecute") as string) && params.get("isExecute") === "true";
  const requestCode = params.get("requestCode") as string;
  // const statusCode = params.get("statusCode") as string;
  const peaOfficeOptions: Options[] = useAppSelector(
    (state) => state.options.peaOfficeOptions || []
  );
  const user: User = useAppSelector((state) => state.user);
  const customerRequest = useAppSelector(
    (state) => state.customer_request_data
  );
  const [eventOptions, setEventOptions] = useState<Options[]>([]);
  const [mainWorkCenterOptions, setMainWorkCenterOptions] = useState<Options[]>(
    []
  );
  const [serviceEquipmentOptions, setServiceEquipmentOptions] = useState<
    Options[]
  >([]);
  const [businessTypeOptions, setBusinessTypeOptions] = useState<Options[]>([]);
  const [voltagesOptions, setVoltagesOptions] = useState<Options[]>([]);
  const [renewableSourceOptions, setRenewableSourceOptions] = useState<
    Options[]
  >([]);
  const [renewableTypeOptions, setRenewableTypeOptions] = useState<Options[]>(
    []
  );
  const [workerOptions, setWorkerOptions] = useState<Options[]>([]);
  const [participantOptions, setParticipantOptions] = useState<Options[]>([]);
  const [transformerBrandOptions, setTransformerBrandOptions] = useState<
    Options[]
  >([]);
  const [transformerPhaseOptions, setTransformerPhaseOptions] = useState<
    Options[]
  >([]);
  const [transformerTypeOptions, setTransformerTypeOptions] = useState<
    Options[]
  >([]);
  const [transformerSizeOptions, setTransformerSizeOptions] = useState<
    Options[]
  >([]);
  const [requestServiceOptions, setRequestServiceOptions] = useState<Options[]>(
    []
  );
  const [serviceTypesOptions, setServiceTypesOptions] = useState<Options[]>([]);
  const [materialEquipments, setMaterialEquipments] = useState<
    MaterialEquipmentObj[]
  >([]);
  const [workOrderStep, setWorkOrderStep] =
    useState<Array<StepWorkOrderObj>>(stepsWorkOrder);
  const [meterEquipmentOptions, setMeterEquipmentOptions] = useState<Options[]>(
    []
  );
  const [initialCustomerBp, setInitialCustomerBp] = useState<string>("");
  const [initialCustomerCa, setInitialCustomerCa] = useState<string>("");
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setBreadcrumb(
        <div className="flex items-end">
          <WorkOrderBreadcrumb
            title={`ใบสั่งงาน ${renderWorkOrderBreadcrumbTitle(requestCode)}`}
            path={requestCode}
          />

          {
            data.sapStatusCodes && data.sapStatusCodes === 'SAP_CANCELLED' &&
            (
              <div className="bg-[#E02424] p-2 rounded-md text-[16px] text-white font-medium mb-1">
                ยกเลิกการส่งข้อมูลขึ้น SAP
              </div>
            )
          }
        </div>
      );
    }
  }, [data, isExecute, isEdit, setBreadcrumb]);

  useEffect(() => {
    showProgress();
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    const requests: { [K in keyof ResolvedData]?: Promise<Options[]> } = {
      respEventOptions: handleSearchEvent(),
      resMainWorkCenter: handleSearchMainWorkCenter(),
      resWorkerOptions: getWorkerListOptions(),
      resParticipantOptions: getWorkerListOptions(),
      resBusinessType: handleSearchBusinessType()
    };

    if (["s301", "s312"].includes(requestCode)) {
      requests.resServiceEquipmentOptions = handleSearchServiceEquipmentType("", requestCode);
    }

    if (requestCode === "s318") {
      requests.resMeterEquipmentOptions = searchMeterEquipmentOptions("", requestCode);
    }

    if (["s307", "s305", "s308"].includes(requestCode)) {
      requests.resVoltages = handleSearchTransformerVoltage("", requestCode);
    }

    if (requestCode === "s329") {
      requests.resRenewableSource = handleSearchRenewableSource("", requestCode);
      requests.resRenewableType = handleSearchRenewableType("", requestCode);
    }

    if (["s305", "s308"].includes(requestCode)) {
      requests.resTransformerBrands = handleSearchTransformerBrands("", requestCode);
      requests.resTransformerPhase = handleSearchTransformerPhase("", requestCode);
      requests.resTransformerType = handleSearchTransformerType("", requestCode);
      requests.resTransformerSize = handleSearchTransformerSize("", requestCode);
    }

    if (requestCode === "s305") {
      requests.resReqService = handleSearchRequestService("", requestCode);
      requests.resServiceTypes = handleSearchServiceType("", requestCode);
    }

    const promiseKeys = Object.keys(requests) as Array<keyof ResolvedData>;
    const promiseValues = Object.values(requests);

    Promise.all(promiseValues)
      .then(async (results) => {
        const resolvedData = promiseKeys.reduce((acc, key, index) => {
          acc[key] = results[index];
          return acc;
        }, {} as ResolvedData);

        const {
          respEventOptions, resMainWorkCenter, resServiceEquipmentOptions, resBusinessType,
          resVoltages, resRenewableSource, resRenewableType, resWorkerOptions, resParticipantOptions,
          resTransformerBrands, resTransformerPhase, resTransformerType, resTransformerSize,
          resReqService, resServiceTypes, resMeterEquipmentOptions,
        } = resolvedData;

        setEventOptions(respEventOptions || []);
        setMainWorkCenterOptions(resMainWorkCenter || []);
        setServiceEquipmentOptions(resServiceEquipmentOptions || []);
        setBusinessTypeOptions(resBusinessType || []);
        setVoltagesOptions(resVoltages || []);
        setRenewableSourceOptions(resRenewableSource || []);
        setRenewableTypeOptions(resRenewableType || []);
        setWorkerOptions(resWorkerOptions || []);
        setParticipantOptions(resParticipantOptions || []);
        setTransformerBrandOptions(resTransformerBrands || []);
        setTransformerPhaseOptions(resTransformerPhase || []);
        setTransformerTypeOptions(resTransformerType || []);
        setTransformerSizeOptions(resTransformerSize || []);
        setRequestServiceOptions(resReqService || []);
        setServiceTypesOptions(resServiceTypes || []);
        setMeterEquipmentOptions(resMeterEquipmentOptions || []);

        const steps: StepWorkOrderObj[] = [
          { name: "ข้อมูลลูกค้า", icon: faPen },
          { name: "ผู้ปฏิบัติงาน", icon: faUser },
          { name: "อุปกรณ์ปฏิบัติงาน", icon: faWrench },
        ];

        if (isEdit || isExecute) {
          await fetchWorkOrderDetail(
            id,
            steps,
            respEventOptions || [],
            resMainWorkCenter || [],
            resMeterEquipmentOptions || [],
            resWorkerOptions || [],
            resParticipantOptions || []
          );
        } else {
          setWorkOrderStep(steps);
          if (customerRequest?.workOrderParentId) {
            //สร้างใบสั่งงานย่อย อ้างอิงใบสั่งงานหลัก
            await fetchWorkOrderDetail(
              customerRequest.workOrderParentId,
              steps,
              respEventOptions || [],
              resMainWorkCenter || [],
              resMeterEquipmentOptions || [],
              resWorkerOptions || [],
              resParticipantOptions || []
            );
          } else {
            //สร้างแบบใหม่
            let newData: WorkOrderObj = {
              ...data,
              workOrderNo: customerRequest?.workOrderNo || "",
              appointmentDate: new Date(),
              requestServiceDetail: {} as RequestServiceDetail,
              materialEquipments: [],
              request_status: customerRequest?.status || "",
              workOrderStatusCode: "W",
              officePlant: customerRequest?.officePlant || "",
              costCenter: customerRequest?.costCenter || "",
              peaNameFull: customerRequest?.peaNameFull,
              peaOffice: customerRequest?.peaOffice || "",
              serviceName: customerRequest?.serviceName || "",
              priority: 2,
            };

            if (customerRequest?.customerRequestNo) {
              // สร้างใบสั่งงานแบบอ้างอิงใบคำร้อง
              const resCustReq = await getServiceRequestDetail(
                customerRequest.customerRequestNo
              );

              if (resCustReq.status === 200) {
                const customerItem: CustomerRequest[] = resCustReq.data?.data
                  ?.data || [{} as CustomerRequest];
                if (customerItem.length > 0) {
                  let customerData: CustomerRequest = customerItem[0]
                  setInitialCustomerBp(customerData.customerBp || "");
                  setInitialCustomerCa(customerData.customerCa || "");
                  newData = {
                    ...newData,
                    customerRequestNo: customerRequest?.customerRequestNo || "",
                    sapOrderNo: customerData?.sapOrderNo || customerRequest?.sapOrderNo || "",
                    serviceName: customerData?.serviceName || "",
                    customerName: customerData?.customerName || "",
                    customerMobileNo: customerData.customerMobileNo || "",
                    customerAddress: customerData.customerAddress || "",
                    customerEmail: customerData.customerEmail || "",
                    customerBp: customerData.customerBp || "",
                    customerCa: customerData.customerCa || "",
                    customerLatitude: customerData.customerLatitude || 0,
                    customerLongitude: customerData.customerLongitude || 0,
                    sapProcessCreatedDate: customerData.sapProcessCreatedDate || undefined
                  };
                }
              }
            }

            setData(newData);
            setMaterialEquipments([]);
            dismissAlert();
          }
        }
      })
      .catch((error) => {
        console.error("An error occurred while fetching data:", error);
        dismissAlert();
      })
  };

  const fetchWorkOrderDetail = async (
    workOrderId: string,
    steps: StepWorkOrderObj[],
    respEventOptions: Options[],
    resMainWorkCenter: Options[],
    resMeterEquipmentOptions: Options[],
    resWorkerOptions: Options[],
    resParticipantOptions: Options[]
  ) => {
    getWorkOrderDetailById(workOrderId, isExecute as boolean).then(
      async (res) => {
        if (res.status === 200) {
          const items = res.data.data as WorkOrderObj;
          items.id = id;
          items.workOrderNo =
            customerRequest.workOrderNo || items.workOrderNo || "";

          if (customerRequest.workOrderParentId) {
            //กรณีที่สร้างแบบอ้างอิงใบสั่งงานหลัก ต้องแก้ไขให้ status ไม่เป็นไปตามตัวหลัก
            items.workOrderStatusCode = "W";
          }

          if (!["W", "M"].includes(items.workOrderStatusCode)) {
            steps.push({ name: "ผลปฏิบัติงาน", icon: faFile });
          }

          setWorkOrderStep(steps);

          items.appointmentDate = items.appointmentDate
            ? new Date(items.appointmentDate)
            : new Date();
          items.requestServiceDetail = {} as RequestServiceDetail;
          items.peaOffice = customerRequest.peaOffice || items.peaOffice;
          items.officePlant = customerRequest.officePlant || items.officePlant;
          items.costCenter = customerRequest.costCenter || items.costCenter;
          items.executionNote = items.execution?.note || "";
          items.latitude = items.execution?.latitude || 0;
          items.longitude = items.execution?.longitude || 0;
          items.priority = items.priority || 2;
          items.sapOrderNo = items.sapOrderNo || ""
          items.sapProcessCreatedDate = items.sapProcessCreatedDate || undefined
          items.serviceName = items.serviceName || "";
          items.recorderName = items.execution?.recorderName || `${user.prefix} ${user.firstName} ${user.lastName}` || ""
          items.recorderPosition = items.execution?.recorderPosition || user.position || ""
          items.recorderPhoneNumber = items.execution?.recorderPhoneNumber || user.phoneNumber || ""

          let startDate: Date | string | undefined | null = "";
          let endDate: Date | string | undefined | null = "";
          if (items.execution?.startDateTime && items.execution?.endDateTime) {
            startDate = new Date(items.execution.startDateTime)
            endDate = new Date(items.execution.endDateTime)
          } else {
            if (items.assignees?.length > 0) {
              const resMinMax = workerMinMaxWorkDate(items.assignees)
              startDate = resMinMax?.minStartDate
              endDate = resMinMax?.maxEndDate
            }
          }

          items.startWorkDate = startDate
          items.endWorkDate = endDate

          if (items.serviceSpecificData) {
            if (requestCode === "s316") {
              const serviceS316 = items.serviceSpecificData as S316ServiceData;
              if (serviceS316) {
                items.serviceSpecificData = {
                  ...items.serviceSpecificData,
                  generatorStartTime: serviceS316.generatorStartTime ? formatJSDate(new Date(serviceS316.generatorStartTime), "HH:mm") : "",
                  generatorEndTime: serviceS316.generatorEndTime ? formatJSDate(new Date(serviceS316.generatorEndTime), "HH:mm") : ""
                } as S316ServiceData
              }
            }

            if (requestCode === "s318") {
              const serviceSpecS318 =
                items.serviceSpecificData as S318ServiceData;
              const materialEquipment = await mapMeterEquipmentOptions(
                serviceSpecS318.equipments,
                resMeterEquipmentOptions || [],
                requestCode
              );
              setMeterEquipmentOptions(materialEquipment);
            }
          }

          if (items.assignees?.length > 0) {
            const assignees = items.assignees;
            const newWorkerOpts = await mapWorkerOptions(
              assignees,
              resWorkerOptions || []
            )
            setWorkerOptions(newWorkerOpts);
            const newEventOpts = await mapEventOptions(
              assignees,
              respEventOptions || []
            );
            setEventOptions(newEventOpts);
            const newWorkCenterOptions = await mapWorkCenterOptions(
              assignees,
              resMainWorkCenter || []
            );
            setMainWorkCenterOptions(newWorkCenterOptions);
          }

          if (items.participants?.length > 0) {
            const participants: Assignee[] = items.participants
            const newParticipantOpts = await mapParticipantOptions(
              participants,
              resParticipantOptions || []
            )
            setParticipantOptions(newParticipantOpts)
          }

          setInitialCustomerBp(items.customerBp || "");
          setInitialCustomerCa(items.customerCa || "");
          setData(items);
          dismissAlert();
        } else {
          dismissAlert();
        }
      })
  };

  useEffect(() => {
    if (screenSize !== DESKTOP_SCREEN) {
      const newData = data;
      if (newData && typeof newData.requestServiceDetail === "object") {
        newData.requestServiceDetail.items =
          newData.requestServiceDetail.items?.map((item) => {
            return { ...item, isUpdate: false };
          }) as RequestServiceItem[] | Transformer[];

        setData(newData);
      }

      if (newData.assignees?.length > 0) {
        newData.assignees = newData.assignees.map((item) => {
          return { ...item, isUpdate: false };
        });

        setData(newData);
      }
    }
  }, [screenSize]);

  const getOfficeCode = useMemo(() => {
    if (data?.peaOffice) {
      return data.peaOffice;
    }

    if (user?.selectedPeaOffice && user.selectedPeaOffice.length <= 10) {
      return user.selectedPeaOffice;
    }

    if (user?.selectedPeaOffice && peaOfficeOptions.length > 0) {
      const officeOption = peaOfficeOptions.find(
        (opt) =>
          opt.label === user.selectedPeaOffice ||
          opt.data?.peaNameFull === user.selectedPeaOffice
      );

      if (officeOption?.data?.office) {
        return officeOption.data.office;
      }
    }

    return "";
  }, [data?.peaOffice, user?.selectedPeaOffice, peaOfficeOptions]);

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
    router.push("/work_order");
  };

  const handleConfirm = () => {
    handleSave("M");
  };

  const handleComplete = () => {
    // Logic สำหรับจบงาน
    console.log("Complete work order");
  };

  const handleSave = async (status: string | null = null) => {
    showProgress();
    const item = _.cloneDeep(data) as any;

    item.requestServiceDetail = JSON.stringify(item.requestServiceDetail);
    item.customerLatitude = item.customerLatitude
      ? parseFloat(item.customerLatitude)
      : 0;
    item.customerLongitude = item.customerLongitude
      ? parseFloat(item.customerLongitude)
      : 0;
    item.appointmentDate = new Date(item.appointmentDate).toISOString()

    if (requestCode === "s316" && item.serviceSpecificData) {
      let serviceSpecS316 = item.serviceSpecificData as S316ServiceData
      if (serviceSpecS316.generatorStartTime) {
        item.serviceSpecificData.generatorStartTime = timeStringToDateTime(serviceSpecS316.generatorStartTime)
      }

      if (serviceSpecS316.generatorEndTime) {
        item.serviceSpecificData.generatorEndTime = timeStringToDateTime(serviceSpecS316.generatorEndTime)
      }
    }

    if (data.equipments && data.equipments.length > 0) {
      item.equipments = data.equipments.map((material) => ({
        code: material.code,
        name: material.name,
        quantity: Number(material.quantity),
        availableStock: Number(material.availableStock) || 0,
        unit: material.unit,
        price: Number(material.price) || 0,
      }));
    }

    const assignees: Assignee[] = [];
    item.assignees?.map((assignee: Assignee) => {
      const assigneeKeyDel: (keyof Assignee)[] = [
        "isUpdate",
        "index",
        "id",
        "workOrderId",
        "sequenceNo",
        "isRead",
      ];
      assigneeKeyDel.map((key) => {
        delete assignee[key];
      });

      assignee = {
        ...assignee,
        workCenterId: assignee.workCenterId.toString(),
        workActivityTypeId: assignee.workActivityTypeId.toString(),
      };

      assignees.push(assignee);
    });

    item.assignees = assignees;

    delete item.recorderName;
    delete item.recorderPosition;
    delete item.recorderPhoneNumber;

    let res = null;
    if (item.workOrderStatusCode !== "W") {
      try {
        res = await executeWorkOrder(id, item);
      } catch (e: any) {
        if (e?.response?.data?.message?.length > 0) {
          showError(e.response.data.message[0]);
        }
        return;
      }
    } else {
      try {
        res = await updateWorkOrder(id, item);
      } catch (e: any) {
        if (e?.response?.data?.message?.length > 0) {
          showError(e.response.data.message[0]);
        }
        return;
      }
    }

    if (res?.status === 200) {
      if (res.data.error) {
        let message = res.data.status_code === 500
          ? res.data.error as string
          : res.data.message;
        showError(message || "");
        return;
      }

      if (status && status === "M") {
        await updateWorkOrderStatus(id, status);
      }

      showSuccess().then(async (res) => {
        dispatch(clearCustomerRequestData())
        if (status && status === "M") {
          router.push(`/work_order/${id}`);
        } else {
          const params = new URLSearchParams({
            id,
            requestCode,
            isExecute: ["O", "K", "B", "J", "T", "X", "Y", "Z"].includes(item.workOrderStatusCode) ? "true" : "false",
            isEdit: item.workOrderStatusCode === "W" ? "true" : "false",
          });

          window.location.href = `/work_order/create_or_update?${params.toString()}`
        }
      });
    } else {
      showError(res.data.message || "");
    }
  };

  useEffect(() => {
    console.log("data >>> ", data);
  }, [data]);

  const updateMaterialEquipments = (materials: MaterialEquipmentObj[]) => {
    setMaterialEquipments(materials);
    setData((prevState) => ({
      ...prevState,
      equipments: materials,
    }));
  };

  const updateAppointment = (date: Date | undefined) => {
    setData((prevState) => ({
      ...prevState,
      appointmentDate: date,
    }));
  };

  const isCanEdit = (): boolean => {
    if (data && data.workOrderStatusCode) {
      return (
        !["B", "J", "T", "X", "Y", "Z"].includes(data.workOrderStatusCode)
        && (!data.sapStatusCodes || (data.sapStatusCodes && data.sapStatusCodes !== 'SAP_CANCELLED'))
      ) as boolean
    }
    return true;
  };

  const renderBusinessType = () => {
    return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <BusinessType
          data={data || ({} as WorkOrderObj)}
          updateData={(d) => setData(d as WorkOrderObj)}
          onUpdateOptions={setBusinessTypeOptions}
          businessOptions={businessTypeOptions}
          disabled={!isCanEdit()}
        />
      </div>
    );
  };

  const renderElectrical = () => {
    const canEdit = isCanEdit();
    return (
      <ElectricalList
        data={data || ({} as WorkOrderObj)}
        updateData={setData}
        serviceEquipmentOptions={serviceEquipmentOptions}
        onUpdateOptions={setServiceEquipmentOptions}
        requestCode={requestCode}
        options={{
          showActionColumn: canEdit,
          showAddButton: canEdit,
          showDeleteAllButton: canEdit,
        }}
      />
    );
  };

  const renderTransformerList = () => {
    return (
      <TransformerList
        data={data || ({} as WorkOrderObj)}
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
        options={{
          showActionColumn: isCanEdit(),
          showDeleteAllButton: isCanEdit(),
          showAddButton: isCanEdit(),
          isReadOnly: !isCanEdit(),
        }}
      />
    );
  };

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
              disabled={!isCanEdit()}
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
            disabled={!isCanEdit()}
          />
        );
      case "s308":
        return (
          <div>
            <TransformerSize
              data={data}
              updateData={(d) => setData(d as WorkOrderObj)}
              businessOptions={businessTypeOptions}
              disabled={!isCanEdit()}
            />

            {renderTransformerList()}
          </div>
        )
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
            <TransformerDateSelector
              data={data || ({} as WorkOrderObj)}
              updateData={setData}
              label={"วันที่เช่าฉนวนครอบสายไฟฟ้า"}
              disabled={!isCanEdit()}
            />

            <InsulatorList
              data={data}
              updateData={setData}
              options={{
                showActionColumn: isCanEdit(),
                showAddButton: isCanEdit(),
                showDeleteAllButton: isCanEdit(),
                isReadOnly: !isCanEdit(),
              }}
            />
          </div>
        );
      case "s315":
        return (
          <div>
            {renderBusinessType()}

            <TransformerDateSelector
              data={data || ({} as WorkOrderObj)}
              updateData={setData}
              disabled={!isCanEdit()}
            />

            <TransFormerList315
              data={data || ({} as WorkOrderObj)}
              updateData={setData}
              options={{
                showActionColumn: isCanEdit(),
                showAddButton: isCanEdit(),
                showDeleteAllButton: isCanEdit(),
                isReadOnly: !isCanEdit(),
              }}
            />
          </div>
        );
      case "s316":
        return (
          <div>
            <TransformerDateSelector
              data={data || ({} as WorkOrderObj)}
              updateData={setData}
              disabled={!isCanEdit()}
            />

            <ElectricGenerator data={data} updateData={setData} disabled={!isCanEdit()} />
          </div>
        );
      case "s318":
        return (
          <div>
            {/*{renderBusinessType()}*/}

            <MeterEquipmentList
              data={data || ({} as WorkOrderObj)}
              updateData={setData}
              meterEquipmentOptions={meterEquipmentOptions}
              onUpdateOptions={setMeterEquipmentOptions}
              requestCode={requestCode}
              options={{
                showActionColumn: isCanEdit(),
                showAddButton: isCanEdit(),
                showDeleteAllButton: isCanEdit(),
                isReadOnly: !isCanEdit(),
              }}
            />
          </div>
        );
      case "s322":
        return (
          <BusinessTypePackage
            currentStep={currentStep}
            businessTypeOptions={businessTypeOptions}
            onUpdateBusinessTypeOptions={setBusinessTypeOptions}
            updateData={(d) => setData(d as WorkOrderObj)}
            data={data || ({} as WorkOrderObj)}
            disabled={!isCanEdit()}
          />
        );
      case "s332-solar-battery":
        return (
          <div>
            <InverterComponent
              data={data}
              updateData={setData}
              disabled={!isCanEdit()}
            />

            <AddImagesSolarBattery
              onImagesChange={(images) => {
                console.log("Images updated:", images);
              }}
              disabled={!isCanEdit()}
            />
          </div>
        );
      case "s332-solar-air-condition":
        return (
          <div>
            <DistanceComponent
              data={data}
              updateData={setData}
              disabled={!isCanEdit()}
            />

            <AddImagesSolarAirCondition
              onImagesChange={(images) => {
                console.log("Images updated:", images);
              }}
              disabled={!isCanEdit()}
            />
          </div>
        );
      case "s329":
        return (
          <div>
            <EnergyRequirement
              options={renewableSourceOptions}
              data={data || ({} as WorkOrderObj)}
              onUpdate={setData}
              disabled={!isCanEdit()}
            />

            <EnergySource
              options={renewableTypeOptions}
              data={data || ({} as WorkOrderObj)}
              onUpdate={setData}
              disabled={!isCanEdit()}
            />

            <SurveyPeriod
              data={data || ({} as WorkOrderObj)}
              onUpdate={setData}
              disabled={!isCanEdit()}
            />
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
              data={data || ({} as WorkOrderObj)}
              updateData={setData}
              disabled={!isCanEdit()}
              hasInitialCustomerBp={!!initialCustomerBp}
              hasInitialCustomerCa={!!initialCustomerCa}
            />

            {renderByService()}
          </div>
        );

      case 1:
        return (
          <div>
            <InvolvedPersonsListComponent
              onUpdateData={setData}
              data={data}
              workerOptions={participantOptions}
              setWorkerOptions={setParticipantOptions}
              disabled={!isCanEdit()}
            />

            <WorkerList
              data={data || ({} as WorkOrderObj)}
              updateData={setData}
              updateAppointment={updateAppointment}
              eventOptions={eventOptions}
              workCenterOptions={mainWorkCenterOptions}
              workerOptions={workerOptions}
              setEventOptions={setEventOptions}
              setMainWorkCenterOptions={setMainWorkCenterOptions}
              setWorkerOptions={setWorkerOptions}
              appointment_date={data.appointmentDate as Date}
              options={{
                showActionColumn: isCanEdit(),
                showDeleteAllButton: isCanEdit(),
                showAddButton: isCanEdit(),
                isReadOnly: !isCanEdit(),
              }}
            />
          </div>
        );

      case 2:
        return (
          <div>
            <ResponsiblePersonComponent
              onUpdateData={setData}
              data={data || ({} as WorkOrderObj)}
              workerOptions={workerOptions}
              disabled={!isCanEdit()}
            />

            <MaterialEquipmentChecklistPage
              data={data?.equipments || []}
              updateData={updateMaterialEquipments}
              office={getOfficeCode}
              options={{
                showActionColumn: data.workOrderStatusCode === "W",
                showDeleteAllButton: data.workOrderStatusCode === "W",
                showAddButton: data.workOrderStatusCode === "W",
                isReadOnly: data.workOrderStatusCode !== "W"
              }}
            />
          </div>
        );
      case 3:
        return (
          <ExecuteWorkOrder
            requestCode={requestCode}
            isSurvey={data.isSurvey || false}
            renderByService={renderByService}
            disabled={!isCanEdit()}
            data={data}
            setData={setData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-w-0">
      <WorkOrderInfo
        data={data || ({} as WorkOrderObj)}
        updateData={setData}
        mainWorkCenterOptions={mainWorkCenterOptions}
        onUpdateOptions={setMainWorkCenterOptions}
        disabled={!isCanEdit()}
      />

      {screenSize === DESKTOP_SCREEN ? (
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
        isEdit={isEdit as boolean}
        isExecute={isExecute as boolean}
        id={id}
        workOrderNo={data.workOrderNo}
        disabled={!isCanEdit()}
      />
    </div>
  );
};

export default CreateOrUpdateWorkOrder;
