import Modal from "@/app/layout/Modal";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import InputSelect from "@/app/components/form/InputSelect";
import InputText from "@/app/components/form/InputText";
import { MaterialEquipmentObj, Options } from "@/types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AddMaterialProps {
  open: boolean;
  onClose: () => void;
  index: number;
  onAddMaterial?: (material: MaterialEquipmentObj) => void;
}

const AddMaterial = ({ open, onClose, onAddMaterial }: AddMaterialProps) => {
  const [active, setActive] = useState(0);
  const [material, setMaterial] = useState<string | number>("");
  const [searchText, setSearchText] = useState<string>(""); // For direct search input
  const [equipmentSelected, setEquipmentSelected] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredEquipmentList, setFilteredEquipmentList] = useState<
    MaterialEquipmentObj[]
  >([]);

  const pageSize = 3; 


  const [materialOptions] = useState<Options[]>([
    {
      value: "ชุดตรวจสอบและบำรุงอุปกรณ์ไฟฟ้า",
      label: "ชุดตรวจสอบและบำรุงอุปกรณ์ไฟฟ้า",
    },
    { value: "S-3H-044", label: "S-3H-044" },
  ]);

  
  const [directSearchOptions] = useState<Options[]>([
    { value: "S-3H-044", label: "S-3H-044 - หม้อแปลง 3P5000KVA(รายปี)" },
    { value: "S-3H-045", label: "S-3H-045 - หม้อแปลง 1P2000KVA(รายปี)" },
    { value: "S-3H-046", label: "S-3H-046 - สายไฟฟ้าแรงสูง" },
    { value: "S-3H-047", label: "S-3H-047 - อุปกรณ์ป้องกันไฟฟ้า" },
    { value: "S-3H-048", label: "S-3H-048 - เครื่องมือวัดค่าไฟฟ้า" },
    { value: "S-3H-049", label: "S-3H-049 - อุปกรณ์ควบคุมไฟฟ้า" },
    { value: "S-3H-050", label: "S-3H-050 - อุปกรณ์จ่ายไฟฟ้า" },
  ]);

 
  const [baseEquipmentList, setBaseEquipmentList] = useState<
    MaterialEquipmentObj[]
  >([]);

  const classActive = "text-[#671FAB] bg-[#F4EEFF]";
  const classDefault = "w-full text-center p-2 font-semibold rounded-full";
  const tabs = ["ชุดติดตั้งอุปกรณ์", "ค้นหาจากรหัส/ชื่อ"];


  useEffect(() => {
    let newBaseList: MaterialEquipmentObj[] = [];

    if (active === 0) {
      // Tab 1: Equipment Sets
      if (material === "ชุดตรวจสอบและบำรุงอุปกรณ์ไฟฟ้า") {
        newBaseList = [
          {
            name: "S-3H-044 - หม้อแปลง 3P5000KVA(รายปี)",
            code: "S-3H-044",
            quantity: 1,
            unit: "หน่วย",
            id: 1,
            isActive: true,
            isUpdate: false,
            isEdited: false,
            uuid: "",
          } as MaterialEquipmentObj,
          {
            name: "S-3H-045 - หม้อแปลง 1P2000KVA(รายปี)",
            code: "S-3H-045",
            quantity: 1,
            unit: "หน่วย",
            id: 2,
            isActive: true,
            isUpdate: false,
            isEdited: false,
            uuid: "",
          } as MaterialEquipmentObj,
          {
            name: "S-3H-046 - สายไฟฟ้าแรงสูง",
            code: "S-3H-046",
            quantity: 1,
            unit: "เมตร",
            id: 3,
            isActive: true,
            isUpdate: false,
            isEdited: false,
            uuid: "",
          } as MaterialEquipmentObj,
          {
            name: "S-3H-047 - อุปกรณ์ป้องกันไฟฟ้า",
            code: "S-3H-047",
            quantity: 1,
            unit: "ชิ้น",
            id: 4,
            isActive: true,
            isUpdate: false,
            isEdited: false,
            uuid: "",
          } as MaterialEquipmentObj,
          {
            name: "S-3H-048 - เครื่องมือวัดค่าไฟฟ้า",
            code: "S-3H-048",
            quantity: 1,
            unit: "ชิ้น",
            id: 5,
            isActive: true,
            isUpdate: false,
            isEdited: false,
            uuid: "",
          } as MaterialEquipmentObj,
        ];
      } else if (material === "S-3H-044") {
        newBaseList = [
          {
            name: "S-3H-044 - หม้อแปลง 3P5000KVA(รายปี)",
            code: "S-3H-044",
            quantity: 1,
            unit: "หน่วย",
            id: 1,
            isActive: true,
            isUpdate: false,
            isEdited: false,
            uuid: "",
          } as MaterialEquipmentObj,
        ];
      }
    } else {
      // Tab 2: Direct Search
      if (searchText.trim()) {
        newBaseList = directSearchOptions
          .map(
            (opt) =>
              ({
                name: opt.label,
                code: opt.value.toString(),
                quantity: 1,
                unit: "หน่วย",
                id: Math.random(), // หรือ gen id ตามจริง
                isActive: true,
                isUpdate: false,
                isEdited: false,
                uuid: "",
              } as MaterialEquipmentObj)
          )
          .filter(
            (item) =>
              item.name.toLowerCase().includes(searchText.toLowerCase()) ||
              item.code.toLowerCase().includes(searchText.toLowerCase())
          );
      }
    }

    setBaseEquipmentList(newBaseList);
    setFilteredEquipmentList(newBaseList);
    setCurrentPage(0); // Reset to first page when data changes
  }, [material, active, searchText, directSearchOptions]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredEquipmentList.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = filteredEquipmentList.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageIds = paginatedItems.map((eq) => eq.id);
      const allExistingSelected = equipmentSelected.filter(
        (id) => !currentPageIds.includes(id)
      );
      setEquipmentSelected([...allExistingSelected, ...currentPageIds]);
    } else {
      const currentPageIds = paginatedItems.map((eq) => eq.id);
      setEquipmentSelected(
        equipmentSelected.filter((id) => !currentPageIds.includes(id))
      );
    }
  };

  const handleCheck = (checked: boolean, id: number) => {
    if (checked) {
      setEquipmentSelected([...equipmentSelected, id]);
    } else {
      setEquipmentSelected(equipmentSelected.filter((item) => item !== id));
    }
  };

  const handleQuantityChange = (id: number, newQuantity: string) => {
    const updatedList = baseEquipmentList.map((item) =>
      item.id === id ? { ...item, quantity: parseInt(newQuantity) || 0 } : item
    );
    setBaseEquipmentList(updatedList);
    setFilteredEquipmentList(updatedList);
  };

  const handleSubmit = () => {
    const selectedEquipments = baseEquipmentList.filter((equipment) =>
      equipmentSelected.includes(equipment.id)
    );

    selectedEquipments.forEach((equipment) => {
      onAddMaterial?.(equipment);
    });

    // Reset selections
    setEquipmentSelected([]);
    setMaterial("");
    setSearchText("");
    setCurrentPage(0);
    onClose();
  };

  const handleCancel = () => {
    setEquipmentSelected([]);
    setMaterial("");
    setSearchText("");
    setCurrentPage(0);
    onClose();
  };

  const getCurrentOptions = () => {
    return materialOptions; // Only for tab 1
  };

  const getCurrentPlaceholder = () => {
    return active === 0
      ? "ค้นหาชุดติดตั้งอุปกรณ์"
      : "ค้นหารหัสวัสดุหรือชื่อวัสดุ";
  };

  const getCurrentLabel = () => {
    return active === 0
      ? "ค้นหาชุดติดตั้งอุปกรณ์"
      : "ค้นหารหัสวัสดุหรือชื่อวัสดุ";
  };

  const handleTabChange = (index: number) => {
    setActive(index);
    setMaterial(""); 
    setSearchText(""); 
    setEquipmentSelected([]);
    setCurrentPage(0); 
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };


  const isAllCurrentPageSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => equipmentSelected.includes(item.id));

  return (
    <Modal
      title="เพิ่มวัสดุอุปกรณ์"
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
      <div className="flex items-center p-1 bg-[#F8F8F8] rounded-full">
        {tabs.map((tab, index) => (
          <div
            className={cn(classDefault, active === index && classActive)}
            onClick={() => handleTabChange(index)}
            key={index}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab 1: Equipment Sets */}
      {active === 0 && (
        <InputSelect
          options={getCurrentOptions()}
          value={material as string}
          placeholder={getCurrentPlaceholder()}
          label={getCurrentLabel()}
          setData={setMaterial}
        />
      )}

      {/* Tab 2: Direct Search Input */}
      {active === 1 && (
        <InputText
          label="ค้นหารหัสวัสดุหรือชื่อวัสดุ"
          placeholder="พิมพ์รหัสวัสดุหรือชื่อวัสดุที่ต้องการค้นหา"
          value={searchText}
          onChange={setSearchText}
        />
      )}

      <hr className="my-3" />

      <div className="mb-3">
        รายการวัสดุ ({filteredEquipmentList.length || 0})
        {totalPages > 1 && (
          <span className="text-sm text-gray-500 ml-2">
            (หน้า {currentPage + 1} จาก {totalPages})
          </span>
        )}
      </div>

      {paginatedItems.length > 0 && (
        <>
          <div className="flex items-center gap-3">
            <Checkbox
              id="all"
              className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA]"
              onCheckedChange={handleSelectAll}
              checked={isAllCurrentPageSelected}
            />
            <Label htmlFor="all">เลือกทั้งหมดในหน้านี้</Label>
          </div>

          {paginatedItems.map((item, index) => {
            
            const actualIndex = startIndex + index;
            return (
              <div
                className="flex items-center p-3 bg-[#FAF5FF] rounded-[12px] border-1 gap-3 mt-3"
                key={item.id}
              >
                <Checkbox
                  id={`equipment_${item.id}`}
                  className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA]"
                  checked={equipmentSelected.includes(item.id)}
                  onCheckedChange={(checked: boolean) =>
                    handleCheck(checked, item.id)
                  }
                />
                <Label
                  htmlFor={`equipment_${item.id}`}
                  className="flex flex-col items-start w-full"
                >
                  <div className="flex flex-row justify-between w-full">
                 
                    <div className="font-medium w-[65%]">
                      {actualIndex + 1}. {item.name}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      หน่วย : {item.unit}
                    </div>
                  </div>

                  <div className="flex justify-between items-center w-full mt-2">
                    <div className="text-[14px] text-[#4A4A4A]">จำนวน :</div>
                    <div className="w-[15%]">
                      <InputText
                        value={item.quantity?.toString() || "1"}
                        align="center"
                        numberOnly={true}
                        onChange={(value) =>
                          handleQuantityChange(item.id, value)
                        }
                        disabled={!equipmentSelected.includes(item.id)}
                      />
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(i)}
                    className={`min-w-[32px] h-8 ${
                      currentPage === i
                        ? "bg-[#9538EA] text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </>
      )}

      {filteredEquipmentList.length === 0 && (material || searchText) && (
        <div className="text-center text-gray-500 p-4">
          ไม่พบรายการวัสดุอุปกรณ์
        </div>
      )}
    </Modal>
  );
};

export default AddMaterial;
