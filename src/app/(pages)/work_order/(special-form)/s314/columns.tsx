import {ColumnDef, Table} from "@tanstack/react-table";
import {EditableTextCell} from "@/app/components/editor-table/EditableTextCell";
import {Insulator, S314CableServiceData} from "@/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faPencil, faTrashCan} from "@fortawesome/free-solid-svg-icons";

interface TableMeta {
  handleRemoveRow?: (index: number, id: number) => void;
  handleEditRow?: (index: number, isUpdate: boolean, isEdited: boolean, table: unknown) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

type TypedTable = Table<S314CableServiceData> & {
  options: {
    meta?: TableMeta;
  };
};
interface CustomTable {
  options: {
    meta?: TableMeta;
  };
}
const asTypedTable = (table: Table<S314CableServiceData>): TypedTable =>
    table as TypedTable;
const deleteData = (index: number, id: number, table: CustomTable) => {
  table.options.meta?.handleRemoveRow?.(index, id)
}

const updateData = (index: number, isUpdate: boolean, isEdited: boolean, table: CustomTable) => {
  const is_edit = isUpdate ? true : isEdited
  table.options.meta?.handleEditRow?.(index, isUpdate, is_edit, table);
}

export const columns: ColumnDef<S314CableServiceData>[] = [
  {
    accessorKey: "no",
    header: "ลำดับที่",
    cell: ({row}) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    maxSize: 5
  },
  {
    accessorKey: "cableInsulator",
    header: "ประเภทฉนวนครอบสายไฟฟ้า",
    cell: ({row, table}) => {
      if (row.original.isUpdate) {
        return <EditableTextCell
          row={row}
          column={{id: 'cableInsulator'}}
          table={asTypedTable(table)}
          columnValue={row.getValue('cableInsulator') || ''}
          placeholder={"ประเภท"}
        />
      } else {
        return row.getValue('cableInsulator') || '';
      }
    }
  },
  {
    accessorKey: "amount",
    header: "จำนวน",
    cell: ({row, table}) => {
      if (row.original.isUpdate) {
        return <EditableTextCell
          row={row}
          column={{id: 'amount'}}
          table={asTypedTable(table)}
          columnValue={row.original.amount || ""}
          numberOnly={true}
          placeholder={"จำนวน"}
        />
      } else {
        return row.getValue('amount')
      }
    }
  },
  {
    id: "action",
    accessorKey: "action",
    header: "",
    enableSorting: false,
    maxSize: 5,
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
          onClick={() => deleteData(row.index, 0, asTypedTable(table))}>
          <FontAwesomeIcon icon={faTrashCan} size={"sm"} color="#E02424"/>
        </button>
      </div>
    }
  }
]
