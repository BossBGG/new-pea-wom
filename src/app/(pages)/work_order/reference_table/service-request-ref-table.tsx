import React from "react";
import {DataTable} from "@/app/components/list/DataTable";
import {ColumnDef} from "@tanstack/react-table";
import {Options, ServiceRequest} from "@/types";
import {ServiceRequestRefList} from "@/app/api/WorkOrderApi";
import {useAppSelector} from "@/app/redux/hook";
import {formatJSDateTH} from "@/app/helpers/DatetimeHelper";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faPlus} from "@fortawesome/free-solid-svg-icons";

const renderColumns = (
  serviceTypeOptions: Options[],
  setSelected: (sel: string | null) => void,
  selected: string | null
): ColumnDef<ServiceRequest>[] => [
  {
    accessorKey: "id",
    header: "#",
    cell: ({row}) => {
      const isSelected = selected === row.getValue("id")
      return <Button className={`text-[14px] text-white cursor-pointer ${isSelected ? 'bg-[#F9AC12] hover:bg-[#F9AC12]' : 'bg-[#671FAB] hover:bg-[#671FAB]'}`}
                     size="sm"
                     onClick={() => setSelected(row.getValue("id"))}>
        { isSelected ? <FontAwesomeIcon icon={faCheck}/> : <FontAwesomeIcon icon={faPlus}/> }
        เลือก
      </Button>
    },
    maxSize: 55,
    enableSorting: false
  },
  {
    accessorKey: "requestNo",
    header: "เลขที่คำร้อง",
    cell: ({row}) => row.getValue('requestNo'),
    maxSize: 100,
  },
  {
    accessorKey: "customerName",
    header: "ชื่อลูกค้า",
    cell: ({row}) => (
      <div className="whitespace-pre-wrap">{row.getValue('customerName')}</div>
    ),
    maxSize: 120
  },
  {
    accessorKey: "serviceType",
    header: "ประเภทงานบริการ",
    cell: ({row}) => {
      const value = row.getValue('serviceType')
      let service_type = "-"
      serviceTypeOptions.map((service) => {
        if (service.value === value) {
          service_type = service.label
        }

        if (service.subOptions && service.subOptions.length > 0) {
          const option = service.subOptions?.find((sub) => sub.data.id === value)
          if (option) service_type = option.data.name
        }
      })

      return service_type
    },
    maxSize: 120
  },
  {
    accessorKey: "createdDate",
    header: "วันที่รับคำร้อง",
    cell: ({row}) => {
      if (!row.getValue("createdDate")) return '-'
      return formatJSDateTH(new Date(row.getValue('createdDate')), 'dd MMMM yyyy')
    },
    maxSize: 100
  }
]

const EmpTyData = (): React.ReactNode => {
  return <div className="flex flex-col justify-center items-center p-4">
    <div className="font-bold text-[24px] mt-5">ไม่พบรายการใบคำร้อง</div>
  </div>
}

const ServiceRequestRefTable = () => {
  const serviceTypeOptions = useAppSelector((state) => state.options.serviceTypeOptions);
  const [serviceType, setServiceType] = React.useState<string | null>(null);

  return (
    <DataTable columns={
      renderColumns(
        serviceTypeOptions,
        (service: string | null) => setServiceType(service),
        serviceType
      )}
               tableApi={ServiceRequestRefList}
               tableApiData={{}}
               emptyData={<EmpTyData/>}
    />
  )
}

export default ServiceRequestRefTable;
