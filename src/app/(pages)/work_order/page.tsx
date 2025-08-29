'use client'
import LatestUpdateData from "@/app/components/utils/LatestUpdateData";
import AddonRightContent from "@/app/(pages)/work_order/addon-right-content";
import {useBreadcrumb} from "@/app/context/BreadcrumbContext";
import {useEffect} from "react";
import WorkOrderBreadcrumb from "@/app/(pages)/work_order/breadcrumb";

const WorkOrder = () => {
  const {setBreadcrumb} = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb(<WorkOrderBreadcrumb/>)
  }, [setBreadcrumb]);
  return (
    <div>
      <LatestUpdateData addonRightContent={<AddonRightContent/>}/>
    </div>
  )
}

export default WorkOrder;
