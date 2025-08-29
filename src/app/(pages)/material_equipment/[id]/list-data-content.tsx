import {MaterialEquipmentObj, MaterialOptionObj, Options} from "@/types";
import React, {useEffect, useState} from "react";
import InputSelect from "@/app/components/form/InputSelect";
import InputText from "@/app/components/form/InputText";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faPencil, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {useAppSelector} from "@/app/redux/hook";

interface ListDataContentProps {
  realData: MaterialEquipmentObj[],
  pageData: MaterialEquipmentObj[],
  onUpdateData: (data: MaterialEquipmentObj[]) => void,
  onRemoveData: (id: number) => void,
  setUpdateIndex: (index: number) => void,
  page: number,
  pageSize: number,
  materialCodeOptions: Options[],
  materialNameOptions: Options[],
  materialOriginalOptions: MaterialOptionObj[]
}

const DataInfo = ({
                    label,
                    value
                  }: {
  label: string,
  value: string | number
}) => {
  return (
    <div className="w-full md:border-r-1 text-[14px] md:text-[16px]">
      <span className="text-[#4A4A4A]">{label} : </span>
      <span className="text-[#160C26]">{value}</span>
    </div>
  )
}

const ListDataContent = ({
                           realData,
                           pageData,
                           onUpdateData,
                           page,
                           pageSize,
                           materialCodeOptions,
                           materialNameOptions,
                           onRemoveData,
                           setUpdateIndex,
                           materialOriginalOptions
                         }: ListDataContentProps) => {
  const [data, setData] = useState<MaterialEquipmentObj[]>([]);
  const screenSize = useAppSelector((state) => state.screen_size)

  useEffect(() => {
    setData(pageData)
  }, [pageData]);

  useEffect(() => {
    if (screenSize === 'mobile') {
      const newData = realData.map((item: MaterialEquipmentObj) => {
        return {...item, isUpdate: false}
      })
      onUpdateData(newData)
    }
  }, [screenSize]);

  const handleUpdateData = (key: string, value: string | number | boolean | undefined, index: number) => {
    index = (page * pageSize) + index
    const newData = realData.map((item: MaterialEquipmentObj, idx) => {
      let isEdited = item.isEdited;
      if (key === 'isUpdate' && value) {
        isEdited = true
        if (screenSize === 'mobile') {
          setUpdateIndex(index)
          value = false
        }
      }

      if (key === 'isActive' && screenSize === 'mobile') {
        isEdited = true
      }

      if (key === 'code' || key === 'name') {
        let material = materialOriginalOptions.filter((itemMaterial: MaterialOptionObj) => {
          return key === 'code' ? itemMaterial.code === value : itemMaterial.name === value;
        })

        if (material?.length > 0 && idx === index) {
          item = {...item, unit: material[0].unit}
          if (key === 'name') {
            item.code = material[0].code
          } else if (key === 'code') {
            item.name = material[0].name
          }
        }
      }

      return idx === index ? {...item, [key]: value, isEdited} : item;
    })
    onUpdateData(newData);
  }

  const deleteData = (id: number, index: number) => {
    const newData = realData.filter((_, idx) => index !== idx);
    onUpdateData(newData);
    id && onRemoveData(id);
  }

  return (
    <div>
      {
        data.map((item: MaterialEquipmentObj, index: number) => (
          <div key={index}
               className={cn('border-1 border-[#E0E0E0] rounded-[12px] p-3 mb-3', item.isUpdate && 'bg-[#F8F8F8]')}
          >
            <div className="flex flex-wrap w-full">
              <div className={cn('p-2', item.isUpdate ? 'w-1/4' : 'w-full md:w-1/5')}>
                {
                  item.isUpdate && screenSize !== 'mobile'
                    ? <InputSelect options={materialCodeOptions}
                                   value={item.code}
                                   placeholder={"ค้นหารหัสวัสดุ"}
                                   setData={(value) => handleUpdateData('code', value, index)}
                    />
                    : <DataInfo label="รหัสวัสดุ"
                                value={materialCodeOptions.filter((eq) => eq.value === item.code)[0]?.label || ''}/>
                }
              </div>
              <div className={cn('p-2', item.isUpdate ? 'w-1/4' : 'w-full md:w-1/5')}>
                {
                  item.isUpdate && screenSize !== 'mobile'
                    ? <InputSelect options={materialNameOptions}
                                   value={item.name}
                                   placeholder={"ชื่ออุปกรณ์"}
                                   setData={(value) => handleUpdateData('name', value, index)}
                    />
                    : <DataInfo label="ชื่ออุปกรณ์"
                                value={materialNameOptions.filter((eq) => eq.value === item.name)[0]?.label || ''}/>
                }
              </div>
              <div className={cn('p-2', item.isUpdate ? 'w-1/4' : 'w-full md:w-1/5')}>
                {
                  item.isUpdate && screenSize !== 'mobile'
                    ? <InputText label=""
                                 placeholder="ระบุจำนวน"
                                 value={item.quantity}
                                 numberOnly={true}
                                 onChange={(value) => handleUpdateData('quantity', value, index)}
                    />
                    : <DataInfo label="จำนวน" value={item.quantity}/>
                }
              </div>
              <div className={cn('p-2', item.isUpdate ? 'hidden' : 'w-full md:w-1/5')}>
                <DataInfo label="หน่วย" value={item.unit}/>
              </div>
              <div className={cn('p-2', item.isUpdate ? 'w-1/4' : 'w-full md:w-1/5')}>
                <span className="text-[#4A4A4A]">เปิด/ปิดการใช้งาน : </span>
                <Switch checked={item.isActive}
                        onCheckedChange={() => handleUpdateData('isActive', !item.isActive, index)}
                        disabled={screenSize === 'tablet' && !item.isUpdate}
                        className="data-[state=checked]:bg-[#9538EA] data-[state=unchecked]:bg-[#57595B]"
                />
              </div>
            </div>

            <div className="flex justify-end md:mt-0 mt-3">
              {
                item.isUpdate ?
                  <button
                    className="bg-[#C8F9E9] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
                    onClick={() => handleUpdateData('isUpdate', false, index)}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} size={"sm"} color="#31C48D"/>
                  </button>
                  :
                  <button
                    className="bg-[#FDE5B6] rounded-[8px] mr-2 p-2 flex items-center justify-center cursor-pointer"
                    onClick={() => handleUpdateData('isUpdate', true, index)}
                  >
                    <FontAwesomeIcon icon={faPencil} size={"sm"} color="#F9AC12"/>
                  </button>
              }

              <button
                className="bg-[#FFD4D4] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
                onClick={() => deleteData(item.id || 0, index)}>
                <FontAwesomeIcon icon={faTrashCan} size={"sm"} color="#E02424"/>
              </button>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default ListDataContent;
