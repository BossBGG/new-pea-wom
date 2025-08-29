import { ColumnDef, Table } from "@tanstack/react-table";
import { EditableSelectCell } from "@/app/components/editor-table/EditableSelectCell";
import { EditableTextCell } from "@/app/components/editor-table/EditableTextCell";
import { MeterEquipment } from "@/types";
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

type TypedTable = Table<MeterEquipment> & {
  options: {
    meta?: TableMeta;
  };
};

interface CustomTable {
  options: {
    meta?: TableMeta;
  };
}

const equipmentNameOptions = [
  {
    label: "มิเตอร์",
    value: "มิเตอร์",
  },
  {
    label: "อุปกรณ์ครอบสายไฟฟ้า",
    value: "อุปกรณ์ครอบสายไฟฟ้า",
  },
  {
    label: "หม้อแปลงไฟฟ้า",
    value: "หม้อแปลงไฟฟ้า",
  },
  
];

const asTypedTable = (table: Table<MeterEquipment>): TypedTable => 
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

export const columns: ColumnDef<MeterEquipment>[] = [
  {
    accessorKey: "no",
    header: "ลำดับที่",
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "equipment_name",
    header: "มิเตอร์/อุปกรณ์ไฟฟ้า",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableSelectCell
            columnValue={row.getValue('equipment_name') || ''}
            row={row}
            column={{ id: 'equipment_name' }}
            table={asTypedTable(table)}
            options={equipmentNameOptions}
            placeholder={'เลือกมิเตอร์/อุปกรณ์ไฟฟ้า'}
          />
        );
      } else {
        return row.getValue('equipment_name') || '';
      }
    },
  },
  {
    accessorKey: "size",
    header: "ขนาด",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableTextCell
            row={row}
            column={{ id: 'size' }}
            table={asTypedTable(table)}
            columnValue={row.getValue('size') || ''}
          />
        );
      } else {
        return row.getValue('size') || '';
      }
    },
  },
  {
    accessorKey: "quantity",
    header: "จำนวน",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableTextCell
            row={row}
            column={{ id: 'quantity' }}
            table={asTypedTable(table)}
            columnValue={row.getValue('quantity') || 0}
            numberOnly={true}
          />
        );
      } else {
        return row.getValue('quantity') || 0;
      }
    },
  },
  {
    accessorKey: "price",
    header: "ราคา",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableTextCell
            row={row}
            column={{ id: 'price' }}
            table={asTypedTable(table)}
            columnValue={row.getValue('price') || 0}
            numberOnly={true}
          />
        );
      } else {
        const price = row.getValue('price') as number;
        return price ? `${price.toLocaleString()}` : '0';
      }
    },
  },
  {
    accessorKey: "action",
    header: "",
    enableSorting: false,
    cell: ({ row, table }) => {
      return (
        <div className="flex justify-center">
          {row.original.isUpdate ? (
            <button
              className="bg-[#C8F9E9] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
              onClick={() =>
                updateData(row.index, false, row.original.isEdited, asTypedTable(table))
              }
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                size={"sm"}
                color="#31C48D"
              />
            </button>
          ) : (
            <button
              className="bg-[#FDE5B6] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
              onClick={() =>
                updateData(row.index, true, row.original.isEdited, asTypedTable(table))
              }
            >
              <FontAwesomeIcon icon={faPencil} size={"sm"} color="#F9AC12" />
            </button>
          )}

          <button
            className="bg-[#FFD4D4] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
            onClick={() => deleteData(row.index, row.original.id || 0, asTypedTable(table))}
          >
            <FontAwesomeIcon icon={faTrashCan} size={"sm"} color="#E02424" />
          </button>
        </div>
      );
    },
  },
];