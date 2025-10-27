import React from "react";
import { SatisfactionData } from "@/types";
import { formatJSDateTH } from "@/app/helpers/DatetimeHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import {cn} from "@/lib/utils";
import StarRating from "@/app/components/utils/StarRating";

interface ListDataContentProps {
  item: SatisfactionData;
}

const ListDataContent: React.FC<ListDataContentProps> = ({ item }) => {
  const router = useRouter();
  console.log('item >>> ', item)

  const InfoRow = ({title, value, className}: { title: string; value: string, className?: string }) => (
    <div className={
      cn('flex flex-wrap items-center justify-between mb-2 md:w-1/3 w-full px-2', className)
    }>
      <div className="text-[#4A4A4A]">{title} :</div>
      <div className="text-[#160C26]">{value}</div>
    </div>
  );

  return (
    <div className="border-1 border-[#E0E0E0] rounded-[12px] p-3 mb-3 text-[14px]">
      <div className="flex flex-wrap mb-2">
        <InfoRow title={"เลขที่ใบสั่งงาน"} value={item.workOrderNumber || "-"}/>
        <InfoRow title={"วันที่จบงาน"} value={item.completedAt ? formatJSDateTH(new Date(item.completedAt), 'dd/MM/yyyy') : "-"}/>
        <InfoRow title={"ประเภทงานบริการ"} value={item.serviceRequest?.serviceTypeName || "-"}/>
        <InfoRow title={"เลขที่คำร้อง"} value={item.serviceRequest?.requestNumber || "-"} className={'md:w-1/3 w-full'}/>
        <InfoRow title={"เวลา"} value={item.completedAt ? formatJSDateTH(new Date(item.completedAt), 'HH:mm น.') : "-"} className={'md:w-1/3 w-full'}/>
      </div>

      <div className="md:flex md:justify-between md:items-center w-full">
        <div className="flex items-center justify-between md:w-1/3 w-full px-2">
          <span className="text-[#4A4A4A]">คะแนนรวม:</span>
          <StarRating score={item.overallRating} size="sm" />
        </div>

        <button
          className="bg-[#BEE2FF] rounded-[8px] p-2 flex items-center justify-center hover:bg-[#BEE2FF]/80 md:mt-0 mt-2"
          onClick={() => router.push(`/service_satisfaction/${item.id}`)}
        >
          <FontAwesomeIcon icon={faSearch} size="sm" color="#03A9F4" />
        </button>
      </div>
    </div>
  );
};

export default ListDataContent;
