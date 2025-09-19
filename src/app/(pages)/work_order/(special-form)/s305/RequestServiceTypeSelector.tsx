import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { useAppSelector } from "@/app/redux/hook";

interface RequestServiceTypeSelectorProps {
  onRequestTypeChange?: (value: string) => void;
  onServiceTypeChange?: (value: string) => void;
  requestType?: string;
  serviceType?: string;
}

const RequestServiceTypeSelector: React.FC<RequestServiceTypeSelectorProps> = ({
  onRequestTypeChange,
  onServiceTypeChange,
  requestType = '',
  serviceType = ''
}) => {
  const [selectedRequestType, setSelectedRequestType] = useState(requestType);
  const [selectedServiceType, setSelectedServiceType] = useState(serviceType);
  const screenSize = useAppSelector(state => state.screen_size);

  // Mock data - ในความเป็นจริงควรมาจาก API
  const requestTypeOptions = [
    { value: 'normal', label: 'ตรวจสอบ' },
    { value: 'urgent', label: 'ซ่อมแซม' }
  ];

  const serviceTypeOptions = [
    { value: 'fast_track', label: 'Fast Track' },
    { value: 'standard', label: 'Standard' }
  ];

  const handleRequestTypeChange = (value: string) => {
    setSelectedRequestType(value);
    onRequestTypeChange?.(value);
  };

  const handleServiceTypeChange = (value: string) => {
    setSelectedServiceType(value);
    onServiceTypeChange?.(value);
  };

  // Mobile/Tablet Layout
  if (screenSize === 'mobile' || screenSize === 'tablet') {
    return (
    
        <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
          <div className="space-y-6">
            {/* ประเภทคำร้อง */}
            <div className="space-y-2">
              <Label htmlFor="request-type-mobile" className="text-sm font-medium text-gray-700">
                ประเภทคำร้อง
              </Label>
              <Select value={selectedRequestType} onValueChange={handleRequestTypeChange}>
                <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                  <SelectValue placeholder="ตรวจสอบ" />
                </SelectTrigger>
                <SelectContent>
                  {requestTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ประเภทการให้บริการ */}
            <div className="space-y-2">
              <Label htmlFor="service-type-mobile" className="text-sm font-medium text-gray-700">
                ประเภทการให้บริการ
              </Label>
              <Select value={selectedServiceType} onValueChange={handleServiceTypeChange}>
                <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                  <SelectValue placeholder="Fast Track" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Summary for mobile */}
          {(selectedRequestType || selectedServiceType) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">สรุปการเลือก</h4>
              <div className="space-y-1 text-sm text-gray-600">
                {selectedRequestType && (
                  <p>
                    ประเภทคำร้อง: <span className="font-medium">
                      {requestTypeOptions.find(opt => opt.value === selectedRequestType)?.label}
                    </span>
                  </p>
                )}
                {selectedServiceType && (
                  <p>
                    ประเภทการให้บริการ: <span className="font-medium">
                      {serviceTypeOptions.find(opt => opt.value === selectedServiceType)?.label}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
    
    );
  }

  // Desktop Layout
  return (

      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-6">
          {/* ประเภทคำร้อง */}
          <div className="space-y-2">
            <Label htmlFor="request-type" className="text-sm font-medium text-gray-700">
              ประเภทคำร้อง
            </Label>
            <Select value={selectedRequestType} onValueChange={handleRequestTypeChange}>
              <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                <SelectValue placeholder="ตรวจสอบ" />
              </SelectTrigger>
              <SelectContent>
                {requestTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ประเภทการให้บริการ */}
          <div className="space-y-2 ">
            <Label htmlFor="service-type" className="text-sm font-medium text-gray-700">
              ประเภทการให้บริการ
            </Label>
            <Select value={selectedServiceType} onValueChange={handleServiceTypeChange}>
              <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                <SelectValue placeholder="Fast Track" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

       
      </div>

  );
};

export default RequestServiceTypeSelector;