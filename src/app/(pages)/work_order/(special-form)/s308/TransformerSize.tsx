import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/redux/hook";

interface TransformerSizeProps {
  businessValue?: string;
  transformerSizeValue?: string;
  onBusinessChange?: (value: string) => void;
  onTransformerSizeChange?: (value: string) => void;
}

const TransformerSize: React.FC<TransformerSizeProps> = ({ 
  businessValue, 
  transformerSizeValue, 
  onBusinessChange, 
  onTransformerSizeChange 
}) => {
  const [selectedBusiness, setSelectedBusiness] = useState(businessValue || '');
  const [transformerSize, setTransformerSize] = useState(transformerSizeValue || '');
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

  const handleBusinessChange = (newValue: string) => {
    setSelectedBusiness(newValue);
    onBusinessChange?.(newValue);
  };

  const handleTransformerSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers
    if (value === '' || /^\d+$/.test(value)) {
      setTransformerSize(value);
      onTransformerSizeChange?.(value);
    }
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

          {/* ขนาดหม้อแปลงที่ติดตั้งรวม */}
          <div className="space-y-2">
            <Label htmlFor="transformer-size" className="text-sm font-medium text-gray-700">
              ขนาดหม้อแปลงที่ติดตั้งรวม (kW)
            </Label>
            <Input
              id="transformer-size"
              type="text"
              value={transformerSize}
              onChange={handleTransformerSizeChange}
              placeholder="ระบุขนาดหม้อแปลง"
              className="w-full h-[36px] border-[#D1D5DB]"
            />
          </div>
        </div>
        
        {/* แสดงข้อมูลที่เลือก */}
        {(selectedBusiness || transformerSize) && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md space-y-1">
            {selectedBusiness && (
              <p className="text-sm text-gray-600">
                ประเภทธุรกิจที่เลือก: <span className="font-medium">
                  {businessOptions.find(option => option.value === selectedBusiness)?.label}
                </span>
              </p>
            )}
            {transformerSize && (
              <p className="text-sm text-gray-600">
                ขนาดหม้อแปลงที่ติดตั้งรวม: <span className="font-medium">
                  {transformerSize} kW
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

        {/* ขนาดหม้อแปลงที่ติดตั้งรวม */}
        <div className="space-y-2">
          <Label htmlFor="transformer-size-mobile" className="text-sm font-medium text-gray-700">
            ขนาดหม้อแปลงที่ติดตั้งรวม (kW)
          </Label>
          <Input
            id="transformer-size-mobile"
            type="text"
            value={transformerSize}
            onChange={handleTransformerSizeChange}
            placeholder="ระบุขนาดหม้อแปลง"
            className="w-full h-[36px] border-[#D1D5DB]"
          />
        </div>
        
        {/* แสดงข้อมูลที่เลือก */}
        {(selectedBusiness || transformerSize) && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md space-y-1">
            {selectedBusiness && (
              <p className="text-sm text-gray-600">
                ประเภทธุรกิจที่เลือก: <span className="font-medium">
                  {businessOptions.find(option => option.value === selectedBusiness)?.label}
                </span>
              </p>
            )}
            {transformerSize && (
              <p className="text-sm text-gray-600">
                ขนาดหม้อแปลงที่ติดตั้งรวม: <span className="font-medium">
                  {transformerSize} kW
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransformerSize;