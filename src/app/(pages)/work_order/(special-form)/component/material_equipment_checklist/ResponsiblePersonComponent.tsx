"use client";
import React, { useState } from "react";
import {
  getResponsiblePersonColumns,
  ResponsiblePersonObj,
} from "./ResponsiblePersonColumns";
import { DataTableEditor } from "@/app/components/editor-table/DataTableEditor";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@/app/redux/hook";
import { ListDataEditor } from "@/app/components/editor-table/ListDataEditor";
import ResponsiblePersonListContent from "./ResponsiblePersonListContent";
import CardCollapse from "../CardCollapse";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

const ResponsiblePersonComponent = () => {
  const screenSize = useAppSelector((state) => state.screen_size);
  const [responsiblePerson, setResponsiblePerson] = useState<
    ResponsiblePersonObj[]
  >([
    
  ]);

  const [updateIndex, setUpdateIndex] = useState(-1);

  const handleUpdateData = (data: ResponsiblePersonObj[]) => {
    setResponsiblePerson(data);
  };

  const onRemoveData = (id: number) => {
    console.log("Remove responsible person with id:", id);
  };

  const columns = getResponsiblePersonColumns();

  const itemResponsiblePerson: ResponsiblePersonObj = {
    id: Date.now(),
    responsiblePerson: "",
    isUpdate: true,
    isEdited: false,
  };

  return (
    <div>
      <CardCollapse title={"ผู้รับผิดชอบเบิก/คืนวัสดุอุปกรณ์"}>
        {screenSize === "desktop" ? (
          <DataTableEditor
            columns={columns}
            onUpdateData={handleUpdateData}
            realData={responsiblePerson}
            rowItem={itemResponsiblePerson}
            LabelAddRow={"เพิ่มผู้รับผิดชอบ"}
            onRemoveData={onRemoveData}
            visibleDelete={true}
          />
        ) : (
          <ListDataEditor
            onUpdateData={handleUpdateData}
            realData={responsiblePerson}
          >
            {(pageData: ResponsiblePersonObj[], page, pageSize) => (
              <div>
                <ResponsiblePersonListContent
                  pageData={pageData}
                  realData={responsiblePerson}
                  page={page}
                  pageSize={pageSize}
                  onUpdateData={handleUpdateData}
                  onRemoveData={onRemoveData}
                  setUpdateIndex={setUpdateIndex}
                />

                <Button
                  className="pea-button-outline my-2 w-full"
                  onClick={() => {
                    const newItem: ResponsiblePersonObj = {
                      id: Date.now(),
                      responsiblePerson: "",
                      isUpdate: true,
                      isEdited: false,
                    };
                    handleUpdateData([...responsiblePerson, newItem]);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  เพิ่มผู้รับผิดชอบ
                </Button>
              </div>
            )}
          </ListDataEditor>
        )}
      </CardCollapse>
    </div>
  );
};

export default ResponsiblePersonComponent;
