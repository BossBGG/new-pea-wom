import Modal from "@/app/layout/Modal";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  MaterialEquipmentObj,
  Options,
  MaterialSet,
  MaterialMaster,
} from "@/types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MaterialSearchWrapper from "./MaterialSearchWrapper";
import InputText from "@/app/components/form/InputText";
import {
  getMaterialSets,
  getMaterialMaster,
} from "@/app/api/MaterialEquipmentApi";

interface AddMaterialProps {
  open: boolean;
  onClose: () => void;
  index: number;
  onAddMaterial?: (
    materials: MaterialEquipmentObj | MaterialEquipmentObj[]
  ) => void;
  editMode?: boolean;
  existingSelections?: number[];
  editingItem?: MaterialEquipmentObj;
  office?: string;
}

const AddMaterial = ({
  open,
  onClose,
  onAddMaterial,
  editMode = false,
  existingSelections = [],
  editingItem,
  office = "",
}: AddMaterialProps) => {
  const [active, setActive] = useState(0);
  const [material, setMaterial] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [equipmentSelected, setEquipmentSelected] = useState<number[]>(
    editMode ? [...existingSelections] : []
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [filteredEquipmentList, setFilteredEquipmentList] = useState<
    MaterialEquipmentObj[]
  >([]);
  const [loading, setLoading] = useState(false);

  const pageSize = 3;
  const classActive = "text-[#671FAB] bg-[#F4EEFF]";
  const classDefault = "w-full text-center p-2 font-semibold rounded-full";
  const tabs = ["ชุดติดตั้งอุปกรณ์", "ค้นหาจากรหัส/ชื่อ"];

  const [selectedSetName, setSelectedSetName] = useState<string>("");

  useEffect(() => {
    if (editMode && editingItem && open) {
      if (editingItem.materialSetUuid) {
        setActive(0);
        setMaterial(editingItem.materialSetUuid);
        setSearchText("");
      } else {
        setActive(1);
        setSearchText(editingItem.code || editingItem.name || "");
        setMaterial("");
      }

      setEquipmentSelected([editingItem.id]);
    } else if (!editMode) {
      setActive(0);
      setMaterial("");
      setSearchText("");
      setEquipmentSelected([]);
      setSelectedSetName("");
    }
  }, [editMode, editingItem, open]);

  const loadMaterialSets = async (materialUuid: string, searchName: string = "") => {
    if (!materialUuid) return;

    if (!office) {
      console.error("Office code is required");
      setFilteredEquipmentList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await getMaterialSets(searchName, office);

      if (response.status === 200 && response.data.data) {
        const sets = response.data.data.items;
        const selectedSet = sets.find((set) => set.uuid === materialUuid);

        if (selectedSet) {
          const equipmentList: MaterialEquipmentObj[] =
            selectedSet.materialAndEquipment.map((item) => ({
              id: item.id,
              uuid: selectedSet.uuid,
              code: item.code,
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              price: item.price,
              availableStock: item.availableStock ?? 0,
              isActive: item.isActive,
              isUpdate: false,
              isEdited: false,
              materialSetUuid: selectedSet.uuid,
              originalId: item.id,
            }));

          setFilteredEquipmentList(equipmentList);
        } else {
          setFilteredEquipmentList([]);
        }
      }
    } catch (error) {
      console.error("Error loading material sets:", error);
      setFilteredEquipmentList([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterialMaster = async (search: string) => {
    if (!search.trim()) {
      setFilteredEquipmentList([]);
      return;
    }

    setLoading(true);
    try {
      const response = await getMaterialMaster(search);
      if (response.status === 200 && response.data.data) {
        const materials = response.data.data;
        const equipmentList: MaterialEquipmentObj[] = materials.map((item) => ({
          id: item.id,
          uuid: `master_${item.id}`,
          code: item.code,
          name: item.name,
          quantity: editMode && editingItem ? editingItem.quantity : 1,
          unit: item.unit,
          price: item.price,
          availableStock: 0,
          isActive: true,
          isUpdate: false,
          isEdited: false,
          originalId: item.id,
        }));

        setFilteredEquipmentList(equipmentList);

        if (editMode && editingItem) {
          const matchingItem = equipmentList.find(
            (item) => item.code === editingItem.code
          );
          if (matchingItem) {
            setEquipmentSelected([matchingItem.id]);
          }
        }
      }
    } catch (error) {
      console.error("Error loading material master:", error);
      setFilteredEquipmentList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (active === 0 && material) {
      loadMaterialSets(material, selectedSetName);
    } else if (active === 1 && searchText.trim()) {
      loadMaterialMaster(searchText);
    } else if (!editMode) {
      setFilteredEquipmentList([]);
    }
    setCurrentPage(0);
  }, [material, active, searchText, office, selectedSetName]);

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
      if (editMode) {
        setEquipmentSelected([id]);
      } else {
        setEquipmentSelected([...equipmentSelected, id]);
      }
    } else {
      setEquipmentSelected(equipmentSelected.filter((item) => item !== id));
    }
  };

  const handleQuantityChange = (id: number, newQuantity: string) => {
    const updatedList = filteredEquipmentList.map((item) =>
      item.id === id ? { ...item, quantity: parseInt(newQuantity) || 0 } : item
    );
    setFilteredEquipmentList(updatedList);
  };

  const handleSubmit = () => {
    const selectedEquipments = filteredEquipmentList.filter((equipment) =>
      equipmentSelected.includes(equipment.id)
    );

    if (selectedEquipments.length > 0) {
      onAddMaterial?.(selectedEquipments);
    }

    if (!editMode) {
      setEquipmentSelected([]);
    }
    setMaterial("");
    setSearchText("");
    setCurrentPage(0);
    onClose();
  };

  const handleCancel = () => {
    if (!editMode) {
      setEquipmentSelected([]);
    } else {
      setEquipmentSelected([...existingSelections]);
    }
    setMaterial("");
    setSearchText("");
    setCurrentPage(0);
    onClose();
  };

  const handleTabChange = (index: number) => {
    if (editMode) return;

    setActive(index);
    setMaterial("");
    setSearchText("");
    if (!editMode) {
      setEquipmentSelected([]);
    }
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
      title={editMode ? "แก้ไขวัสดุอุปกรณ์" : "เพิ่มวัสดุอุปกรณ์"}
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
            className={cn(
              classDefault,
              active === index && classActive,
              editMode && "cursor-not-allowed opacity-60"
            )}
            onClick={() => handleTabChange(index)}
            key={index}
          >
            {tab}
          </div>
        ))}
      </div>

      {active === 0 && (
        <MaterialSearchWrapper
          type="sets"
          value={material}
          placeholder="ค้นหาชุดติดตั้งอุปกรณ์"
          label="ค้นหาชุดติดตั้งอุปกรณ์"
          onChange={(uuid: string, setName?: string) => {
            setMaterial(uuid);
            setSelectedSetName((setName || "").trim());
          }}
          disabled={editMode}
          office={office}
        />
      )}

      {active === 1 && (
        <MaterialSearchWrapper
          type="search"
          value={searchText}
          placeholder="พิมพ์รหัสวัสดุหรือชื่อวัสดุที่ต้องการค้นหา"
          label="ค้นหารหัสวัสดุหรือชื่อวัสดุ"
          onChange={setSearchText}
          disabled={editMode}
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

      {loading ? (
        <div className="text-center text-gray-500 p-4">กำลังโหลดข้อมูล...</div>
      ) : paginatedItems.length > 0 ? (
        <>
          {!editMode && (
            <div className="flex items-center gap-3">
              <Checkbox
                id="all"
                className="border-[#9538EA] data-[state=checked]:border-none data-[state=checked]:bg-[#9538EA]"
                onCheckedChange={handleSelectAll}
                checked={isAllCurrentPageSelected}
              />
              <Label htmlFor="all">เลือกทั้งหมดในหน้านี้</Label>
            </div>
          )}

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
                      {actualIndex + 1}. {item.code} - {item.name}
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
      ) : (
        <div className="text-center text-gray-500 p-4">
          {material || searchText
            ? "ไม่พบรายการวัสดุอุปกรณ์"
            : "กรุณาเลือกหรือค้นหาวัสดุอุปกรณ์"}
        </div>
      )}
    </Modal>
  );
};

export default AddMaterial;