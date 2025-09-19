"use client";
import React, {useEffect, useState} from "react";
import {
  getResponsiblePersonColumns
} from "./ResponsiblePersonColumns";
import { DataTableEditor } from "@/app/components/editor-table/DataTableEditor";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "@/app/redux/hook";
import { ListDataEditor } from "@/app/components/editor-table/ListDataEditor";
import ResponsiblePersonListContent from "./ResponsiblePersonListContent";
import CardCollapse from "../CardCollapse";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {Assignee, Options, ResponsiblePersonObj} from "@/types";

interface ResponsiblePersonOptions {
  isReadOnly? : boolean;
  showAddButton?: boolean;
  showDeleteAllButton?: boolean;
  showActionColumn?: boolean;
}

interface ResponsiblePersonComponentProps {
  options?: ResponsiblePersonOptions;
  assignees: Assignee[];
  onUpdateData: (d: ResponsiblePersonObj[]) => void;
  data: ResponsiblePersonObj[]
}

const ResponsiblePersonComponent = ({
                                      options = {},
                                      assignees,
                                      onUpdateData,
                                      data
} : ResponsiblePersonComponentProps) => {
  const { isReadOnly = false, showAddButton = true, showDeleteAllButton = true, showActionColumn = true} = options;
  const [assigneeOptions, setAssigneeOptions] = useState<Options[]>([]);
  const [responsiblePerson, setResponsiblePerson] = useState<ResponsiblePersonObj[]>(data);

  useEffect(() => {
    setResponsiblePerson(data);
  }, [data]);

  useEffect(() => {
    let opts: Options[] = []
    assignees.map((assignee) => {
      opts.push({label: assignee.username, value: assignee.username})
    })
    setAssigneeOptions(opts);
  }, [assignees]);

  const screenSize = useAppSelector((state) => state.screen_size);

  const handleUpdateData = (data: ResponsiblePersonObj[]) => {
    if (!isReadOnly) {
      console.log('handleUpdateData data >>>> ', data)
      onUpdateData(data);
    }
  };

  const onRemoveData = (id: number) => {
    if (!isReadOnly) {
      console.log("Remove responsible person with id:", id);
    }
  };


  const getFilteredColumns = () => {
    const columns = getResponsiblePersonColumns(
      assigneeOptions,
      );
    if (!showActionColumn || isReadOnly) {
      return columns.filter(columns => columns.id !== 'action');
    }
    return columns;
  }

  const itemResponsiblePerson: ResponsiblePersonObj = {
    isUpdate: true,
    isEdited: false,
  } as ResponsiblePersonObj;

  return (
    <div>
      <CardCollapse title={"ผู้รับผิดชอบเบิก/คืนวัสดุอุปกรณ์"}>
        {screenSize === "desktop" ? (
          <DataTableEditor
            columns={getFilteredColumns()}
            onUpdateData={handleUpdateData}
            realData={responsiblePerson}
            // rowItem={itemResponsiblePerson}
            // LabelAddRow={showAddButton && !isReadOnly ? "เพิ่มผู้รับผิดชอบ" : undefined}
            onRemoveData={onRemoveData}
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
                  showActionButtons={showActionColumn && !isReadOnly}
                  isReadOnly={isReadOnly}
                  assigneeOptions={assigneeOptions}
                />

                {/*{showAddButton && !isReadOnly && (
                <Button
                  className="pea-button-outline my-2 w-full"
                  onClick={() => {
                    const newItem: ResponsiblePersonObj = {
                      isUpdate: true,
                      isEdited: false,
                    } as ResponsiblePersonObj;
                    handleUpdateData([...responsiblePerson, newItem]);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-2" />
                  เพิ่มผู้รับผิดชอบ
                </Button>
                )}*/}
              </div>
            )}
          </ListDataEditor>
        )}
      </CardCollapse>
    </div>
  );
};

export default ResponsiblePersonComponent;
