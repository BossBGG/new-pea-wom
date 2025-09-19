'use client';
import React, { useState } from 'react';
import { getColumns } from "./columns";
import CardCollapse from '../CardCollapse';
import { DataTableEditor } from "@/app/components/editor-table/DataTableEditor";
import { MaterialEquipmentObj, Options } from "@/types";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/app/redux/hook";
import { ListDataEditor } from "@/app/components/editor-table/ListDataEditor";
import MaterialEquipmentListContent from "./MaterialEquipmentListContent";
import AddMaterial from "./AddMaterial";

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
}

const MaterialEquipmentChecklistPage = ({
  options = {},
  data,
  updateData
}: MaterialEquipmentChecklistProps) => {
  // Default options
  const {
    showCardCollapse = true,
    showAddButton = true,
    showDeleteAllButton = true,
    showActionColumn = true,
    isReadOnly = false
  } = options;

  const screenSize = useAppSelector(state => state.screen_size);
  const [materialEquipments, setMaterialEquipments] = useState<MaterialEquipmentObj[]>(data || []);
  const [openModal, setOpenModal] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);
  
  // Mock material options
  const materialOptions: Options[] = [
    {label: 'S-3H-044 - หม้อแปลง3P5000KVA(รายปี)', value: 'S-3H-044'},
    {label: 'S-3H-045 - หม้อแปลง1P2000KVA', value: 'S-3H-045'},
    {label: 'S-3H-046 - อุปกรณ์ไฟฟ้าอื่นๆ', value: 'S-3H-046'},
  ]

  const handleUpdateData = (newData: MaterialEquipmentObj[]) => {
    setMaterialEquipments(newData);
    if (updateData) {
      updateData(newData);
    }
  };

  const onRemoveData = (id: number) => {
    console.log('Remove data with id:', id);
  };

  const handleAddMaterial = (newMaterial: MaterialEquipmentObj) => {
    const updatedData = [...materialEquipments, newMaterial];
    setMaterialEquipments(updatedData);
    if (updateData) {
      updateData(updatedData);
    }
  };

  // Filter columns based on options
  const getFilteredColumns = () => {
    const allColumns = getColumns();
    if (!showActionColumn) {
      return allColumns.filter(column => column.id !== 'action');
    }
    return allColumns;
  };

  const itemMaterialEquipment: MaterialEquipmentObj = {
    id: 0,
    uuid: '',
    code: '',
    name: '',
    quantity: 0,
    unit: 'ชิ้น',
    isActive: true,
    isUpdate: true,
    isEdited: false
  } as MaterialEquipmentObj;

  // Custom handler for desktop add button
  const handleDesktopAdd = () => {
    setOpenModal(true);
  };

  // Render content without CardCollapse
  const renderContent = () => {
    if (screenSize === 'desktop') {
      return (
        <div>
          <DataTableEditor 
            columns={getFilteredColumns()}
            onUpdateData={handleUpdateData}
            realData={materialEquipments}
            onRemoveData={onRemoveData}
           
           
          />
          
          {/* Custom Add Button for Desktop */}
          {showAddButton && !isReadOnly && (
            <div className="flex items-center justify-end mt-3">
              <Button 
                className="pea-button !px-3 !py-4" 
                onClick={handleDesktopAdd}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                เพิ่มวัสดุอุปกรณ์
              </Button>
              
              {showDeleteAllButton && (
                <Button 
                  className="mx-2 pea-button-outline !px-3 !py-4" 
                  onClick={() => handleUpdateData([])}
                >
                  <FontAwesomeIcon icon={faTrashCan} className="mr-2"/>
                  ลบทั้งหมด
                </Button>
              )}
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
                  setUpdateIndex(index)
                  setOpenModal(true)
                }}
                showActionButtons={showActionColumn}
                isReadOnly={isReadOnly}
              />

              {showAddButton && !isReadOnly && (
                <Button 
                  className="pea-button-outline my-2 w-full"
                  onClick={() => setOpenModal(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2"/>
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
        <CardCollapse title={"รายการวัสดุอุปกรณ์"}>
          {content}
        </CardCollapse>
      ) : (
        content
      )}

      {/* Add Material Modal for both Desktop and Mobile */}
      {showAddButton && !isReadOnly && (
        <AddMaterial 
          open={openModal}
          onClose={() => setOpenModal(false)}
          index={updateIndex}
          onAddMaterial={handleAddMaterial}
        />
      )}
    </>
  );
};

export default MaterialEquipmentChecklistPage;