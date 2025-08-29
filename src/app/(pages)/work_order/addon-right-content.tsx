'use client'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useState} from "react";
import ModalNewWorkOrder from "@/app/(pages)/work_order/modal-new-work-order";

const AddonRightContent = (): React.ReactNode => {
  const [isOpenNewWorkOrder, setIsOpenNewWorkOrder] = useState(false);
  const defaultClassMenuItem = 'p-3 cursor-pointer mb-3';

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger className="pea-button h-[44px]">
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          สร้างใบสั่งงาน
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="p-3">
          <DropdownMenuItem className={defaultClassMenuItem}>
            สร้างใบสั่งงาน อ้างอิงใบคำร้อง
          </DropdownMenuItem>
          <DropdownMenuItem className={defaultClassMenuItem}>
            สร้างใบสั่งงานย่อย อ้างอิงใบสั่งงานหลัก
          </DropdownMenuItem>
          <DropdownMenuItem className={defaultClassMenuItem}
                            onClick={() => setIsOpenNewWorkOrder(true)}
          >
            สร้างใบสั่งงานใหม่
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalNewWorkOrder open={isOpenNewWorkOrder}
                         onClose={() => setIsOpenNewWorkOrder(false)}
      />
    </div>
  )
}
export default AddonRightContent
