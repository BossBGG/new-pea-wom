import Modal from "@/app/layout/Modal";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLocationDot} from "@fortawesome/free-solid-svg-icons";
import {Autocomplete, GoogleMap, Marker, useJsApiLoader} from "@react-google-maps/api";
import React, {useEffect, useRef, useState} from "react";

type MapLocationSelector = {
  latitude: number,
  longitude: number,
  open: boolean,
  onClose: () => void,
  onLocationUpdate?: (lat: number, lng: number) => void
}

const libraries: ("places")[] = ["places"];
const MapLocationSelector: React.FC<MapLocationSelector> = ({
                                                              latitude,
                                                              longitude,
                                                              open,
                                                              onClose,
                                                              onLocationUpdate
                                                            }) => {
  const {isLoaded} = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries
  });
  const [center, setCenter] = useState({lat: latitude, lng: longitude});
  const [markerPos, setMarkerPos] = useState(center);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const placesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        const pacContainer = document.querySelector('.pac-container');
        if (pacContainer && placesContainerRef.current) {
          placesContainerRef.current.appendChild(pacContainer);
        }
      }, 200);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  const handlePlaceChanged = () => {
    console.log('autocompleteRef>>> ', autocompleteRef)
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      console.log('place', place);
      if (place.geometry?.location) {
        const newPos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setCenter(newPos);
        setMarkerPos(newPos);

        onLocationUpdate?.(newPos.lat, newPos.lng)

        // Keep the dropdown open by triggering a new search
        setTimeout(() => {
          const input = document.querySelector('input[placeholder="ค้นหาสถานที่..."]') as HTMLInputElement;
          if (input) {
            const event = new Event('input', { bubbles: true });
            input.dispatchEvent(event);
          }
        }, 100);
      }
    }
  };

  return (
    <Modal title={"ตรวจสอบ/แก้ไขตำแหน่ง"}
           classContent="w-[80%] xl:w-[65%] 2xl:w-[45%] !max-w-[80%]"
           open={open} onClose={onClose}
           footer={<div className="w-full flex justify-center items-center">
             <Button className="pea-button h-[44px]" onClick={() => {
             }}>
               <FontAwesomeIcon icon={faLocationDot}/>
               เลือกตำแหน่ง
             </Button>
           </div>}
    >
      <div className="w-full flex flex-col gap-2">
        {/* Search Box */}
        {isLoaded && (
          <div className="relative">
            <Autocomplete
              onLoad={(ref) => (autocompleteRef.current = ref)}
              onPlaceChanged={handlePlaceChanged}
              options={{
                componentRestrictions: { country: "th" },
                fields: ["place_id", "geometry", "name", "formatted_address"],
                types: ["establishment", "geocode"]
              }}
            >
              <input
                type="text"
                placeholder="ค้นหาสถานที่..."
                className="w-full border rounded-md p-2 text-sm focus:outline-none"
                autoComplete="off"
                onFocus={(e) => {
                  // Trigger search when focused to show suggestions
                  setTimeout(() => {
                    const event = new Event('input', { bubbles: true });
                    e.target.dispatchEvent(event);
                  }, 100);
                }}
              />
            </Autocomplete>

            <div ref={placesContainerRef} />
          </div>
        )}

        {/* Map */}
        <div className="w-full h-[400px]">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={center}
              zoom={15}
              onClick={(e) => {
                if (e.latLng) {
                  const pos = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng(),
                  };
                  setMarkerPos(pos);
                }
              }}
            >
              <Marker
                position={markerPos}
                draggable
                onDragEnd={(e) => {
                  if (e.latLng) {
                    setMarkerPos({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    });
                  }
                }}
              />
            </GoogleMap>
          ) : (
            <p>Loading map...</p>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default MapLocationSelector;
