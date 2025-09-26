import { ColumnDef, Table } from "@tanstack/react-table";
import { MaterialEquipmentObj, Options } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { EditableTextCell } from "@/app/components/editor-table/EditableTextCell";
import { EditableSelectCell } from "@/app/components/editor-table/EditableSelectCell";
import { getMaterialMaster } from "@/app/api/MaterialEquipmentApi";

// Define proper types to avoid any
interface CustomTableMeta {
  handleRemoveRow?: (index: number, id: number) => void;
  handleEditRow?: (
    index: number,
    isUpdate: boolean,
    isEdit: boolean,
    table: unknown
  ) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

type TypedTable = Table<MaterialEquipmentObj> & {
  options: {
    meta?: CustomTableMeta;
  };
};

interface CustomTable {
  options: {
    meta?: CustomTableMeta;
  };
}

const asTypedTable = (table: Table<MaterialEquipmentObj>): TypedTable =>
  table as TypedTable;


const searchMaterialOptions = async (search: string): Promise<Options[]> => {
  try {
    const response = await getMaterialMaster(search);
    if (response.status === 200 && response.data.data) {
      return response.data.data.map((material) => ({
        label: `${material.code} - ${material.name}`,
        value: material.code,
        data: material,
      }));
    }
  } catch (error) {
    console.error("Error searching materials:", error);
  }
  return [];
};

// Base columns without action
const baseColumns: ColumnDef<MaterialEquipmentObj>[] = [
  {
    id: "no",
    accessorKey: "no",
    header: "ลำดับที่",
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>;
    },
  },
  {
    id: "code_and_name",
    accessorKey: "code_and_name",
    header: "รหัสวัสดุและชื่ออุปกรณ์",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableSelectCell
            columnValue={row.original.code || ""}
            row={row}
            column={{ id: "code" }}
            table={asTypedTable(table)}
            options={[]} // เริ่มต้นด้วย array ว่าง
            placeholder={"รหัสวัสดุและชื่ออุปกรณ์"}
            onSearch={searchMaterialOptions}
            onUpdate={(value, item) => {
              // อัพเดทข้อมูลเมื่อเลือก - แก้ไข type error
              if (item?.data) {
                const typedTable = asTypedTable(table);
                const meta = typedTable.options.meta;
                if (meta && meta.updateData) {
                  meta.updateData(row.index, "code", value);
                  meta.updateData(row.index, "name", item.data.name);
                  meta.updateData(row.index, "unit", item.data.unit);
                  meta.updateData(row.index, "price", item.data.price);
                }
              }
            }}
          />
        );
      } else {
        return (
          <div className="flex flex-col">
            <div className="font-medium">{row.original.code}</div>
            <div className="text-sm text-gray-600">{row.original.name}</div>
          </div>
        );
      }
    },
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "จำนวนที่เบิก",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableTextCell
            row={row}
            column={{ id: "quantity" }}
            table={asTypedTable(table)}
            columnValue={row.original.quantity}
            numberOnly={true}
          />
        );
      } else {
        return row.original.quantity || 0;
      }
    },
  },
  {
    id: "remaining",
    accessorKey: "remaining",
    header: "จำนวนคงเหลือ",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableTextCell
            row={row}
            column={{ id: "remaining" }}
            table={asTypedTable(table)}
            columnValue={row.getValue("remaining") || 0}
            numberOnly={true}
          />
        );
      } else {
        return row.getValue("remaining") || 0;
      }
    },
  },
  {
    id: "unit",
    accessorKey: "unit",
    header: "หน่วย",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableTextCell
            row={row}
            column={{ id: "unit" }}
            table={asTypedTable(table)}
            columnValue={row.original.unit || "ชิ้น"}
          />
        );
      } else {
        return row.original.unit || "ชิ้น";
      }
    },
  },
  {
    id: "price",
    accessorKey: "price",
    header: "ราคา",
    cell: ({ row, table }) => {
      if (row.original.isUpdate) {
        return (
          <EditableTextCell
            row={row}
            column={{ id: "price" }}
            table={asTypedTable(table)}
            columnValue={row.getValue("price") || 0}
            numberOnly={true}
          />
        );
      } else {
        const price = row.getValue("price") as number;
        return price ? `${price.toLocaleString()}` : "0";
      }
    },
  },
];

const actionColumn: ColumnDef<MaterialEquipmentObj> = {
  id: "action",
  accessorKey: "action",
  header: "",
  enableSorting: false,
  cell: ({ row, table }) => {
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

    return (
      <div className="flex justify-center">
        {row.original.isUpdate ? (
          <button
            className="bg-[#C8F9E9] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
            onClick={() =>
              updateData(
                row.index,
                false,
                row.original.isEdited,
                asTypedTable(table)
              )
            }
          >
            <FontAwesomeIcon icon={faCheckCircle} size={"sm"} color="#31C48D" />
          </button>
        ) : (
          <button
            className="bg-[#FDE5B6] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
            onClick={() =>
              updateData(
                row.index,
                true,
                row.original.isEdited,
                asTypedTable(table)
              )
            }
          >
            <FontAwesomeIcon icon={faPencil} size={"sm"} color="#F9AC12" />
          </button>
        )}

        <button
          className="bg-[#FFD4D4] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
          onClick={() =>
            deleteData(row.index, row.original.id || 0, asTypedTable(table))
          }
        >
          <FontAwesomeIcon icon={faTrashCan} size={"sm"} color="#E02424" />
        </button>
      </div>
    );
  },
};


export const getColumns = (): ColumnDef<MaterialEquipmentObj>[] => [
  ...baseColumns,
  actionColumn,
];


export const getColumnsWithoutAction = (): ColumnDef<MaterialEquipmentObj>[] =>
  baseColumns;
