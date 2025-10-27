"use client";

import React, {useEffect, useMemo, useState} from "react";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/app/components/list/DataTable";
import ListData from "@/app/components/list/ListData";
import ListDataContent from "@/app/(pages)/service_satisfaction/list-data-content";
import { ColumnDef } from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import InputSearch from "@/app/components/form/InputSearch";
import LatestUpdateData from "@/app/components/utils/LatestUpdateData";
import StarRating from "@/app/components/utils/StarRating";
import FilterDialog from "@/app/components/list/FilterDialog";
import FilterDialogContent from "@/app/(pages)/service_satisfaction/filter-dialog-content";
import {ServiceSatisfactionList} from "@/app/api/ServiceSatisfactionApi";
import {formatJSDateTH} from "@/app/helpers/DatetimeHelper";
import {SatisfactionData} from "@/types";
import {useRouter} from "next/navigation";
import {useBreadcrumb} from "@/app/context/BreadcrumbContext";
import ServiceSatisfactionBreadcrumb from "@/app/(pages)/service_satisfaction/breadcrumb";
import {useAppSelector} from "@/app/redux/hook";

const initFilter = {
  startDate: undefined,
  endDate: undefined,
  rating: "",
  serviceType: ""
};

const ServiceSatisfactionPage = () => {
  const [search, setSearch] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [filters, setFilter] = useState(initFilter);
  const [listData, setListData] = useState<SatisfactionData[]>([]);
  const router = useRouter()
  const {setBreadcrumb} = useBreadcrumb();
  const screenSize = useAppSelector(state => state.screen_size);

  useEffect(() => {
    setBreadcrumb(<ServiceSatisfactionBreadcrumb title="ผลประเมินความพึงพอใจในการให้บริการ"/>)
  }, []);

  const clearFilter = () => {
    setFilter(initFilter);
  };

  const tableApiData = useMemo(() => {
    return {...filters, search: searchFilter}
  }, [filters, searchFilter])

  const columns:  ColumnDef<SatisfactionData>[] = [
    {
      accessorKey: 'index',
      header: "ลำดับที่",
      cell: ({ row, table }) => {
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        return <div className="text-center">{(pageIndex * pageSize) + row.index + 1}</div>
      },
      enableSorting: false,
      minSize: 80,
      maxSize: 80
    },
    {
      accessorKey: 'completedAt',
      header: "วันที่รายงาน",
      minSize: 80,
      maxSize: 80,
      cell: ({ row }) => {
        return <div>
          <div>{formatJSDateTH(new Date(row.getValue('completedAt')), 'dd MMMM yyyy')}</div>
          <div className="text-[#4A4A4A]">{formatJSDateTH(new Date(row.getValue('completedAt')), 'HH:mm น.')}</div>
        </div>
      }
    },
    {
      accessorKey: 'workOrderNumber',
      header: "เลขที่ใบสั่งงาน",
      minSize: 150,
      maxSize: 150
    },
    {
      accessorKey: 'serviceRequestNumber',
      header: "เลขที่คำร้อง",
      minSize: 150,
      maxSize: 150
    },
    {
      accessorKey: 'serviceTypeName',
      header: "ประเภทงานบริการ",
      minSize: 250,
      maxSize: 250,
      cell: ({ row }) => (
        <div className="text-left">{row.original.serviceRequest?.serviceTypeName || "-"}</div>
      )
    },
    {
      accessorKey: 'overallRating',
      header: "คะแนนรวม",
      cell: ({ row }) => <StarRating score={row.original.overallRating} />,
      minSize: 100,
      maxSize: 100
    },
    {
      accessorKey: "action",
      header: "",
      enableSorting: false,
      minSize: 60,
      maxSize: 60,
      cell: ({row}) => (
        <div className="flex justify-center">
          <button className="bg-[#BEE2FF] rounded-sm px-2 py-1 cursor-pointer"
                  onClick={() => router.push(`/service_satisfaction/${row.original.id}`)}
          >
            <FontAwesomeIcon icon={faSearch} color="#03A9F4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="px-6">
      <LatestUpdateData />

      {/* Search and Filter Bar */}
      <Card className="p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <InputSearch
              value={search}
              handleSearch={setSearchFilter}
              setValue={setSearch}
              placeholder="ค้นหาโดยเลขที่ใบสั่งงาน และเลขที่คำร้อง"
            />
          </div>
          <FilterDialog>
            <FilterDialogContent
              clearFilter={clearFilter}
              filters={filters}
              submitSearch={setFilter}
            />
          </FilterDialog>
        </div>

        {/* Data Table / List Data */}
        {screenSize !== 'desktop' ? (
          <ListData
            setListData={(data) => setListData(data as SatisfactionData[])}
            tableApi={ServiceSatisfactionList}
            tableApiData={tableApiData}
            visibleSizeSelection={false}
          >
            {listData.length > 0 ? (
              listData.map((item) => (
                <ListDataContent key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center text-[18px] text-gray-500 p-4">
                ไม่พบข้อมูลการประเมินความพึงพอใจ
              </div>
            )}
          </ListData>
        ) : (
          <DataTable
            columns={columns}
            tableApi={ServiceSatisfactionList}
            tableApiData={tableApiData}
            emptyData={
              <div className="text-center text-[18px] text-gray-500 p-4">
                ไม่พบข้อมูลการประเมินความพึงพอใจ
              </div>
            }
          />
        )}
      </Card>
    </div>
  );
};

export default ServiceSatisfactionPage;
