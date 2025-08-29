"use client";
import { ResponsiblePersonObj } from "./ResponsiblePersonColumns"
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Options } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const responsiblePersonOptions: Options[] = [
  {label: '4828375 - นายจำนงค์ องอาจ', value: 'emp_001'},
  {label: '4828379 - นายมานะ ในมนตรี', value: 'emp_002'},
  {label: '6728379 - นาจอนห์ มานะ', value: 'emp_003'},
];

interface ResponsiblePersonListContentProps {
  realData: ResponsiblePersonObj[];
  pageData: ResponsiblePersonObj[];
  onUpdateData: (data: ResponsiblePersonObj[]) => void;
  onRemoveData: (id: number) => void;
  setUpdateIndex: (index: number) => void;
  page: number;
  pageSize: number;
}

const ResponsiblePersonListContent = ({
  realData,
  pageData,
  onUpdateData,
  onRemoveData,
  setUpdateIndex,
  page,
  pageSize,
}: ResponsiblePersonListContentProps) => {
  const handleUpdateData = (
    key: string,
    value: string | number | boolean | undefined,
    index: number
  ) => {
    const adjustedIndex = page * pageSize + index;
    const newData = realData.map((item: ResponsiblePersonObj, idx) => {
      let isEdited = item.isEdited;
      if (key === "isUpdate" && value) {
        isEdited = true;
        setUpdateIndex(adjustedIndex);
        value = false;
      }

      if (key === "isActive") {
        isEdited = true;
      }

      return idx === adjustedIndex ? { ...item, [key]: value, isEdited } : item;
    });
    onUpdateData(newData);
  };


  const deleteData = (id: number, index: number) => {
    const adjustedIndex = page * pageSize + index;
    const newData = realData.filter((_, idx) => adjustedIndex !== idx);
    onUpdateData(newData);
    onRemoveData(id);
  };

  const getPersonName = (value: string) => {
    const person = responsiblePersonOptions.find((p) => p.value === value);
    return person ? person.label : value;
  };

  return (
    <div>
      {pageData.length > 0 ? (
        pageData.map((item, index) => (
          <Card key={index} className="p-3 mb-3 shadow-none">
            <CardContent>
              <div className="flex flex-col justify-between">
                <div className="flex-1">
                  <div className="font-medium text-lg mb-2">
                    {index + 1}. พนักงานรับผิดชอบเบิก/คืนวัสดุอุปกรณ์
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    {getPersonName(item.responsiblePerson || '')}
                  </div>
                </div>

                <div className="flex justify-end items-center space-x-2 mt-3">
                  {item.isUpdate ? (
                    <button
                      className="bg-[#C8F9E9] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
                      onClick={() =>
                        handleUpdateData("isUpdate", false, index)
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
                        handleUpdateData("isUpdate", true, index)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faPencil}
                        size={"sm"}
                        color="#F9AC12"
                      />
                    </button>
                  )}

                  <button
                    className="bg-[#FFD4D4] rounded-[8px] w-[32px] h-[32px] flex items-center justify-center cursor-pointer"
                    onClick={() => deleteData(item.id || 0, index)}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size={"sm"}
                      color="#E02424"
                    />
                  </button>
                </div>
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
