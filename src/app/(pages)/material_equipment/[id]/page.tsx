'use client'
import {useBreadcrumb} from "@/app/context/BreadcrumbContext";
import React, {useEffect, useState} from "react";
import AddMaterialEquipmentBreadcrumb from "@/app/(pages)/material_equipment/[id]/breadcrumb";
import InputText from "@/app/components/form/InputText";
import {Button} from "@/components/ui/button";
import {
  createDataMaterials,
  MaterialEquipmentListById,
  getMaterialOptions,
  updateDataMaterials
} from "@/app/api/MaterialEquipmentApi";
import {useParams, useRouter} from "next/navigation";
import {useAppSelector} from "@/app/redux/hook";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {MaterialEquipmentObj, MaterialOptionObj, Options} from "@/types";
import {EmpTyData} from "@/app/(pages)/material_equipment/empty-data";
import {DataTableEditor} from "@/app/components/editor-table/DataTableEditor";
import {ListDataEditor} from "@/app/components/editor-table/ListDataEditor";
import ListDataContent from "@/app/(pages)/material_equipment/[id]/list-data-content";
import {showError, showProgress, showSuccess} from "@/app/helpers/Alert";
import Link from "next/link";
import {cn} from "@/lib/utils";
import ModalAddOrEditMaterials from "@/app/(pages)/material_equipment/[id]/modal-add-or-edit-materials";
import {getColumns} from "@/app/(pages)/material_equipment/[id]/columns";

export interface addMaterialType {
  name: string,
  code: string,
  quantity: number,
  unit: string,
  isActive: boolean
}

export interface updateMaterialType {
  id: number,
  name: string,
  code: string,
  quantity: number,
  unit: string,
  isActive: boolean
}

const CreateMaterialEquipment = () => {
  const {setBreadcrumb} = useBreadcrumb();
  const params = useParams();
  const screenSize = useAppSelector(state => state.screen_size);
  const isCreate = params.id === 'create';
  const itemMaterial: MaterialEquipmentObj = {
    id: 0,
    uuid: '',
    code: '',
    name: '',
    quantity: 0,
    unit: '',
    isActive: false,
    isUpdate: true,
    isEdited: false
  }

  const [materialData, setMaterialData] = useState<MaterialEquipmentObj[]>([]);
  const [name, setName] = useState<string>('');
  const [removeIds, setRemoveIds] = useState<number[]>([]);
  const router = useRouter()
  const [openModal, setOpenModal] = React.useState(false);
  const [updateIndex, setUpdateIndex] = React.useState(-1);
  const [materialCodeOptions, setMaterialCodeOptions] = React.useState<Options[]>([]);
  const [materialNameOptions, setMaterialNameOptions] = React.useState<Options[]>([]);
  const [materialOriginal, setMaterialOriginal] = React.useState<MaterialOptionObj[]>([]);
  const columns = getColumns(materialCodeOptions, materialNameOptions, materialOriginal)

  useEffect(() => {
    setBreadcrumb(<AddMaterialEquipmentBreadcrumb/>)
    if (!isCreate) {
      fetchListData()
    }
    fetchMaterialOptions()
  }, [setBreadcrumb]);

  const fetchMaterialOptions = () => {
    getMaterialOptions().then((resp) => {
      if(resp.data?.status_code === 200) {
        let code_options: Options[] = []
        let name_options: Options[] = []
        let material_original_data: MaterialOptionObj[] = resp.data.data || [];
        setMaterialOriginal(material_original_data)

        material_original_data.map((item) => {
          code_options.push({value: item.code, label: item.code});
          name_options.push({value: item.name, label: item.name});
        })

        setMaterialCodeOptions(code_options)
        setMaterialNameOptions(name_options)
      }
    })
  }

  const fetchListData = () => {
    MaterialEquipmentListById(params.id as string)
      .then(res => {
        if (res.data?.status_code === 200) {
          setMaterialData(res.data?.data?.materialAndEquipment || [])
          setName(res.data?.data?.name || '')
        } else {
          showError(res.data?.message || '')
        }
      })
      .catch((error) => {
        showError(error.message)
      })
  }

  const addEquipment = () => {
    if (screenSize === 'mobile') {
      setOpenModal(true)
    } else {
      const newData = [...materialData, itemMaterial];
      setMaterialData(newData);
    }
  }

  const onRemoveData = (id: number) => {
    setRemoveIds(old => (
      [...old, id]
    ))
    console.log('ids >>>> ', removeIds)
  }

  const submit = () => {
    if (!name) {
      showError('กรุณาตั้งชื่อกลุ่มวัสดุและอุปกรณ์')
      return
    }

    if (materialData?.length === 0) {
      showError('กรุณาเพิ่มอุปกรณ์')
      return
    }

    showProgress()
    if (isCreate) {
      submitCreate()
    } else {
      submitUpdate()
    }
  }

  const resSuccess = () => {
    showSuccess().then(() => {
      router.push('/material_equipment')
    })
  }

  const submitCreate = () => {
    const newMaterialData: addMaterialType[] = [];

    materialData.map(equipment => {
      newMaterialData.push({
        name: equipment.name,
        code: equipment.code,
        quantity: typeof equipment.quantity === 'string' ? parseInt(equipment.quantity) : equipment.quantity,
        unit: equipment.unit,
        isActive: equipment.isActive
      })
    })

    const data = {
      name,
      isActive: true,
      materialAndEquipment: newMaterialData
    }

    createDataMaterials(data)
      .then(res => {
        if (res.data?.status_code === 201) {
          resSuccess()
        } else {
          showError(res.data?.message || '')
        }
      })
      .catch((error) => {
        showError(error.message)
      })
  }

  const submitUpdate = () => {
    const addMaterials: addMaterialType[] = [];
    const updateMaterials: updateMaterialType[] = [];
    materialData.map(item => {
      if (!item.id) {
        addMaterials.push({
          name: item.name,
          code: item.code,
          quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
          unit: item.unit,
          isActive: item.isActive
        })
      } else if (item.id && item.isEdited) {
        updateMaterials.push({
          id: item.id,
          name: item.name,
          code: item.code,
          quantity: typeof item.quantity === 'string' ? parseInt(item.quantity) : item.quantity,
          unit: item.unit,
          isActive: item.isActive
        });
      }
    })

    const data = {
      name,
      addMaterials,
      updateMaterials,
      removeMaterialIds: removeIds
    }

    updateDataMaterials(params.id as string, data)
      .then(res => {
        if (res.data?.status_code === 200) {
          resSuccess()
        } else {
          showError(res.data?.message || '')
        }
      })
      .catch((error) => {
        showError(error.message)
      })
  }

  return <div className="border-1 border-[#E1D2FF] rounded-[20px] p-4">
    <div className={screenSize !== 'desktop' ? 'flex flex-wrap md:flex-nowrap items-end w-full mb-3' : 'w-full'}>
      <InputText label="ชื่อกลุ่ม"
                 isRequired={true}
                 placeholder="ตั้งชื่อกลุ่ม"
                 onChange={setName}
                 value={name}
      />

      <Button
        className={cn('mx-0 md:mx-3 pea-button w-full mt-3 md:mt-0 md:w-auto !px-3 !py-5', screenSize === 'desktop' && 'hidden')}
        onClick={() => addEquipment()}>
        <FontAwesomeIcon icon={faPlus} className="mr-2"/>
        เพิ่มอุปกรณ์
      </Button>

      <ModalAddOrEditMaterials open={openModal}
                               onClose={() => setOpenModal(false)}
                               materialCodeOptions={materialCodeOptions}
                               materialNameOptions={materialNameOptions}
                               materialOriginalOptions={materialOriginal}
                               data={materialData}
                               onUpdate={setMaterialData}
                               index={updateIndex}
                               setUpdateIndex={setUpdateIndex}
      />
    </div>

    {
      screenSize !== 'desktop' ?
        materialData.length > 0 ?
          <ListDataEditor onUpdateData={setMaterialData}
                          realData={materialData}
          >
            {
              (pageData: MaterialEquipmentObj[], page, pageSize) =>
                <ListDataContent pageData={pageData}
                                 realData={materialData}
                                 page={page}
                                 pageSize={pageSize}
                                 onUpdateData={setMaterialData}
                                 materialCodeOptions={materialCodeOptions}
                                 materialNameOptions={materialNameOptions}
                                 materialOriginalOptions={materialOriginal}
                                 onRemoveData={onRemoveData}
                                 setUpdateIndex={(index) => {
                                   setUpdateIndex(index)
                                   setOpenModal(true)
                                 }}
                />
            }
          </ListDataEditor>
          : <EmpTyData/>
        :
        <DataTableEditor columns={columns}
                         onUpdateData={setMaterialData}
                         rowItem={itemMaterial}
                         LabelAddRow={screenSize === 'desktop' ? 'เพิ่มอุปกรณ์' : undefined}
                         realData={materialData}
                         onRemoveData={onRemoveData}
        />
    }

    <div className="flex justify-between mt-4 md:flex-row flex-wrap-reverse">
      <Link className="cancel-button w-full md:w-auto !h-[43px] text-center"
            href="/material_equipment"
      >
        ยกเลิก
      </Link>
      <Button className="!py-[20px] pea-button w-full md:w-auto md:mb-0 mb-4"
              onClick={() => submit()}>
        บันทึก
      </Button>
    </div>
  </div>
}

export default CreateMaterialEquipment;
