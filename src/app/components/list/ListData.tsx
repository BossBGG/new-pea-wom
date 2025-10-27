import {useEffect, useRef, useState} from "react";
import {PaginationList} from "@/components/ui/pagination-list";
import * as React from "react";
import {TableListApi} from "@/app/api/TableApiHelper";
import type {CancelTokenSource} from "axios";
import {dismissAlert, showError, showProgress} from "@/app/helpers/Alert";

interface ListDataProps {
  children: React.ReactNode;
  visibleSizeSelection?: boolean;
  setListData: (data: unknown[]) => void;
  tableApi: TableListApi;
  tableApiData?: {
    [key: string]: string | number | boolean | Date | undefined;
  };
  layoutClass?: string;
  layoutStyle?: { [key: string]: string };
  limit?: number
}

const ListData = ({
                    children,
                    visibleSizeSelection,
                    setListData,
                    tableApi,
                    tableApiData = {},
                    layoutClass,
                    layoutStyle,
                    limit
                  }: ListDataProps) => {
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [pageSize, setPageSize] = useState(limit || 10);
  const pageSizeSelectOptions = {
    pageSizeOptions: [10, 20, 30, 50, 100],
  };

  const prevTableApiDataRef = useRef<string>("");
  const isResettingRef = useRef(false);
  const isFirstRenderRef = useRef(true);

  let cancelTokenSource: CancelTokenSource | null = null;

  const fetchListData = async () => {
    showProgress();
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
    }

    tableApi
      .callApi({
        page: page + 1,
        limit: pageSize,
        ...tableApiData,
      })
      .then(({api, cancelToken}) => {
        cancelTokenSource = cancelToken;
        return api;
      })
      .then((res) => {
        if (res.data?.status_code === 200) {
          dismissAlert();
          const data = res?.data?.data?.items || res?.data?.data?.data || [];
          let meta = res?.data?.data?.meta || res?.data?.data?.pagination;
          if (!meta && res?.data?.data) {
            meta = {
              limit: res.data.data?.limit,
              page: res.data.data?.page,
              totalCount: res.data.data?.total
            }
          }

          setListData(data);
          setTotalCount(meta?.totalCount || 0);
        } else {
          dismissAlert();
          setListData([]);
          setTotalCount(0);
        }
      })
      .catch((error) => {
        showError(error.message);
      });
  };

  const currentTableApiDataString = JSON.stringify(tableApiData);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      prevTableApiDataRef.current = currentTableApiDataString;
      fetchListData();
      return;
    }

    if (isResettingRef.current) {
      isResettingRef.current = false;
      prevTableApiDataRef.current = currentTableApiDataString;
      fetchListData();
      return;
    }

    const hasChanged =
      prevTableApiDataRef.current !== currentTableApiDataString;

    if (hasChanged) {
      if (page !== 0) {
        isResettingRef.current = true;
        setPage(0);
        return;
      } else {
        prevTableApiDataRef.current = currentTableApiDataString;
        fetchListData();
        return;
      }
    }

    fetchListData();
  }, [page, pageSize, currentTableApiDataString]);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangePageSize = (newPageSize: number) => {
    setPageSize(newPageSize);

    if (page !== 0) {
      isResettingRef.current = true;
      setPage(0);
    }
  };

  return (
    <div className={layoutClass || ""} style={layoutStyle || undefined}>
      {children}

      <footer className="flex justify-center lg:justify-end px-3 py-2">
        <PaginationList
          totalCount={totalCount}
          pageSize={pageSize}
          page={page}
          changePage={handleChangePage}
          changePageSize={handleChangePageSize}
          pageSizeSelectOptions={
            visibleSizeSelection ? pageSizeSelectOptions : undefined
          }
        />
      </footer>
    </div>
  );
};

export default ListData;
