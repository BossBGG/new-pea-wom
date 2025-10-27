"use client";
import React, {useEffect, useState} from "react";
import {getInvolvedPersonsColumns} from "./InvolvedPersonsColumns";
import {DataTableEditor} from "@/app/components/editor-table/DataTableEditor";
import {useAppSelector} from "@/app/redux/hook";
import {ListDataEditor} from "@/app/components/editor-table/ListDataEditor";
import InvolvedPersonsListContent from "./InvolvedPersonsListContent";
import CardCollapse from "../CardCollapse";
import {Assignee, Options, WorkOrderObj} from "@/types";

interface InvolvedPersonsListComponentProps {
  onUpdateData: (d: WorkOrderObj) => void;
  data: WorkOrderObj;
  workerOptions: Options[];
  disabled?: boolean;
}

const InvolvedPersonsListComponent = ({
                                        onUpdateData,
                                        data,
                                        workerOptions,
                                        disabled = false
                                      }: InvolvedPersonsListComponentProps) => {
  const [involvedPersons, setInvolvedPersons] = useState<Assignee[]>([]);
  const screenSize = useAppSelector((state) => state.screen_size);

  useEffect(() => {

    

    if (data.participants && data.participants.length > 0) {
      const mapped = data.participants.map((p: any) => {

        const isUpdate = p.isUpdate !== undefined ? p.isUpdate : false;
        
        return {
          ...p,
          isUpdate: isUpdate
        };
      });
      setInvolvedPersons(mapped);
    } else {
      setInvolvedPersons([]);
    }
  }, [data.participants]);

  const handleUpdateData = (updatedPersons: Assignee[]) => {
    
    const clonedPersons = updatedPersons.map(p => ({...p}));
    
    const newData = {
      ...data,
      participants: clonedPersons
    };
    
    onUpdateData(newData);

  };

  const handleRemoveData = (id: number) => {
    console.log('Remove involved person with id:', id);
  };

  const onUpdatePerson = (value: string | number, item: Assignee) => {
    console.log('Update person:', value, item);
  };

  const getFilteredColumns = () => {
    const columns = getInvolvedPersonsColumns(
      workerOptions,
      onUpdatePerson,
      disabled
    );
    return columns;
  };

  const itemPerson: Assignee = {
    isUpdate: true,  
    isEdited: false,
    username: '',
    userType: 'peaUser', 
    workCenterId: '',
    workUnit: '',
    workActivityTypeId: '',
    workHours: 0,
    name: '',
    isEquipmentResponsible: false
  } as Assignee;

  return (
    <div>
      <CardCollapse title={"รายชื่อผู้เกี่ยวข้อง"}>
        {screenSize === "desktop" ? (
          <DataTableEditor
            columns={getFilteredColumns()}
            onUpdateData={handleUpdateData}
            realData={involvedPersons}
            onRemoveData={handleRemoveData}
            LabelAddRow={!disabled ? "เพิ่มผู้เกี่ยวข้อง" : undefined}
            rowItem={itemPerson}
            visibleDelete={!disabled}
            classPagination="mt-12"
          />
        ) : (
          <ListDataEditor
            onUpdateData={handleUpdateData}
            realData={involvedPersons}
            hiddenPagination={involvedPersons.length <= 10}
          >
            {(pageData: Assignee[], page, pageSize) => (
              <div>
                <InvolvedPersonsListContent
                  pageData={pageData}
                  realData={involvedPersons}
                  page={page}
                  pageSize={pageSize}
                  workerOptions={workerOptions}
                  onUpdateData={handleUpdateData}
                  onRemoveData={handleRemoveData}
                  disabled={disabled}
                />
                
                {!disabled && (
                  <div className="mt-3">
                    <button
                      className="pea-button-outline w-full py-2 px-4 rounded-full flex items-center justify-center"
                      onClick={() => {
                        const newPerson = {...itemPerson};
                        const newList = [...involvedPersons, newPerson];
                        handleUpdateData(newList);
                      }}
                    >
                      <span className="mr-2">+</span>
                      เพิ่มผู้เกี่ยวข้อง
                    </button>
                  </div>
                )}
              </div>
            )}
          </ListDataEditor>
        )}
      </CardCollapse>
    </div>
  );
};

export default InvolvedPersonsListComponent;