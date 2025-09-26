import Modal from "@/app/layout/Modal";
import {useEffect, useState} from "react";
import {TransformerMaterialEquipmentObj, Options, WorkOrderObj, Transformer} from "@/types";

import {Button} from "@/components/ui/button";
import {Selection} from "@/app/components/form/Selection";
import {
  handleSearchTransformerBrands,
  handleSearchTransformerPhase, handleSearchTransformerSize,
  handleSearchTransformerType, handleSearchTransformerVoltage
} from "@/app/helpers/SearchTransformer.";
import InputText from "@/app/components/form/InputText";

interface ModalEquipmentsProps {
  open: boolean,
  onClose: () => void,
  onAddTransformer: (d: Transformer) => void,
  onEditTransformer: (d: Transformer) => void,
  editData: Transformer | null,
  brandOptions: Options[],
  onUpdateBrandOptions: (options: Options[]) => void,
  phaseOptions: Options[],
  onUpdatePhaseOptions: (options: Options[]) => void,
  typeOptions: Options[],
  onUpdateTypeOptions: (options: Options[]) => void,
  sizeOptions: Options[],
  onUpdateSizeOptions: (options: Options[]) => void,
  voltageOptions: Options[],
  onUpdateVoltageOptions: (options: Options[]) => void,
  reqCode: string
}

const ModalTransformer = ({
                            open,
                            onClose,
                            onAddTransformer,
                            onEditTransformer,
                            editData,
                            brandOptions,
                            onUpdateBrandOptions,
                            phaseOptions,
                            onUpdatePhaseOptions,
                            typeOptions,
                            onUpdateTypeOptions,
                            sizeOptions,
                            onUpdateSizeOptions,
                            voltageOptions,
                            onUpdateVoltageOptions,
                            reqCode
                          }: ModalEquipmentsProps) => {

  const [transformer, setTransformer] = useState<Transformer>({} as Transformer)

  useEffect(() => {
    if (editData) {
      setTransformer(editData)
    }
  }, [editData]);

  const handleSubmit = () => {
    if(editData) {
      onEditTransformer(transformer)
    }else {
      onAddTransformer(transformer)
    }
    handleCancel()
  };

  const handleCancel = () => {
    setTransformer({} as Transformer)
    onClose();
  };

  const handleUpdateTransformer = (key: string, value: string) => {
    let newTransformer = {
      ...transformer,
      [key]: value
    }
    setTransformer(newTransformer);
  }

  return (
    <Modal title="เพิ่มหม้อแปลง"
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

      <div className="w-full p-2">
        <div className="mb-3">
          <div className="mb-2">ยี่ห้อ</div>
          <Selection value={transformer.title}
                     options={brandOptions}
                     placeholder={"ยี่ห้อ"}
                     onSearch={(s: string) => handleSearchTransformerBrands(s, reqCode)}
                     onUpdateOptions={onUpdateBrandOptions}
                     onUpdate={(v:string) => handleUpdateTransformer('title', v)}
          />
        </div>

        <div className="mb-3">
          <div className="mb-2">เฟส</div>
          <Selection value={transformer.phase}
                     options={phaseOptions}
                     placeholder={"เฟส"}
                     onSearch={(s: string) => handleSearchTransformerPhase(s, reqCode)}
                     onUpdateOptions={onUpdatePhaseOptions}
                     onUpdate={(v:string) => handleUpdateTransformer('phase', v)}
          />
        </div>

        <div className="mb-3">
          <div className="mb-2">ประเภท</div>
          <Selection value={transformer.type}
                     options={typeOptions}
                     placeholder={"ประเภท"}
                     onSearch={(s: string) => handleSearchTransformerType(s, reqCode)}
                     onUpdateOptions={onUpdateTypeOptions}
                     onUpdate={(v:string) => handleUpdateTransformer('type', v)}
          />
        </div>

        <div className="mb-3">
          <InputText value={transformer.serial || ""}
                     label="Serial"
                     placeholder="Serial"
                     onChange={(v: string) => handleUpdateTransformer('serial', v)}
          />
        </div>

        <div className="mb-3">
          <div className="mb-2">ขนาด</div>
          <Selection value={transformer.size}
                     options={sizeOptions}
                     placeholder={"ขนาด"}
                     onSearch={(s: string) => handleSearchTransformerSize(s, reqCode)}
                     onUpdateOptions={onUpdateSizeOptions}
                     onUpdate={(v:string) => handleUpdateTransformer('size', v)}
          />
        </div>

        <div className="mb-2">
          <div className="mb-2">แรงดัน</div>
          <Selection value={transformer.voltage}
                     options={voltageOptions}
                     placeholder={"แรงดัน"}
                     onSearch={(s: string) => handleSearchTransformerVoltage(s, reqCode)}
                     onUpdateOptions={onUpdateVoltageOptions}
                     onUpdate={(v:string) => handleUpdateTransformer('voltage', v)}
          />
        </div>
      </div>
    </Modal>
)
}

export default ModalTransformer;
