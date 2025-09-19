import {ColumnDef, Table} from "@tanstack/react-table";
import {EditableTextCell} from "@/app/components/editor-table/EditableTextCell";
import {Insulator} from "@/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faPencil, faTrashCan} from "@fortawesome/free-solid-svg-icons";

interface TableMeta {
  handleRemoveRow?: (index: number, id: number) => void;
  handleEditRow?: (index: number, isUpdate: boolean, isEdited: boolean, table: unknown) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

type TypedTable = Table<Insulator> & {
  options: {
    meta?: TableMeta;
  };
};
interface CustomTable {
  options: {
    meta?: TableMeta;
  };
}
const asTypedTable = (table: Table<Insulator>): TypedTable => 
    table as TypedTable;
const deleteData = (index: number, id: number, table: CustomTable) => {
  table.options.meta?.handleRemoveRow?.(index, id)
}

const updateData = (index: number, isUpdate: boolean, isEdited: boolean, table: CustomTable) => {
  const is_edit = isUpdate ? true : isEdited
  table.options.meta?.handleEditRow?.(index, isUpdate, is_edit, table);
}

const baseColumns: ColumnDef<Insulator>[] = [
  {
    accessorKey: "no",
    header: "ลำดับที่",

    cell: ({row}) => {
      return <div className="text-center">{row.index + 1}</div>
    },
  },
  {
    accessorKey: "name",
    header: "ประเภทฉนวนครอบสายไฟฟ้า",
    cell: ({row, table}) => {
      if (row.original.isUpdate) {
        return <EditableTextCell 
          row={row}
          column={{id: 'name'}}
          table={asTypedTable(table)}
          columnValue={row.getValue('name') || ''}
        />
      } else {
        return row.getValue('name') || '';
      }
    }
  },
  {
    accessorKey: "quantity",
    header: "จำนวน",
    cell: ({row, table}) => {
      if (row.original.isUpdate) {
        return <EditableTextCell 
          row={row}
          column={{id: 'quantity'}}
          table={asTypedTable(table)}
          columnValue={row.original.quantity}
          numberOnly={true}
        />
      } else {
        return row.getValue('quantity')
      }
    }
  },
]

const actionColumn: ColumnDef<Insulator> = {
  id: "action",
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
};

// Full columns with action
export const columns: ColumnDef<Insulator>[] = [...baseColumns, actionColumn];

// Columns without action (for read-only views)
export const columnsWithoutAction: ColumnDef<Insulator>[] = baseColumns;
