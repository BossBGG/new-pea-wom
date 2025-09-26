import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import { DataTableEditor } from "@/app/components/editor-table/DataTableEditor";
import { columns } from "@/app/(pages)/work_order/(special-form)/s318/columns";
import { useAppSelector } from "@/app/redux/hook";
import { MeterEquipment, Options, RequestServiceDetail, WorkOrderObj } from "@/types";
import { ListDataEditor } from "@/app/components/editor-table/ListDataEditor";
import ListDataContent from "@/app/(pages)/work_order/(special-form)/s318/list-data-content";
import { Button } from "@/components/ui/button";
import ModalEquipments from "@/app/(pages)/work_order/(special-form)/s318/modal-equipments";
import CardCollapse from "@/app/(pages)/work_order/(special-form)/component/CardCollapse";
import { getMeterEquipmentOptions } from "@/app/api/MaterialEquipmentApi";

interface MeterEquipmentListOptions {
  showCardCollapse?: boolean;
  showAddButton?: boolean;
  showDeleteAllButton?: boolean;
  showActionColumn?: boolean;
  isReadOnly?: boolean;
}

interface MeterEquipmentListProps {
  data: WorkOrderObj;
  updateData?: (data: WorkOrderObj) => void;
  options?: MeterEquipmentListOptions;
  meterEquipmentOptions: Options[];
  onUpdateOptions?: (options: Options[]) => void;
  requestCode: string;
}

const MeterEquipmentList = ({
  data,
  updateData,
  options = {},
  meterEquipmentOptions,
  onUpdateOptions,
  requestCode
}: MeterEquipmentListProps) => {
  const {
    showCardCollapse = true,
    showAddButton = true,
    showDeleteAllButton = true,
    showActionColumn = true,
    isReadOnly = false,
  } = options;

  const itemMeterEquipment: MeterEquipment = {
    id: Date.now(), 
    equipment_id: "",
    equipment_name: "", 
    size: "",
    quantity: 1, 
    price: 0,
    isUpdate: true,
    isEdited: false,
  };

  const [meterEquipments, setMeterEquipments] = useState<MeterEquipment[]>([]);
  const screenSize = useAppSelector((state) => state.screen_size);

  const [openModal, setOpenModal] = React.useState(false);
  const [updateIndex, setUpdateIndex] = React.useState(-1);

  useEffect(() => {
    let requestService = data.requestServiceDetail as RequestServiceDetail;
    if (typeof data.requestServiceDetail === "string") {
      requestService = JSON.parse(data.requestServiceDetail);
    }
   
    const items = requestService?.items || [];
    const convertedItems: MeterEquipment[] = items.map((item: any, index: number) => ({
      id: item.item_id || `temp_${index}`, 
      equipment_id: item.item_id || "",
      equipment_name: meterEquipmentOptions.find(opt => opt.value === item.item_id)?.label || "",
      size: item.item_size?.toString() || "",
      quantity: item.quantity || 0,
      price: item.price || 0,
      isUpdate: false,
      isEdited: false,
    }));
    
    setMeterEquipments(convertedItems);
  }, [data.requestServiceDetail, meterEquipmentOptions]);

  useEffect(() => {
    if (screenSize !== "desktop") {
      const newMeterEquipments: MeterEquipment[] = meterEquipments.map(
        (item) => {
          return { ...item, isUpdate: false };
        }
      );
      setMeterEquipments(newMeterEquipments);
    }
  }, [screenSize]);

  const onRemoveData = (id: number | string) => {
    console.log("Remove equipment with id:", id);
  };

  const handleUpdateData = (items: MeterEquipment[]) => {
    setMeterEquipments(items);
    
    
    const convertedItems = items.map(item => ({
      item_id: item.equipment_id || "",
      item_size: typeof item.size === 'string' ? parseFloat(item.size) || 0 : item.size || 0,
      quantity: item.quantity,
      price: item.price || 0
    }));

    let newData = data;
    newData = {
      ...newData,
      requestServiceDetail: {
        ...newData.requestServiceDetail as RequestServiceDetail,
        items: convertedItems
      }
    };
    
    updateData?.(newData);
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
              ? "เพิ่มมิเตอร์/อุปกรณ์ไฟฟ้า"
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
                meterEquipmentOptions={meterEquipmentOptions}
                onRemoveData={onRemoveData}
                setUpdateIndex={(index) => {
                  setUpdateIndex(index);
                  setOpenModal(true);
                }}
                showActionButtons={showActionColumn && !isReadOnly}
                isReadOnly={isReadOnly}
                requestCode={requestCode}
              />

              {showAddButton && !isReadOnly && (
                <Button
                  className="pea-button-outline my-2 w-full"
                  onClick={() => setOpenModal(true)}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  เพิ่มมิเตอร์/อุปกรณ์ไฟฟ้า
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
          options={meterEquipmentOptions}
          onUpdateOptions={onUpdateOptions}
          data={meterEquipments}
          onUpdateData={handleUpdateData}
          requestCode={requestCode}
        />
      )}
    </>
  );
};

export default MeterEquipmentList;