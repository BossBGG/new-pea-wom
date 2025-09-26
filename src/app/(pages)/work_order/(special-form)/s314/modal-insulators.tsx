import Modal from "@/app/layout/Modal";
import {cn} from "@/lib/utils";
import {useEffect, useState} from "react";
import InputSelect from "@/app/components/form/InputSelect";
import {Insulator, MaterialEquipmentObj, Options} from "@/types";
import {Label} from "@/components/ui/label";
import {Checkbox} from "@/components/ui/checkbox";
import InputText from "@/app/components/form/InputText";
import { Button } from "@/components/ui/button";

interface ModalEquipmentsProps {
  open: boolean,
  onClose: () => void,
  onAddOrEditEquipment: (insulator: Insulator) => void,
  editData: Insulator | null
}

const ModalInsulators = ({
                           open,
                           onClose,
                           onAddOrEditEquipment,
                           editData
                         }: ModalEquipmentsProps) => {
  const [insulator, setInsulator] = useState<Insulator>({} as Insulator);

  useEffect(() => {
    if(editData) {
      setInsulator(editData);
    }
  }, [editData]);

  const handleChange = (key: string, value: string) => {
    let newInsulator: Insulator = {
      ...insulator,
      [key]: value
    }

    setInsulator(newInsulator);
  }

  const handleSubmit = () => {
    onAddOrEditEquipment(insulator)
    handleCancel()
  }

  const handleCancel = () => {
    setInsulator({} as Insulator)
    onClose();
  }

  return (
    <Modal title="เพิ่มวัสดุอุปกรณ์"
           footer={
            <div className="w-full flex flex-wrap justify-between items-center">
              <div className=" p-2 w-1/2">
              <Button
              className="text-[#671FAB] w-full bg-white border-1 border-[#671FAB] rounded-full font-semibold md:text-start text-center cursor-pointer hover:bg-white"
              onClick={handleCancel}
              >
                ยกเลิก
              </Button>
              </div>
               <div className=" p-2 w-1/2">
               <Button className="pea-button w-full" onClick={handleSubmit}>
                บันทึก
               </Button>
              </div>
           </div>
           }
           open={open} onClose={onClose}>
      <div className="mb-3">
        <InputText value={insulator.item_title || ""}
                   label={"ประเภทฉนวนครอบสายไฟฟ้า"}
                   placeholder="ประเภท"
                   onChange={(value: string) => handleChange("item_title", value)}
        />
      </div>

      <InputText value={insulator.quantity || ""}
                 label={"จำนวน"}
                 placeholder="จำนวน"
                 onChange={(value: string) => handleChange("quantity", value)}
      />
    </Modal>
  )
}

export default ModalInsulators;
