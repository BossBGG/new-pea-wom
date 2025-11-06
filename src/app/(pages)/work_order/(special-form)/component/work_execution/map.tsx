import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiamondTurnRight,
  faLocationDot,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: unknown) => unknown;
        Marker: new (options: unknown) => unknown;
      };
    };
    initMap: () => void;
  }
}

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

const Map: React.FC<MapProps> = ({ latitude, longitude, onLocationUpdate, options, disabled = false }) => {
   const { showEditable = false } = options ?? {};
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const initializeMap = useCallback(() => {
    if (mapRef.current) {
      // ใช้ OpenStreetMap แทน Google Maps สำหรับ demo
      // หรือสามารถใช้ Google Maps ได้ถ้ามี API Key
      createSimpleMap();
    }
  }, []);

  const createSimpleMap = useCallback(() => {
    if (mapRef.current) {
      // สร้าง simple map display
      mapRef.current.innerHTML = `
        <div style="width: 100%; height: 100%; background: #e8f5e8; position: relative; border-radius: 8px; overflow: hidden;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #dc2626; font-size: 24px;">
            📍
          </div>
          <div style="position: absolute; bottom: 10px; left: 10px; background: rgba(255,255,255,0.9); padding: 8px; border-radius: 4px; font-size: 12px;">
            ${latitude.toFixed(6)}, ${longitude.toFixed(6)}
          </div>
          <div style="position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); padding: 4px 8px; border-radius: 4px; font-size: 10px;">
            แผนที่
          </div>
        </div>
      `;
    }
  }, [latitude, longitude]);

  useEffect(() => {
    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=geometry`;
      script.async = true;
      script.defer = true;

      window.initMap = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      if (typeof window.initMap !== "undefined") {
        delete (window as { initMap?: () => void }).initMap;
      }
    };
  }, [initializeMap]);

  const handleLocationCheck = () => {
    if (disabled) return;

    setShowLocationDialog(true);


  };

  const handleSelectLocation = () => {
     // จำลองการอัพเดทตำแหน่ง
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          onLocationUpdate?.(newLat, newLng);
          setShowLocationDialog(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          // ใช้ตำแหน่งปัจจุบันแทน
          onLocationUpdate?.(latitude, longitude);
          setShowLocationDialog(false);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      onLocationUpdate?.(latitude, longitude);
      setShowLocationDialog(false);
    }
  }

  const handleCloseDialog = () => {
    setShowLocationDialog(false);
  }

  return (
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
          className="flex items-center text-center justify-center gap-2 px-4 py-2 bg-[#671FAB] text-white rounded-xl hover:bg-[#5A1A96] transition-colors text-sm font-medium"
        >
          <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" />
          ตรวจสอบ/แก้ไขตำแหน่ง
        </button>
        )}
      </div>

      {/* Map Content */}
      <div className=" relative p-4 ">
        <div
          ref={mapRef}
          className="w-full h-64 "
          style={{ minHeight: "256px"  }}
        >
          {/* Fallback content while map loads */}
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#671FAB] mx-auto mb-2"></div>
              <p className="text-gray-600">กำลังโหลดแผนที่...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Dialog */}
      {showLocationDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-[#F4EEFF]">
              <div className="flex items-center space-x-2">

                <span className="ml-4 text-md font-bold text-gray-600">ตรวจสอบ/แก้ไขตำแหน่ง</span>
              </div>
              <button
                onClick={handleCloseDialog}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* Map Content */}
            <div className="relative bg-white p-4" style={{ height: '400px' }}>
              {/* Mock Google Map */}
              <div className="bg-white border-2 border-[#E1D2FF] rounded-xl w-full h-full p-4">
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 relative">

              </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex justify-center">
                <button
                  onClick={handleSelectLocation}
                  className="bg-[#671FAB] text-white px-6 py-2 rounded-full hover:bg-[#5A1A96] transition-colors font-medium"
                >
                 <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4" /> เลือกตำแหน่ง
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
