import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/app/redux/hook";


interface EnergySourceProps {
  value?: string;
  onChange?: (value: string) => void;
}

const EnergySource: React.FC<EnergySourceProps> = ({ 
  value, 
  onChange 
}) => {
  const [selectedSource, setSelectedSource] = useState(value || '');
  const screenSize = useAppSelector(state => state.screen_size);

  const sourceOptions = [
    { value: 'solar', label: 'พลังงานแสงอาทิตย์ (Solar)' },
    { value: 'wind', label: 'พลังงานลม (Wind)' },
    { value: 'biomass', label: 'พลังงานชีวมวล (Biomass)' },
    { value: 'hydro', label: 'พลังงานน้า (Hydro)' },
    { value: 'geothermal', label: 'พลังงานใต้พิภพ (Geothermal)' },
    { value: 'battery', label: 'แบตเตอรี่สะสมพลังงาน (Battery)' },
  ];

  const handleSourceChange = (newValue: string) => {
    setSelectedSource(newValue);
    onChange?.(newValue);
  };

  // Desktop Layout
  if (screenSize === 'desktop') {
    return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div className="space-y-2">
          <Label htmlFor="energy-source" className="text-sm font-medium text-gray-700">
            แหล่งที่มาของพลังงานหมุนเวียนที่ต้องการ
          </Label>
          <Select value={selectedSource} onValueChange={handleSourceChange}>
            <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
              <SelectValue placeholder="พลังงานแสงอาทิตย์ (Solar)" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedSource && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              แหล่งพลังงานที่เลือก: <span className="font-medium">
                {sourceOptions.find(option => option.value === selectedSource)?.label}
              </span>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Mobile Layout with CardCollapse
  return (
    
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div>
            แหล่งที่มาของพลังงานหมุนเวียนที่ต้องการ        
        </div>
        <div className="space-y-2">
            
          <Select value={selectedSource} onValueChange={handleSourceChange}>
            <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
              <SelectValue placeholder="พลังงานแสงอาทิตย์ (Solar)" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedSource && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              แหล่งพลังงานที่เลือก: <span className="font-medium">
                {sourceOptions.find(option => option.value === selectedSource)?.label}
              </span>
            </p>
          </div>
        )}
      </div>

  );
};

export default EnergySource;