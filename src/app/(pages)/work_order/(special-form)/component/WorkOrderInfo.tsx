import InputText from "@/app/components/form/InputText";
import {Options, WorkOrderObj} from "@/types";
import InputSelect from "@/app/components/form/InputSelect";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import {useAppSelector} from "@/app/redux/hook";
import {JobPriorityOptions} from "@/app/api/WorkOrderApi";
import {useEffect, useState} from "react";
import {Selection} from "@/app/components/form/Selection";
import handleSearchMainWorkCenter from "@/app/helpers/SearchMainWorkCenter";
import {formatJSDateTH} from "@/app/helpers/DatetimeHelper";
import {DESKTOP_SCREEN} from "@/app/redux/slices/ScreenSizeSlice";
import {getWorkOrderStatusLabel} from "@/app/helpers/map-work-order-status";

interface WorkOrderInfoProps {
  data: WorkOrderObj,
  updateData: (d: WorkOrderObj) => void,
  mainWorkCenterOptions: Options[],
  onUpdateOptions: (d: Options[]) => void,
  disabled?: boolean
}

const WorkOrderInfo = ({
                         data,
                         updateData,
                         mainWorkCenterOptions,
                         onUpdateOptions,
                         disabled
                       }: WorkOrderInfoProps) => {

  const screenSize = useAppSelector(state => state.screen_size)
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if(["W", "M"].includes(data.workOrderStatusCode)) {
      setIsDisable(false)
    }
  }, [data.workOrderStatusCode]);

  const handleUpdateData = (key: keyof WorkOrderObj, value: string | number) => {
    let newData = {
      ...data,
      [key]: value
    }

    updateData(newData);
  }

  return (
    <CardCollapse title={'รายละเอียดคำร้อง'} isShowHeader={screenSize !== DESKTOP_SCREEN}>
      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="เลขที่ใบสั่งงาน"
                     label="เลขที่ใบสั่งงาน"
                     value={data.workOrderNo}
                     numberOnly={true}
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="เลขที่คำร้อง"
                     label="เลขที่คำร้อง"
                     value={data.customerRequestNo as string}
                     numberOnly={true}
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="เลขที่คำร้อง (SAP)"
                     label="เลขที่คำร้อง (SAP)"
                     value={data.sapOrderNo}
                     numberOnly={true}
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="ประเภทคำร้อง"
                     label="ประเภทคำร้อง"
                     value={data.serviceName}
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="สถานะคำร้อง"
                     value={getWorkOrderStatusLabel(data.workOrderStatusCode)}
                     // value={data.workOrderStatusName}
                     label="สถานะคำร้อง"
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/3 p-2">
          <InputSelect options={JobPriorityOptions}
                       value={data.priority?.toString() || ""}
                       placeholder="ลำดับความสำคัญของงาน"
                       label="ลำดับความสำคัญของงาน"
                       setData={(v) => handleUpdateData('priority', parseInt(v as string))}
                       disabled={isDisable || disabled}
          />
        </div>

        <div className="w-full md:w-1/3 p-2">
          <InputText placeholder="วันที่รับชำระเงิน"
                     value={data.sapProcessCreatedDate ? formatJSDateTH(new Date(data.sapProcessCreatedDate), "dd MMMM yyyy") : ""}
                     disabled={true}
                     label="วันที่รับชำระเงิน"
          />
        </div>

        <div className="w-full md:w-1/3 p-2">
          <InputText placeholder="คำอธิบายการทำงาน"
                     value={data.workDescription }
                     label="คำอธิบายการทำงาน"
                     onChange={(v) => handleUpdateData('workDescription', v)}
                     disabled={isDisable || disabled}
          />
        </div>

        <div className="w-full md:w-1/4 p-2">
          <InputText placeholder="กอง/กฟฟ."
                     value={data.peaNameFull}
                     label="กอง/กฟฟ."
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/4 p-2">
          <InputText placeholder="รหัสโรงงาน"
                     value={data.officePlant}
                     label="รหัสโรงงาน"
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/4 p-2">
          <div className="mb-3">ศูนย์งาน</div>
          <Selection options={mainWorkCenterOptions}
                     value={data.mainWorkCenterId}
                     placeholder="ศูนย์งาน"
                     onSearch={(s: string) => handleSearchMainWorkCenter(s)}
                     onUpdateOptions={onUpdateOptions}
                     onUpdate={(v) => handleUpdateData('mainWorkCenterId', v)}
                     disabled={isDisable || disabled}
          />
        </div>

        <div className="w-full md:w-1/4 p-2">
          <InputText placeholder="ศูนย์ต้นทุน"
                     value={data.costCenter}
                     label="ศูนย์ต้นทุน"
                     disabled={true}
          />
        </div>
      </div>
    </CardCollapse>
  )
}

export default WorkOrderInfo;
