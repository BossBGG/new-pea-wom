import Modal from "@/app/layout/Modal";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import InputSelect from "@/app/components/form/InputSelect";
import InputText from "@/app/components/form/InputText";
import {Options, WorkerObj} from "@/types";
import {Label} from "@/components/ui/label";

interface AddWorkerProps {
  open: boolean,
  onClose: () => void,
  index: number,
  onAddWorker?: (worker: WorkerObj) => void,
  groupWorkerOptions: Options[],
  workerOptions: Options[],
  eventOptions: Options[]
}

const AddWorker = ({
                    open,
                    onClose,

                    onAddWorker,
                    groupWorkerOptions,
                    workerOptions,
                    eventOptions
                  }: AddWorkerProps) => {
  

  const [formData, setFormData] = useState<Partial<WorkerObj>>({
    group: '',
    worker: '',
    operation_center: '',
    event: '',
    hours: 0, 
    unit: ''
  });

  
  const handleInputChange = (key: keyof WorkerObj, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.group || !formData.worker) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const newWorker: WorkerObj = {
      id: Date.now(), 
      worker_id: `WK${Date.now()}`, 
      group: formData.group || '',
      worker: formData.worker || '',
      operation_center: formData.operation_center || '',
      event: formData.event || '',
      hours: typeof formData.hours === 'string' ? parseInt(formData.hours) || 0 : formData.hours || 0,
      unit: formData.unit || '',
      group_worker: formData.group || '', 
      isUpdate: false,
      isEdited: false
    };

    onAddWorker?.(newWorker);
    
    // Reset form
    setFormData({
      group: '',
      worker: '',
      operation_center: '',
      event: '',
      hours: 0,
      unit: ''
    });
    
    onClose();
  };

  const handleCancel = () => {
    // Reset form on cancel
    setFormData({
      group: '',
      worker: '',
      operation_center: '',
      event: '',
      hours: 0,
      unit: ''
    });
    onClose();
  };


  return (
    <Modal title="เพิ่มผู้ปฏิบัติงาน"
           footer={
             <div className="w-full flex flex-wrap justify-between items-center">
               <div className="p-2 w-1/2">
                 <Button
                   className="text-[#671FAB] w-full bg-white border-1 border-[#671FAB] rounded-full font-semibold md:text-start text-center cursor-pointer hover:bg-white"
                   onClick={handleCancel}
                 >
                   ยกเลิก
                 </Button>
               </div>
               <div className="p-2 w-1/2">
                 <Button className="pea-button w-full" onClick={handleSubmit}>
                   บันทึก
                 </Button>
               </div>
             </div>
           }
           open={open} 
           onClose={onClose}>
      
      <div className="space-y-4">
        {/* กลุ่มผู้ปฏิบัติงาน */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            กลุ่มผู้ปฏิบัติงาน
          </Label>
          <InputSelect 
            options={groupWorkerOptions}
            value={formData.group || ''}
            placeholder="เลือกกลุ่มผู้ปฏิบัติงาน"
            setData={(value: string) => handleInputChange('group', value)}
   
          />
         
        </div>

        {/* ผู้ปฏิบัติงาน */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            ผู้ปฏิบัติงาน
          </Label>
          <InputSelect 
            options={workerOptions}
            value={formData.worker || ''}
            placeholder="เลือกผู้ปฏิบัติงาน"
            setData={(value: string) => handleInputChange('worker', value)}
          
          />
          
        </div>

        {/* ศูนย์งานหลัก */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            ศูนย์งานหลัก
          </Label>
          <InputText 
            value={formData.operation_center || ''}
            placeholder="ระบุศูนย์งานหลัก"
            onChange={(value: string) => handleInputChange('operation_center', value)}
          />
        </div>

        {/* กิจกรรม */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            กิจกรรม
          </Label>
          <InputSelect 
            options={eventOptions}
            value={formData.event || ''}
            placeholder="เลือกกิจกรรม"
            setData={(value: string) => handleInputChange('event', value)}
            label="" // เพิ่ม label prop ถ้า InputSelect ต้องการ
          />
          
        </div>

        {/* ชั่วโมง/งาน */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            ชั่วโมง/งาน
          </Label>
          <InputText 
            value={formData.hours?.toString() || ''}
            placeholder="ระบุชั่วโมง/งาน"
            onChange={(value: string) => handleInputChange('hours', value)}
            numberOnly={true}
          />
        </div>

        {/* หน่วย */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            หน่วย
          </Label>
          <InputText 
            value={formData.unit || ''}
            placeholder="ระบุหน่วย"
            onChange={(value: string) => handleInputChange('unit', value)}
          />
        </div>
      </div>
    </Modal>
  )
}

export default AddWorker;