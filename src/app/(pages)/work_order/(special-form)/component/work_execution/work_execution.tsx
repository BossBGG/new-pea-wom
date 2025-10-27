import React, {useState} from "react";
import CardCollapse from "../CardCollapse";
import OutputButton from "@/app/components/form/OutputButton";
import InputDateButton from "@/app/components/form/InputDateButton";
import Map from "@/app/(pages)/work_order/(special-form)/component/map/Map";
import {WorkOrderObj} from "@/types";

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

  const latitude = data?.latitude || 18.74499;
  const longitude = data?.longitude || 99.126769;
  const startDate = data?.startWorkDate || undefined;
  const endDate = data?.endWorkDate || undefined;

  const handleLocationUpdate = (newLat: number, newLng: number) => {
    if (!isReadOnly) {
      setData({...data, latitude: newLat, longitude: newLng});
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!isReadOnly) {
      setData({...data, startWorkDate: date});
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!isReadOnly) {
      setData({...data, endWorkDate: date});
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
                <InputDateButton
                  label="วันที่และเวลาเริ่มปฏิบัติงาน"
                  value={startDate as Date}
                  onChange={handleStartDateChange}
                  placeholder="เลือกวันที่"
                  className="w-full"
                  disabled={isReadOnly}
                />
              </div>
              <div className="w-full md:w-1/2 px-0 md:px-3 mb-3 md:mb-0">
                <InputDateButton
                  label="วันที่และเวลาปฏิบัติงานเสร็จ"
                  value={endDate as Date}
                  onChange={handleEndDateChange}
                  placeholder="เลือกวันที่"
                  className="w-full"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <Map latitude={latitude}
                 longitude={longitude}
                 onLocationUpdate={handleLocationUpdate}
            />
          </div>
        </div>
      </CardCollapse>
    </div>
  );
};

export default WorkExecution;
