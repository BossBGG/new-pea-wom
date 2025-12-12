import {ColumnDef, Table} from "@tanstack/react-table";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {EditableSelectCell} from "@/app/components/editor-table/EditableSelectCell";
import {Options, ResponsiblePersonObj} from "@/types";
import { faCheckCircle, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";


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

const asTypedTable = (table: Table<ResponsiblePersonObj>): TypedTable =>
  table as TypedTable;

export const getResponsiblePersonColumns = (
  assigneeOptions: Options[],
  onUpdate: (value: string | number, item: ResponsiblePersonObj) => void,
  disabled: boolean
): ColumnDef<ResponsiblePersonObj>[] => {

  return [
    {
      accessorKey: "no",
      header: "ลำดับ",
      cell: ({row}) => {
        return <div className="text-center">{row.index + 1}</div>
      },
      maxSize: 5
    },
    {
      accessorKey: "username",
      header: "พนักงานรับผิดชอบเบิก/คืนวัสดุอุปกรณ์",
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return <EditableSelectCell
            columnValue={row.original.username as string || ''}
            row={row}
            column={{id: 'username'}}
            table={asTypedTable(table)}
            options={assigneeOptions}
            placeholder={'พนักงาน'}
            onUpdate={onUpdate}
            disabled={disabled}
          />
        } else {
          return assigneeOptions.find(option => option.value === row.original.username)?.label || ''
        }
      }
    }
  ]
}
