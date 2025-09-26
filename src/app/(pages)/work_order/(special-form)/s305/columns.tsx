import {ColumnDef, Table} from "@tanstack/react-table";
import {EditableSelectCell} from "@/app/components/editor-table/EditableSelectCell";
import {EditableTextCell} from "@/app/components/editor-table/EditableTextCell";
import {Options, Transformer} from "@/types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  handleSearchTransformerBrands,
  handleSearchTransformerPhase, handleSearchTransformerSize,
  handleSearchTransformerType, handleSearchTransformerVoltage
} from "@/app/helpers/SearchTransformer.";

interface TableMeta {
  handleRemoveRow?: (index: number, id: number) => void;
  handleEditRow?: (index: number, isUpdate: boolean, isEdited: boolean, table: unknown) => void;
  updateData: (rowIndex: number, columnId: string, value: unknown) => void;
}

type TypedTable = Table<Transformer> & {
  options: {
    meta?: TableMeta;
  };
};

interface CustomTable {
  options: {
    meta?: TableMeta;
  };
}

const asTypedTable = (table: Table<Transformer>): TypedTable =>
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

export const getColumns = (
  brandsOptions: Options[],
  onUpdateBrandOptions: (opts: Options[]) => void,
  phaseOptions: Options[],
  onUpdatePhaseOptions: (opts: Options[]) => void,
  typeOptions: Options[],
  onUpdateTypeOptions: (opts: Options[]) => void,
  sizeOptions: Options[],
  onUpdateSizeOptions: (opts: Options[]) => void,
  voltageOptions: Options[],
  onUpdateVoltageOptions: (opts: Options[]) => void,
  reqCode: string
): ColumnDef<Transformer>[] => {

  return [
    {
      accessorKey: "no",
      header: "ลำดับที่",
      maxSize: 5,
      enableSorting: false,
      cell: ({row}) => {
        return <div className="text-center">{row.index + 1}</div>;
      },
    },
    {
      accessorKey: "title",
      header: "ยื่ห้อ",
      maxSize: 50,
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return (
            <EditableSelectCell
              columnValue={row.original.title}
              row={row}
              column={{id: "title"}}
              table={asTypedTable(table)}
              options={brandsOptions}
              placeholder={"ยื่ห้อ"}
              onSearch={(s) => handleSearchTransformerBrands(s, reqCode)}
              onUpdateOptions={onUpdateBrandOptions}
            />
          );
        } else {
          return brandsOptions.find((brand) => brand.value == row.getValue("title"))?.label || row.getValue("title");
        }
      },
    },
    {
      accessorKey: "phase",
      header: "เฟส",
      maxSize: 50,
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return (
            <EditableSelectCell
              columnValue={row.original.phase}
              row={row}
              column={{id: "phase"}}
              table={asTypedTable(table)}
              options={phaseOptions}
              placeholder={"เฟส"}
              onSearch={(s) => handleSearchTransformerPhase(s, reqCode)}
              onUpdateOptions={onUpdatePhaseOptions}
            />
          );
        } else {
          return phaseOptions.find(
            (item) => item.value == row.getValue("phase")
          )?.label || row.getValue("phase");
        }
      },
    },
    {
      accessorKey: "type",
      header: "ประเภท",
      maxSize: 50,
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return (
            <EditableSelectCell
              columnValue={row.original.type}
              row={row}
              column={{id: "type"}}
              table={asTypedTable(table)}
              options={typeOptions}
              placeholder={"ประเภท"}
              onSearch={(s) => handleSearchTransformerType(s, reqCode)}
              onUpdateOptions={onUpdateTypeOptions}
            />
          );
        } else {
          return typeOptions.find((type) => type.value == row.getValue("type"))?.label || row.getValue("type");
        }
      },
    },
    {
      accessorKey: "serial",
      header: "Serial",
      maxSize: 50,
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return (
            <EditableTextCell
              row={row}
              column={{id: "serial"}}
              table={asTypedTable(table)}
              columnValue={row.getValue("serial") || ''}
            />
          );
        } else {
          return row.getValue("serial");
        }
      },
    },
    {
      accessorKey: "size",
      header: "ขนาด",
      maxSize: 50,
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return (
            <EditableSelectCell
              columnValue={row.original.size}
              row={row}
              column={{id: "size"}}
              table={asTypedTable(table)}
              options={sizeOptions}
              placeholder={"ขนาด"}
              onSearch={(s) => handleSearchTransformerSize(s, reqCode)}
              onUpdateOptions={onUpdateSizeOptions}
            />
          );
        } else {
          return sizeOptions.find((size) => size.value == row.getValue("size"))?.label || row.getValue("size");
        }
      },
    },
    {
      accessorKey: "voltage",
      header: "แรงดัน",
      maxSize: 50,
      cell: ({row, table}) => {
        if (row.original.isUpdate) {
          return (
            <EditableSelectCell
              columnValue={row.original.voltage}
              row={row}
              column={{id: "voltage"}}
              table={asTypedTable(table)}
              options={voltageOptions}
              placeholder={"แรงดัน"}
              onSearch={(s) => handleSearchTransformerVoltage(s, reqCode)}
              onUpdateOptions={onUpdateVoltageOptions}
            />
          );
        } else {
          return voltageOptions.find((volt) => volt.value == row.getValue("voltage"))?.label || row.getValue("voltage")
        }
      },
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
    }
  ];
}

