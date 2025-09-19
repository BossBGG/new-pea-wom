import React, { useState } from "react";
import CardCollapse from "../CardCollapse";
import OutputButton from "@/app/components/form/OutputButton";
import InputDateButton from "@/app/components/form/InputDateButton";
import Map from "./map";
import { useAppSelector } from "@/app/redux/hook";

interface WorkExecutionOptions {
  isReadOnly?: boolean;
}

interface WorkExecutionProps {
  options?: WorkExecutionOptions;
}

const WorkExecution = ({ options = {} }: WorkExecutionProps) => {
  const { isReadOnly = false } = options;

  const [latitude, setLatitude] = useState(18.74499);
  const [longitude, setLongitude] = useState(99.126769);
  const screenSize = useAppSelector((state) => state.screen_size);

  // States for date inputs
  const [startDate, setStartDate] = useState<Date | undefined>(
    isReadOnly ? new Date("2024-12-14T08:30:00") : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    isReadOnly ? new Date("2024-12-14T16:30:00") : undefined
  );

  const handleLocationUpdate = (newLat: number, newLng: number) => {
    if (!isReadOnly) {
      setLatitude(newLat);
      setLongitude(newLng);
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    if (!isReadOnly) {
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (!isReadOnly) {
      setEndDate(date);
    }
  };

  return (
    <div>
      <CardCollapse title={"ผลการปฏิบัติงาน"}>
        <div className="p-4">
          <div
            className={`${
              screenSize === "mobile"
                ? "flex flex-col space-y-6"
                : "grid grid-cols-1 md:grid-cols-2 gap-6"
            }`}
          >
            {/* Left Section - Coordinates and Date Inputs */}
            <div className="space-y-4">
              {/* Coordinates Row */}
              <div
                className={`${
                  screenSize === "mobile"
                    ? "flex flex-col space-y-4"
                    : "grid grid-cols-2 gap-4"
                }`}
              >
                <OutputButton label="Latitude" value={latitude.toString()} />
                <OutputButton label="Longitude" value={longitude.toString()} />
              </div>

              {/* Date Inputs */}
              <div
                className={`${
                  screenSize === "mobile"
                    ? "flex flex-col space-y-4"
                    : "flex flex-row gap-4"
                }`}
              >
                <InputDateButton
                  label="วันที่และเวลาเริ่มปฏิบัติงาน"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="เลือกวันที่"
                  className="w-full"
                  disabled={isReadOnly}
                />

                <InputDateButton
                  label="วันที่และเวลาปฏิบัติงานเสร็จ"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="เลือกวันที่"
                  className="w-full"
                  disabled={isReadOnly}
                />
              </div>
            </div>

            {/* Right Section - Map */}
            <div>
              <Map
                latitude={latitude}
                longitude={longitude}
                onLocationUpdate={handleLocationUpdate}
                options={{
                  showEditable: true,
                }}
              />
            </div>
          </div>
        </div>
      </CardCollapse>
    </div>
  );
};

export default WorkExecution;
