import Modal from "@/app/layout/Modal";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import InputText from "@/app/components/form/InputText";
import {Assignee, MainWorkCenter, Options, Event} from "@/types";
import {Label} from "@/components/ui/label";
import {Selection} from "@/app/components/form/Selection";
import handleSearchMainWorkCenter from "@/app/helpers/SearchMainWorkCenter";
import handleSearchEvent from "@/app/helpers/SearchEvent";
import {groupWorkerOptions} from "@/app/api/WorkOrderApi";

interface AddWorkerProps {
  open: boolean,
  onClose: () => void,
  onAddWorker: (worker: Assignee) => void,
  onUpdateWorker: (worker: Assignee) => void,
  workerOptions: Options[],
  eventOptions: Options[],
  workCenterOptions: Options[],
  onUpdateEventOptions: (d: Options[]) => void,
  onUpdateWorkCenterOptions: (d: Options[]) => void,
  editData: Assignee | null
}

const AddWorker = ({
                    open,
                    onClose,
                    onAddWorker,
                    workerOptions,
                    eventOptions,
                     workCenterOptions,
                     onUpdateEventOptions,
                     onUpdateWorkCenterOptions,
                     editData,
                     onUpdateWorker
                  }: AddWorkerProps) => {


  const [formData, setFormData] = useState<Assignee>({} as Assignee);

  useEffect(() => {
    if(editData) {
      setFormData(editData)
    }
  }, [editData])

  const handleInputChange = (key: keyof Assignee, value: string | number, item?: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value,
      workUnit: key === 'userType'
        ? value === 'peaUser'
          ? 'H' : 'Z05'
        : prev.workUnit
    }));

    if(item) {
      switch (key) {
        case "workCenterId":
          let inOptionWorker = workCenterOptions.find((opt) => opt.value === value)
          if(!inOptionWorker) {
            workCenterOptions.push({value: value, label: item.Ktext, data: item});
            onUpdateWorkCenterOptions(workCenterOptions);
          }
          break;
        case "workActivityTypeId":
          let inOption = eventOptions.find((opt) => opt.value === value)
          if(!inOption) {
            eventOptions.push({value: value, label: item.ktext, data: item});
            onUpdateEventOptions(eventOptions)
          }
          break;
        case "username":
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = () => {
    if (!formData.userType
      || !formData.username
      || !formData.workCenterId
      || !formData.workActivityTypeId
      || !formData.workHours
      || !formData.workUnit
    ) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if(editData) {
      onUpdateWorker(formData)
    }else {
      const newWorker: Assignee = {
        ...formData,
        isUpdate: false,
        isEdited: false
      } as Assignee;

      onAddWorker?.(newWorker);
    }

    // Reset form
    setFormData({} as Assignee);
    onClose();
  };

  const handleCancel = () => {
    setFormData({} as Assignee);
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
          <Selection
            options={groupWorkerOptions}
            value={formData.userType || ''}
            placeholder="เลือกกลุ่มผู้ปฏิบัติงาน"
            onUpdate={(value: string | number) => handleInputChange('userType', value)}
          />

        </div>

        {/* ผู้ปฏิบัติงาน */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            ผู้ปฏิบัติงาน
          </Label>
          <Selection value={formData.username || ''}
                     options={workerOptions}
                     placeholder={"ผู้ปฏิบัติงาน"}
                     onUpdate={(value) => handleInputChange('username', value)}
          />
        </div>

        {/* ศูนย์งานหลัก */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            ศูนย์งานหลัก
          </Label>
          <Selection value={formData.workCenterId || ''}
                     options={workCenterOptions}
                     placeholder={"ระบุศูนย์งานหลัก"}
                     onUpdate={(value, item: MainWorkCenter) => handleInputChange('workCenterId', value, item)}
                     onSearch={(s: string) => handleSearchMainWorkCenter(s)}
          />
        </div>

        {/* กิจกรรม */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            กิจกรรม
          </Label>
          <Selection value={formData.workActivityTypeId || ''}
                     options={eventOptions}
                     placeholder={"เลือกกิจกรรม"}
                     onUpdate={(value, item: Event) => handleInputChange('workActivityTypeId', value, item)}
                     onSearch={(s: string) => handleSearchEvent(s)}
          />
        </div>

        {/* ชั่วโมง/งาน */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            ชั่วโมง/งาน
          </Label>
          <InputText
            value={formData.workHours?.toString() || ''}
            placeholder="ระบุชั่วโมง/งาน"
            onChange={(value: string) => handleInputChange('workHours', value)}
            numberOnly={true}
          />
        </div>

        {/* หน่วย */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            หน่วย
          </Label>
          <div>{formData.workUnit || ''}</div>
          {/*<InputText
            value={formData.workUnit || ''}
            placeholder="ระบุหน่วย"
            onChange={(value: string) => handleInputChange('workUnit', value)}
          />*/}
        </div>
      </div>
    </Modal>
  )
}

export default AddWorker;
