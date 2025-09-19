"use client";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import {Options, ResponsiblePersonObj} from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {Selection} from "@/app/components/form/Selection";

interface ResponsiblePersonListContentProps {
  realData: ResponsiblePersonObj[];
  pageData: ResponsiblePersonObj[];
  onUpdateData: (data: ResponsiblePersonObj[]) => void;
  onRemoveData: (id: number) => void;
  page: number;
  pageSize: number;
  showActionButtons?: boolean;
  isReadOnly?: boolean;
  assigneeOptions: Options[]
}

const ResponsiblePersonListContent = ({
  realData,
  pageData,
  onUpdateData,
  onRemoveData,
  page,
  pageSize,
  showActionButtons = true,
  isReadOnly = false,
  assigneeOptions
}: ResponsiblePersonListContentProps) => {
  const handleUpdateData = (
    value: boolean,
    index: number
  ) => {
    if (isReadOnly) return;
    const newData = realData.map((item: ResponsiblePersonObj, idx) => {
      return idx === index ? { ...item, isUpdate: value } : item;
    });
    onUpdateData(newData);
  };


  /*const deleteData = (id: number | string, index: number) => {
    if (isReadOnly) return;

    const adjustedIndex = page * pageSize + index;
    const newData = realData.filter((_, idx) => adjustedIndex !== idx);
    onUpdateData(newData);
    onRemoveData(id as number);
  };*/

  const getPersonName = (value: string | number) => {
    return assigneeOptions.find((assignee, index) => assignee.value === value)?.label || ''
  };

  const handleChange = (value: string, index: number) => {
    const newData = realData.map((item: ResponsiblePersonObj, idx) => {
      return index === idx ? {...item, id: value } : item;
    })
    onUpdateData(newData);
  }

  return (
    <div>
      {pageData.length > 0 ? (
        pageData.map((item, index) => (
          <Card key={index} className="p-3 mb-3 shadow-none">
            <CardContent>
              <div className="font-medium text-lg mb-3">
                พนักงานรับผิดชอบเบิก/คืนวัสดุอุปกรณ์
              </div>

              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {
                    !item.isUpdate
                      ? getPersonName(item.id)
                      : <Selection value={item.id as string}
                                   options={assigneeOptions}
                                   placeholder="พนักงาน"
                                   onUpdate={(value: string) => handleChange(value, index)}
                      />
                  }
                </div>

                {showActionButtons && !isReadOnly && (
                <div className="ms-2">
                  {item.isUpdate ? (
                    <button
                      className="bg-[#C8F9E9] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        handleUpdateData(false, index)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        size={"sm"}
                        color="#31C48D"
                      />
                    </button>
                  ) : (
                    <button
                      className="bg-[#FDE5B6] rounded-[8px] w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        handleUpdateData(true, index)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faPencil}
                        size={"sm"}
                        color="#F9AC12"
                      />
                    </button>
                  )}

                  {/*<button
                    className="bg-[#FFD4D4] rounded-[8px] w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
                    onClick={() => deleteData(item.id || 0, index)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size={"sm"}
                      color="#E02424"
                    />
                  </button>*/}
                </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center text-gray p-4">ไม่มีผู้รับผิดชอบเบิก/คืนวัสดุอุปกรณ์</div>
      )}
    </div>
  );
};

export default ResponsiblePersonListContent;
