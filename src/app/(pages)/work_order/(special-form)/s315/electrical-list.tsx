import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {DataTableEditor} from "@/app/components/editor-table/DataTableEditor";
import {columns} from "@/app/(pages)/work_order/(special-form)/s315/columns";
import {useAppSelector} from "@/app/redux/hook";
import {Electrical, MaterialEquipmentObj} from "@/types";
import {ListDataEditor} from "@/app/components/editor-table/ListDataEditor";
import ListDataContent from "@/app/(pages)/work_order/(special-form)/s315/list-data-content";
import {Button} from "@/components/ui/button";
import ModalEquipments from "@/app/(pages)/work_order/(special-form)/s315/modal-equipments";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";

interface ElectricalListOptions {
  showCardCollapse?: boolean;
  showAddButton?: boolean;
  showDeleteAllButton?: boolean;
  showActionColumn?: boolean;
  isReadOnly?: boolean;
}

interface ElectricalListProps {
  data: Electrical[];
  updateData: (data: Electrical[]) => void;
  options?: ElectricalListOptions;
}

const ElectricalList = ({
                          data,
                          updateData,
                          options = {}
                        }: ElectricalListProps) => {
  // Default options
  const {
    showCardCollapse = true,
    showAddButton = true,
    showDeleteAllButton = true,
    showActionColumn = true,
    isReadOnly = false
  } = options;

  const itemElectrical = {
    id: 0,
    name: '',
    quantity: 0,
    isUpdate: true,
    isEdited: false
  } as Electrical;

  const [electricals, setElectrical] = useState<Electrical[]>(data || [])
  const screenSize = useAppSelector(state => state.screen_size)
  
  const [openModal, setOpenModal] = React.useState(false);
  const [updateIndex, setUpdateIndex] = React.useState(-1);

  const equipmentNameOptions = [
    {label: 'METER (E) WATTHOUR 1P 5(100) A O/D BLE', value: 'METER (E) WATTHOUR 1P 5(100) A O/D BLE'},
    {label: 'METER (E) WATTHOUR 1P 1(500)', value: 'METER (E) WATTHOUR 1P 1(500)'}
  ]

  useEffect(() => {
    if (screenSize !== 'desktop') {
      const newElectricals: Electrical[] = electricals.map((item) => {
        return {...item, isUpdate: false};
      })

      console.log('newElectricals >>> ', newElectricals)
      setElectrical(newElectricals)
    }
  }, [screenSize]);

  // Update electricals when data prop changes
  useEffect(() => {
    setElectrical(data || []);
  }, [data]);

  const onRemoveData = (id: number) => {
    console.log('Remove equipment with id:', id);
  }

  const handleUpdateData = (data: Electrical[]) => {
    setElectrical(data)
    updateData(data)
  }

  // ฟังก์ชันสำหรับเพิ่มอุปกรณ์จาก modal
  const handleAddEquipment = (equipment: MaterialEquipmentObj) => {
    const newElectrical: Electrical = {
      id: Date.now(), 
      name: equipment.name || 'อุปกรณ์ไฟฟ้าใหม่',
      quantity: typeof equipment.quantity === 'string'
        ? parseInt(equipment.quantity) || 1
        : equipment.quantity || 1,
      isUpdate: false,
      isEdited: false
    };

    const updatedElectricals = [...electricals, newElectrical];
    setElectrical(updatedElectricals);
    updateData(updatedElectricals);
  }

  // Filter columns based on options
  const getFilteredColumns = () => {
    if (!showActionColumn) {
      return columns.filter(column => column.id !== 'action');
    }
    return columns;
  };

  // Render content without CardCollapse
  const renderContent = () => {
    if (screenSize === 'desktop') {
      return (
        <DataTableEditor 
          columns={getFilteredColumns()}
          onUpdateData={handleUpdateData}
          visibleDelete={showDeleteAllButton && !isReadOnly}
          rowItem={itemElectrical}
          realData={electricals}
          LabelAddRow={
            showAddButton && !isReadOnly && screenSize === 'desktop' 
              ? 'เพิ่มประเภทอุปกรณ์ไฟฟ้า' 
              : undefined
          }
          onRemoveData={onRemoveData}
        />
      );
    } else {
      return (
        <ListDataEditor 
          onUpdateData={handleUpdateData}
          realData={electricals}
        >
          {(pageData: Electrical[], page, pageSize) => (
            <div>
              <ListDataContent 
                pageData={pageData}
                realData={electricals}
                page={page}
                pageSize={pageSize}
                onUpdateData={handleUpdateData}
                equipmentNameOptions={equipmentNameOptions}
                onRemoveData={onRemoveData}
                setUpdateIndex={(index) => {
                  setUpdateIndex(index)
                  setOpenModal(true)
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
        <CardCollapse title={'หม้อแปลง'}>
          {content}
        </CardCollapse>
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
  )
}

export default ElectricalList;