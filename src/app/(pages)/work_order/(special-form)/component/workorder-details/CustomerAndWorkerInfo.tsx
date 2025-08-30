import React from "react";
import { Customer, WorkerObj } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faMapMarkerAlt,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/app/redux/hook";
import CardCollapse from "../CardCollapse";

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

  const handleViewWorkerDetails = (workerId: string) => {
    console.log("View worker details:", workerId);
  };

  // Mobile Layout
  if (screenSize === "mobile") {
    return (
      <CardCollapse
        title={"ข้อมูลผู้ขอคำร้อง / ตำแหน่ง /  ที่อยู่สำหรับสำรวจพื้นที่"}
      >
        <div className="space-y-4">
          {/* ข้อมูลลูกค้า */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                ข้อมูลลูกค้า
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-1">
                 
                  <div className="flex flex-row justify-between">
                    <p className="text-sm text-gray-600">ชื่อ-นามสกุล :</p>
                    <p className="font-medium">{customerInfo.name || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-1">
                  
                  <div className="flex flex-row justify-between">
                    <p className="text-sm text-gray-600">โทรศัพท์มือถือ :</p>
                    <div className="flex flex-row">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                    <p className="font-medium">{customerInfo.tel || "-"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-1">
                 
                  <div className="flex flex-row justify-between">
                    <p className="text-sm text-gray-600">อีเมลติดต่อ :</p>
                    <p className="font-medium">{customerInfo.email || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-1">
                 
                  <div className="flex flex-row justify-between">
                    <p className="text-sm text-gray-600">BP :</p>
                    <p className="font-medium">{customerInfo.bp || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-1">
                 
                  <div className="flex flex-row justify-between">
                    <p className="text-sm text-gray-600">CA :</p>
                    <p className="font-medium">{customerInfo.ca || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-1">
                 
                  <div className="flex flex-row justify-between">
                    <p className="text-sm text-gray-600">ที่อยู่ขอรับบริการ :</p>
                    <p className="font-medium text-sm">
                      {customerInfo.address || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-1">
                 
                  <div className="flex flex-row justify-between">
                    <p className="text-sm text-gray-600">Latitude :</p>
                    <p className="font-medium">{customerInfo.latitude || "-"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-1">
                 
                  <div className="flex flex-row justify-between">
                    <p className="text-sm text-gray-600">Longitude :</p>
                    <p className="font-medium">{customerInfo.longitude || "-"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* รายชื่อผู้ปฏิบัติงาน */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                รายชื่อผู้ปฏิบัติงาน
              </h3>
              {workers.length > 0 ? (
                <div className="space-y-3">
                  {workers.map((worker, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {worker.worker || "ไม่ระบุชื่อ"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {worker.group || "ไม่ระบุกลุ่ม"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleViewWorkerDetails(worker.worker_id || "")
                        }
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        ดูรายละเอียด
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  ไม่มีข้อมูลผู้ปฏิบัติงาน
                </p>
              )}
            </CardContent>
          </Card>

          {/* แผนที่ / พิกัด */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                แผนที่ / พิกัด
              </h3>
              <div className="space-y-3">
                
                <div className="bg-green-100 h-40 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="text-2xl text-red-500 mb-2"
                    />
                    <p className="text-sm text-gray-600">
                      แผนที่พื้นที่ปฏิบัติงาน
                    </p>
                    <p className="text-xs text-gray-500">
                      {latitude.toFixed(6)}, {longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardCollapse>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              ข้อมูลลูกค้า
            </h3>
            <div className="space-y-4">
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  ชื่อ-นามสกุล :
                </label>
                <div className="flex items-center ">
                  <p className="text-gray-900">{customerInfo.name || "-"}</p>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์ :
                </label>
                <div className="flex items-center ">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-gray-400 "
                  />
                  <p className="text-gray-900">{customerInfo.tel || "-"}</p>
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  อีเมล :
                </label>
                <p className="mt-1 text-gray-900">
                  {customerInfo.email || "-"}
                </p>
              </div>
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  BP :
                </label>
                <p className="mt-1 text-gray-900">{customerInfo.bp || "-"}</p>
              </div>
              <div className="flex flex-row justify-between">
                <label className="text-sm font-medium text-gray-700">
                  CA :
                </label>
                <p className="mt-1 text-gray-900">{customerInfo.ca || "-"}</p>
              </div>

              <div></div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-row justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    ที่อยู่ขอรับบริการ :
                  </label>
                  <div className="flex items-start ">
                    <p className="text-gray-900 text-sm">
                      {customerInfo.address || "-"}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              รายชื่อผู้ปฏิบัติงาน
            </h3>
            {workers.length > 0 ? (
              <div className="space-y-4">
                {workers.map((worker, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {worker.worker || "ไม่ระบุชื่อ"}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {worker.group || "ไม่ระบุกลุ่ม"}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleViewWorkerDetails(worker.worker_id || "")
                        }
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        ดูรายละเอียด
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">ศูนย์งาน:</span>
                        <span className="ml-1">
                          {worker.operation_center || "-"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">กิจกรรม:</span>
                        <span className="ml-1">{worker.event || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">ชั่วโมง/งาน:</span>
                        <span className="ml-1">{worker.hours || "-"}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">หน่วย:</span>
                        <span className="ml-1">{worker.unit || "-"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                ไม่มีข้อมูลผู้ปฏิบัติงาน
              </p>
            )}
          </CardContent>
        </Card>

        {/* แผนที่ / พิกัด */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              แผนที่ / พิกัด
            </h3>
            <div className="space-y-4">
              <div className="bg-green-100 h-48 rounded-lg flex items-center justify-center relative">
                <div className="text-center">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-3xl text-red-500 mb-3"
                  />
                  <p className="text-sm text-gray-600 mb-1">
                    แผนที่พื้นที่ปฏิบัติงาน
                  </p>
                  <p className="text-xs text-gray-500">
                    {latitude.toFixed(6)}, {longitude.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CardCollapse>
  );
};

export default CustomerAndWorkerInfo;
