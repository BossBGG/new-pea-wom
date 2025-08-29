import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppSelector } from "@/app/redux/hook";

interface DistanceData {
  batteryToInverterDistance: number;
  dcCableDistance: number;
  acCableDistance: number;
  houseWiringType: string;
}

interface DistanceComponentProps {
  data?: DistanceData;
  onChange?: (data: DistanceData) => void;
}

const DistanceComponent: React.FC<DistanceComponentProps> = ({ 
  data = {
    batteryToInverterDistance: 0,
    dcCableDistance: 0,
    acCableDistance: 0,
    houseWiringType: 'เหนือ'
  }, 
  onChange 
}) => {
  const [formData, setFormData] = useState<DistanceData>(data);
  const screenSize = useAppSelector(state => state.screen_size);

  const wiringOptions = [
    { value: 'เหนือ', label: 'เหนือ' },
    { value: 'ใต้', label: 'ใต้' },
    { value: 'ตะวันออก', label: 'ตะวันออก' },
    { value: 'ตะวันตก', label: 'ตะวันตก' }
  ];

  const handleChange = (field: keyof DistanceData, value: string | number) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange?.(newData);
  };

  // Mobile Layout
  if (screenSize === 'mobile') {
    return (
      <div className="bg-white rounded-lg borderborder-gray-200  p-4 border-1 mb-4 shadow-md">
        {/* ระยะก่อนแบตเตอรี่ */}
        <div className="space-y-2 mb-2">
          <Label htmlFor="battery-distance-mobile" className="text-sm font-medium text-gray-700">
            ระยะท่อน้ำยาแอร์
          </Label>
          <div className="text-xs text-gray-500 mb-2">
            (จากคอยส์ร่อนถึงคอยส่วยเย็น) ประมาณ
          </div>
          <div className="relative">
            <Input
              id="battery-distance-mobile"
              type="number"
              value={formData.batteryToInverterDistance}
              onChange={(e) => handleChange('batteryToInverterDistance', parseInt(e.target.value) || 0)}
              className="pr-12"
              min="0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              เมตร
            </span>
          </div>
        </div>

        {/* ระยะสายไฟ DC */}
        <div className="space-y-2 mb-2">
          <Label htmlFor="dc-cable-mobile" className="text-sm font-medium text-gray-700 ">
            ระยะสายไฟ DC
          </Label>
          <div className="text-xs text-gray-500 mb-2">
            (จากแผงโซลาร์เซลล์ถึงคอยส่วยร้อน) ประมาณ
          </div>
          <div className="relative">
            <Input
              id="dc-cable-mobile"
              type="number"
              value={formData.dcCableDistance}
              onChange={(e) => handleChange('dcCableDistance', parseInt(e.target.value) || 0)}
              className="pr-12"
              min="0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              เมตร
            </span>
          </div>
        </div>

        {/* ระยะสายไฟ AC */}
        <div className="space-y-2 mb-2">
          <Label htmlFor="ac-cable-mobile" className="text-sm font-medium text-gray-700">
            ระยะสายไฟ AC (จากตู้ไฟถึงคอยส่วยร้อน)
          </Label>
          <div className="relative">
            <Input
              id="ac-cable-mobile"
              type="number"
              value={formData.acCableDistance}
              onChange={(e) => handleChange('acCableDistance', parseInt(e.target.value) || 0)}
              className="pr-12"
              min="0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              เมตร
            </span>
          </div>
        </div>

        {/* หน้าบ้านเห็นกิจ */}
        <div className="space-y-2 mb-2">
          <Label htmlFor="wiring-type-mobile" className="text-sm font-medium text-gray-700">
            หน้าบ้านเห็นกิจ
          </Label>
          <Select 
            value={formData.houseWiringType} 
            onValueChange={(value) => handleChange('houseWiringType', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือก" />
            </SelectTrigger>
            <SelectContent>
              {wiringOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="bg-white rounded-lg borderborder-gray-200  p-4 border-1 mb-4 shadow-md">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* ระยะก่อนแบตเตอรี่ */}
          <div className="space-y-2">
            <Label htmlFor="battery-distance" className="text-sm font-medium text-gray-700">
              ระยะก่อนแบตเตอรี่ (จากคอยส์ร่อนถึงคอยส่วยเย็น) ประมาณ
            </Label>
            <div className="relative">
              <Input
                id="battery-distance"
                type="number"
                value={formData.batteryToInverterDistance}
                onChange={(e) => handleChange('batteryToInverterDistance', parseInt(e.target.value) || 0)}
                className="pr-12"
                min="0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                เมตร
              </span>
            </div>
          </div>

          {/* ระยะสายไฟ AC */}
          <div className="space-y-2">
            <Label htmlFor="ac-cable" className="text-sm font-medium text-gray-700">
              ระยะสายไฟ AC (จากตู้ไฟถึงคอยส่วยร่อน)
            </Label>
            <div className="relative">
              <Input
                id="ac-cable"
                type="number"
                value={formData.acCableDistance}
                onChange={(e) => handleChange('acCableDistance', parseInt(e.target.value) || 0)}
                className="pr-12"
                min="0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                เมตร
              </span>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* ระยะสายไฟ DC */}
          <div className="space-y-2">
            <Label htmlFor="dc-cable" className="text-sm font-medium text-gray-700">
              ระยะสายไฟ DC (จากแผงโซลาร์เซลล์ถึงคอยส่วยร่อน) ประมาณ
            </Label>
            <div className="relative">
              <Input
                id="dc-cable"
                type="number"
                value={formData.dcCableDistance}
                onChange={(e) => handleChange('dcCableDistance', parseInt(e.target.value) || 0)}
                className="pr-12"
                min="0"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                เมตร
              </span>
            </div>
          </div>

          {/* หน้าบ้านเห็นกิจ */}
          <div className="space-y-2">
            <Label htmlFor="wiring-type" className="text-sm font-medium text-gray-700">
              หน้าบ้านเห็นกิจ
            </Label>
            <Select 
              value={formData.houseWiringType} 
              onValueChange={(value) => handleChange('houseWiringType', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="เลือก" />
              </SelectTrigger>
              <SelectContent>
                {wiringOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceComponent;