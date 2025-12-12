import React, {useState} from "react";
import CardCollapse from "../CardCollapse";
import OutputButton from "@/app/components/form/OutputButton";
import InputDateButton from "@/app/components/form/InputDateButton";
import Map from "@/app/(pages)/work_order/(special-form)/component/map/Map";
import {Assignee, ParsedAddress, WorkOrderObj} from "@/types";
import InputDateTimePicker from "@/app/components/form/InputDateTimePicker";
import {syncExecutionToWorkers} from "@/app/(pages)/work_order/(special-form)/component/WorkDateSyncHelper";

interface WorkExecutionOptions {
  isReadOnly?: boolean;
}

interface WorkExecutionProps {
  options?: WorkExecutionOptions;
  data: WorkOrderObj;
  setData: (data: WorkOrderObj) => void;
}

const WorkExecution = ({options = {}, data, setData}: WorkExecutionProps) => {
  const {isReadOnly = false} = options;

  const [latitude, setLatitude] = useState<number>(data?.latitude || data?.customerLatitude || 18.74499)
  const [longitude, setLongitude] = useState<number>(data?.longitude || data?.customerLongitude || 99.126769)
  const startDate = data?.startWorkDate || undefined;
  const endDate = data?.endWorkDate || undefined;

  const handleAddressUpdate = (lat:number, lng: number, address: ParsedAddress) => {
    setLatitude(lat)
    setLongitude(lng)
    setTimeout(() => {
      setData({
        ...data,
        customerAddress: address.formattedAddress,
        latitude: lat,
        longitude: lng,
        customerLatitude: lat,
        customerLongitude: lng
      });
    }, 1200)
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (!isReadOnly) {
      const workers = data.assignees as Assignee[] || [];
      if(workers.length === 0) {
        setData({...data, startWorkDate: date});
      }else {
        syncExecutionToWorkers(date, workers, data, setData, 'start');
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!isReadOnly) {
      const workers = data.assignees as Assignee[] || [];
      if(workers.length === 0) {
        setData({...data, endWorkDate: date});
      }else {
        syncExecutionToWorkers(date, workers, data, setData, 'end');
      }
    }
  };

  return (
    <div>
      <CardCollapse title={"ผลการปฏิบัติงาน"}>
        <div className="p-4 flex flex-wrap">
          <div className="w-full md:w-1/2 mb-3 md:mb-0 px-0 md:px-3">
            <div className="flex flex-wrap mb-0 md:mb-3">
              <div className="w-full md:w-1/2 px-0 md:px-3 mb-3 md:mb-0">
                <OutputButton label="Latitude" value={latitude.toString()}/>
              </div>
              <div className="w-full md:w-1/2 px-0 md:px-3 mb-3 md:mb-0">
                <OutputButton label="Longitude" value={longitude.toString()}/>
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 px-0 md:px-3 mb-3 md:mb-0">
                <InputDateTimePicker value={startDate as Date}
                                     onChange={handleStartDateChange}
                                     label="วันที่และเวลาเริ่มปฏิบัติงาน"
                                     placeholder="เลือกวันที่"
                                     disabled={isReadOnly}
                />
              </div>
              <div className="w-full md:w-1/2 px-0 md:px-3 mb-3 md:mb-0">
                <InputDateTimePicker value={endDate as Date}
                                     onChange={handleEndDateChange}
                                     label="วันที่และเวลาปฏิบัติงานเสร็จ"
                                     placeholder="เลือกวันที่"
                                     disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <Map latitude={latitude}
                 longitude={longitude}
                 onUpdateAddress={handleAddressUpdate}
            />
          </div>
        </div>
      </CardCollapse>
    </div>
  );
};

export default WorkExecution;
