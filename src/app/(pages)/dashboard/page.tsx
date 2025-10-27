"use client"
import {useEffect, useState} from "react";
import {useBreadcrumb} from "@/app/context/BreadcrumbContext";
import DashboardBreadcrumb from "@/app/(pages)/dashboard/breadcrumb";
import LatestUpdateData from "@/app/components/utils/LatestUpdateData";
import {WorkOrderStackChart} from "@/app/(pages)/dashboard/work-order-stack-chart";
import {WorkOrderHourChart} from "@/app/(pages)/dashboard/work-order-hour-chart";
import NotificationList from "@/app/(pages)/dashboard/notification-list";
import {Card} from "@/components/ui/card";
import MyCalendar from "@/app/components/calendar/MyCalendar";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faNoteSticky, faFileCirclePlus, faClock, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import type {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import TaskProgressChart from "@/app/(pages)/dashboard/task-progress-chart";

interface ViewButtonProps {
  label: string,
  selected: boolean,
  updateData: () => void
}

interface StatCardProps {
  backgroundColor: string,
  value: number,
  label: string,
  iconColor: string,
  unit: string,
  icon: IconDefinition
}

const StatCard = ({backgroundColor, value, label, unit, icon, iconColor}: StatCardProps) => {
  return (
    <div className="w-full lg:w-1/3 xl:w-1/6 px-2 mb-3 xl:mb-0 flex">
      <Card className="flex flex-row items-center justify-between p-3 w-full h-full"
           style={{backgroundColor, borderColor: backgroundColor}}>
        <div>
          <div className="font-medium mb-2">{label}</div>

          <div className="flex items-center">
            <div className="text-[32px] font-bold me-2">{value}</div>
            <div className="text-[12px]">{unit}</div>
          </div>
        </div>

        <div>
          <FontAwesomeIcon icon={icon} color={iconColor} size="2x"/>
        </div>
      </Card>
    </div>
  )
}

const ViewButton = ({
                      label,
                      selected,
                      updateData
                    }: ViewButtonProps) => {
  const defaultClass = "w-1/2 rounded-full shadow-none cursor-pointer bg-[#F8F8F8] text-[#57595B] hover:bg-transparent";
  const activeClass = "bg-[#E1D2FF] text-[#671FAB]";

  return (
    <Button className={`${defaultClass} ${selected && activeClass}`}
            onClick={() => updateData()}>
      {label}
    </Button>
  )
}

const WorkOrderCountInfo = () => {

}

const Dashboard = () => {
  const {setBreadcrumb} = useBreadcrumb();
  const [viewMode, setViewMode] = useState<"ALL" | "SELF">("ALL")

  useEffect(() => {
    setBreadcrumb(<DashboardBreadcrumb/>)
  }, [setBreadcrumb]);

  return (
    <div>
      <LatestUpdateData
        addonRightContent={
          <div className="bg-[#F8F8F8] text-[#4A4A4A] rounded-full p-1 font-semibold mr-2 my-3 sm:my-0">
            <ViewButton label="มุมมองทั้งหมด (200)"
                        selected={viewMode === 'ALL'}
                        updateData={() => setViewMode('ALL')}
            />
            <ViewButton label="มุมมองตนเอง"
                        selected={viewMode === 'SELF'}
                        updateData={() => setViewMode('SELF')}
            />
          </div>
        }
      />

      <div className="flex my-4 flex-wrap items-stretch">
        <StatCard backgroundColor="#E4DCFF" iconColor="#8561FF" value={120} label="ใบสั่งงานทั้งหมด" unit="/ ใบ" icon={faNoteSticky}/>
        <StatCard backgroundColor="#E3F2FF" iconColor="#2097F4" value={60} label="ใบสั่งงานใหม่" unit="/ ใบ" icon={faFileCirclePlus}/>
        <StatCard backgroundColor="#FFF4E4" iconColor="#E86339" value={30} label="ระหว่างการดำเนินงาน" unit="/ งาน" icon={faClock}/>
        <StatCard backgroundColor="#E7F4E8" iconColor="#298267" value={30} label="ดำเนินงานเสร็จสิ้น" unit="/ งาน" icon={faCircleCheck}/>
        <div className="w-full h-full lg:w-1/2 xl:w-2/6 px-2 mb-3 xl:mb-0">
          <TaskProgressChart/>
        </div>
      </div>

      {/*รายการทั้งหมด*/}
      <WorkOrderStackChart/>

      {/*จำนวนชั่วโมงการปฏิบัติงานรวม*/}
      <WorkOrderHourChart/>

      <div className="w-full flex flex-wrap">
        <div className="w-full md:w-3/4 mt-3 px-2">
          <Card>
            <MyCalendar title="ปฏิทินงาน"/>
          </Card>
        </div>
        <div className="w-full md:w-1/4 px-2">
          <NotificationList/>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
