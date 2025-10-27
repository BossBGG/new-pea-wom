"use client";
import React, { useState, useEffect, useMemo } from "react";
import { columns } from "./columns";
import CardCollapse from "../CardCollapse";
import { DataTableEditor } from "@/app/components/editor-table/DataTableEditor";
import { MaterialEquipmentObj, Options, WorkOrderObj } from "@/types";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/app/redux/hook";
import { ListDataEditor } from "@/app/components/editor-table/ListDataEditor";
import MaterialEquipmentListContent from "./MaterialEquipmentListContent";
import AddMaterial from "./AddMaterial";
import { getMaterialMaster } from "@/app/api/MaterialEquipmentApi";

interface MaterialEquipmentOptions {
  showCardCollapse?: boolean;
  showAddButton?: boolean;
  showDeleteAllButton?: boolean;
  showActionColumn?: boolean;
  isReadOnly?: boolean;
}

interface MaterialEquipmentChecklistProps {
  options?: MaterialEquipmentOptions;
  data?: MaterialEquipmentObj[];
  updateData?: (data: MaterialEquipmentObj[]) => void;
  office?: string;
}

const MaterialEquipmentChecklistPage = ({
  options = {},
  data = [],
  updateData,
  office,
}: MaterialEquipmentChecklistProps) => {
  const {
    showCardCollapse = true,
    showAddButton = true,
    showDeleteAllButton = true,
    showActionColumn = true,
    isReadOnly = false,
  } = options;

  const user = useAppSelector((state) => state.user);
  const customerRequest = useAppSelector((state) => state.customer_request_data);
  const peaOfficeOptions = useAppSelector((state) => state.options.peaOfficeOptions);

  const screenSize = useAppSelector((state) => state.screen_size);
  const [materialEquipments, setMaterialEquipments] =
    useState<MaterialEquipmentObj[]>(data);
  const [openModal, setOpenModal] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);

  const [materialOptions, setMaterialOptions] = useState<Options[]>([]);

  const userOffice = useMemo(() => {
    let resolvedOffice = "";

    if (office) {
      resolvedOffice = office;
    } else if (customerRequest?.peaOffice) {
      resolvedOffice = customerRequest.peaOffice;
    } else if (user?.selectedPeaOffice) {
      if (user.selectedPeaOffice.length <= 10) {
        resolvedOffice = user.selectedPeaOffice;
      } else {
        const found = peaOfficeOptions.find(
          opt => 
            opt.label === user.selectedPeaOffice ||
            opt.data?.peaNameFull === user.selectedPeaOffice
        );
        resolvedOffice = found?.data?.office || "";
      }
    }
    
    if (!resolvedOffice || resolvedOffice.length > 10) {
      console.error("Invalid office code:", resolvedOffice);
      return "";
    }

    return resolvedOffice;
  }, [office, customerRequest?.peaOffice, user?.selectedPeaOffice, peaOfficeOptions]);

  useEffect(() => {
    const loadInitialMaterials = async () => {
      try {
        const response = await getMaterialMaster("");
        if (response.status === 200 && response.data.data) {
          const options = response.data.data.map((material) => ({
            label: `${material.code} - ${material.name}`,
            value: material.code,
            data: material,
          }));
          setMaterialOptions(options);
        }
      } catch (error) {
        console.error("Error loading materials:", error);
      }
    };

    loadInitialMaterials();
  }, []);

  useEffect(() => {
    if (data && data.length >= 0) {
      setMaterialEquipments(data);
    }
  }, [data]);

  useEffect(() => {
    if (materialEquipments.length > 0 && updateData) {
      updateData(materialEquipments);
    }
  }, [materialEquipments]);

  const handleUpdateData = (newData: MaterialEquipmentObj[]) => {
    setMaterialEquipments(newData);
    if (updateData) {
      updateData(newData);
    }
  };

  const onRemoveData = (id: number) => {
    console.log("Remove data with id:", id);
  };

  const handleAddMaterial = (
    newMaterials: MaterialEquipmentObj | MaterialEquipmentObj[]
  ) => {
    const materialsArray = Array.isArray(newMaterials)
      ? newMaterials
      : [newMaterials];

    let updatedData = [...materialEquipments];

    materialsArray.forEach((newMaterial) => {
      const existingMaterialIndex = updatedData.findIndex(
        (item) =>
          item.code === newMaterial.code &&
          item.uuid === newMaterial.uuid &&
          item.id !== newMaterial.id
      );

      if (existingMaterialIndex >= 0) {
        updatedData[existingMaterialIndex] = {
          ...updatedData[existingMaterialIndex],
          quantity:
            Number(updatedData[existingMaterialIndex].quantity) +
            Number(newMaterial.quantity),
        };
      } else {
        updatedData.push({
          ...newMaterial,
          id: newMaterial.id || Date.now() + Math.random(),
          isUpdate: false,
          isEdited: false,
        });
      }
    });

    handleUpdateData(updatedData);
  };

  const handleDesktopAdd = () => {
    setOpenModal(true);
  };

  const renderContent = () => {
    if (screenSize === "desktop") {
      return (
        <div>
          <DataTableEditor
            columns={columns}
            onUpdateData={handleUpdateData}
            realData={materialEquipments}
            onRemoveData={onRemoveData}
            hiddenColumn={(!showActionColumn || isReadOnly) && { action: false }}
          />

          {showAddButton && !isReadOnly && (
            <div className="flex items-center justify-end mt-3">
              <Button
                className="pea-button !px-3 !py-4"
                onClick={handleDesktopAdd}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                เพิ่มวัสดุอุปกรณ์
              </Button>

              <Button
                className="mx-2 pea-button-outline !px-3 !py-4"
                onClick={() => handleUpdateData([])}
              >
                <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
                ลบทั้งหมด
              </Button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <ListDataEditor
          onUpdateData={handleUpdateData}
          realData={materialEquipments}
        >
          {(pageData: MaterialEquipmentObj[], page, pageSize) => (
            <div>
              <MaterialEquipmentListContent
                pageData={pageData}
                realData={materialEquipments}
                page={page}
                pageSize={pageSize}
                onUpdateData={handleUpdateData}
                materialOptions={materialOptions}
                onRemoveData={onRemoveData}
                setUpdateIndex={(index) => {
                  setUpdateIndex(index);
                  setOpenModal(true);
                }}
                showActionButtons={showActionColumn && !isReadOnly}
                isReadOnly={isReadOnly}
              />

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
        <CardCollapse title={"รายการวัสดุอุปกรณ์"}>{content}</CardCollapse>
      ) : (
        content
      )}

      {showAddButton && !isReadOnly && (
        <AddMaterial
          open={openModal}
          onClose={() => setOpenModal(false)}
          index={updateIndex}
          onAddMaterial={handleAddMaterial}
          office={userOffice}
        />
      )}
    </>
  );
};

export default MaterialEquipmentChecklistPage;