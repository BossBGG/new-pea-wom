import { NotificationObj } from "@/app/api/NotificationApi";
import { formatJSDateTH } from "@/app/helpers/DatetimeHelper";
import { useAppSelector } from "@/app/redux/hook";
import { Checkbox } from "@/components/ui/checkbox";
import {
  faArrowUpRightFromSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const getTypeBadge = (type: string) => {
  const typeMap: { [key: string]: { bg: string; text: string } } = {
    ใบสั่งงานใหม่: { bg: "#BEE2FF", text: "#000000" },
    งานสำรวจ: { bg: "#FDE5B6", text: "#000000" },
    อนุมัติใบสั่งงาน: { bg: "#C8F9E9", text: "#000000" },
    สำรวจไม่สำเร็จ: { bg: "#FFD4D4", text: "#000000" },
  };

  const style = typeMap[type] || { bg: "#E1D2FF", text: "#671FAB" };

  return (
    <div
      className="inline-block text-center px-2 py-1 rounded-full text-[12px] font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {type}
    </div>
  );
};

interface ListDataContentProps {
  item: NotificationObj;
  onCheck: (checked: boolean, id: string) => void;
}

const ListDataContent: React.FC<ListDataContentProps> = ({ item, onCheck }) => {
  const screenSize = useAppSelector((state) => state.screen_size);

  return (
    <div className="border-1 border-[#E0E0E0] rounded-[12px] p-3 mb-3 text-[14px]">
      <div className="flex items-center gap-3 mb-2">
        <Checkbox
          onCheckedChange={(check: boolean) => onCheck(check, item.id)}
          className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA] cursor-pointer mt-1 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="text-[#160C26] text-[12px] mb-1">
            วันที่: {formatJSDateTH(new Date(item.createdAt), "dd/MM/yyyy")}{" "}
            เวลา: {formatJSDateTH(new Date(item.createdAt), "HH:mm น.")}
          </div>

          <p className="text-[#4A4A4A] mb-2 break-words">
            {screenSize === "tablet" && (
              <span className="font-medium">รายละเอียด :&nbsp;</span>
            )}
            {item.detail}
          </p>

          {screenSize === "mobile" && (
            <div className="flex items-center justify-between gap-2 ">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[#4A4A4A] text-[12px] flex-shrink-0">
                  ประเภท:
                </span>
                {getTypeBadge(item.type)}
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button className="bg-[#BEE2FF] rounded-[8px] p-2 flex items-center justify-center hover:bg-[#BEE2FF]/80">
                  <FontAwesomeIcon
                    icon={faArrowUpRightFromSquare}
                    size="sm"
                    color="#03A9F4"
                  />
                </button>
                <button className="bg-[#FFD4D4] rounded-[8px] p-2 flex items-center justify-center hover:bg-[#FFD4D4]/80">
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    size="sm"
                    color="#E02424"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
        {screenSize === "tablet" && (
          <div className="flex items-center justify-between gap-2 ">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-[#4A4A4A] text-[12px] flex-shrink-0">
                ประเภท:
              </span>
              {getTypeBadge(item.type)}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button className="bg-[#BEE2FF] rounded-[8px] p-2 flex items-center justify-center hover:bg-[#BEE2FF]/80">
                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                  size="sm"
                  color="#03A9F4"
                />
              </button>
              <button className="bg-[#FFD4D4] rounded-[8px] p-2 flex items-center justify-center hover:bg-[#FFD4D4]/80">
                <FontAwesomeIcon icon={faTrashCan} size="sm" color="#E02424" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListDataContent;
