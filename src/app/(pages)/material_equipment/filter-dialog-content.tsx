'use client'
import InputSelect from "@/app/components/form/InputSelect";
import {Options} from "@/types";
import {useEffect, useState} from "react";
import ModalFilter from "@/app/layout/ModalFilter";

const FilterDialogContent = ({
                               clearFilter,
                               submitSearch,
                               status
                             }:
                             {
                               clearFilter: () => void,
                               submitSearch: (value: string) => void,
                               status: string,
                             }) => {

  const statusOptions: Options[] = [
    {value: 'all', label: 'ทั้งหมด'},
    {value: 'true', label: 'เปิดใช้งาน'},
    {value: 'false', label: 'ปิดใช้งาน'},
  ]
  const [status_filter, setStatus] = useState<string>(status || statusOptions[0].value);

  useEffect(() => {
    setStatus(status)
  }, [status]);

  return (
    <div>
      <ModalFilter title={"ตัวกรอง"}
                   clearFilter={clearFilter}
                   submitSearch={() => submitSearch(status_filter)}
      >
        <InputSelect options={statusOptions}
                     label="สถานะ"
                     placeholder="สถานะ"
                     value={status_filter}
                     setData={(v: string) => setStatus(v)}
        />
      </ModalFilter>
    </div>
  )
}

export default FilterDialogContent;
