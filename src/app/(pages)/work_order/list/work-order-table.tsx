import InputSearch from "@/app/components/form/InputSearch";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFile, faFileImport, faPencil, faSearch} from "@fortawesome/free-solid-svg-icons";
import {Card} from "@/components/ui/card";
import React, {useRef, useState} from "react";
import {DataTable} from "@/app/components/list/DataTable";
import {ColumnDef, Row} from "@tanstack/react-table";
import {Options, SubServiceType, WorkOrderObj} from "@/types";
import {WorkOrderList, WorkOrderListByOffice} from "@/app/api/WorkOrderApi";
import {useAppSelector} from "@/app/redux/hook";
import {showConfirm} from "@/app/helpers/Alert";
import Link from "next/link";

const getColumns = (
  onCheck: (checked: boolean, val: string) => void,
  ServiceTypeOptions: Options[]
): ColumnDef<WorkOrderObj>[] => {

  const getPathEditWorkOrder = (status: string, row: Row<WorkOrderObj>, requestCode: string) => {
    let params = new URLSearchParams({
      id: row.original.id as string,
      workOrderNo: row.original.workOrderNo as string,
      requestCode: requestCode as string,
    });

    switch (status) {
      case 'M':
        return `/work_order/${row.original.id}`
      case 'O':
        params.append('isExecute', "true")
        return `/work_order/create_or_update?${params.toString()}`
      default:
        params.append('isEdit', "true")
        return `/work_order/create_or_update?${params.toString()}`
    }
  }

  return [
    {
      accessorKey: 'id',
      header: "",
      cell: ({row}) => {
        return <Checkbox key={row.id}
                         onCheckedChange={(check: boolean) => onCheck(check, row.id)}
                         className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA] cursor-pointer"
        />
      },
      enableSorting: false,
      minSize: 30,
      maxSize: 30
    },
    {
      accessorKey: 'index',
      header: "ลำดับที่",
      cell: ({row, table}) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <div className="text-center">{(pageIndex * pageSize) + row.index + 1}</div>
      },
      enableSorting: false,
      minSize: 40,
      maxSize: 40
    },
    {
      accessorKey: 'customerRequestNo',
      header: "เลขที่คำร้อง",
      cell: ({row}) => {
        return row.original.customerRequestNo || '-'
      },
    },
    {
      accessorKey: 'workOrderNo',
      header: "เลขที่ใบสั่งงาน"
    },
    {
      accessorKey: 'customerName',
      header: "ชื่อลูกค้า",
      cell: ({row}) => {
        return row.original.customerName || '-'
      },
    },
    {
      accessorKey: 'serviceType',
      header: "ประเภทคำร้อง"
    },
    {
      accessorKey: 'workType',
      header: "ประเภทงาน"
    },
    {
      accessorKey: 'isSurvey',
      header: "ประเภทใบสั่งงาน",
      minSize: 90,
      maxSize: 90,
      cell: ({row}) => {
        return (
          <div className="rounded-full text-center px-3 py-2 font-medium text-[12px]"
               style={row.original.isSurvey ? {background: '#FDE5B6'} : {background: '#E1D2FF'}}
          >
            {row.original.isSurvey ? 'งานสำรวจ' : 'งานปฏิบัติงาน'}
          </div>
        )
      }
    },
    {
      accessorKey: "action",
      header: "",
      enableSorting: false,
      minSize: 60,
      maxSize: 60,
      cell: ({row}) => {
        let service: Options = {} as Options
        ServiceTypeOptions.map((ser) => {
          let findService = ser.subOptions?.find((sub) => sub.value === row.original.requestCode)
          if(findService) service = findService
        })

        if(service) {
          const requestCode = (service.value as string)?.toLowerCase();
          const status = row.original.statusCode
          const editPath = getPathEditWorkOrder(status, row, requestCode)
          return <div className="flex items-center">
            <Link className="bg-[#BEE2FF] rounded-sm px-2 py-1 mr-2"
                  href={`/work_order/create_or_update?id=${row.original.id}&workOrderNo=${row.original.workOrderNo}&requestCode=${requestCode}&isView=true`}>
              <FontAwesomeIcon icon={faFile} color="#03A9F4"/>
            </Link>

            <Link href={editPath}
                  className="bg-[#FDE5B6] rounded-sm px-2 py-1">
              <FontAwesomeIcon icon={faPencil} color="#F9AC12"/>
            </Link>
          </div>
        }

        return ""
      }
    },
  ]

}

type WorkOrderTableProps = {
  viewMode: "SELF" | "ALL"
}

const WorkOrderTable: React.FC<WorkOrderTableProps> = ({viewMode}) => {
  const [search, setSearch] = useState<string>("")
  const user = useAppSelector(state => state.user)
  const [selected, setSelected] = useState<string[]>([])
  const ServiceTypeOptions = useAppSelector((state) => state.options.serviceTypeOptions)

  const onSearch = () => {

  }

  const handleSelectAll = () => {

  }

  const onCheckWorkOrder = (checked: boolean, value: string) => {
    if(checked) {
      setSelected((prev) => ({...prev, value}))
    }else {
      setSelected(selected.filter((sel) => sel !== value))
    }
  }

  const onComplete = () => {
    showConfirm("ยืนยันการทำรายการหรือไม่ ?").then((isConfirm) => {
      if (isConfirm) {
        //TODO call api complete work order
      }
    })
  }

  return (
    <Card className="p-4">
      <InputSearch value={search}
                   handleSearch={onSearch}
                   setValue={setSearch}
                   placeholder="ค้นหาโดยเลขที่คำร้อง เลขที่ใบสั่งงาน และชื่อลูกค้า"
      />

      <div className="flex justify-between items-center">
        <Label htmlFor="all" className="font-semibold">
          <Checkbox id="all"
                    className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA] cursor-pointer"
                    onCheckedChange={handleSelectAll}
          />
          ทั้งหมด
        </Label>

        <div>
          <button className="bg-[#298267] rounded-full p-3 text-white mr-2"
                  onClick={() => onComplete()}
          >
            จบงาน
          </button>

          <button className="pea-button-outline">
            <FontAwesomeIcon icon={faFileImport} className="mr-2"/>
            ส่งออกเอกสาร
          </button>
        </div>
      </div>

      <div>
        <DataTable columns={
          getColumns(
            (checked: boolean, val: string) => onCheckWorkOrder(checked, val),
            ServiceTypeOptions
          )
        }
                   tableApi={viewMode === 'ALL' ? WorkOrderListByOffice(user.selectedPeaOffice) : WorkOrderList}
                   tableApiData={{}}
                   emptyData={
                     <div className="text-center text-[18px] text-gray-500">
                       ไม่พบรายการใบสั่งงาน
                     </div>
                   }
        />
      </div>
    </Card>
  )
}

export default WorkOrderTable;
