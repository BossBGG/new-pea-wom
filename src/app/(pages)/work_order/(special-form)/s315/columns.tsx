import { ColumnDef, Table } from "@tanstack/react-table";
import { EditableTextCell } from "@/app/components/editor-table/EditableTextCell";
import {TransFormerS315} from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

interface TableMeta {
  handleRemoveRow?: (index: number, id: number) => void;
  handleEditRow?: (index: number, isUpdate: boolean, isEdited: boolean, table: unknown) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

type TypedTable = Table<TransFormerS315> & {
  options: {
    meta?: TableMeta;
  };
};

interface CustomTable {
  options: {
    meta?: TableMeta;
  };
}

const asTypedTable = (table: Table<TransFormerS315>): TypedTable =>
    table as TypedTable;
const deleteData = (index: number, id: number, table: CustomTable) => {
  table.options.meta?.handleRemoveRow?.(index, id);
};

const updateData = (
  index: number,
  isUpdate: boolean,
  isEdited: boolean,
  table: CustomTable
) => {
  const is_edit = isUpdate ? true : isEdited;
  table.options.meta?.handleEditRow?.(index, isUpdate, is_edit, table);
};

export const columns: ColumnDef<TransFormerS315>[] = [
  {
    accessorKey: "no",
    header: "ลำดับที่",
    maxSize: 5,
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "transformer_size",
    header: "ขนาดหม้อแปลง",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableTextCell
            row={row}
            column={{id: 'transformer_size'}}
            table={asTypedTable(table)}
            columnValue={row.original.transformer_size as string || ""}
            placeholder="ขนาดหม้อแปลง"
          />
        );
      } else {
        return row.getValue('transformer_size') || '';
      }
    },
  },
  {
    accessorKey: "transformer_qty",
    header: "จำนวน",
    cell: ({row, table}) => {
      if (row.original.isUpdate) {
        return <EditableTextCell
          row={row}
          column={{id: 'transformer_qty'}}
          table={asTypedTable(table)}
          columnValue={row.original.transformer_qty || ""}
          numberOnly={true}
          placeholder="จำนวน"
        />
      } else {
        return row.getValue('transformer_qty')
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
          onClick={() => deleteData(row.index, row.original.id as number || 0, asTypedTable(table))}>
          <FontAwesomeIcon icon={faTrashCan} size={"sm"} color="#E02424"/>
        </button>
      </div>
    }
  }
];
