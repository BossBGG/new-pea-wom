"use client";

import { NotificationList, NotificationObj } from "@/app/api/NotificationApi";
import InputDateRange from "@/app/components/form/InputDateRange";
import InputSearch from "@/app/components/form/InputSearch";
import InputSelect from "@/app/components/form/InputSelect";
import { DataTable } from "@/app/components/list/DataTable";
import FilterDialog from "@/app/components/list/FilterDialog";
import LatestUpdateData from "@/app/components/utils/LatestUpdateData";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import { showConfirm } from "@/app/helpers/Alert";
import { formatJSDate } from "@/app/helpers/DatetimeHelper";
import ModalFilter from "@/app/layout/ModalFilter";
import { useAppSelector } from "@/app/redux/hook";
import { Options } from "@/types";
import { faEnvelope, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addMonths, subMonths } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { getColumns } from "./columns";
import EmptyData from "./empty-data";
import ListData from "@/app/components/list/ListData";
import ListDataContent from "./list-data-content";
import { SyncFailedPopup } from "@/components/ui/popup";
import NotificationBreadcrumb from "./breadcrumb";

const Notification = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const screenSize = useAppSelector((state) => state.screen_size);
  const [data, setData] = useState<NotificationObj[]>([]);
  const [search, setSearch] = useState<string>("");
  const [search_filter, setSearchFilter] = useState<string>("");
  const [type_filter, setTypeFilter] = useState<string | number>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showSyncFailedPopup, setShowSyncFailedPopup] = useState(false);

  const initDate: DateRange = {
    from: subMonths(new Date(), 1),
    to: addMonths(new Date(), 1),
  };

  const [date, setDate] = useState<DateRange | undefined>(initDate);

  const initFilterDate = {
    from: formatJSDate(initDate.from as Date, "yyyy-MM-dd"),
    to: formatJSDate(initDate.to as Date, "yyyy-MM-dd"),
  };

  const [filters, setFilters] = useState({
    ...initFilterDate,
    type: "all",
  });

  useEffect(() => {
    setBreadcrumb(<NotificationBreadcrumb />);
  }, [setBreadcrumb]);

  const clearFilter = () => {
    setSearch("");
    setSearchFilter("");
    setTypeFilter("all");
    setDate(initDate);
    setFilters({
      ...initFilterDate,
      type: "all",
    });
  };

  const submitSearch = () => {
    const filter_item = {
      from: date?.from ? formatJSDate(date.from, "yyyy-MM-dd") : "",
      to: date?.to ? formatJSDate(date.to, "yyyy-MM-dd") : "",
      type: type_filter as string,
    };
    setFilters(filter_item);
  };

  const tableApiData = useMemo(() => {
    const items: {
      from: string;
      to: string;
      search: string;
      type?: string;
    } = { from: filters.from, to: filters.to, search: search_filter };

    if (type_filter !== "all") {
      items.type = type_filter as string;
    }

    return items;
  }, [filters, search_filter, type_filter]);

  const typeOptions: Options[] = [
    { value: "all", label: "ทั้งหมด" },
    { value: "ใบสั่งงานใหม่", label: "ใบสั่งงานใหม่" },
    { value: "สำรวจงานสำเร็จ", label: "สำรวจงานสำเร็จ" },
    { value: "สำรวจไม่สำเร็จ", label: "สำรวจไม่สำเร็จ" },
    { value: "ส่งใบเสนอราคา", label: "ส่งใบเสนอราคา" },
    { value: "อนุมัติใบสั่งงาน", label: "อนุมัติใบสั่งงาน" },
    { value: "รายงานการใช้วัสดุ", label: "รายงานการใช้วัสดุ" },
    { value: "ประเมินผลการดำเนินงาน", label: "ประเมินผลการดำเนินงาน" },
    { value: "ปิดงานและส่งรายงาน", label: "ปิดงานและส่งรายงาน" },
  ];

  const handleCheckNotification = (checked: boolean, id: string) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    showConfirm("คุณต้องการลบรายการที่เลือกหรือไม่?").then((isConfirm) => {
      if (isConfirm) {
        console.log("Delete notifications:", selectedIds);
        setSelectedIds([]);
      }
    });
  };

  const handleSyncRetry = () => {
    setShowSyncFailedPopup(true);
  };

  return (
    <div>
      <LatestUpdateData showConnectInfo={true} />

      <div className="border-1 border-[#E1D2FF] rounded-[20px] p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-1  min-w-[200px] ">
            {screenSize !== "mobile" && (
              <div className="flex w-full items-center justify-between mb-3 gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <InputSearch
                    handleSearch={setSearchFilter}
                    value={search}
                    setValue={setSearch}
                    placeholder="ค้นหา"
                  />

                  <FilterDialog>
                    <ModalFilter
                      title={"ตัวกรอง"}
                      clearFilter={clearFilter}
                      submitSearch={() => submitSearch()}
                    >
                      <InputDateRange
                        setData={setDate}
                        data={date}
                        label="วันที่"
                      />

                      <InputSelect
                        label="ประเภท"
                        placeholder="ทั้งหมด"
                        options={typeOptions}
                        setData={setTypeFilter}
                        value={type_filter as string}
                      />
                    </ModalFilter>
                  </FilterDialog>
                </div>

                <div className="flex gap-2">
                  <button className="bg-[#F0E9F7]  rounded-full px-4 py-4 flex items-center justify-center">
                    <FontAwesomeIcon icon={faEnvelope} color="#671FAB" />
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="bg-[#FFD4D4] 0 disabled:cursor-not-allowed rounded-full px-4 py-4 flex items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faTrashCan} color="#E02424" />
                  </button>
                </div>
              </div>
            )}

            {screenSize === "mobile" && (
              <div className="mb-3">
                <div className="flex justify-end gap-2 mb-3">
                  <button className="bg-[#F0E9F7] rounded-full w-[48px] h-[48px] flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      color="#671FAB"
                      size="lg"
                    />
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={selectedIds.length === 0}
                    className="bg-[#FFD4D4]  disabled:cursor-not-allowed rounded-full w-[48px] h-[48px] flex items-center justify-center"
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      color="#E02424"
                      size="lg"
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <InputSearch
                      handleSearch={setSearchFilter}
                      value={search}
                      setValue={setSearch}
                      placeholder="ค้นหา"
                    />
                  </div>

                  <FilterDialog>
                    <ModalFilter
                      title={"ตัวกรอง"}
                      clearFilter={clearFilter}
                      submitSearch={() => submitSearch()}
                    >
                      <InputDateRange
                        setData={setDate}
                        data={date}
                        label="วันที่"
                      />

                      <InputSelect
                        label="ประเภท"
                        placeholder="ทั้งหมด"
                        options={typeOptions}
                        setData={setTypeFilter}
                        value={type_filter as string}
                      />
                    </ModalFilter>
                  </FilterDialog>
                </div>
              </div>
            )}
          </div>
        </div>

        {screenSize === "desktop" ? (
          <DataTable
            columns={getColumns(
              (checked, id) => handleCheckNotification(checked, id),
              selectedIds
            )}
            tableApi={NotificationList}
            tableApiData={tableApiData}
            emptyData={<EmptyData />}
          />
        ) : (
          <div>
            <ListData
              setListData={(data) => setData(data as NotificationObj[])}
              tableApi={NotificationList}
              tableApiData={tableApiData}
              visibleSizeSelection={true}
            >
              {data?.length > 0 ? (
                data.map((item, index) => (
                  <ListDataContent
                    item={item}
                    key={index}
                    onCheck={handleCheckNotification}
                  />
                ))
              ) : (
                <EmptyData />
              )}
            </ListData>
          </div>
        )}
      </div>
      <SyncFailedPopup
        open={showSyncFailedPopup}
        onClose={() => setShowSyncFailedPopup(false)}
        onConfirm={() => {
          setShowSyncFailedPopup(false);
        }}
      />
    </div>
  );
};

export default Notification;
