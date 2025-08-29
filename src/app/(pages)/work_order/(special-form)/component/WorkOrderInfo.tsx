import InputText from "@/app/components/form/InputText";
import {Options, WorkOrderObj} from "@/types";
import InputSelect from "@/app/components/form/InputSelect";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import {useAppSelector} from "@/app/redux/hook";

interface WorkOrderInfoProps {
  data: WorkOrderObj
}

const WorkOrderInfo = ({data}: WorkOrderInfoProps) => {
  const JobPriorityOptions: Options[] = [
    {value: '1', label: 'สำคัญมาก (24 ชม.)'}
  ]
  const screenSize = useAppSelector(state => state.screen_size)

  return (
    <CardCollapse title={'รายละเอียดคำร้อง'} isShowHeader={screenSize !== 'desktop'}>
      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="เลขที่ใบสั่งงาน"
                     label="เลขที่ใบสั่งงาน"
                     value={data.order_no}
                     numberOnly={true}
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="เลขที่คำร้อง"
                     label="เลขที่คำร้อง"
                     value={data.request_no}
                     numberOnly={true}
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="เลขที่คำร้อง (SAP)"
                     label="เลขที่คำร้อง (SAP)"
                     value={data.request_sap_no}
                     numberOnly={true}
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="ประเภทคำร้อง"
                     label="ประเภทคำร้อง"
                     value={data.request_type}
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/5 p-2">
          <InputText placeholder="สถานะคำร้อง"
                     value={data.request_status}
                     label="สถานะคำร้อง"
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/3 p-2">
          <InputSelect options={JobPriorityOptions}
                       value={data.job_priority}
                       placeholder="ลำดับความสำคัญของงาน"
                       label="ลำดับความสำคัญของงาน"
                       disabled={true}
          />
        </div>

        <div className="w-full md:w-1/3 p-2">
          <InputText placeholder="วันที่รับชำระเงิน"
                     value={data.payment_received_date}
                     disabled={true}
                     label="วันที่รับชำระเงิน"
          />
        </div>

        <div className="w-full md:w-1/3 p-2">
          <InputText placeholder="คำอธิบายการทำงาน"
                     value={data.work_description}
                     label="คำอธิบายการทำงาน"
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/4 p-2">
          <InputText placeholder="กอง/กฟฟ."
                     value={data.division}
                     label="กอง/กฟฟ."
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/4 p-2">
          <InputText placeholder="รหัสโรงงาน"
                     value={data.plant_code}
                     label="รหัสโรงงาน"
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/4 p-2">
          <InputText placeholder="ศูนย์งาน"
                     value={data.operation_center}
                     label="ศูนย์งาน"
                     disabled={true}
          />
        </div>

        <div className="w-full md:w-1/4 p-2">
          <InputText placeholder="ศูนย์ต้นทุน"
                     value={data.cost_center}
                     label="ศูนย์ต้นทุน"
                     disabled={true}
          />
        </div>
      </div>
    </CardCollapse>
  )
}

export default WorkOrderInfo;
