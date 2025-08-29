import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {DataTableEditor} from "@/app/components/editor-table/DataTableEditor";
import {columns} from "@/app/(pages)/work_order/(special-form)/s301/columns";
import {useAppSelector} from "@/app/redux/hook";
import {Electrical, MaterialEquipmentObj} from "@/types";
import {ListDataEditor} from "@/app/components/editor-table/ListDataEditor";
import ListDataContent from "@/app/(pages)/work_order/(special-form)/s301/list-data-content";
import {Button} from "@/components/ui/button";
import ModalEquipments from "@/app/(pages)/work_order/(special-form)/s301/modal-equipments";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";


interface ElectricalListProps {
  data: Electrical[],
  updateData: (data: Electrical[]) => void;
}

const ElectricalList = ({
                          data,
                          updateData
                        }: ElectricalListProps) => {
  const itemElectrical = {
    id: 0,
    name: '',
    quantity: 0,
    isUpdate: true,
    isEdited: false
  } as Electrical;

  const [electricals, setElectrical] = useState<Electrical[]>(data)
  const screenSize = useAppSelector(state => state.screen_size)
  
  const [openModal, setOpenModal] = React.useState(false);
  const [updateIndex, setUpdateIndex] = React.useState(-1);

  const equipmentNameOptions = [
    {label: 'METER (E) WATTHOUR 1P 5(100) A O/D BLE', value: 'METER (E) WATTHOUR 1P 5(100) A O/D BLE'},
    {label: 'METER (E) WATTHOUR 1P 1(500', value: 'METER (E) WATTHOUR 1P 1(500'}
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
        :equipment.quantity || 1,
      isUpdate: false,
      isEdited: false
    };

    const updatedElectricals = [...electricals, newElectrical];
    setElectrical(updatedElectricals);
    updateData(updatedElectricals);
  }

  return (
    <CardCollapse title={'รายการอุปกรณ์ไฟฟ้า'}>
      {
        screenSize === 'desktop'
          ? <DataTableEditor columns={columns}
                             onUpdateData={handleUpdateData}
                             visibleDelete={true}
                             rowItem={itemElectrical}
                             realData={electricals}
                             LabelAddRow={screenSize === 'desktop' ? 'เพิ่มประเภทอุปกรณ์ไฟฟ้า' : undefined}
                             onRemoveData={onRemoveData}/>
          : <ListDataEditor onUpdateData={handleUpdateData}
                            realData={electricals}
          >
            {
              (pageData: Electrical[], page, pageSize) =>
                <div>
                  <ListDataContent pageData={pageData}
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

      <ModalEquipments open={openModal}
                       onClose={() => setOpenModal(false)}
                       index={updateIndex}
                       onAddEquipment={handleAddEquipment}
      />
    </CardCollapse>
  )
}

export default ElectricalList;