"use client"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel, Header
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import React, {useEffect, useRef, useState} from "react";
import {ChevronDown, ChevronsUpDown, ChevronUp} from "lucide-react";
import {cn} from "@/lib/utils";
import {PaginationList} from "@/components/ui/pagination-list";
import {TableListApi} from "@/app/api/TableApiHelper";
import {dismissAlert, showError, showProgress} from "@/app/helpers/Alert";
import type {CancelTokenSource} from "axios";
import {Pagination} from "@/types";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  tableApi: TableListApi,
  tableApiData: {
    [key: string]: string | number | boolean | Date | undefined
  },
  emptyData: React.ReactNode
}

// function useSkipper() {
//   const shouldSkipRef = React.useRef(true)
//   const shouldSkip = shouldSkipRef.current

//   // Wrap a function with this to skip a pagination reset temporarily
//   const skip = React.useCallback(() => {
//     shouldSkipRef.current = false
//   }, [])

//   React.useEffect(() => {
//     shouldSkipRef.current = true
//   })

//   return [shouldSkip, skip] as const
// }

export function DataTable<TData, TValue>({
                                           columns,
                                           tableApi,
                                           tableApiData,
                                           emptyData,
                                         }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [data, setData] = useState<TData[]>([])


  const prevTableApiDataRef = useRef(tableApiData)

  const prevSoringRef = useRef<SortingState>([])

  let cancelTokenSource: CancelTokenSource | null = null

  const fetchListData = async () => {
    if (!tableApi) return
    showProgress()
    if (cancelTokenSource) {
      cancelTokenSource.cancel()
    }

    let sort: {sortBy?: string, sortOrder?: string} = {}
    if (sorting.length > 0) {
      sort.sortBy = sorting[0].id;
      sort.sortOrder = sorting[0].desc ? "desc" : "asc";
    }

    tableApi.callApi({
      page: page + 1,
      limit: pageSize,
      ...sort,
      ...tableApiData
    })
      .then(({api, cancelToken}) => {
        cancelTokenSource = cancelToken
        return api
      })
      .then(res => {
        if (res.data?.status_code === 200) {
          dismissAlert()
          const data = res?.data?.data?.items as TData[] || res?.data?.data?.data as TData[];
          let meta = res?.data?.data?.meta || res?.data?.data?.pagination;
          if(!meta) {
            meta = {
              limit: res?.data?.data?.limit || 0,
              page: res?.data?.data?.page || 0,
              totalCount: res?.data?.data?.total || 0
            }
          }
          setData(data)
          setTotalCount(meta?.totalCount || 0)
        } else {
          dismissAlert()
          setData([])
          setTotalCount(0)
        }
      })
      .catch((error) => {
        showError(error.message)
      })
  }

  const hasTableApiDataChanged = (prev: typeof tableApiData , current: typeof tableApiData) => {
    return JSON.stringify(prev) !== JSON.stringify(current)
  }

    const hasSortingChanged = (prev: SortingState , current: SortingState) => {
    return JSON.stringify(prev) !== JSON.stringify(current)
  }

  useEffect(() => {

    const dataChanged = hasTableApiDataChanged(prevTableApiDataRef.current , tableApiData)

    const sortingChange = hasSortingChanged(prevSoringRef.current , sorting)
    if(dataChanged) {
      setPage(0)
      table.setPageIndex(0)
      prevTableApiDataRef.current = tableApiData
    }

    if (sortingChange) {
      setPage(0)
      table.setPageIndex(0)
      prevSoringRef.current = sorting
    }
    fetchListData()
    // table.setPageIndex(page)
    console.log('page >>> ', page)
  }, [page, pageSize, tableApiData, sorting]);



  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex: page,
        pageSize: pageSize,
      },
      sorting: sorting

    },
    manualPagination: true,
    manualSorting: true,
    // autoResetPageIndex,
    meta: {
      refreshData: () => {
        fetchListData()
      }
    },
  })

  const handleSort = (header: Header<TData, unknown>) => {
    return header.column.getToggleSortingHandler()
  }

  const handleChangePage = (page: number) => {
    setPage(page)
    table.setPageIndex(page)
  }

  const handleChangePageSize = (page: number) => {
    setPageSize(page)
    setPage(0)
    table.setPageIndex(0)
    table.setPageSize(page)
  }

  return (
    <div>
      {
        data?.length > 0 ?
          <div className="rounded-[20px] border">
            <Table className="rounded-tl-[8px] rounded-tr-[8px]">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      return (
                        <TableHead key={header.id}
                                   className="bg-[#B05FF3] text-white first:rounded-tl-[8px] last:rounded-tr-[8px]"
                                   style={{
                                     width: header.getSize(),
                                     maxWidth: header.column.columnDef.maxSize,
                                     minWidth: header.column.columnDef.minSize
                                   }}
                        >
                          {
                            header.isPlaceholder
                              ? null
                              : <Button
                                variant="ghost"
                                onClick={canSort ? handleSort(header) : undefined}
                                className={cn("hover:bg-transparent hover:text-white p-0", canSort ? 'cursor-pointer' : 'cursor-default')}
                              >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {
                                  canSort && (
                                    <div>
                                      {header.column.getIsSorted() === "desc" && <ChevronDown/>}
                                      {header.column.getIsSorted() === "asc" && <ChevronUp/>}
                                      {!header.column.getIsSorted() && <ChevronsUpDown className="h-1 w-1"/>}
                                    </div>
                                  )
                                }
                              </Button>
                          }
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="even:bg-[#F2F2F2]"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="first:rounded-bl-[8px] last:rounded-br-[8px]"
                                   style={{
                                     width: cell.column.getSize(),
                                     minWidth: cell.column.columnDef.minSize,
                                     maxWidth: cell.column.columnDef.maxSize,
                                   }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          : <div>{emptyData}</div>
      }

      {
        data?.length > 0 &&
        <div className="flex items-center space-x-2 py-4 justify-center lg:justify-end mt-3">
          <PaginationList totalCount={totalCount}
                          pageSize={pageSize}
                          page={page}
                          changePage={(p) => handleChangePage(p)}
                          changePageSize={(size) => handleChangePageSize(size)}
                          pageSizeSelectOptions={{
                            pageSizeOptions: [10, 20, 30, 50, 100],
                          }}
          />
        </div>
      }

    </div>

  )
}
