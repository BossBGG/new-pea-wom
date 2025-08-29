import {useEffect, useState} from "react";
import {PaginationList} from "@/components/ui/pagination-list";
import * as React from "react";
import {TableListApi} from "@/app/api/TableApiHelper";
import type {CancelTokenSource} from "axios";
import {dismissAlert, showError, showProgress} from "@/app/helpers/Alert";

interface ListDataProps {
  children: React.ReactNode;
  visibleSizeSelection?: boolean;
  setListData: (data: unknown[]) => void;
  tableApi: TableListApi,
  tableApiData?: {
    [key: string]: string | number | boolean | Date | undefined
  },
  layoutClass?: string
  layoutStyle?: {[key: string]: string};
}

const ListData = ({
                    children,
                    visibleSizeSelection,
                    setListData,
                    tableApi,
                    tableApiData,
                    layoutClass,
                    layoutStyle
                  }: ListDataProps) => {

  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [pageSize, setPageSize] = useState(10)
  const pageSizeSelectOptions = {
    pageSizeOptions: [10, 20, 30, 50, 100],
  }

  let cancelTokenSource: CancelTokenSource | null = null

  const fetchListData = async () => {
    showProgress()
    if (cancelTokenSource) {
      cancelTokenSource.cancel()
    }

    tableApi.callApi({
      page: page + 1,
      limit: pageSize,
      sortOrder: '',
      sortBy: '',
      ...tableApiData
    })
      .then(({api, cancelToken}) => {
        cancelTokenSource = cancelToken
        return api
      })
      .then(res => {
        if (res.data?.status_code === 200) {
          dismissAlert()
          const data = res?.data?.data?.items || [];
          const meta = res?.data?.data?.meta;
          setListData(data)
          setTotalCount(meta?.totalCount || 0)
        } else {
          dismissAlert()
          setListData([])
        }
      })
      .catch((error) => {
        showError(error.message)
      })
  }

  useEffect(() => {
    fetchListData()
  }, [page, pageSize, tableApiData]);

  return (
    <div className={layoutClass || ''} style={layoutStyle || undefined}>

      {children}

      <footer className="flex justify-center lg:justify-end px-3 py-2">
        <PaginationList totalCount={totalCount}
                        pageSize={pageSize}
                        page={page}
                        changePage={(p) => setPage(p)}
                        changePageSize={(limit) => setPageSize(limit)}
                        pageSizeSelectOptions={visibleSizeSelection ? pageSizeSelectOptions : undefined}
        />
      </footer>
    </div>
  )
}

export default ListData;
