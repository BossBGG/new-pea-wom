import React from "react";
import WorkExecution from "@/app/(pages)/work_order/(special-form)/component/work_execution/work_execution";
import AddImages from "@/app/(pages)/work_order/(special-form)/component/work_execution/add_images";
import AddFile from "@/app/(pages)/work_order/(special-form)/component/work_execution/add_file";
import Comment from "@/app/(pages)/work_order/(special-form)/component/work_execution/comment";

interface ExecuteWorkOrderProps {
  requestCode: string
}

export const ExecuteWorkOrder: React.FC<ExecuteWorkOrderProps> = ({
                                                                    requestCode
                                                                  }) => {
  return (
    <div>
      <WorkExecution />

      <AddImages />

      <AddFile />

      <Comment />
    </div>
  )
}
