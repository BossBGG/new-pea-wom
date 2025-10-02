"use client";
import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useBreadcrumb} from "@/app/context/BreadcrumbContext";
import {getWorkOrderDetailById, updateWorkOrderStatus} from "@/app/api/WorkOrderApi";
import {MaterialEquipmentObj, Options, RequestServiceItem, ResolvedData, S301ServiceData, WorkOrderObj} from "@/types";
import WorkOrderDetailBreadcrumb from "@/app/(pages)/work_order/[id]/breadcrumb";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faClock, faPlus, faPrint} from "@fortawesome/free-solid-svg-icons";
import LatestUpdateData from "@/app/components/utils/LatestUpdateData";
import WorkOrderInfo from "@/app/(pages)/work_order/(special-form)/component/workorder-details/WorkOrderInfo"
import {renderStatusWorkOrder} from "@/app/(pages)/work_order/[id]/work-order-status";
import CustomerAndWorkerInfo
  from "@/app/(pages)/work_order/(special-form)/component/workorder-details/CustomerAndWorkerInfo";
import handleSearchEvent from "@/app/helpers/SearchEvent";
import handleSearchMainWorkCenter from "@/app/helpers/SearchMainWorkCenter";
import {getWorkerListOptions} from "@/app/helpers/WorkerOptions";
import {
  mapEventOptions,
  mapRequestServiceOptions,
  mapWorkCenterOptions
} from "@/app/(pages)/work_order/create_or_update/mapOptions";
import MaterialEquipmentChecklistPage
  from "@/app/(pages)/work_order/(special-form)/component/material_equipment_checklist/material_equipment_checklist";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import ElectricalList from "@/app/(pages)/work_order/(special-form)/s301/electrical-list";
import handleSearchServiceEquipmentType from "@/app/helpers/SearchServiceEquipmentType";
import RequestServiceTypeSelector from "@/app/(pages)/work_order/(special-form)/s305/RequestServiceTypeSelector";
import VoltageLevel from "@/app/(pages)/work_order/(special-form)/s307/Voltagelevel";
import TransformerDateSelector from "@/app/(pages)/work_order/(special-form)/s315/TransformerDateSelector";
import InsulatorList from "@/app/(pages)/work_order/(special-form)/s314/insulator-list";
import TransFormerList315 from "@/app/(pages)/work_order/(special-form)/s315/electrical-list";
import ElectricGenerator from "@/app/(pages)/work_order/(special-form)/s316/electric-generator";
import MeterEquipmentList from "@/app/(pages)/work_order/(special-form)/s318/electrical-list";
import BusinessTypePackage from "@/app/(pages)/work_order/(special-form)/s322/BusinessTypePackage";
import InverterComponent from "@/app/(pages)/work_order/(special-form)/s332-solar-battery/Inverter";
import AddImagesSolarBattery from "@/app/(pages)/work_order/(special-form)/s332-solar-battery/AddImagesSolarBattery ";
import DistanceComponent from "@/app/(pages)/work_order/(special-form)/s332-solar-air-conditioner/Distance";
import AddImagesSolarAirCondition
  from "@/app/(pages)/work_order/(special-form)/s332-solar-air-conditioner/AddImagesSolarBattery ";
import EnergyRequirement from "@/app/(pages)/work_order/(special-form)/s329/EnergyRequirement";
import EnergySource from "@/app/(pages)/work_order/(special-form)/s329/EnergySource";
import SurveyPeriod from "@/app/(pages)/work_order/(special-form)/s329/SurveyPeriod";
import handleSearchBusinessType from "@/app/helpers/SearchBusinessType";
import {
  handleSearchTransformerBrands,
  handleSearchTransformerPhase, handleSearchTransformerSize, handleSearchTransformerType,
  handleSearchTransformerVoltage
} from "@/app/helpers/SearchTransformer.";
import {handleSearchRenewableSource, handleSearchRenewableType} from "@/app/helpers/SearchRenewable";
import {handleSearchRequestService} from "@/app/helpers/SearchRequestService";
import {handleSearchServiceType} from "@/app/helpers/SearchServiceType";
import BusinessType from "@/app/(pages)/work_order/(special-form)/component/work_execution/business_type";
import TransformerList from "@/app/(pages)/work_order/(special-form)/s305/transformer-list";
import {ModalConfirm} from "@/app/components/utils/ModalConfirm";
import PopupStartWork from "@/assets/images/popup_startwork.png";
import {dismissAlert, showProgress} from "@/app/helpers/Alert";
import {getMeterEquipmentOptions} from "@/app/api/MaterialEquipmentApi";

const WorkOrderDetail = () => {
  const params = useParams();
  const [data, setData] = useState<WorkOrderObj>({} as WorkOrderObj);
  const id = params.id as string;
  const router = useRouter()
  const {setBreadcrumb} = useBreadcrumb();
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
  const [requestCode, setRequestCode] = useState<string>("");
  const [isShowConfirmStart, setIsShowConfirmStart] = useState(false);
  const [meterEquipmentOptions, setMeterEquipmentOptions] = useState<Options[]>([]);

  useEffect(() => {
    setBreadcrumb(<WorkOrderDetailBreadcrumb path={id} title={"ใบสั่งงาน"}/>)
    getWorkOrderDetailById(id).then(async (res) => {
      if (res.status === 200) {
        let items = res.data.data as WorkOrderObj;
        let reqCode = items.requestCode.toLowerCase() as string;
        setRequestCode(reqCode)
        setData(items);

        const requests: { [K in keyof ResolvedData]?: Promise<Options[]> } = {
          respEventOptions: handleSearchEvent(),
          resMainWorkCenter: handleSearchMainWorkCenter(),
          resWorkerOptions: getWorkerListOptions()
        }

        if (['s301', 's312'].includes(reqCode)) {
          requests.resServiceEquipmentOptions = handleSearchServiceEquipmentType("", reqCode)
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
          "s309", "s310", "s311", "s317", "s319", "s320", "s322", "s323", "s399"].includes(reqCode)) {
          requests.resBusinessType = handleSearchBusinessType()
        }

        if (['s307', 's305', 's308'].includes(reqCode)) {
          requests.resVoltages = handleSearchTransformerVoltage("", reqCode)
        }

        if (reqCode === 's329') {
          requests.resRenewableSource = handleSearchRenewableSource("", reqCode);
          requests.resRenewableType = handleSearchRenewableType("", reqCode);
        }

        if (['s305', 's308'].includes(reqCode)) {
          requests.resTransformerBrands = handleSearchTransformerBrands("", reqCode);
          requests.resTransformerPhase = handleSearchTransformerPhase("", reqCode);
          requests.resTransformerType = handleSearchTransformerType("", reqCode);
          requests.resTransformerSize = handleSearchTransformerSize("", reqCode);
        }

        if (reqCode === 's305') {
          requests.resReqService = handleSearchRequestService("", reqCode);
          requests.resServiceTypes = handleSearchServiceType("", reqCode);
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
              respEventOptions, resMainWorkCenter, resServiceEquipmentOptions,
              resBusinessType, resVoltages, resRenewableSource,
              resRenewableType, resWorkerOptions, resTransformerBrands,
              resTransformerPhase, resTransformerType, resTransformerSize,
              resReqService, resServiceTypes
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

            /*if (typeof items.requestServiceDetail === "string") {
              items.requestServiceDetail = JSON.parse(items.requestServiceDetail as string)
              if(typeof items.requestServiceDetail === 'object') {
                if(items.requestServiceDetail.items) {
                  if(['s301', 's312'].indexOf(reqCode) > -1) {
                    const reqService = items.requestServiceDetail.items as RequestServiceItem[];
                    const newServiceEqOptions = await mapRequestServiceOptions(reqService, resServiceEquipmentOptions || [], requestCode)
                    setServiceEquipmentOptions(newServiceEqOptions)
                  }
                }
              }
            }*/

            if(items.serviceSpecificData) {
              if(['s301', 's312'].indexOf(requestCode) > -1) {
                const reqService = items.serviceSpecificData as S301ServiceData;
                const newServiceEqOptions = await mapRequestServiceOptions(reqService?.equipments || [], resServiceEquipmentOptions || [], requestCode)
                setServiceEquipmentOptions(newServiceEqOptions)
              }
            }

            if(items.assignees?.length > 0) {
              let assignees = items.assignees;
              const newEventOpts = await mapEventOptions(assignees, eventOptions || [])
              setEventOptions(newEventOpts)
              const newWorkCenterOptions = await mapWorkCenterOptions(assignees, resMainWorkCenter || [])
              setMainWorkCenterOptions(newWorkCenterOptions)
            }
          })
      }
    })
  }, []);

  const handleHistory = () => {
    console.log("Show history");
  };

  const handleEdit = () => {
    const params = new URLSearchParams({
      id: id,
      workOrderNo: data.workOrderNo as string,
      requestCode: requestCode as string,
      isEdit: "true"
    });
    router.push(`/work_order/create_or_update?${params.toString()}`)
  }

  const handleConfirmStart = () => {
    setIsShowConfirmStart(true)
  }

  const handleRecordResult = () => {
    showProgress()
    const params = new URLSearchParams({
      id: id,
      workOrderNo: data.workOrderNo as string,
      requestCode: requestCode as string,
      isExecute: "true"
    });
    router.push(`/work_order/create_or_update?${params.toString()}`)
  }

  const submitConfirmStart = async () => {
    showProgress()
    const res = await updateWorkOrderStatus(id, "O")
    if (res.status === 200) {
      dismissAlert()
      window.location.reload()
    }
  }

  const renderElectrical = () => {
    return (
      <ElectricalList
        data={data}
        serviceEquipmentOptions={serviceEquipmentOptions}
        requestCode={requestCode}
        options={{
          showCardCollapse: false,
          isReadOnly: true
        }}
      />
    );
  };

  const renderBusinessType = () => {
    return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md ">
        <BusinessType
          data={data || {} as WorkOrderObj}
          updateData={setData}
          onUpdateOptions={setBusinessTypeOptions}
          businessOptions={businessTypeOptions}
        />
      </div>
    );
  };

  const renderTransformerList = () => {
    return (
      <TransformerList
        data={data || {} as WorkOrderObj}
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
            businessTypeOptions={businessTypeOptions}
            data={data || {} as WorkOrderObj}
          />
        );
      case "s332-solar-battery":
        return (
          <div>
            <InverterComponent data={data}/>

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
            <DistanceComponent data={data}/>

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
            />

            <EnergySource options={renewableTypeOptions}
                          data={data || {} as WorkOrderObj}
            />

            <SurveyPeriod data={data || {} as WorkOrderObj}/>
          </div>
        );
    }
  }

  return (
    <div>
      <div className="flex flex-wrap justify-center items-center md:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#671FAB]">
            {data.workOrderNo}
          </h1>
          <LatestUpdateData showConnectInfo={false}/>
        </div>

        <div className="flex gap-3 mb-5">
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
              <DropdownMenuItem>สร้างใบคำร้องใหม่</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className="bg-[#E1D2FF] rounded-full justify-center items-center h-[44px] w-[44px] p-0"
            variant="outline"
            onClick={handleHistory}
          >
            <FontAwesomeIcon icon={faClock} color={"#671FAB"} size={"lg"} />
          </Button>
        </div>
      </div>

      <div className="w-full">
        {/* Work Order Detail */}
        <WorkOrderInfo data={data}
                       status={renderStatusWorkOrder(data.workOrderStatusCode)}
                       mainWorkCenterOptions={mainWorkCenterOptions}
        />

        {/* Customer and Worker Info */}
        <CustomerAndWorkerInfo
          data={data}
          eventOptions={eventOptions}
          workCenterOptions={mainWorkCenterOptions}
          workerOptions={workerOptions}
        />

        <CardCollapse title={"ข้อมูลคำร้อง"}>
          {renderByService()}
        </CardCollapse>

        <MaterialEquipmentChecklistPage
          data={data.materialEquipments || []}
          options={{
            isReadOnly: true
          }}
        />
      </div>

      <div className="flex flex-wrap justify-between items-center">
        <div className="w-full md:w-auto">
          <Button className="rounded-full text-[#A6A6A6] border-1 border-[#A6A6A6] bg-white hover:bg-white cursor-pointer w-full md:w-auto">
            ยกเลิก
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto md:mt-0 mt-3">
          <div className="w-full md:w-auto">
            <Button className="rounded-full text-[#671FAB] bg-white border-1 hover:bg-white border-[#671FAB] cursor-pointer w-full md:w-auto">
              <FontAwesomeIcon icon={faPrint} className="mr-2" />
              พิมพ์เอกสาร
            </Button>
          </div>

          {
            ['M', 'O', 'K'].includes(data.workOrderStatusCode) &&
              <div className="w-full md:w-auto">
                <Button className="rounded-full text-[#671FAB] bg-white cursor-pointer hover:bg-white border-1 border-[#671FAB] w-full md:w-auto"
                        onClick={() => handleEdit()}
                >
                  แก้ไข
                </Button>
              </div>
          }

          <div className="w-full md:w-auto">
            {
              data.workOrderStatusCode === 'O' ?
                <Button className="rounded-full text-white bg-[#671FAB] hover:bg-[#671FAB] cursor-pointer w-full md:w-auto"
                        onClick={() => handleRecordResult()}
                >
                  บันทึกผล
                </Button>
                : data.workOrderStatusCode === 'M' ?
                  <Button className="rounded-full text-white bg-[#671FAB] hover:bg-[#671FAB] cursor-pointer w-full md:w-auto"
                          onClick={() => handleConfirmStart()}
                  >
                    เริ่มปฏิบัติงาน
                  </Button>
                  : ''
            }
          </div>
        </div>
      </div>

      <ModalConfirm open={isShowConfirmStart}
                    onCancel={() => setIsShowConfirmStart(false)}
                    onSubmit={submitConfirmStart}
                    confirmText="เริ่มปฏิบัติงาน"
                    title="เริ่มปฏิบัติงาน?"
                    message="ท่านต้องการเริ่มปฏิบัติงาน ‘ใช่ หรือ ไม่’ "
                    icon={<div className="relative">
                      <img src={PopupStartWork.src} alt="start work image" className="w-[120px] h-[110px]"/>
                    </div>}
      />
    </div>
  )
}

export default WorkOrderDetail;
