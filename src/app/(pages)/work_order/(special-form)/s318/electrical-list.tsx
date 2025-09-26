import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { DataTableEditor } from "@/app/components/editor-table/DataTableEditor";
import { columns } from "@/app/(pages)/work_order/(special-form)/s318/columns";
import { useAppSelector } from "@/app/redux/hook";
import { MaterialEquipmentObj, MeterEquipment } from "@/types";
import { ListDataEditor } from "@/app/components/editor-table/ListDataEditor";
import ListDataContent from "@/app/(pages)/work_order/(special-form)/s318/list-data-content";
import { Button } from "@/components/ui/button";
import ModalEquipments from "@/app/(pages)/work_order/(special-form)/s318/modal-equipments";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";

interface MeterEquipmentListOptions {
  showCardCollapse?: boolean;
  showAddButton?: boolean;
  showDeleteAllButton?: boolean;
  showActionColumn?: boolean;
  isReadOnly?: boolean;
}
interface MeterEquipmentListProps {
  data: MeterEquipment[];
  updateData?: (data: MeterEquipment[]) => void;
  options?: MeterEquipmentListOptions;
}

const MeterEquipmentList = ({
  data,
  updateData,
  options = {},
}: MeterEquipmentListProps) => {
  const {
    showCardCollapse = true,
    showAddButton = true,
    showDeleteAllButton = true,
    showActionColumn = true,
    isReadOnly = false,
  } = options;

  const itemMeterEquipment = {
    id: 0,
    equipment_name: "",
    size: "",
    quantity: 0,
    price: 0,
    isUpdate: true,
    isEdited: false,
  } as MeterEquipment;

  const [meterEquipments, setMeterEquipments] =
    useState<MeterEquipment[]>(data || []);
  const screenSize = useAppSelector((state) => state.screen_size);

  const [openModal, setOpenModal] = React.useState(false);
  const [updateIndex, setUpdateIndex] = React.useState(-1);

  const equipmentNameOptions = [
    { label: "มิเตอร์", value: "มิเตอร์" },
    { label: "อุปกรณ์ครอบสายไฟฟ้า", value: "อุปกรณ์ครอบสายไฟฟ้า" },
    { label: "หม้อแปลงไฟฟ้า", value: "หม้อแปลงไฟฟ้า" },
  ];

  useEffect(() => {
    if (screenSize !== "desktop") {
      const newMeterEquipments: MeterEquipment[] = meterEquipments.map(
        (item) => {
          return { ...item, isUpdate: false };
        }
      );

      console.log("newMeterEquipments >>> ", newMeterEquipments);
      setMeterEquipments(newMeterEquipments);
    }
  }, [screenSize]);

  useEffect(() => {
    setMeterEquipments(data || []);
  }, [data]);

  const onRemoveData = (id: number) => {
    console.log("Remove equipment with id:", id);
  };

  const handleUpdateData = (data: MeterEquipment[]) => {
    setMeterEquipments(data);
    updateData?.(data);
  };

  // ฟังก์ชันสำหรับเพิ่มอุปกรณ์จาก modal
  const handleAddEquipment = (equipment: MaterialEquipmentObj) => {
    const newMeterEquipment: MeterEquipment = {
      id: Date.now(),
      equipment_name: equipment.name || "อุปกรณ์ไฟฟ้าใหม่",
      size: equipment.size || "1",
      quantity:
        typeof equipment.quantity === "string"
          ? parseInt(equipment.quantity) || 1
          : equipment.quantity || 1,
      isUpdate: false,
      isEdited: false,
    };

    const updatedMeterEquipments = [...meterEquipments, newMeterEquipment];
    setMeterEquipments(updatedMeterEquipments);
    updateData?.(updatedMeterEquipments);
  };

  const getFilteredColumns = () => {
    if (!showActionColumn) {
      return columns.filter((column) => column.id !== "action");
    }
    return columns;
  };

  // Render content without CardCollapse
  const renderContent = () => {
    if (screenSize === "desktop") {
      return (
        <DataTableEditor
          columns={getFilteredColumns()}
          onUpdateData={handleUpdateData}
          visibleDelete={showDeleteAllButton && !isReadOnly}
          rowItem={itemMeterEquipment}
          realData={meterEquipments}
          LabelAddRow={
            showAddButton && !isReadOnly && screenSize === "desktop"
              ? "เพิ่มประเภทอุปกรณ์ไฟฟ้า"
              : undefined
          }
          onRemoveData={onRemoveData}
        />
      );
    } else {
      return (
        <ListDataEditor
          onUpdateData={handleUpdateData}
          realData={meterEquipments}
        >
          {(pageData: MeterEquipment[], page, pageSize) => (
            <div>
              <ListDataContent
                pageData={pageData}
                realData={meterEquipments}
                page={page}
                pageSize={pageSize}
                onUpdateData={handleUpdateData}
                equipmentNameOptions={equipmentNameOptions}
                onRemoveData={onRemoveData}
                setUpdateIndex={(index) => {
                  setUpdateIndex(index);
                  setOpenModal(true);
                }}
                showActionButtons={showActionColumn && !isReadOnly} // เพิ่ม !isReadOnly
                isReadOnly={isReadOnly}
              />

              {/* แสดง Add Button เฉพาะเมื่อ showAddButton เป็น true และไม่ใช่ readOnly */}
              {showAddButton && !isReadOnly && (
                <Button
                  className="pea-button-outline my-2 w-full"
                  onClick={() => setOpenModal(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  เพิ่มวัสดุอุปกรณ์
                </Button>
              )}
            </div>
          )}
        </ListDataEditor>
      );
    }
  };

  const content = renderContent();

  return (
    <>
      {showCardCollapse ? (
        <CardCollapse title={"มิเตอร์/อุปกรณ์ไฟฟ้า"}>{content}</CardCollapse>
      ) : (
        content
      )}

      {showAddButton && !isReadOnly && (
        <ModalEquipments
          open={openModal}
          onClose={() => setOpenModal(false)}
          index={updateIndex}
          onAddEquipment={handleAddEquipment}
        />
      )}
    </>
  );
};

export default MeterEquipmentList;
