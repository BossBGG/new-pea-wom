'use client';
import React, { useState } from 'react';
import { getColumns } from "./columns";
import CardCollapse from '../CardCollapse';
import { DataTableEditor } from "@/app/components/editor-table/DataTableEditor";
import { MaterialEquipmentObj, Options } from "@/types";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/app/redux/hook";
import { ListDataEditor } from "@/app/components/editor-table/ListDataEditor";
import MaterialEquipmentListContent from "./MaterialEquipmentListContent";
import AddMaterial from "./AddMaterial";

const MaterialEquipmentChecklistPage = () => {
  const screenSize = useAppSelector(state => state.screen_size);
  const [materialEquipments, setMaterialEquipments] = useState<MaterialEquipmentObj[]>([
    
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [updateIndex, setUpdateIndex] = useState(-1);
  
  // Mock material options
  const materialOptions: Options[] = [
    {label: 'S-3H-044 - หม้อแปลง3P5000KVA(รายปี)', value: 'S-3H-044'},
    {label: 'S-3H-045 - หม้อแปลง1P2000KVA', value: 'S-3H-045'},
    {label: 'S-3H-046 - อุปกรณ์ไฟฟ้าอื่นๆ', value: 'S-3H-046'},
  ]
 

  const handleUpdateData = (data: MaterialEquipmentObj[]) => {
    setMaterialEquipments(data);
  };

  const onRemoveData = (id: number) => {
    console.log('Remove data with id:', id);
  };

  const handleAddMaterial = (newMaterial: MaterialEquipmentObj) => {
    setMaterialEquipments(prev => [...prev, newMaterial]);
  };

  // สร้าง columns โดยไม่ต้องส่ง parameters ที่ไม่ใช้
  const columns = getColumns();

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

  return (
    <div>
      <CardCollapse title={"รายการวัสดุอุปกรณ์"}>
        {
          screenSize === 'desktop'
            ? <DataTableEditor 
                columns={columns}
                onUpdateData={handleUpdateData}
                realData={materialEquipments}
                rowItem={itemMaterialEquipment}
                LabelAddRow="เพิ่มวัสดุอุปกรณ์"
                onRemoveData={onRemoveData}
                visibleDelete={true}
              />
            : <ListDataEditor 
                onUpdateData={handleUpdateData}
                realData={materialEquipments}
              >
                {
                  (pageData: MaterialEquipmentObj[], page, pageSize) =>
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
                      />

                      <Button className="pea-button-outline my-2 w-full"
                              onClick={() => setOpenModal(true)}
                      >
                        <FontAwesomeIcon icon={faPlus} className="mr-2"/>
                        เพิ่มวัสดุอุปกรณ์
                      </Button>
                    </div>
                }
              </ListDataEditor>
        }
        
       
      </CardCollapse>

      {/* Add Material Modal */}
      <AddMaterial 
        open={openModal}
        onClose={() => setOpenModal(false)}
        index={updateIndex}
        onAddMaterial={handleAddMaterial}
      />
    </div>
  );
};

export default MaterialEquipmentChecklistPage;