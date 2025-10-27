"use client";
import {GoogleMap, LoadScript, Marker} from "@react-google-maps/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faDiamondTurnRight, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import MapLocationSelector from "@/app/(pages)/work_order/(special-form)/component/map/MapLocationSelector";

interface MapOptions {
  showEditable: boolean;
  disabled?: boolean;
}

interface MapProps {
  latitude: number;
  longitude: number;
  onLocationUpdate?: (lat: number, lng: number) => void;
  options?: Partial<MapOptions>;
  disabled?: boolean;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const Map: React.FC<MapProps> = ({
                                          latitude,
                                          longitude,
                                          onLocationUpdate,
                                          options,
                                          disabled,
                                        }) => {
  const {showEditable = true} = options ?? {};
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [center, setCenter] = useState({lat: 13.7563, lng: 100.5018});

  useEffect(() => {
    setCenter({lat: latitude ?? 13.7563, lng: longitude ?? 100.5018})
  }, [latitude, longitude]);

  const handleLocationCheck = () => {
    if (disabled) return;
    setShowLocationDialog(true);
  };
  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden w-full h-full">
        {/* Map Header */}
        <div className="flex flex-col p-4 border-b border-gray-200">
          <div className="flex flex-row justify-between items-center   mb-3">
            <span className="text-gray-700 font-medium">แผนที่ / พิกัด</span>
            <button className="flex bg-[#BEE2FF] justify-center items-center p-2 rounded-md ">
              <FontAwesomeIcon
                icon={faDiamondTurnRight}
                className="text-[#03A9F4]"
              />
            </button>
          </div>

          {showEditable && (
            <button
              onClick={handleLocationCheck}
              className="flex items-center text-center cursor-pointer justify-center gap-2 px-4 py-2 bg-[#671FAB] text-white rounded-full hover:bg-[#671FAB] text-[14px] font-semibold h-[44px]"
            >
              <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4"/>
              ตรวจสอบ/แก้ไขตำแหน่ง
            </button>
          )}
        </div>
      </div>

      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                  libraries={["places"]}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={18}>
          <Marker position={center}/>
        </GoogleMap>
      </LoadScript>

      {
        showLocationDialog && (
          <MapLocationSelector open={showLocationDialog}
                               onClose={() => setShowLocationDialog(false)}
                               onLocationUpdate={onLocationUpdate}
                               latitude={latitude}
                               longitude={longitude}
          />
        )
      }
    </div>
  );
}

export default Map;
