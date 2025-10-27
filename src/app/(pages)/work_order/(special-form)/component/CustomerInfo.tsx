import {useCallback, useEffect, useState} from "react";
import InputText from "@/app/components/form/InputText";
import {WorkOrderObj} from "@/types";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import debounce from "lodash/debounce";

interface CustomerInfoProps {
  data: WorkOrderObj;
  updateData: (value: WorkOrderObj) => void,
  disabled?: boolean
}

const CustomerInfo = ({
                        data,
                        updateData,
                        disabled
                      }: CustomerInfoProps) => {
  const [workOrder, setWorkOrder] = useState<WorkOrderObj>(data);
  const [isDisable, setIsDisable] = useState(true);

  useEffect(() => {
    if(["W", "M"].includes(data.workOrderStatusCode)) {
      setIsDisable(false)
    }
  }, [data.workOrderStatusCode]);

  useEffect(() => {
    setWorkOrder(data);
    console.log('workOrder', workOrder);
  }, [data]);

  const debounceSetData = useCallback(
    debounce((d) => {
      updateData(d);
    }, 1000), []
  )

  const handleChange = (key: string, value: string) => {
    let newData = {...data, [key]: value};
    setWorkOrder(newData);
    debounceSetData(newData)
  }

  return (
    <CardCollapse title={'ข้อมูลลูกค้า'}>
      <div className="flex flex-wrap px-0 py-2 ">
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="ชื่อลูกค้า"
                     label="ชื่อลูกค้า"
                     value={workOrder.customerName}
                     onChange={(v) => handleChange('customerName', v)}
                     disabled={isDisable || disabled}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="โทรศัพท์มือถือ"
                     label="โทรศัพท์มือถือ"
                     value={workOrder.customerMobileNo}
                     numberOnly={true}
                     onChange={(v) => handleChange('customerMobileNo', v)}
                     format="phone"
                     disabled={isDisable || disabled}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="ที่อยู่ขอรับบริการ"
                     label="ที่อยู่ขอรับบริการ"
                     value={workOrder.customerAddress}
                     onChange={(v) => handleChange('customerAddress', v)}
                     disabled={isDisable || disabled}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="อีเมล"
                     label="อีเมล"
                     value={workOrder.customerEmail}
                     onChange={(v) => handleChange('customerEmail', v)}
                     format="email"
                     disabled={isDisable || disabled}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="BP"
                     label="BP"
                     value={workOrder.customerBp}
                     onChange={(v) => handleChange('customerBp', v)}
                     disabled={isDisable || disabled}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="CA"
                     label="CA"
                     value={workOrder.customerCa}
                     onChange={(v) => handleChange('customerCa', v)}
                     disabled={isDisable || disabled}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="Latitude"
                     label="Latitude"
                     value={workOrder.customerLatitude}
                     onChange={(v) => handleChange('customerLatitude', v)}
                     format="latitude"
                     disabled={isDisable || disabled}
          />
        </div>
        <div className="w-full md:w-1/2 p-2">
          <InputText placeholder="Longitude"
                     label="Longitude"
                     value={workOrder.customerLongitude}
                     onChange={(v) => handleChange('customerLongitude', v)}
                     format="longitude"
                     disabled={isDisable || disabled}
          />
        </div>
      </div>
    </CardCollapse>
  )
}

export default CustomerInfo;
