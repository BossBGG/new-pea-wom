import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {DataTableEditor} from "@/app/components/editor-table/DataTableEditor";
import {columns} from "@/app/(pages)/work_order/(special-form)/s318/columns";
import {useAppSelector} from "@/app/redux/hook";
import {MaterialEquipmentObj, MeterEquipment} from "@/types";
import {ListDataEditor} from "@/app/components/editor-table/ListDataEditor";
import ListDataContent from "@/app/(pages)/work_order/(special-form)/s318/list-data-content";
import {Button} from "@/components/ui/button";
import ModalEquipments from "@/app/(pages)/work_order/(special-form)/s318/modal-equipments";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";

interface MeterEquipmentListProps {
  data: MeterEquipment[],
  updateData: (data: MeterEquipment[]) => void;
}

const MeterEquipmentList = ({
                          data,
                          updateData
                        }: MeterEquipmentListProps) => {
  const itemMeterEquipment = {
    id: 0,
    equipment_name: '',
    size: '',
    quantity: 0,
    price: 0,
    isUpdate: true,
    isEdited: false
  } as MeterEquipment;

  const [meterEquipments, setMeterEquipments] = useState<MeterEquipment[]>(data)
  const screenSize = useAppSelector(state => state.screen_size)

  const [openModal, setOpenModal] = React.useState(false);
  const [updateIndex, setUpdateIndex] = React.useState(-1);

  const equipmentNameOptions = [
    {label: 'มิเตอร์', value: 'มิเตอร์'},
    {label: 'อุปกรณ์ครอบสายไฟฟ้า', value: 'อุปกรณ์ครอบสายไฟฟ้า'},
    {label: 'หม้อแปลงไฟฟ้า', value: 'หม้อแปลงไฟฟ้า'},
  
  ]

  useEffect(() => {
    if (screenSize !== 'desktop') {
      const newMeterEquipments: MeterEquipment[] = meterEquipments.map((item) => {
        return {...item, isUpdate: false};
      })

      console.log('newMeterEquipments >>> ', newMeterEquipments)
      setMeterEquipments(newMeterEquipments)
    }
  }, [screenSize]);

  const onRemoveData = (id: number) => {
    console.log('Remove equipment with id:', id);
  }

  const handleUpdateData = (data: MeterEquipment[]) => {
    setMeterEquipments(data)
    updateData(data)
  }

   // ฟังก์ชันสำหรับเพิ่มอุปกรณ์จาก modal
    const handleAddEquipment = (equipment: MaterialEquipmentObj) => {
      const newMeterEquipment: MeterEquipment = {
        id: Date.now(), 
        equipment_name: equipment.name || "อุปกรณ์ไฟฟ้าใหม่",
        size: equipment.size || "1",
        quantity: typeof equipment.quantity === 'string'
        ? parseInt(equipment.quantity) || 1
        :equipment.quantity || 1,
        isUpdate: false,
        isEdited: false,
      };
  
      const updatedMeterEquipments = [...meterEquipments, newMeterEquipment];
      setMeterEquipments(updatedMeterEquipments);
      updateData(updatedMeterEquipments);
    };

  return (
    <CardCollapse title={'มิเตอร์/อุปกรณ์ไฟฟ้า'}>
      {
        screenSize === 'desktop'
          ? <DataTableEditor columns={columns}
                             onUpdateData={handleUpdateData}
                             visibleDelete={true}
                             rowItem={itemMeterEquipment}
                             realData={meterEquipments}
                             LabelAddRow={screenSize === 'desktop' ? 'เพิ่มอุปกรณ์ไฟฟ้า' : undefined}
                             onRemoveData={onRemoveData}/>
          : <ListDataEditor onUpdateData={handleUpdateData}
                            realData={meterEquipments}
          >
            {
              (pageData: MeterEquipment[], page, pageSize) =>
                <div>
                  <ListDataContent pageData={pageData}
                                   realData={meterEquipments}
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
                    เพิ่มอุปกรณ์ไฟฟ้า
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

export default MeterEquipmentList;