import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { DataTableEditor } from "@/app/components/editor-table/DataTableEditor";
import { columns } from "@/app/(pages)/work_order/(special-form)/s314/columns";
import { useAppSelector } from "@/app/redux/hook";
import { Insulator, MaterialEquipmentObj } from "@/types";
import { ListDataEditor } from "@/app/components/editor-table/ListDataEditor";
import ListDataContent from "@/app/(pages)/work_order/(special-form)/s314/list-data-content";
import { Button } from "@/components/ui/button";
import ModalEquipments from "@/app/(pages)/work_order/(special-form)/s314/modal-equipments";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";

interface InsulatorListOptions {
  showCardCollapse?: boolean;
  showAddButton?: boolean;
  showDeleteAllButton?: boolean;
  showActionColumn?: boolean;
  isReadOnly?: boolean;
}

interface InsulatorListProps {
  data: Insulator[];
  updateData: (data: Insulator[]) => void;
  options?: InsulatorListOptions;
}

const InsulatorList = ({
  data,
  updateData,
  options = {},
}: InsulatorListProps) => {
  // Default options
  const {
    showCardCollapse = true,
    showAddButton = true,
    showDeleteAllButton = true,
    showActionColumn = true,
    isReadOnly = false,
  } = options;

  const itemInsulator = {
    id: 0,
    insulator_type: "",
    quantity: 0,
    isUpdate: true,
    isEdited: false,
  } as Insulator;

  const [insulators, setInsulators] = useState<Insulator[]>(data || []);
  const screenSize = useAppSelector((state) => state.screen_size);

  const [openModal, setOpenModal] = React.useState(false);
  const [updateIndex, setUpdateIndex] = React.useState(-1);

  useEffect(() => {
    setInsulators(data || []);
  }, [data]);

 useEffect(() => {
    if (screenSize !== "desktop") {
      const newInsulators: Insulator[] = insulators.map((item) => {
        return { ...item, isUpdate: false };
      });

      console.log("newInsulators >>> ", newInsulators);
      setInsulators(newInsulators);
    }
  }, [screenSize, insulators]);

  const onRemoveData = (id: number) => {
    console.log("Remove equipment with id:", id);
  };

  const handleUpdateData = (data: Insulator[]) => {
    setInsulators(data);
    updateData(data);
  };

  // ฟังก์ชันสำหรับเพิ่มอุปกรณ์จาก modal
  const handleAddEquipment = (equipment: MaterialEquipmentObj) => {
    const newInsulators: Insulator = {
      id: Date.now(),
      name: equipment.name || "",
      quantity:
        typeof equipment.quantity === "string"
          ? parseInt(equipment.quantity) || 1
          : equipment.quantity || 1,
      isUpdate: false,
      isEdited: false,
    };

    const updatedInsulators = [...insulators, newInsulators];
    setInsulators(updatedInsulators);
    updateData(updatedInsulators);
  };

  // Filter columns based on options
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
          visibleDelete={showDeleteAllButton}
          rowItem={itemInsulator}
          realData={insulators}
          LabelAddRow={
            showAddButton && screenSize === "desktop"
              ? "เพิ่มฉนวนครอบสายไฟฟ้า"
              : undefined
          }
          onRemoveData={onRemoveData}
        />
      );
    } else {
      return (
        <ListDataEditor onUpdateData={handleUpdateData} realData={insulators}>
          {(pageData: Insulator[], page, pageSize) => (
            <div>
              <ListDataContent
                pageData={pageData}
                realData={insulators}
                page={page}
                pageSize={pageSize}
                onUpdateData={handleUpdateData}
                onRemoveData={onRemoveData}
                setUpdateIndex={(index) => {
                  setUpdateIndex(index);
                  setOpenModal(true);
                }}
                showActionButtons={showActionColumn}
                isReadOnly={isReadOnly}
              />

              {showAddButton && (
                <Button
                  className="pea-button-outline my-2 w-full"
                  onClick={() => setOpenModal(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  เพิ่มฉนวนครอบสายไฟฟ้า
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
        <CardCollapse title={"ฉนวนครอบสายไฟฟ้า"}>{content}</CardCollapse>
      ) : (
        content
      )}

      {showAddButton && (
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

export default InsulatorList;
