import {ColumnDef, Table} from "@tanstack/react-table";
import {Options, WorkerObj} from "@/types";
import {EditableSelectCell} from "@/app/components/editor-table/EditableSelectCell";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faPencil, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {EditableTextCell} from "@/app/components/editor-table/EditableTextCell";

interface TableMeta {
  handleRemoveRow? : (index: number, id: number) => void;
  handleEditRow?: (index: number, isUpdate: boolean, isEdit: boolean, table: unknown) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

type TypedTable = Table<WorkerObj> & {
  options: {
    meta?: TableMeta;
  };
};

interface CustomTable {
  options: {
    meta?: TableMeta;
  };
}

export const getColumns = (
  groupWorkerOptions: Options[],
  workerOptions: Options[],
  eventOptions: Options[]
): ColumnDef<WorkerObj>[] => {

  const asTypedTable = (table: Table<WorkerObj>): TypedTable => 
    table as TypedTable;
  const deleteData = (index: number, id: number, table: CustomTable) => {
    table.options.meta?.handleRemoveRow?.(index, id)
  }

  const updateData = (index: number, isUpdate: boolean, isEdited: boolean, table: CustomTable) => {
    const is_edit = isUpdate ? true : isEdited
    table.options.meta?.handleEditRow?.(index, isUpdate, is_edit, table);
  }

  return [
    {
      accessorKey: "no",
      header: "ลำดับที่",
      cell: ({row}) => {
        return <div className="text-center">{row.index + 1}</div>
      },
    },
    {
      accessorKey: "group",
      header: "กลุ่มผู้ปฏิบัติงาน",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell columnValue={row.original.group}
                                     row={row}
                                     column={{id: 'group'}}
                                     table={asTypedTable(table)}
                                     options={groupWorkerOptions}
                                     placeholder={'กลุ่มผู้ปฏิบัติงาน'}/>
        } else {
           const selectedOption = groupWorkerOptions.find(item => item.value === row.original.group);
          return selectedOption ? selectedOption.label : (row.original.group || '-');
        }
      }
    },
    {
      accessorKey: "worker",
      header: "ผู้ปฏิบัติงาน",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell columnValue={row.original.worker || ''}
                                     row={row}
                                     column={{id: 'worker'}}
                                     table={asTypedTable(table)}
                                     options={workerOptions}
                                     placeholder={'ผู้ปฏิบัติงาน'}/>
        } else {
          const selectedOption = workerOptions.find(item => item.value === row.original.worker);
          return selectedOption ? selectedOption.label : (row.original.worker || '-');
        }
      }
    },
    {
      accessorKey: "operation_center",
      header: "ศูนย์งานหลัก",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableTextCell row={row}
                                   column={{id: 'operation_center'}}
                                   table={asTypedTable(table)}
                                   columnValue={row.original.operation_center}/>
        } else {
          return row.getValue('operation_center')
        }
      }
    },
    {
      accessorKey: "event",
      header: "กิจกรรม",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell columnValue={row.original.event || ''}
                                     row={row}
                                     column={{id: 'event'}}
                                     table={asTypedTable(table)}
                                     options={eventOptions}
                                     placeholder={'กิจกรรม'}/>
        } else {
          const selectedOption = eventOptions.find(item => item.value === row.original.event);
          return selectedOption ? selectedOption.label : (row.original.event || '-');
        }
      }
    },
    {
      accessorKey: "hours",
      header: "ชั่วโมง/งาน",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableTextCell row={row}
                                   column={{id: 'hours'}}
                                   table={asTypedTable(table)}
                                   columnValue={row.original.hours}
                                   numberOnly={true}/>
        } else {
          return row.getValue('hours')
        }
      }
    },
    {
      accessorKey: "unit",
      header: "หน่วย",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableTextCell row={row}
                                   column={{id: 'unit'}}
                                   table={asTypedTable(table)}
                                   columnValue={row.original.unit}/>
        } else {
          return row.getValue('unit')
        }
      }
    },
    {
      accessorKey: "action",
      header: "",
      enableSorting: false,
      cell: ({row, table}) => {
        return <div className="flex justify-center">
          {
            row.original.isUpdate ?
              <button
                className="bg-[#C8F9E9] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
                onClick={() => updateData(row.index, false, row.original.isEdited , asTypedTable(table))}
              >
                <FontAwesomeIcon icon={faCheckCircle} size={"sm"} color="#31C48D"/>
              </button>
              :
              <button
                className="bg-[#FDE5B6] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
                onClick={() => updateData(row.index, true, row.original.isEdited, asTypedTable(table))}
              >
                <FontAwesomeIcon icon={faPencil} size={"sm"} color="#F9AC12"/>
              </button>
          }

          <button
            className="bg-[#FFD4D4] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
            onClick={() => deleteData(row.index, row.original.id || 0, asTypedTable(table))}>
            <FontAwesomeIcon icon={faTrashCan} size={"sm"} color="#E02424"/>
          </button>
        </div>
      }
    },
  ]
}
