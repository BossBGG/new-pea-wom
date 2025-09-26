//s318
import { ColumnDef, Table } from "@tanstack/react-table";
import { EditableSelectCell } from "@/app/components/editor-table/EditableSelectCell";
import { EditableTextCell } from "@/app/components/editor-table/EditableTextCell";
import { MeterEquipment, Options } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { getMeterEquipmentOptions } from "@/app/api/MaterialEquipmentApi";

interface TableMeta {
  handleRemoveRow?: (index: number, id: number | string) => void;
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


const searchMeterEquipmentOptions = async (search: string): Promise<Options[]> => {
  try {
    const response = await getMeterEquipmentOptions(search, "s318");
    if (response.status === 200 && response.data.data) {
      return response.data.data.map((equipment) => ({
        label: equipment.option_title,
        value: equipment.id,
        data: equipment,
      }));
    }
  } catch (error) {
    console.error("Error searching meter equipment:", error);
  }
  return [];
};

const asTypedTable = (table: Table<MeterEquipment>): TypedTable => 
    table as TypedTable;
    
const deleteData = (index: number, id: number | string, table: CustomTable) => {
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

const baseColumns: ColumnDef<MeterEquipment>[] = [
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
      console.log("[Table Render] row.original:", row.original);
      if (row.original.isUpdate) {
        console.log("[Table Render] Render EditableSelectCell for row:", row.index);
        return (
          <EditableSelectCell
            columnValue={row.original.equipment_id || ''}
            row={row}
            column={{ id: 'equipment_id' }}
            table={asTypedTable(table)}
            options={[]} 
            placeholder={'เลือกมิเตอร์/อุปกรณ์ไฟฟ้า'}
            onSearch={searchMeterEquipmentOptions}
            onUpdate={(value, item) => {
              console.log("[EditableSelectCell] onUpdate called:", value, item);
              if (item?.data) {
                const typedTable = asTypedTable(table);
                const meta = typedTable.options.meta;
                if (meta && meta.updateData) {
                  meta.updateData(row.index, "equipment_id", value);
                  meta.updateData(row.index, "equipment_name", item.data.option_title);
                }
              }
            }}
          />
        );
      } else {
        console.log("[Table Render] Render static text:", row.original.equipment_name);
        return row.original.equipment_name || '';
        
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
            numberOnly={false} 
            placeholder="ขนาด"
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
];

const actionColumn: ColumnDef<MeterEquipment> = {
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
        onClick={() => deleteData(row.index, row.original.id, asTypedTable(table))}>
        <FontAwesomeIcon icon={faTrashCan} size={"sm"} color="#E02424"/>
      </button>
    </div>
  }
};

// Full columns with action
export const columns: ColumnDef<MeterEquipment>[] = [...baseColumns, actionColumn];

// Columns without action (for read-only views)
export const columnsWithoutAction: ColumnDef<MeterEquipment>[] = baseColumns;