"use client";
import { WorkerObj, Options } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faPencil,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

interface WorkerListContentProps {
  realData: WorkerObj[];
  pageData: WorkerObj[];
  onUpdateData: (data: WorkerObj[]) => void;
  onRemoveData: (id: number) => void;
  setUpdateIndex: (index: number) => void;
  page: number;
  pageSize: number;
  groupWorkerOptions: Options[];
  workerOptions: Options[];
  eventOptions: Options[];
}

const WorkerListContent = ({
  realData,
  pageData,
  onUpdateData,
  onRemoveData,
  setUpdateIndex,
  page,
  pageSize,
  groupWorkerOptions,
  workerOptions,
  
}: WorkerListContentProps) => {
 

  const handleUpdateData = (
    key: string,
    value: string | number | boolean | undefined,
    index: number
  ) => {
    index = page * pageSize + index;
    const newData = realData.map((item: WorkerObj, idx) => {
      let isEdited = item.isEdited;
      if (key === "isUpdate" && value) {
        isEdited = true;
        setUpdateIndex(index);
        value = false;
      }

      if (key === "isActive") {
        isEdited = true;
      }

      return idx === index ? { ...item, [key]: value, isEdited } : item;
    });
    onUpdateData(newData);
  };

  const deleteData = (id: number, index: number) => {
    const adjustedIndex = (page * pageSize) + index;
    const newData = realData.filter((_, idx) => adjustedIndex !== idx);
    onUpdateData(newData);
    onRemoveData(id);
  };

  const getWorkerName = (workerId: string) => {
    const worker = workerOptions.find((w) => w.value === workerId);
    return worker ? worker.label : workerId;
  };


  const getGroupName = (groupId: string) => {
    const group = groupWorkerOptions.find((g) => g.value === groupId);
    return group ? group.label : groupId;
  };

  return (
    <div>
      {pageData.length > 0 ? (
        pageData.map((item, index) => (
          <Card key={index} className="p-3 mb-3 shadow-none bg-[#F9F6FF]">
            <CardContent>
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="font-medium text-lg mb-2">
                    {index + 1}. {item.worker_id || "48283375"} -{" "}
                    {getWorkerName(item.worker || "นายจิตนพื้นกต่าง องอาจ")}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>กลุ่มผู้ปฏิบัติงาน :</span>
                      <span className="font-medium">
                        {getGroupName(item.group || "พนักงาน PEA")}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>ศูนย์งานหลัก :</span>
                      <span className="font-medium">
                        {item.operation_center || "-"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>กิจกรรม :</span>
                      <span className="font-medium">
                        {item.event || "กิจกรรม A"}
                      </span>
                    </div>

                    <div className="flex flex-row text-black justify-between gap-4">
                      <div className="w-full flex flex-col bg-white p-2 rounded-md">
                        <div className="flex justify-between">
                          <span>ชั่วโมง/งาน :</span>
                          <span className="font-medium ">
                            {item.hours || "10"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>หน่วย :</span>
                          <span className="font-medium ">
                            {item.unit || "205"}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-center  items-center md:mt-0  mt-4 space-x-2">
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
                          className="bg-[#FFD4D4] rounded-[8px] p-2 flex items-center justify-center cursor-pointer"
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
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="text-center text-gray p-4">
          ไม่มีรายการผู้ปฏิบัติงาน
        </div>
      )}
    </div>
  );
};

export default WorkerListContent;
