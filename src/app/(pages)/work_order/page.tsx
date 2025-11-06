'use client'
import LatestUpdateData from "@/app/components/utils/LatestUpdateData";
import AddonRightContent from "@/app/(pages)/work_order/addon-right-content";
import {useBreadcrumb} from "@/app/context/BreadcrumbContext";
import {useEffect, useState} from "react";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/breadcrumb";
import {Card} from "@/components/ui/card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStickyNote} from "@fortawesome/free-solid-svg-icons";
import {WorkOrderChart} from "@/app/(pages)/work_order/work-order-chart";
import WorkOrderTable from "@/app/(pages)/work_order/list/work-order-table";
import MyCalendar from "@/app/components/calendar/MyCalendar";
import {useAppDispatch, useAppSelector} from "@/app/redux/hook";
import {Progress} from "@/components/ui/progress";
import {clearCustomerRequestData} from "@/app/redux/slices/CustomerRequestSlice";

const CardCountWorkOrder = ({
                              label,
                              count,
                              total
                            }: {
  label: string,
  count: number,
  total: number
}) => {
  return (
    <Card className="p-3 bg-[#F8F8F8] w-full md:w-[50%] shadow-none border-none">
      <Card className="p-3 bg-white shadow-none border-none">
        <div className="font-bold text-[24px] -mb-[10px]">{label}</div>

        <div className="flex justify-between items-center">
          <div className="font-semibold text-[20px]">คงค้าง</div>
          <div>
            <span className="text-[#671FAB] text-[32px] font-bold">{count}</span>
            <span className="font-bold text-[24px]">&nbsp;&nbsp;/ {total}</span>
          </div>
        </div>
      </Card>
    </Card>
  )
}

const CardCountWorkOrderMobile = ({
                                    label,
                                    total,
                                    inprogress,
                                    complete
                                  }: {
  label: string,
  total: number,
  inprogress: number,
  complete: number,
}) => {
  return (
    <Card className="p-3 bg-[#F8F8F8] shadow-none border-none md:w-[50%] w-full">
      <div className="flex w-full flex-wrap">
        <Card className="p-3 bg-white shadow-none border-none md:w-[100%] lg:w-[50%] text-center">
          <div className="font-medium text-nowrap text-[14px] -mb-[12px]">{label}</div>
          <div className="font-bold text-[24px] -mb-[14px]">{total}</div>
          <div className="font-medium text-[12px]">งานทั้งหมด</div>
        </Card>

        <div className="font-medium text-[12px] md:w-[100%] lg:w-[50%] p-3 flex flex-col justify-end">
          <Progress value={inprogress}
                    max={total}
                    className="mb-3 [&>div]:bg-[#B05FF3] [&>div>div]:bg-[#B05FF3]"
          />
          <div>กำลังปฏิบัติงาน {inprogress} งาน</div>
          <div>สำเร็จแล้ว {complete} งาน</div>
        </div>
      </div>
    </Card>
  )
}

const WorkOrder = () => {
  const {setBreadcrumb} = useBreadcrumb()
  const [data, setData] = useState()
  const [viewMode, setViewMode] = useState<'ALL' | 'SELF'>('ALL');
  const screen_size = useAppSelector((state) => state.screen_size)
  const dispatch = useAppDispatch()

  useEffect(() => {
    setBreadcrumb(<WorkOrderBreadcrumb/>)
    dispatch(clearCustomerRequestData())
  }, [setBreadcrumb]);


  return (
    <div>
      <LatestUpdateData
        addonRightContent={
          <AddonRightContent
            viewMode={viewMode}
            updateViewMode={(mode: "ALL" | "SELF") => setViewMode(mode)}/>
        }
      />

      <div className="w-full flex items-stretch my-3 flex-wrap md:flex-nowrap">
        <div className="w-full md:w-[60%] md:mr-3 flex flex-col flex-1">
          <Card className="px-4 py-3 flex-1">
            <div className="font-semibold text-[14px] flex items-center -mb-[15px]">
              <FontAwesomeIcon icon={faStickyNote} className="mr-2" size="xl" color="#8561FF"/>
              ใบสั่งงานทั้งหมด <span className="text-[32px] mx-2 font-bold">120</span> งาน
            </div>

            {
              screen_size === "desktop"
                ? <div className="flex flex-wrap">
                  <CardCountWorkOrder label="งานปฏิบัติงาน"
                                      count={33}
                                      total={56}/>

                  <CardCountWorkOrder label="งานสำรวจ"
                                      count={26}
                                      total={64}/>
                </div>
                : <div className="flex flex-wrap">
                  <CardCountWorkOrderMobile label="งานที่ปฏิบัติงาน"
                                            inprogress={23}
                                            complete={33}
                                            total={56}
                  />

                  <CardCountWorkOrderMobile label="งานสำรวจ"
                                            inprogress={38}
                                            complete={26}
                                            total={64}
                  />
                </div>
            }
          </Card>
        </div>

        <div className="w-full md:w-[40%] mt-3 md:mt-0 flex-1">
          <Card className="flex-1 p-3">
            <WorkOrderChart/>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <MyCalendar/>
      </div>

      <div className="w-full my-3">
        <WorkOrderTable viewMode={viewMode}/>
      </div>
    </div>
  )
}

export default WorkOrder;
