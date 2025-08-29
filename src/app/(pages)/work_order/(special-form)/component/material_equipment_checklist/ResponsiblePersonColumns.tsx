import {ColumnDef, Table} from "@tanstack/react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {EditableSelectCell} from "@/app/components/editor-table/EditableSelectCell";
import {Options} from "@/types";
import { faCheckCircle, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";


const responsiblePersonOptions: Options[] = [
  {label: '4828375 - นายจำนงค์ องอาจ', value: 'emp_001'},
  {label: '4828379 - นายมานะ ในมนตรี', value: 'emp_002'},
  {label: '6728379 - นาจอนห์ มานะ', value: 'emp_003'},
];


export interface ResponsiblePersonObj {
  id: number;
  responsiblePerson: string;
  isUpdate: boolean;
  isEdited: boolean;
}

interface TableMeta {
  handleRemoveRow?: (index: number, id: number) => void;
  handleEditRow?: (index: number, isUpdate: boolean, isEdit: boolean, table: unknown) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

type TypedTable = Table<ResponsiblePersonObj> & {
  options: {
    meta?: TableMeta;
  };
};

interface CustomTable {
  options: {
    meta?: TableMeta;
  };
}

const asTypedTable = (table: Table<ResponsiblePersonObj>): TypedTable => 
  table as TypedTable;

export const getResponsiblePersonColumns = (): ColumnDef<ResponsiblePersonObj>[] => {
 
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
      header: "ลำดับ",
      cell: ({row, table}) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <div className="text-center">{(pageIndex * pageSize) + row.index + 1}</div>
      },
    },
    {
      accessorKey: "responsiblePerson",
      header: "พนักงานรับผิดชอบเบิก/คืนวัสดุอุปกรณ์",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell 
            columnValue={row.original.responsiblePerson || ''}
            row={row}
            column={{id: 'responsiblePerson'}}
            table={asTypedTable(table)}
            options={responsiblePersonOptions}
            placeholder={'พนักงาน'}
          />
        } else {
          const selectedOption = responsiblePersonOptions.find(
            option => option.value === row.original.responsiblePerson
          );
          return <div className="text-sm">
            {selectedOption ? selectedOption.label : 'ไม่ได้ระบุ'}
          </div>;
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