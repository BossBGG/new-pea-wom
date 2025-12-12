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
import InputDateTimePicker from "@/app/components/form/InputDateTimePicker";
import React from "react";
import {formatJSDateTH} from "@/app/helpers/DatetimeHelper";

interface TableMeta {
  handleRemoveRow?: (index: number, id: number) => void;
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

  const handleDateChange = (key: "startDatetime" | "endDatetime", value: Date | undefined, index: number, table: CustomTable) => {
    table.options.meta?.updateData(index, key, value)
  }

  const getDateValue = (dateValue: Date | string | undefined): Date | undefined => {
    if (!dateValue) return undefined;
    if (dateValue instanceof Date) return dateValue;
    return new Date(dateValue);
  };

  return [
    {
      id: "userType",
      accessorKey: "userType",
      header: "กลุ่มผู้ปฏิบัติงาน",
      maxSize: 150,
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
      minSize: 200,
      maxSize: 200,
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
          return <div
            className="text-wrap">{selectedOption ? selectedOption.label : (row.original.username || '-')}</div>
        }
      }
    },
    {
      id: "workCenterId",
      accessorKey: "workCenterId",
      header: "ศูนย์งานหลัก",
      minSize: 250,
      maxSize: 250,
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
          return <div className="text-wrap">
            {mainWorkCenterOptions.find((opt) => opt.value == row.original.workCenterId)?.label || ''}
          </div>
        }
      }
    },
    {
      id: "workActivityTypeId",
      accessorKey: "workActivityTypeId",
      header: "กิจกรรม",
      minSize: 250,
      maxSize: 250,
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
          return <div
            className="text-wrap">{selectedOption ? selectedOption.label : (row.original.workActivityTypeId || '-')}</div>
        }
      }
    },
    {
      id: "startDatetime",
      accessorKey: "startDatetime",
      header: "วันที่และเวลาเริ่มต้น",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return (
            <InputDateTimePicker value={getDateValue(row.original.startDatetime)}
                                 onChange={(v) => handleDateChange("startDatetime", v, row.index, table as CustomTable)}
                                 placeholder={"วันที่และเวลาเริ่มต้น"}
                                 showConfirmButton={true}
            />
          )
        } else {
          return row.original.startDatetime ? formatJSDateTH(new Date(row.original.startDatetime), 'dd MMMM yyyy, HH:mm น.') : "-"
        }
      }
    },
    {
      id: "endDatetime",
      accessorKey: "endDatetime",
      header: "วันที่และเวลาสิ้นสุด",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return (
            <InputDateTimePicker value={getDateValue(row.original.endDatetime)}
                                 onChange={(v) => handleDateChange("endDatetime", v, row.index, table as CustomTable)}
                                 placeholder={"วันที่และเวลาสิ้นสุด"}
                                 showConfirmButton={true}
            />
          )
        } else {
          return row.original.endDatetime ? formatJSDateTH(new Date(row.original.endDatetime), 'dd MMMM yyyy, HH:mm น.') : "-"
        }
      }
    },
    {
      id: "workHours",
      accessorKey: "workHours",
      header: "ชั่วโมง/งาน",
      minSize: 95,
      maxSize: 95,
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
      minSize: 60,
      maxSize: 60
    },
    {
      id: "action",
      header: "",
      enableSorting: false,
      maxSize: 70,
      cell: ({row, table}) => {
        return <div className="flex justify-end">
          {
            row.original.isUpdate ?
              <button
                className="bg-[#C8F9E9] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
                onClick={() => updateData(row.index, false, row.original.isEdited || false, asTypedTable(table))}
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
