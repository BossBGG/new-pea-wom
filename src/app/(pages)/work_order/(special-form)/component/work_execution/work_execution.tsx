import React, {useState} from "react";
import CardCollapse from "../CardCollapse";
import OutputButton from "@/app/components/form/OutputButton";
import InputDateButton from "@/app/components/form/InputDateButton";
import Map from "./map";

interface WorkExecutionOptions {
  isReadOnly?: boolean;
}

interface WorkExecutionProps {
  options?: WorkExecutionOptions;
}

const WorkExecution = ({options = {}}: WorkExecutionProps) => {
  const {isReadOnly = false} = options;

  const [latitude, setLatitude] = useState(18.74499);
  const [longitude, setLongitude] = useState(99.126769);

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
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="เลือกวันที่"
                  className="w-full"
                  disabled={isReadOnly}
                />
              </div>
              <div className="w-full md:w-1/2 px-0 md:px-3 mb-3 md:mb-0">
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
          </div>

          <div className="w-full md:w-1/2">
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
      </CardCollapse>
    </div>
  );
};

export default WorkExecution;
