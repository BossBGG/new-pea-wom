import Modal from "@/app/layout/Modal";
import {Button} from "@/components/ui/button";
import InputRadio from "@/app/components/form/InputRadio";
import {Options, WorkOrderObj} from "@/types";
import {useEffect, useState} from "react";
import InputSelect from "@/app/components/form/InputSelect";
import InputCheckbox from "@/app/components/form/InputCheckbox";
import {useRouter} from "next/navigation";
import {dismissAlert, showProgress} from "@/app/helpers/Alert";

interface ModalNewWorkOrderProps {
  open: boolean,
  onClose: () => void,
}

const FooterModal = ({
                       cancel,
                       submit
                     }:
                     {
                       cancel: () => void,
                       submit: () => void,
                     }) => (
  <div className="w-full flex flex-wrap justify-between items-center">
    <div className="p-2 w-1/2">
      <Button
        className="text-[#671FAB] w-full bg-white border-1 border-[#671FAB] rounded-full font-semibold md:text-start text-center cursor-pointer hover:bg-white"
        onClick={() => cancel()}
      >
        ยกเลิก
      </Button>
    </div>
    <div className="p-2 w-1/2">
      <Button className="pea-button w-full" onClick={() => submit()}>
        สร้างใบสั่งงาน
      </Button>
    </div>
  </div>
)

const ModalNewWorkOrder = ({
                             open,
                             onClose
                           }: ModalNewWorkOrderProps) => {
  const router = useRouter()

  const workOrderTypeOptions: Options[] = [
    {label: 'ใบสั่งงาน', value: 'once_order', description: 'สร้างใบสั่งงานแบบใบเดียว'},
    {label: 'ใบสั่งงานเป็นชุด', value: 'group_order', description: 'สร้างใบสั่งงานแบบหลายใบ'},
  ]

  const serviceTypeOptions: Options[] = [
    {label: 'Y3-2 บริการจัดหาและให้เช่าอุปกรณ์ไฟฟ้า', value: '1'},
    {label: 'Y3-3 บริการอื่นๆ', value: '2'},
    {
      label: 'Y3-4 บริการทดสอบและสอบเทียบอุปกรณ์ไฟฟ้า', value: '3',
      subOptions: [
        {label: 'S301 ขอซ่อมแซมอุปกรณ์ไฟฟ้า', value: '3_1'},
        {label: 'S302 ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร์', value: '3_2'},
        {label: 'S303 ขอตรวจสอบและบำรุงรักษาเคเบิล', value: '3_3'},
        {label: 'S304 ขอตรวจสอบและบำรุงรักษารีเลย์', value: '3_4'},
        {label: 'S305 ขอบำรุงรักษาหม้อแปลงไฟฟ้า', value: '3_5'},
        {label: 'S306 ขอแก้ไขและบำรุงรักษาระบบจำหน่าย', value: '3_6'},
        {label: 'S307 ขอแก้ไขและบำรุงรักษาระบบจำหน่ายโดย Hotline', value: '3_7'},
        {label: 'S308 ขอตรวจสอบระบบไฟฟ้าพร้อมออกใบรับรอง', value: '3_8'},
        {label: 'S309 ขอตรวจหาจุดร้อน/จุดสัมผัสทางไฟฟ้า', value: '3_9'},
        {label: 'S310 ขอปรึกษาด้านวิศวกรรมไฟฟ้า/ตรวจรับรองระบบ', value: '3_10'},
        {label: 'S311 ขอปรึกษาด้านวิศวกรรมและก่อสร้าง', value: '3_11'},
        {label: 'S312 ขอทดสอบอุปกรณ์ไฟฟ้า', value: '3_12'},
        {label: 'S314 ขอเช่าฉนวนครอบสายไฟฟ้า', value: '3_14'},
        {label: 'S315 ขอเช่าหม้อแปลง', value: '3_15'},
        {label: 'S316 ขอเช่าเครื่องกำเนิดไฟฟ้า', value: '3_16'},
        {label: 'S317 ขอติดตั้งมิเตอร์เปรียบเทียบ TOU', value: '3_17'},
        {label: 'S318 ขอซื้อมิเตอร์/อุปกรณ์ไฟฟ้า', value: '3_18'},
        {label: 'S319 ขอซื้อข้อมูล Load Profile', value: '3_19'},
        {label: 'S320 ขอติดตั้งมิเตอร์เปรียบเทียบ กรณีผิดปกติ', value: '3_20'},
        {label: 'S322 ขอตรวจสอบและบำรุงรักษาระบบไฟฟ้า แบบครบวงจร', value: '3_22'},
        {label: 'S323 ขอทดสอบผลิตภัณฑ์คอนกรีต', value: '3_23'},
        {label: 'S329 ขอซื้อขายใบรับรองการผลิตพลังงานหมุนเวียน', value: '3_29'},
        {label: 'S399 ขอบริการอื่นๆ', value: '3_99'},
        {label: 'S332 Solar Battery', value: '3_32-solar-battery'},
        {label: 'S332 Solar Air Conditioner', value: '3_32-solar-air-conditioner'},
        
      ]
    },
    {
      label: 'Y3-6 บริการตรวจสอบและบำรุงรักษาระบบไฟฟ้า', value: '4',
      subOptions: [
        {label: 'S301 ขอซ่อมแซมอุปกรณ์ไฟฟ้า', value: '4_1'},
        {label: 'S302 ขอตรวจสอบและบำรุงรักษาสวิตซ์เกียร์', value: '4_2'},
        {label: 'S303 ขอตรวจสอบและบำรุงรักษาเคเบิล', value: '4_3'},
        {label: 'S304 ขอตรวจสอบและบำรุงรักษารีเลย์', value: '4_4'},
        {label: 'S305 ขอบำรุงรักษาหม้อแปลงไฟฟ้า', value: '4_5'},
        {label: 'S306 ขอแก้ไขและบำรุงรักษาระบบจำหน่าย', value: '4_6'},
        {label: 'S307 ขอแก้ไขและบำรุงรักษาระบบจำหน่ายโดย Hotline', value: '4_7'},
        {label: 'S308 ขอตรวจสอบระบบไฟฟ้าพร้อมออกใบรับรอง', value: '4_8'},
        {label: 'S309 ขอตรวจหาจุดร้อน/จุดสัมผัสทางไฟฟ้า', value: '4_9'},
        {label: 'S310 ขอปรึกษาด้านวิศวกรรมไฟฟ้า/ตรวจรับรองระบบ', value: '4_10'},
        {label: 'S311 ขอปรึกษาด้านวิศวกรรมและก่อสร้าง', value: '4_11'},
        {label: 'S312 ขอทดสอบอุปกรณ์ไฟฟ้า', value: '4_12'},
        {label: 'S314 ขอเช่าฉนวนครอบสายไฟฟ้า', value: '4_14'},
        {label: 'S315 ขอเช่าหม้อแปลงขอเช่าหม้อแปลง', value: '4_15'},
        {label: 'S316 ขอเช่าเครื่องกำเนิดไฟฟ้า', value: '4_16'},
        {label: 'S317 ขอติดตั้งมิเตอร์เปรียบเทียบ TOU', value: '4_17'},
        {label: 'S318 ขอซื้อมิเตอร์/อุปกรณ์ไฟฟ้า', value: '4_18'},
        {label: 'S319 ขอซื้อข้อมูล Load Profile', value: '4_19'},
        {label: 'S320 ขอติดตั้งมิเตอร์เปรียบเทียบ กรณีผิดปกติ', value: '4_20'},
        {label: 'S322 ขอตรวจสอบและบำรุงรักษาระบบไฟฟ้า แบบครบวงจร', value: '4_22'},
        {label: 'S323 ขอทดสอบผลิตภัณฑ์คอนกรีต', value: '4_23'},
        {label: 'S329 ขอซื้อขายใบรับรองการผลิตพลังงานหมุนเวียน', value: '4_29'},
        {label: 'S399 ขอบริการอื่นๆ', value: '4_99'},
        {label: 'S332 Solar Battery', value: '4_32-solar-battery'},
        {label: 'S332 Solar Air Conditioner', value: '4_32-solar-air-conditioner'},
      ]
    },
  ]

  const organizationTypeOptions: Options[] = [
    {
      label: 'กฟน.1 เชียงใหม่', value: '1',
      subOptions: [
        {label: 'กฟจ. เชียงใหม่', value: '1_1'},
        {
          label: 'กฟจ. ลำพูน', value: '1_2',
          subOptions: [
            {label: 'กฟส. เมืองลำพูน', value: '1_2_1'},
            {label: 'กฟส. บ้านโฮ่ง', value: '1_2_2'},
            {label: 'กฟส. แม่ตืน', value: '1_2_3'},
            {label: 'กฟส. แม่ทา', value: '1_2_4'},
            {label: 'กฟส. เวียงหนองล่อง', value: '1_2_5'},
            {label: 'กฟส.บ้านธิ', value: '1_2_6'},
            {label: 'กฟส. ป่าซาง', value: '1_2_7'},
            {label: 'กฟส. ลี้', value: '1_2_8'},
            {label: 'กฟส. นครเจดีย์', value: '1_2_9'},
            {label: 'กฟส. ทุ่งหัวช้าง', value: '1_2_10'},
          ]
        }
      ]
    },
    {label: 'กฟน.2 พิษณุโลก', value: '2'},
    {label: 'กฟน.3 ลพบุรี', value: '3'}
  ]

  const [data, setData] = useState<WorkOrderObj>({} as WorkOrderObj)

  const submit = () => {
    showProgress()
    
    // ตรวจสอบว่าเลือก serviceType แล้วหรือยัง
    if (!data.serviceType) {
      dismissAlert()
      alert('กรุณาเลือกประเภทงานบริการก่อน')
      return
    }
    
    // ตรวจสอบว่าเป็น subOption หรือไม่ (ถ้าเลือกหมวดหลักต้องเลือก sub ด้วย)
    const isMainCategory = ['1', '2', '3', '4'].includes(data.serviceType)
    if (isMainCategory) {
      dismissAlert()
      alert('กรุณาเลือกประเภทงานบริการย่อย')
      return
    }
    
    const currentServiceType = data.serviceType
    
    // ตรวจสอบประเภทงานบริการที่เลือก
    let targetPath = "/work_order/s301" 
    
    switch(currentServiceType) {
      case '3_1': 
      case '4_1': 
        targetPath = "/work_order/s301"
        break
      case '3_2': 
      case '4_2': 
        targetPath = "/work_order/s302"
        break
      case '3_3': 
      case '4_3': 
        targetPath = "/work_order/s303"
        break
      case '3_4': 
      case '4_4': 
        targetPath = "/work_order/s304"
        break
      case '3_5': 
      case '4_5': 
        targetPath = "/work_order/s305"
        break
      case '3_6': 
      case '4_6': 
        targetPath = "/work_order/s306"
        break
      case '3_7': 
      case '4_7': 
        targetPath = "/work_order/s307"
        break
      case '3_8': 
      case '4_8': 
        targetPath = "/work_order/s308"
        break
      case '3_9': 
      case '4_9': 
        targetPath = "/work_order/s309"
        break
      case '3_10': 
      case '4_10': 
        targetPath = "/work_order/s310"
        break
      case '3_11': 
      case '4_11': 
        targetPath = "/work_order/s311"
        break
      case '3_12': 
      case '4_12': 
        targetPath = "/work_order/s312"
        break
      case '3_14': 
      case '4_14': 
        targetPath = "/work_order/s314"
        break
      case '3_15': 
      case '4_15': 
        targetPath = "/work_order/s315"
        break
      case '3_16': 
      case '4_16': 
        targetPath = "/work_order/s316"
        break
      case '3_17': 
      case '4_17': 
        targetPath = "/work_order/s317"
        break
      case '3_18': 
      case '4_18': 
        targetPath = "/work_order/s318"
        break
      case '3_19': 
      case '4_19': 
        targetPath = "/work_order/s319"
        break
      case '3_20': 
      case '4_20': 
        targetPath = "/work_order/s320"
        break
      case '3_22': 
      case '4_22': 
        targetPath = "/work_order/s322"
        break
      case '3_23': 
      case '4_23': 
        targetPath = "/work_order/s323"
        break
      case '3_29': 
      case '4_29': 
        targetPath = "/work_order/s329"
        break
      case '3_99': 
      case '4_99': 
        targetPath = "/work_order/s399"
        break
      case '3_32-solar-battery': 
      case '4_32-solar-battery': 
        targetPath = "/work_order/s332-solar-battery"
        break
      case '3_32-solar-air-conditioner': 
      case '4_32-solar-air-conditioner': 
        targetPath = "/work_order/s332-solar-air-conditioner"
        break
      default:
        targetPath = "/work_order/s301"
    }
    
    router.push(targetPath)
    setTimeout(() => {
      dismissAlert()
    }, 500)
  }

  useEffect(() => {
    if (!data.sheetType) {
      setData(prevState => ({...prevState, sheetType: workOrderTypeOptions[0].value}));
    }
  }, [])

  const handleUpdateData = (key: string, value: string | string[]) => {
    console.log('value >>> ', value)
    console.log('key >>> ', key)
    setData(prevState => ({...prevState, [key]: value}));
  }

  return (
    <Modal title={'สร้างใบงาน'}
           open={open}
           onClose={onClose}
           footer={<FooterModal cancel={onClose} submit={() => submit()}/>}
    >
      <InputRadio label="เลือกประเภทการสร้างใบงาน"
                  options={workOrderTypeOptions}
                  value={data.sheetType || workOrderTypeOptions[0].value}
                  setData={(v: string) => handleUpdateData('sheetType', v)}
                  classItem="rounded-[12px] p-3 w-full border-1"
                  classItemChecked="border-1 border-[#671FAB]"
                  classLabel="flex flex-col items-start"
                  className="flex"
      />

      {
        data.sheetType === workOrderTypeOptions[1].value &&
        <InputCheckbox options={organizationTypeOptions}
                       label="เลือกหน่วยงาน"
                       setData={(v: string[]) => handleUpdateData('organization', v)}
                       value={data.organization || []}
        />
      }

      <InputSelect options={serviceTypeOptions}
                   value={data.serviceType}
                   placeholder="เลือกประเภทงานบริการ"
                   setData={(v: string) => handleUpdateData('serviceType', v)}
                   label="ประเภทงานบริการ"
      />
    </Modal>
  )
}

export default ModalNewWorkOrder;