import Modal from "@/app/layout/Modal";
import { useEffect, useState } from "react";
import { MeterEquipment, Options } from "@/types";
import { Label } from "@/components/ui/label";
import InputText from "@/app/components/form/InputText";
import { Button } from "@/components/ui/button";
import InputSelect from "@/app/components/form/InputSelect";
import { getMeterEquipmentOptions } from "@/app/api/MaterialEquipmentApi";

interface ModalEquipmentsProps {
  open: boolean;
  onClose: () => void;
  index: number;
  options: Options[];
  onUpdateOptions?: (options: Options[]) => void;
  data: MeterEquipment[];
  onUpdateData: (d: MeterEquipment[]) => void;
  requestCode: string;
}

const ModalEquipments = ({
  open,
  onClose,
  options,
  onUpdateOptions,
  data,
  onUpdateData,
  requestCode,
}: ModalEquipmentsProps) => {
  const [formData, setFormData] = useState<MeterEquipment>({
    id: 0,
    equipment_id: "",
    equipment_name: "",
    size: "",
    quantity: 1,
    price: 0,
    isUpdate: true,
    isEdited: false,
  });

  const [equipmentOptions, setEquipmentOptions] = useState<Options[]>(options);

  
  useEffect(() => {
    if (open) {
      loadEquipmentOptions();
    }
  }, [open, requestCode]);

  const loadEquipmentOptions = async () => {
    try {
      const response = await getMeterEquipmentOptions("", requestCode);
      if (response.status === 200 && response.data.data) {
        const opts: Options[] = response.data.data.map((equipment) => ({
          label: equipment.option_title,
          value: equipment.id,
          data: equipment,
        }));
        setEquipmentOptions(opts);
        onUpdateOptions?.(opts);
      }
    } catch (error) {
      console.error("Error loading equipment options:", error);
    }
  };

  const handleInputChange = (
    field: keyof MeterEquipment,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEquipmentSelect = (value: string | number) => {
    const selectedEquipment = equipmentOptions.find(opt => opt.value === value);
    if (selectedEquipment) {
      setFormData((prev) => ({
        ...prev,
        equipment_id: value as string,
        equipment_name: selectedEquipment.label,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.equipment_name || !formData.equipment_id) {
      alert("กรุณาเลือกมิเตอร์/อุปกรณ์ไฟฟ้า");
      return false;
    }
    if (!formData.size) {
      alert("กรุณากรอกขนาด");
      return false;
    }
    if (!formData.quantity || Number(formData.quantity) <= 0) {
      alert("กรุณากรอกจำนวนที่ถูกต้อง");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const newEquipment: MeterEquipment = {
      ...formData,
      id: Date.now(), 
      quantity: Number(formData.quantity),
      price: Number(formData.price) || 0,
      isUpdate: false,
      isEdited: false,
    };

    console.log("[ModalEquipments] newEquipment", newEquipment);

    const updatedData = [...data, newEquipment];
    onUpdateData(updatedData);
    
    setTimeout(() => handleCancel(), 0); 
  };

  const handleCancel = () => {
    setFormData({
      id: 0,
      equipment_id: "",
      equipment_name: "",
      size: "",
      quantity: 1,
      price: 0,
      isUpdate: false,
      isEdited: false,
    });
    onClose();
  };

  return (
    <Modal
      title="เพิ่มมิเตอร์/อุปกรณ์ไฟฟ้า"
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
      onClose={onClose}
    >
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            มิเตอร์/อุปกรณ์ไฟฟ้า
          </Label>
          <InputSelect
            options={equipmentOptions}
            value={formData.equipment_id ?? ""}
            placeholder="เลือกมิเตอร์/อุปกรณ์ไฟฟ้า"
            setData={handleEquipmentSelect}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            ขนาด
          </Label>
          <InputText
            value={formData.size || ""}
            placeholder="ระบุขนาดอุปกรณ์"
            onChange={(value) => handleInputChange("size", value)}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            จำนวน
          </Label>
          <InputText
            value={formData.quantity?.toString() || "1"}
            placeholder="ระบุจำนวน"
            numberOnly={true}
            onChange={(value) => handleInputChange("quantity", parseInt(value) || 1)}
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            ราคา
          </Label>
          <InputText
            value={formData.price?.toString() || "0"}
            placeholder="ระบุราคา"
            numberOnly={true}
            onChange={(value) => handleInputChange("price", parseFloat(value) || 0)}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ModalEquipments;

