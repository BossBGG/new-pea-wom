"use client";

import { NotificationObj } from "@/app/api/NotificationApi";
import { formatJSDateTH } from "@/app/helpers/DatetimeHelper";
import { Checkbox } from "@/components/ui/checkbox";
import {
  faArrowUpRightFromSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const getColumns = (
  onCheck: (checked: boolean, id: string) => void,
  selectedIds: string[]
): ColumnDef<NotificationObj>[] => [
  {
    accessorKey: "id",
    header: "",
    cell: ({ row }) => {
      const notificationId = row.original.id;
      const isSelected = selectedIds.includes(notificationId);
      return (
        <Checkbox
          checked={isSelected}
          onCheckedChange={(check) => {
            console.log("Checkbox changed:", { check, notificationId });
            onCheck(!!check, notificationId);
          }}
          className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA] cursor-pointer"
        />
      );
    },
    enableSorting: false,
    minSize: 5,
    maxSize: 5,
  },
  {
    accessorKey: "createdAt",
    header: "วันที่",
    cell: ({ row }) => {
      return (
        <div>
          <div className="mb-1">
            {formatJSDateTH(
              new Date(row.getValue("createdAt")),
              "dd MMMM yyyy"
            )}
          </div>
          <div className="text-[#4A4A4A] text-[12px]">
            {formatJSDateTH(new Date(row.getValue("createdAt")), "HH:mm น.")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "ประเภท",
    cell: ({ row }) => {
      return (
        <div className="inline-block px-3 py-1 rounded-full text-[12px] font-medium">
          {row.getValue("type")}
        </div>
      );
    },
  },
  {
    accessorKey: "detail",
    header: "รายละเอียด",
    cell: ({ row }) => {
      return <div className="text-wrap">{row.getValue("detail")}</div>;
    },
    size: 300,
  },
  {
    accessorKey: "action",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex justify-center">
          <Link
            className="bg-[#BEE2FF] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
            href={`#`}
          >
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
              size={"sm"}
              color="#03A9F4"
            />
          </Link>
          <button
            className="bg-[#FFD4D4] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
            onClick={() => {}}
          >
            <FontAwesomeIcon icon={faTrashCan} size={"sm"} color="#E02424" />
          </button>
        </div>
      );
    },
    enableSorting: false,
    maxSize: 5,
    minSize: 36,
  },
];
