import React, { useState } from "react";
import { Customer, WorkerObj } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMapMarkerAlt,
  faChevronUp,
  faChevronDown,
  faDiamondTurnRight,
} from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/app/redux/hook";
import CardCollapse from "../CardCollapse";
import Map from "../work_execution/map";

interface CustomerAndWorkerInfoProps {
  customerInfo: Customer;
  workers: WorkerObj[];
  latitude: number;
  longitude: number;
}

const CustomerAndWorkerInfo: React.FC<CustomerAndWorkerInfoProps> = ({
  customerInfo,
  workers,
  latitude,
  longitude,
}) => {
  const screenSize = useAppSelector((state) => state.screen_size);

  // State สำหรับควบคุมการ expand/collapse ของแต่ละ worker
  const [expandedWorkers, setExpandedWorkers] = useState<{
    [key: number]: boolean;
  }>({
    0: true, // worker แรกให้ expand ไว้
  });

  const toggleWorkerDetails = (index: number) => {
    setExpandedWorkers((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Mock appointment data - ในระบบจริงจะได้จาก API
  const appointmentInfo = {
    date: "14 ธันวาคม 2566",
    time: "14:30 น.",
  };

  // Mobile Layout
  if (screenSize === "mobile") {
    return (
      <div className="space-y-4">
        {/* ข้อมูลลูกค้า */}
        <CardCollapse title={"ข้อมูลลูกค้า"}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ข้อมูลลูกค้า
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">ชื่อ-นามสกุล :</span>
              <span className="font-medium">{customerInfo.customer_name || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">โทรศัพท์มือถือ :</span>
              <div className="flex items-center space-x-1">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                <span className="font-medium">{customerInfo.customer_mobile_no || "-"}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">อีเมลติดต่อ :</span>
              <span className="font-medium">{customerInfo.customer_email || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">BP :</span>
              <span className="font-medium">{customerInfo.customer_bp || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">CA :</span>
              <span className="font-medium">{customerInfo.customer_ca || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">
                ที่อยู่ขอรับบริการ :
              </span>
              <span className="font-medium text-sm">
                {customerInfo.customer_address || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Latitude :</span>
              <span className="font-medium">
                {customerInfo.customer_latitude || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Longitude :</span>
              <span className="font-medium">
                {customerInfo.customer_longitude || "-"}
              </span>
            </div>
          </div>
        </CardCollapse>

        {/* รายชื่อผู้ปฏิบัติงาน */}
        <CardCollapse title={"รายชื่อผู้ปฏิบัติงาน"}>
          <div className="bg-purple-300 text-center py-3 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              รายชื่อผู้ปฏิบัติงาน
            </h3>
          </div>

          {workers.length > 0 ? (
            <div className="space-y-3">
              {workers.map((worker, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  {/* Header - รหัสและชื่อ พร้อม arrow */}
                  <div
                    className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleWorkerDetails(index)}
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">
                        {index + 1}. {worker.worker_id} -{" "}
                        {worker.worker || "ไม่ระบุชื่อ"}
                      </span>
                    </div>

                    <FontAwesomeIcon
                      icon={
                        expandedWorkers[index] ? faChevronUp : faChevronDown
                      }
                      className="text-gray-500"
                    />
                  </div>

                  {/* รายละเอียด - แสดงเมื่อ expand */}
                  {expandedWorkers[index] && (
                    <div className="p-3 bg-white space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          กลุ่มผู้ปฏิบัติงาน :
                        </span>
                        <span className="font-medium text-sm">
                          {worker.group || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">กิจกรรม :</span>
                        <span className="font-medium text-sm">
                          {worker.group_worker || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          ศูนย์งานหลัก :
                        </span>
                        <span className="font-medium text-sm">
                          {worker.event || "-"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          ชั่วโมง/งาน :
                        </span>
                        <span className="font-medium text-sm">
                          {worker.hours} {worker.unit || "H"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              ไม่มีข้อมูลผู้ปฏิบัติงาน
            </p>
          )}
          {/* นัดหมายติดตั้ง */}

          <div className="text-start py-3 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              นัดหมายติดตั้ง
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">วันที่นัดหมาย :</span>
              <span className="font-medium">{appointmentInfo.date}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">เวลาที่นัดหมาย :</span>
              <span className="font-medium">{appointmentInfo.time}</span>
            </div>
          </div>
        </CardCollapse>

        {/* แผนที่ / พิกัด */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-row justify-between text-start py-3 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                แผนที่ / พิกัด
              </h3>
              <button className="flex bg-[#BEE2FF] justify-center items-center p-2 rounded-md border-2">
                <FontAwesomeIcon
                  icon={faDiamondTurnRight}
                  className="text-[#03A9F4]"
                />
              </button>
            </div>

            <div className="bg-green-100 h-40 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="text-2xl text-red-500 mb-2"
                />
                <p className="text-sm text-gray-600">แผนที่พื้นที่ปฏิบัติงาน</p>
                <p className="text-xs text-gray-500">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Desktop Layout
  return (
    <CardCollapse
      title={"ข้อมูลผู้ขอคำร้อง / ตำแหน่ง /  ที่อยู่สำหรับสำรวจพื้นที่"}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ข้อมูลลูกค้า */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="bg-[#E1D2FF] text-center py-3 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                ข้อมูลลูกค้า
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  ชื่อ-นามสกุล :
                </label>
                <div className="flex items-center ">
                  <p className="text-gray-900">{customerInfo.customer_name || "-"}</p>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์ :
                </label>
                <div className="flex items-center ">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-400 " />
                  <p className="text-gray-900">{customerInfo.customer_mobile_no || "-"}</p>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  อีเมล :
                </label>
                <p className="mt-1 text-gray-900">
                  {customerInfo.customer_email || "-"}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  BP :
                </label>
                <p className="mt-1 text-gray-900">{customerInfo.customer_bp || "-"}</p>
              </div>
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  CA :
                </label>
                <p className="mt-1 text-gray-900">{customerInfo.customer_ca || "-"}</p>
              </div>

              <div></div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-row justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    ที่อยู่ขอรับบริการ :
                  </label>
                  <div className="flex items-start ">
                    <p className="text-gray-900 text-sm">
                      {customerInfo.customer_address || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Latitude :
                  </label>
                  <p className="mt-1 text-gray-900">{latitude.toFixed(6)}</p>
                </div>
                <div className="flex flex-row justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Longitude :
                  </label>
                  <p className="mt-1 text-gray-900">{longitude.toFixed(6)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* รายชื่อผู้ปฏิบัติงาน */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="bg-[#E1D2FF] text-center py-3 rounded-lg mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                รายชื่อผู้ปฏิบัติงาน
              </h3>
            </div>

            {workers.length > 0 ? (
              <div className="space-y-3">
                {workers.map((worker, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Header - รหัสและชื่อ พร้อม arrow */}
                    <div
                      className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleWorkerDetails(index)}
                    >
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">
                          {index + 1}. {worker.worker_id} -{" "}
                          {worker.worker || "ไม่ระบุชื่อ"}
                        </span>
                      </div>

                      <FontAwesomeIcon
                        icon={
                          expandedWorkers[index] ? faChevronUp : faChevronDown
                        }
                        className="text-gray-500"
                      />
                    </div>

                    {/* รายละเอียด - แสดงเมื่อ expand */}
                    {expandedWorkers[index] && (
                      <div className="p-3 bg-white space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            กลุ่มผู้ปฏิบัติงาน :
                          </span>
                          <span className="font-medium text-sm">
                            {worker.group || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            กิจกรรม :
                          </span>
                          <span className="font-medium text-sm">
                            {worker.group_worker || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            ศูนย์งานหลัก :
                          </span>
                          <span className="font-medium text-sm">
                            {worker.event || "-"}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            ชั่วโมง/งาน :
                          </span>
                          <span className="font-medium text-sm">
                            {worker.hours} {worker.unit || "H"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                ไม่มีข้อมูลผู้ปฏิบัติงาน
              </p>
            )}

            {/* นัดหมายติดตั้ง */}
            <div className="mt-6">
              <div className="text-start  rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  นัดหมายติดตั้ง
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">วันที่นัดหมาย :</span>
                  <span className="font-medium">{appointmentInfo.date}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">
                    เวลาที่นัดหมาย :
                  </span>
                  <span className="font-medium">{appointmentInfo.time}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* แผนที่ / พิกัด */}
        <Map
          latitude={latitude}
          longitude={longitude}
          options={{
            showEditable: false,
          }}
        />
      </div>
    </CardCollapse>
  );
};

export default CustomerAndWorkerInfo;
