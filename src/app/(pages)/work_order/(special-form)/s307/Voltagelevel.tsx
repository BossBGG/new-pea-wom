import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/app/redux/hook";

interface VoltageLevelProps {
  businessValue?: string;
  voltageValue?: string;
  onBusinessChange?: (value: string) => void;
  onVoltageChange?: (value: string) => void;
}

const VoltageLevel: React.FC<VoltageLevelProps> = ({ 
  businessValue, 
  voltageValue, 
  onBusinessChange, 
  onVoltageChange 
}) => {
  const [selectedBusiness, setSelectedBusiness] = useState(businessValue || '');
  const [selectedVoltage, setSelectedVoltage] = useState(voltageValue || '');
  const screenSize = useAppSelector(state => state.screen_size);

  const businessOptions = [
    { value: 'house', label: 'บ้านอยู่อาศัย' },
    { value: 'manufacturing', label: 'ธุรกิจการผลิต' },
    { value: 'trading', label: 'ธุรกิจการค้า' },
    { value: 'service', label: 'ธุรกิจบริการ' },
    { value: 'agriculture', label: 'ธุรกิจการเกษตร' },
    { value: 'technology', label: 'ธุรกิจเทคโนโลยี' },
    { value: 'other', label: 'อื่นๆ' }
  ];

  const voltageOptions = [
    { value: '22-33kv', label: '22-33 kV' },
    { value: '115kv', label: '115 kV' },
    { value: '230kv', label: '230 kV' },
    { value: '500kv', label: '500 kV' },
    { value: 'low-voltage', label: 'แรงดันต่ำ (380V/220V)' },
    { value: 'medium-voltage', label: 'แรงดันกลาง (22kV/33kV)' },
    { value: 'high-voltage', label: 'แรงดันสูง (115kV ขึ้นไป)' }
  ];

  const handleBusinessChange = (newValue: string) => {
    setSelectedBusiness(newValue);
    onBusinessChange?.(newValue);
  };

  const handleVoltageChange = (newValue: string) => {
    setSelectedVoltage(newValue);
    onVoltageChange?.(newValue);
  };

  // Desktop Layout
  if (screenSize === 'desktop') {
    return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div className="grid grid-cols-2 gap-4">
          {/* ประเภทธุรกิจ */}
          <div className="space-y-2">
            <Label htmlFor="business-type" className="text-sm font-medium text-gray-700">
              ประเภทธุรกิจ
            </Label>
            <Select value={selectedBusiness} onValueChange={handleBusinessChange}>
              <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                <SelectValue placeholder="เลือกประเภทธุรกิจ" />
              </SelectTrigger>
              <SelectContent>
                {businessOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ระดับแรงดันไฟฟ้า */}
          <div className="space-y-2">
            <Label htmlFor="voltage-level" className="text-sm font-medium text-gray-700">
              ระดับแรงดันไฟฟ้า
            </Label>
            <Select value={selectedVoltage} onValueChange={handleVoltageChange}>
              <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                <SelectValue placeholder="เลือกระดับแรงดันไฟฟ้า" />
              </SelectTrigger>
              <SelectContent>
                {voltageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* แสดงข้อมูลที่เลือก */}
        {(selectedBusiness || selectedVoltage) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md space-y-1">
            {selectedBusiness && (
              <p className="text-sm text-gray-600">
                ประเภทธุรกิจที่เลือก: <span className="font-medium">
                  {businessOptions.find(option => option.value === selectedBusiness)?.label}
                </span>
              </p>
            )}
            {selectedVoltage && (
              <p className="text-sm text-gray-600">
                ระดับแรงดันไฟฟ้าที่เลือก: <span className="font-medium">
                  {voltageOptions.find(option => option.value === selectedVoltage)?.label}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
      <div className="space-y-4">
        {/* ประเภทธุรกิจ */}
        <div className="space-y-2">
          <Label htmlFor="business-type" className="text-sm font-medium text-gray-700">
            ประเภทธุรกิจ
          </Label>
          <Select value={selectedBusiness} onValueChange={handleBusinessChange}>
            <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
              <SelectValue placeholder="เลือกประเภทธุรกิจ" />
            </SelectTrigger>
            <SelectContent>
              {businessOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* ระดับแรงดันไฟฟ้า */}
        <div className="space-y-2">
          <Label htmlFor="voltage-level" className="text-sm font-medium text-gray-700">
            ระดับแรงดันไฟฟ้า
          </Label>
          <Select value={selectedVoltage} onValueChange={handleVoltageChange}>
            <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
              <SelectValue placeholder="เลือกระดับแรงดันไฟฟ้า" />
            </SelectTrigger>
            <SelectContent>
              {voltageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* แสดงข้อมูลที่เลือก */}
        {(selectedBusiness || selectedVoltage) && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md space-y-1">
            {selectedBusiness && (
              <p className="text-sm text-gray-600">
                ประเภทธุรกิจที่เลือก: <span className="font-medium">
                  {businessOptions.find(option => option.value === selectedBusiness)?.label}
                </span>
              </p>
            )}
            {selectedVoltage && (
              <p className="text-sm text-gray-600">
                ระดับแรงดันไฟฟ้าที่เลือก: <span className="font-medium">
                  {voltageOptions.find(option => option.value === selectedVoltage)?.label}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoltageLevel;