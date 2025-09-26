import Modal from "@/app/layout/Modal";
import {useEffect, useState} from "react";
import {TransFormerS315} from "@/types";
import InputText from "@/app/components/form/InputText";
import {Button} from "@/components/ui/button";

interface ModalAddOrEditTransFormerProps {
  open: boolean,
  onClose: () => void,
  onAddTransFormer: (data: TransFormerS315) => void,
  editData: TransFormerS315 | undefined,
  onUpdateTransFormer: (d: TransFormerS315) => void,
}

const ModalAddOrEditTransFormer = ({
                                     open,
                                     onClose,
                                     onAddTransFormer,
                                     editData,
                                     onUpdateTransFormer
                                   }: ModalAddOrEditTransFormerProps) => {
  const [transformerData, setTransformerData] = useState<TransFormerS315>({} as TransFormerS315);

  useEffect(() => {
    if (editData) {
      setTransformerData(editData);
    }
  }, [editData]);

  const handleSubmit = () => {
    if (editData) {
      onUpdateTransFormer(transformerData);
    }else {
      onAddTransFormer(transformerData)
    }
    handleCancel()
  }

  const handleChangeData = (key: string, value: string) => {
    setTransformerData(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleCancel = () => {
    onClose();
    setTransformerData({} as TransFormerS315);
  }

  return (
    <Modal title={`${editData ? 'แก้ไข' : 'เพิ่ม'}หม้อแปลง`}
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

      <InputText value={transformerData?.transformer_size as string || ""}
                 placeholder={"ขนาดหม้อแปลง"}
                 label={"ขนาดหม้อแปลง"}
                 onChange={(value: string) => handleChangeData('transformer_size', value)}
      />

      <InputText value={transformerData?.transformer_qty || ""}
                 placeholder={"จำนวน"}
                 label={"จำนวน"}
                 onChange={(value: string) => handleChangeData('transformer_qty', value)}
                 numberOnly={true}
      />

    </Modal>
  )
}

export default ModalAddOrEditTransFormer;
