import Modal from "@/app/layout/Modal";
import {Button} from "@/components/ui/button";
import InputRadio from "@/app/components/form/InputRadio";
import {Options, WorkOrderCreateItem, WorkOrderObj} from "@/types";
import React, {useEffect, useState} from "react";
import InputSelect from "@/app/components/form/InputSelect";
import {useRouter} from "next/navigation";
import {dismissAlert, showError, showProgress} from "@/app/helpers/Alert";
import {getPeaOfficeOptions, getServiceTypeOptions} from "@/app/api/WorkOrderOptions";
import InputSearch from "@/app/components/form/InputSearch";
import InputGroupCheckbox from "@/app/components/form/InputGroupCheckbox";
import ServiceTypeSelection from "@/app/(pages)/work_order/service-type-selection";
import {useAppSelector} from "@/app/redux/hook";
import ServiceRequestRefTable from "@/app/(pages)/work_order/reference_table/service-request-ref-table";
import WorkOrderRefTable from "@/app/(pages)/work_order/reference_table/work-order-ref-table";
import ListOrderReference from "@/app/(pages)/work_order/reference_list/list-order-reference";
import {DraftWorkOrder} from "@/app/api/WorkOrderApi";
import {clearCustomerRequestData} from "@/app/redux/slices/CustomerRequestSlice";

interface ModalNewWorkOrderProps {
  open: boolean,
  onClose: () => void,
  workOrderType: 'ref_service_req' | 'not_reference' | 'ref_work_order',
}

const FooterModal = ({
                       cancel,
                       submit
                     }:
                     {
                       cancel: () => void,
                       submit: () => void,
                     }) => (
  <div className="w-full flex flex-wrap justify-between items-center">
    <div className="p-2 w-1/2">
      <Button
        className="text-[#671FAB] w-full bg-white border-1 border-[#671FAB] rounded-full font-semibold md:text-start text-center cursor-pointer hover:bg-white"
        onClick={() => cancel()}
      >
        ยกเลิก
      </Button>
    </div>
    <div className="p-2 w-1/2">
      <Button className="pea-button w-full" onClick={() => submit()}>
        สร้างใบสั่งงาน
      </Button>
    </div>
  </div>
)

const ModalNewWorkOrder = ({
                             open,
                             onClose,
                             workOrderType
                           }: ModalNewWorkOrderProps) => {
  const router = useRouter()
  const [serviceTypeOptions, setServiceTypeOptions] = useState<Options[]>([])
  const [organizationTypeOptions, setOrganizationTypeOptions] = useState<Options[]>([])
  const screen_size = useAppSelector((state) => state.screen_size)

  useEffect(() => {
    Promise.all([
      fetchServiceTypeOptions(),
      fetchPeaOfficeOptions()
    ]).then(([resServiceType, resOrgType]) => {
      let service_type_options = resServiceType || []
      let org_type_options = resOrgType || []
      setServiceTypeOptions(service_type_options)
      setOrganizationTypeOptions(org_type_options)
    })
  }, []);

  const fetchServiceTypeOptions = async () => {
    const resp = await getServiceTypeOptions();
    if (resp.status === 200 && resp.data.data && resp.data.data.serviceGroups) {
      let options: Options[] = []
      resp.data.data.serviceGroups.map((item) => {
        let sub_options = item.services?.map((sub) => {
          return {value: sub.id, label: `${sub.requestCode} ${sub.name}`, data: sub}
        })

        let option: Options = {
          value: item.id,
          label: item.name,
          subOptions: sub_options
        }

        options.push(option)
      })

      return options
    }
    return []
  }

  const fetchPeaOfficeOptions = async () => {
    const resp = await getPeaOfficeOptions();
    if (resp.status === 200 && resp.data.data) {
      let org_data = resp.data.data.data;
      let options: Options[] = []
      org_data.map((item) => {
        let sub_options = item.children?.map((sub) => {
          let childrens: Options[] = []
          sub.children?.map((sub) => {
            childrens.push({
              value: sub.id,
              label: sub.office ? `${sub.name} [${sub.office}]` : sub.name,
              data: sub,
            })
          })

          return {
            value: sub.id,
            label: sub.office ? `${sub.name} [${sub.office}]` : sub.name,
            data: sub,
            subOptions: childrens
          }
        })

        let option: Options = {
          value: item.id,
          label: item.name,
          subOptions: sub_options
        }

        options.push(option)
      })

      return options
    }
    return []
  }

  const workOrderTypeOptions: Options[] = [
    {label: 'ใบสั่งงาน', value: 'single', description: 'สร้างใบสั่งงานแบบใบเดียว'},
    {label: 'ใบสั่งงานเป็นชุด', value: 'bulk', description: 'สร้างใบสั่งงานแบบหลายใบ'},
  ]

  const [data, setData] = useState<WorkOrderCreateItem>({
    serviceId: "",
    workOrderType: "single"
  })

  const [search, setSearch] = useState<string>("")

  const submit = async () => {
    if (!data.serviceId && workOrderType === "not_reference") {
      dismissAlert()
      alert('กรุณาเลือกประเภทงานบริการ')
      return
    }

    showProgress()
    let item: WorkOrderCreateItem = {
      serviceId: data.serviceId,
      workOrderType: data.workOrderType,
    }

    if(workOrderType === "ref_service_req") {
      item = { ...item, customerRequestNo: data.customerRequestNo }
    } else if (workOrderType === "ref_work_order") {
      item = { ...item, workOrderParentId: "" }
    }

    const res = await DraftWorkOrder(item)
    if(res.data.status_code === 201) {
      let service: string | null = data.requestCode?.toLowerCase() || null;
      if(!res.data.data?.customerRequestNo) {
        clearCustomerRequestData()
      }

      if(!service) {
        serviceTypeOptions.map((ser) => {
          if(ser.subOptions) {
            const subService = ser.subOptions.find((sub) => sub.data.id === data.serviceId)
            if(subService) {
              service = subService.data.requestCode.toLowerCase()
            }
          }
        })
      }

      if(service) {
        const params = new URLSearchParams({
          id: res.data.data?.id as string,
          requestCode: service as string,
          workOrderNo: res.data.data?.workOrderNo  as string
        })

        router.push(`/work_order/create_or_update?${params.toString()}`)
      }else {
        showError('ไม่สามารถสร้างใบคำร้องได้ เนื่องจากไม่พบประเภทบริการ')
      }
      dismissAlert()
    }else {
      console.log('res.data >>>', res)
      showError(res.data.message || '')
    }
  }

  useEffect(() => {
    console.log('serviceTypeOptions >>> ', serviceTypeOptions)
    if (!data.workOrderType) {
      setData(prevState => ({...prevState, workOrderType: "single"}));
    }
  }, [])

  const handleUpdateData = (key: string, value: string | number | string[]) => {
    setData(prevState => ({...prevState, [key]: value}));
    if(key === 'serviceId') {

    }
  }

  useEffect(() => {
    if (!data.serviceTypes) {
      handleUpdateData('serviceTypes', [])
    }
  });

  const onSearch = () => {

  }

  const renderTitle = () => {
    switch (workOrderType) {
      case "ref_service_req":
        return 'สร้างใบสั่งงาน อ้างอิงใบคำร้อง'
      case "ref_work_order":
        return 'สร้างใบสั่งงานย่อย อ้างอิงใบสั่งงานหลัก'
      default:
        return 'สร้างใบสั่งงานใหม่'
    }
  }

  const handleClose = () => {
    setData({
      serviceId: "",
      workOrderType: "single",
      customerRequestNo: ""
    } as WorkOrderCreateItem);
    onClose()
  }

  return (
    <Modal title={renderTitle()}
           open={open}
           onClose={() => handleClose()}
           footer={<FooterModal cancel={() => handleClose()} submit={() => submit()}/>}
           classContent="w-[80%] xl:w-[60%] 2xl:w-[45%] !max-w-[80%]"
    >
     <div className="w-full">
       <InputRadio label="เลือกประเภทการสร้างใบงาน"
                   options={workOrderTypeOptions}
                   value={data.workOrderType as string || workOrderTypeOptions[0].value as string}
                   setData={(v: string) => handleUpdateData('workOrderType', v)}
                   classItem="rounded-[12px] p-3 w-full border-1"
                   classItemChecked="border-1 border-[#671FAB]"
                   classLabel="flex flex-col items-start"
                   className="flex"
       />

       {
         data.workOrderType === "single" ?
           <div>
             {
               ["ref_service_req", "ref_work_order"].includes(workOrderType) &&
               <div>
                 <div className="my-2">
                   {
                     workOrderType === 'ref_service_req'
                       ? 'ค้นหาเลขที่ใบคำร้อง'
                       : 'ค้นหาเลขที่ใบสั่งงาน'
                   }
                 </div>
                 <InputSearch value={search}
                              handleSearch={onSearch}
                              setValue={setSearch}
                              placeholder={workOrderType === 'ref_service_req' ? 'ค้นหาเลขที่ใบคำร้อง' : 'ค้นหาเลขที่ใบสั่งงาน'}
                 />
               </div>
             }

             {
               workOrderType !== "not_reference" &&
               <div className="my-3">
                 {/*ประเภทงานบริการ*/}
                 <ServiceTypeSelection options={serviceTypeOptions}
                                       setData={(services: string[]) => handleUpdateData('serviceTypes', services)}
                                       selected={data.serviceTypes || []}
                 />
               </div>
             }

             {
               workOrderType === "ref_service_req" &&
               <div className="my-3 w-full">
                 {
                   screen_size !== "mobile"
                     ? <ServiceRequestRefTable data={data}
                                               updateData={setData}
                                               search={search}
                     />
                     : <ListOrderReference/>
                 }
               </div>
             }

             {
               workOrderType === "ref_work_order" &&
               <div className="my-3 w-full">
                 { screen_size !== "mobile" && <WorkOrderRefTable/> }
               </div>
             }

             {
               workOrderType === "not_reference" &&
               <div className="my-3 w-full">
                 <InputSelect options={serviceTypeOptions}
                              value={data.serviceId}
                              placeholder="เลือกประเภทงานบริการ"
                              setData={(v: string | number) => handleUpdateData('serviceId', v)}
                              label="ประเภทงานบริการ"
                 />
               </div>
             }
           </div>
           :
           <div className="mt-3">
             <div>เลือกหน่วยงาน</div>
             <InputGroupCheckbox options={organizationTypeOptions}
                                 setData={(d: string[]) => handleUpdateData('organization', d)}
             />
           </div>

       }
     </div>
    </Modal>
  )
}

export default ModalNewWorkOrder;
