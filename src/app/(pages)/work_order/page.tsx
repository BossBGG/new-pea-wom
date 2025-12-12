"use client";
import LatestUpdateData from "@/app/components/utils/LatestUpdateData";
import AddonRightContent from "@/app/(pages)/work_order/addon-right-content";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import { useEffect, useState } from "react";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/breadcrumb";
import { Card } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { WorkOrderChart } from "@/app/(pages)/work_order/work-order-chart";
import WorkOrderTable from "@/app/(pages)/work_order/list/work-order-table";
import MyCalendar from "@/app/components/calendar/MyCalendar";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { Progress } from "@/components/ui/progress";
import { clearCustomerRequestData } from "@/app/redux/slices/CustomerRequestSlice";
import { DESKTOP_SCREEN } from "@/app/redux/slices/ScreenSizeSlice";
import { dismissAlert, showProgress } from "@/app/helpers/Alert";
import { getDashboardSummary } from "@/app/api/WorkOrderApi";
import { WorkOrderDashBoardSummary } from "@/types";

const CardCountWorkOrder = ({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) => {
  return (
    <Card className="p-3 bg-[#F8F8F8] w-full shadow-none border-none">
      <Card className="p-3 bg-white shadow-none border-none">
        <div className="font-bold text-[24px] -mb-[10px]">{label}</div>

        <div className="flex justify-between items-center">
          <div className="font-semibold text-[20px]">คงค้าง</div>
          <div>
            <span className="text-[#671FAB] text-[32px] font-bold">
              {count}
            </span>
            <span className="font-bold text-[24px]">&nbsp;&nbsp;/ {total}</span>
          </div>
        </div>
      </Card>
    </Card>
  );
};

const CardCountWorkOrderMobile = ({
  label,
  total,
  inprogress,
  complete,
}: {
  label: string;
  total: number;
  inprogress: number;
  complete: number;
}) => {
  return (
    <Card className="p-3 bg-[#F8F8F8] shadow-none border-none w-full">
      <div className="flex w-full flex-wrap">
        <Card className="p-3 bg-white shadow-none border-none md:w-[100%] lg:w-[50%] text-center">
          <div className="font-medium text-nowrap text-[14px] -mb-[12px]">
            {label}
          </div>
          <div className="font-bold text-[24px] -mb-[14px]">{total}</div>
          <div className="font-medium text-[12px]">งานทั้งหมด</div>
        </Card>

        <div className="font-medium text-[12px] md:w-[100%] lg:w-[50%] p-3 flex flex-col justify-end">
          <Progress
            value={inprogress}
            max={total || 1}
            className="mb-3 [&>div]:bg-[#B05FF3] [&>div>div]:bg-[#B05FF3]"
          />
          <div>กำลังปฏิบัติงาน {inprogress} งาน</div>
          <div>สำเร็จแล้ว {complete} งาน</div>
        </div>
      </div>
    </Card>
  );
};

const WorkOrder = () => {
  const { setBreadcrumb } = useBreadcrumb();
  const [data, setData] = useState<WorkOrderDashBoardSummary>();
  const [viewMode, setViewMode] = useState<"ALL" | "SELF">("ALL");
  const screen_size = useAppSelector((state) => state.screen_size);
  const dispatch = useAppDispatch();
  const [countWorkOrder, setCountWorkOrder] = useState<{
    ALL: number;
    SELF: number;
  }>({ ALL: 0, SELF: 0 });

  useEffect(() => {
    setBreadcrumb(<WorkOrderBreadcrumb />);
    dispatch(clearCustomerRequestData());
  }, [setBreadcrumb]);

  useEffect(() => {
    fetchSummaryData();
  }, [viewMode]);

  const fetchSummaryData = async () => {
    showProgress();
    const response = await getDashboardSummary(viewMode).finally(() => {
      dismissAlert();
    });

    if (response.status === 200 && response.data.data) {
      setData(response.data.data);
    } else {
      setData({} as WorkOrderDashBoardSummary);
    }
  };

  return (
    <div>
      <LatestUpdateData
        addonRightContent={
          <AddonRightContent
            viewMode={viewMode}
            countWorkOrder={countWorkOrder[viewMode]}
            updateViewMode={(mode: "ALL" | "SELF") => {
              setViewMode(mode);
            }}
          />
        }
      />

      <div className="w-full flex items-stretch my-3 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-[50%] lg:w-[60%] xl:w-[70%] md:mr-3 flex flex-col">
          <Card className="px-4 py-2 flex-1">
            <div className="font-semibold text-[14px] flex items-center -mb-[15px]">
              <FontAwesomeIcon
                icon={faStickyNote}
                className="mr-2"
                size="xl"
                color="#8561FF"
              />
              ใบสั่งงานทั้งหมด{" "}
              <span className="text-[32px] mx-2 font-bold">
                {data?.summary?.totalWorkOrders || 0}
              </span>{" "}
              งาน
            </div>

            {screen_size === DESKTOP_SCREEN ? (
              <div className="flex flex-wrap">
                <div className="pr-3 w-full md:w-[50%]">
                  <CardCountWorkOrder
                    label="งานปฏิบัติงาน"
                    count={data?.summary?.execution?.pending || 0}
                    total={data?.summary?.execution?.total || 0}
                  />
                </div>

                <div className="w-full md:w-[50%]">
                  <CardCountWorkOrder
                    label="งานสำรวจ"
                    count={data?.summary?.survey?.pending || 0}
                    total={data?.summary?.survey?.total || 0}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap">
                <div className="w-full mb-3 md:mb-0 md:w-[50%] pr-0 md:pr-1">
                  <CardCountWorkOrderMobile
                    label="งานที่ปฏิบัติงาน"
                    inprogress={data?.summary?.execution?.pending || 0}
                    complete={data?.summary?.execution?.complete || 0}
                    total={data?.summary?.execution?.total || 0}
                  />
                </div>

                <div className="w-full md:w-[50%]">
                  <CardCountWorkOrderMobile
                    label="งานสำรวจ"
                    inprogress={data?.summary?.survey?.pending || 0}
                    complete={data?.summary?.survey?.complete || 0}
                    total={data?.summary?.survey?.total || 0}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="w-full md:w-[50%] lg:w-[40%] xl:w-[30%] mt-3 md:mt-0">
          <Card className="flex-1 p-3 h-full">
            <WorkOrderChart data={data?.weeklyData || []} />
          </Card>
        </div>
      </div>

      <div className="w-full">
        <MyCalendar viewMode={viewMode} />
      </div>

      <div className="w-full my-3">
        <WorkOrderTable
          viewMode={viewMode}
          updateCountWorkOrder={(count: number) => {
            setCountWorkOrder((prev) => ({ ...prev, [viewMode]: count }));
          }}
        />
      </div>
    </div>
  );
};

export default WorkOrder;
