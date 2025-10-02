import {Options} from "@/types";

const workOrderStatus: Options[] = [
  {value: 'M', label: 'รอเริ่มปฏิบัติงาน'},
  {value: 'O', label: 'อยู่ระหว่างดำเนินงาน'},
]

export const renderStatusWorkOrder = (status: string) => {
  if(status) {
    return workOrderStatus.find((workOrder) => workOrder.value == status)?.label || "รอเริ่มปฏิบัติงาน";
  }
  return "รอเริ่มปฏิบัติงาน";
}
