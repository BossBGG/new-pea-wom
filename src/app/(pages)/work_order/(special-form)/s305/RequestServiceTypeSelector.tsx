import React, {useEffect, useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Label} from "@/components/ui/label";

import {useAppSelector} from "@/app/redux/hook";
import {Options, WorkOrderObj} from "@/types";
import {Selection} from "@/app/components/form/Selection";
import {Card} from "@/components/ui/card";
import {handleSearchRequestService} from "@/app/helpers/SearchRequestService";
import {handleSearchServiceType} from "@/app/helpers/SearchServiceType";

interface RequestServiceTypeSelectorProps {
  data: WorkOrderObj,
  updateData: (d: WorkOrderObj) => void;
  requestServiceOptions: Options[],
  onUpdateRequestServiceOptions: (opts: Options[]) => void;
  serviceTypesOptions: Options[],
  onUpdateServiceTypesOptions: (opts: Options[]) => void;
  reqCode: string
}

const RequestServiceTypeSelector: React.FC<RequestServiceTypeSelectorProps> = ({
                                                                                 data,
                                                                                 updateData,
                                                                                 requestServiceOptions,
                                                                                 onUpdateRequestServiceOptions,
                                                                                 serviceTypesOptions,
                                                                                 onUpdateServiceTypesOptions,
                                                                                 reqCode
                                                                               }) => {
  const [selectedRequestType, setSelectedRequestType] = useState<string>();
  const [selectedServiceType, setSelectedServiceType] = useState<string>();

  useEffect(() => {
    if (typeof data.requestServiceDetail === 'object') {
      setSelectedRequestType(data.requestServiceDetail?.request_type || "")
      setSelectedServiceType(data.requestServiceDetail?.service_type || "")
    }
  }, [data.requestServiceDetail]);

  const handleRequestTypeChange = (value: string) => {
    setSelectedRequestType(value);
    handleUpdateData('request_type', value);
  };

  const handleServiceTypeChange = (value: string) => {
    setSelectedServiceType(value);
    handleUpdateData('service_type', value);
  };

  const handleUpdateData = (key: string, value: string) => {
    let newData = data;
    if (typeof newData.requestServiceDetail === 'object') {
      newData = {
        ...newData,
        requestServiceDetail: {
          ...newData.requestServiceDetail,
          [key]: value
        },
      }
      updateData(newData);
    }
  }

  return (
    <Card className="px-2 py-4">
      <div className="flex flex-wrap">
        {/* ประเภทคำร้อง */}
        <div className="w-full md:w-1/2 mb-3 md:mb-0 px-2">
          <Label htmlFor="request-type" className="text-[16px] mb-3">
            ประเภทคำร้อง
          </Label>
          <Selection value={selectedRequestType as string}
                     options={requestServiceOptions}
                     placeholder={"ประเภทคำร้อง"}
                     onUpdate={handleRequestTypeChange}
                     onSearch={(s: string) => handleSearchRequestService(s, reqCode)}
                     onUpdateOptions={onUpdateRequestServiceOptions}
          />
        </div>

        {/* ประเภทการให้บริการ */}
        <div className="w-full md:w-1/2 px-2">
          <Label htmlFor="service-type" className="text-[16px] mb-3">
            ประเภทการให้บริการ
          </Label>
          <Selection value={selectedServiceType as string}
                     options={serviceTypesOptions}
                     placeholder={"ประเภทการให้บริการ"}
                     onUpdate={handleServiceTypeChange}
                     onSearch={(s: string) => handleSearchServiceType(s, reqCode)}
                     onUpdateOptions={onUpdateServiceTypesOptions}
          />
        </div>
      </div>


    </Card>

  );
};

export default RequestServiceTypeSelector;
