import React, { useState } from "react";
import CardCollapse from "../CardCollapse";
import OutputButton from "@/app/components/form/OutputButton";
import InputDateButton from "@/app/components/form/InputDateButton";
import Map from "./map";
import { useAppSelector } from "@/app/redux/hook";

const WorkExecution = () => {
  const [latitude, setLatitude] = useState(18.74499);
  const [longitude, setLongitude] = useState(99.126769);
  const screenSize = useAppSelector(state => state.screen_size);
  
  // States for date inputs
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleLocationUpdate = (newLat: number, newLng: number) => {
    setLatitude(newLat);
    setLongitude(newLng);
  };

  return (
    <div>
      <CardCollapse title={"ผลการปฏิบัติงาน"}>
        <div className="p-4">
          <div className={`${screenSize === 'mobile' ? 'flex flex-col space-y-6' : 'grid grid-cols-1 md:grid-cols-2 gap-6'}`}>
            
            {/* Left Section - Coordinates and Date Inputs */}
            <div className="space-y-4">
              {/* Coordinates Row */}
              <div className={`${screenSize === 'mobile' ? 'flex flex-col space-y-4' : 'grid grid-cols-2 gap-4'}`}>
                <OutputButton 
                  label="Latitude" 
                  value={latitude.toString()} 
                />
                <OutputButton 
                  label="Longitude" 
                  value={longitude.toString()} 
                />
              </div>

              {/* Date Inputs */}
              <div className={`${screenSize === 'mobile' ? 'flex flex-col space-y-4' : 'flex flex-row gap-4'}`}>
                <InputDateButton
                  label="วันที่และเวลาเริ่มปฏิบัติงาน"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="เลือกวันที่"
                  className="w-full"
                />
                
                <InputDateButton
                  label="วันที่และเวลาปฏิบัติงานเสร็จ"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="เลือกวันที่"
                  className="w-full"
                />
              </div>
            </div>

            {/* Right Section - Map */}
            <div>
              <Map 
                latitude={latitude}
                longitude={longitude}
                onLocationUpdate={handleLocationUpdate}
              />
            </div>
            
          </div>
          
          {/* Summary Section */}
          {(startDate || endDate) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">สรุปข้อมูลการปฏิบัติงาน</h4>
              <div className={`${screenSize === 'mobile' ? 'flex flex-col space-y-2' : 'grid grid-cols-1 md:grid-cols-2 gap-4'} text-sm`}>
                <div>
                  <span className="text-gray-600">เริ่มงาน:</span>
                  <span className="ml-2 font-medium">
                    {startDate ? startDate.toLocaleDateString('th-TH') : 'ยังไม่ระบุ'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">เสร็จงาน:</span>
                  <span className="ml-2 font-medium">
                    {endDate ? endDate.toLocaleDateString('th-TH') : 'ยังไม่ระบุ'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">พิกัด:</span>
                  <span className="ml-2 font-medium">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </CardCollapse>
    </div>
  );
};

export default WorkExecution;