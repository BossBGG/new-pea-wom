import {ColumnDef, Table} from "@tanstack/react-table";
import {Options, Event, Assignee, MainWorkCenter} from "@/types";
import {EditableSelectCell} from "@/app/components/editor-table/EditableSelectCell";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faPencil, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {EditableTextCell} from "@/app/components/editor-table/EditableTextCell";
import handleSearchEvent from "@/app/helpers/SearchEvent";
import handleSearchMainWorkCenter from "@/app/helpers/SearchMainWorkCenter";
import {getWorkerListOptions} from "@/app/helpers/WorkerOptions";
import {groupWorkerOptions} from "@/app/api/WorkOrderApi";

interface TableMeta {
  handleRemoveRow? : (index: number, id: number) => void;
  handleEditRow?: (index: number, isUpdate: boolean, isEdit: boolean, table: unknown) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  getDataCallback: () => void;
}

type TypedTable = Table<Assignee> & {
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
  workerOptions: Options[],
  eventOptions: Options[],
  mainWorkCenterOptions: Options[],
  onUpdateEventOptions: (d: Options[]) => void,
  onUpdateWorkCenterOptions: (d: Options[]) => void,
  onUpdateWorkerOptions: (d: Options[]) => void,
): ColumnDef<Assignee>[] => {

  const asTypedTable = (table: Table<Assignee>): TypedTable =>
    table as TypedTable;
  const deleteData = (index: number, id: number, table: CustomTable) => {
    table.options.meta?.handleRemoveRow?.(index, id)
  }

  const updateData = (index: number, isUpdate: boolean, isEdited: boolean, table: CustomTable) => {
    const is_edit = isUpdate ? true : isEdited
    table.options.meta?.handleEditRow?.(index, isUpdate, is_edit, table);
  }

  const handleUpdateUserType = (v: string | number, table: CustomTable, index: number) => {
    setTimeout(() => {
      let value = v === 'peaUser' ? 'H' : 'Z05'
      table.options.meta?.updateData(index, 'workUnit', value)
    }, 500)
  }

  return [
    {
      id: "userType",
      accessorKey: "userType",
      header: "กลุ่มผู้ปฏิบัติงาน",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell columnValue={row.original.userType}
                                     row={row}
                                     column={{id: 'userType'}}
                                     table={asTypedTable(table)}
                                     options={groupWorkerOptions}
                                     onUpdate={(v: string | number, item: Options) => handleUpdateUserType(v, table as CustomTable, row.index)}
                                     placeholder={'กลุ่มผู้ปฏิบัติงาน'}/>
        } else {
           const selectedOption = groupWorkerOptions.find(item => item.value == row.original.userType);
          return selectedOption ? selectedOption.label : (row.original.userType || '-');
        }
      }
    },
    {
      id: "username",
      accessorKey: "username",
      header: "ผู้ปฏิบัติงาน",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell columnValue={row.original.username || ''}
                                     row={row}
                                     column={{id: 'username'}}
                                     table={asTypedTable(table)}
                                     options={workerOptions}
                                     onUpdateOptions={onUpdateWorkerOptions}
                                     onSearch={getWorkerListOptions}
                                     placeholder={'ผู้ปฏิบัติงาน'}/>
        } else {
          const selectedOption = workerOptions.find(item => item.value == row.original.username);
          return selectedOption ? selectedOption.label : (row.original.username || '-');
        }
      }
    },
    {
      id: "workCenterId",
      accessorKey: "workCenterId",
      header: "ศูนย์งานหลัก",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell columnValue={row.original.workCenterId || ''}
                                     row={row}
                                     column={{id: 'workCenterId'}}
                                     table={asTypedTable(table)}
                                     options={mainWorkCenterOptions}
                                     onSearch={(s: string) => handleSearchMainWorkCenter(s)}
                                     placeholder={'ศูนย์งานหลัก'}
                                     onUpdateOptions={onUpdateWorkCenterOptions}
          />
        } else {
          return mainWorkCenterOptions.find((opt) => opt.value == row.original.workCenterId)?.label || ''
        }
      }
    },
    {
      id: "workActivityTypeId",
      accessorKey: "workActivityTypeId",
      header: "กิจกรรม",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell columnValue={row.original.workActivityTypeId || ''}
                                     row={row}
                                     column={{id: 'workActivityTypeId'}}
                                     table={asTypedTable(table)}
                                     options={eventOptions}
                                     placeholder={'กิจกรรม'}
                                     onSearch={(s: string) => handleSearchEvent(s)}
                                     onUpdateOptions={onUpdateEventOptions}
          />
        } else {
          const selectedOption = eventOptions.find(item => item.value == row.original.workActivityTypeId);
          return selectedOption ? selectedOption.label : (row.original.workActivityTypeId || '-');
        }
      }
    },
    {
      id: "workHours",
      accessorKey: "workHours",
      header: "ชั่วโมง/งาน",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableTextCell row={row}
                                   column={{id: 'workHours'}}
                                   table={asTypedTable(table)}
                                   columnValue={row.original.workHours || ''}
                                   numberOnly={true}/>
        } else {
          return row.getValue('workHours')
        }
      }
    },
    {
      id: "workUnit",
      accessorKey: "workUnit",
      header: "หน่วย",
      /*cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableTextCell row={row}
                                   column={{id: 'workUnit'}}
                                   table={asTypedTable(table)}
                                   columnValue={row.original.workUnit || ''}/>
        } else {
          return row.getValue('workUnit')
        }
      }*/
    },
    {
      id: "action",
      header: "",
      enableSorting: false,
      cell: ({row, table}) => {
        return <div className="flex justify-center">
          {
            row.original.isUpdate ?
              <button
                className="bg-[#C8F9E9] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
                onClick={() => updateData(row.index, false, row.original.isEdited || false , asTypedTable(table))}
              >
                <FontAwesomeIcon icon={faCheckCircle} size={"sm"} color="#31C48D"/>
              </button>
              :
              <button
                className="bg-[#FDE5B6] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
                onClick={() => updateData(row.index, true, row.original.isEdited || false, asTypedTable(table))}
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
