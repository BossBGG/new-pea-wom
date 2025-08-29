"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel
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
import React, {useEffect, useState} from "react";
import {PaginationList} from "@/components/ui/pagination-list";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  rowItem?: TData,
  LabelAddRow?: string | undefined,
  onUpdateData: (data: TData[]) => void,
  realData: TData[],
  onRemoveData: (id: number) => void,
  visibleDelete?: boolean
}

export function DataTableEditor<TData, TValue>({
                                                 columns,
                                                 rowItem,
                                                 LabelAddRow,
                                                 onUpdateData,
                                                 realData,
                                                 onRemoveData,
                                                 visibleDelete = false
                                               }: DataTableProps<TData, TValue>) {
  const [pageSize, setPageSize] = useState(10)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [data, setData] = useState<TData[]>([])

  useEffect(() => {
    setData(realData)
    setTotalCount(realData.length)
  }, [realData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    pageCount: Math.ceil(data.length / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    meta: {
      updateData: (rowIndex: number, columnId: string, value: TValue) => {
        const newData = data.map((row, index) => {
          return index === rowIndex ? {...row, [columnId]: value } : row
        })
        onUpdateData(newData)
      },
      handleEditRow: (rowIndex: number, is_update: boolean, is_edit: boolean) => {
        const newData = data.map((row, index) => {
          return index === rowIndex ? {...row, isUpdate: is_update, isEdited: is_edit} : row
        })
        onUpdateData(newData)
      },
      handleRemoveRow: (rowIndex: number, id: number) => {
        setData((oldData) => {
          const newData = oldData.filter((_, index) => index !== rowIndex)

          const newPageCount = Math.ceil(newData.length / pageSize)
          if (pageIndex >= newPageCount && newPageCount > 0) {
            handleChangePage(newPageCount - 1)
          }

          setTotalCount(newData.length)
          onUpdateData(newData)
          onRemoveData(id)
          return newData
        })
      }
    },
  })

  const handleChangePage = (page: number) => {
    setPageIndex(page)
    table.setPageIndex(page)
  }

  const handleChangePageSize = (size: number) => {
    setPageSize(size)
    table.setPageSize(size)
    handleChangePage(0)
  }

  const addRow = () => {
    if (rowItem) {
      const newData: TData[] = [...data, rowItem]
      handleUpdateData(newData)
    }
  }

  const handleUpdateData = (newData: TData[]) => {
    const newPageCount = Math.ceil(newData.length / pageSize)
    const lastPageIndex = newPageCount - 1
    setTotalCount(newData.length)
    handleChangePage(lastPageIndex)
    setData(newData)
    onUpdateData(newData)
  }

  return (
    <div className="mb-3">
      <div className="flex items-center">
        {
          LabelAddRow &&
          <Button className="my-3 pea-button !px-3 !py-4" onClick={() => addRow()}>
            <FontAwesomeIcon icon={faPlus} className="mr-2"/>
            {LabelAddRow}
          </Button>
        }

        {
          visibleDelete &&
          <Button className="my-3 mx-2 pea-button-outline !px-3 !py-4" onClick={() => handleUpdateData([])}>
            <FontAwesomeIcon icon={faTrashCan}/>
            ลบทั้งหมด
          </Button>
        }
      </div>


      <div className="rounded-[20px] border">
        <Table className="rounded-tl-[8px] rounded-tr-[8px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                          : flexRender(header.column.columnDef.header, header.getContext())
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
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {
        data.length > 0 &&
        <div className="flex items-center space-x-2 py-4 justify-center lg:justify-end mt-3">
          <PaginationList totalCount={totalCount}
                          pageSize={pageSize}
                          page={pageIndex}
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
