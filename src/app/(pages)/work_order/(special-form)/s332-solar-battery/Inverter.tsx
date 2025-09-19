import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface InverterData {
  acVoltagePhase: number;
  dcVoltagePhase: number;
  connectionType: 'LAN' | 'WiFi' | 'other';
  otherConnectionDetail: string;
}

interface InverterComponentProps {
  data?: InverterData;
  onChange?: (data: InverterData) => void;
}

const InverterComponent: React.FC<InverterComponentProps> = ({ 
  data = {
    acVoltagePhase: 0,
    dcVoltagePhase: 0,
    connectionType: 'LAN',
    otherConnectionDetail: ''
  }, 
  onChange 
}) => {
  const [formData, setFormData] = useState<InverterData>(data);

  const handleChange = (field: keyof InverterData, value: string | number) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onChange?.(newData);
  };

  const handleConnectionTypeChange = (value: string) => {
    const connectionType = value as 'LAN' | 'WiFi' | 'other';
    handleChange('connectionType', connectionType);
    
    
    if (connectionType !== 'other') {
      handleChange('otherConnectionDetail', '');
    }
  };

  return (
    <div className="bg-white rounded-lg  border-1 border-[#E1D2FF]  p-4 mb-4 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div className="space-y-2">
          <Label htmlFor="ac-voltage" className="text-sm font-medium text-gray-700">
            ระยะจากแผงโซลาร์สำหรับ ถึง อินเวอร์เตอร์
          </Label>
          <div className="relative">
            <Input
              id="ac-voltage"
              type="number"
              value={formData.acVoltagePhase}
              onChange={(e) => handleChange('acVoltagePhase', parseInt(e.target.value) || 0)}
              className="pr-12"
              min="0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              เมตร
            </span>
          </div>
        </div>

      
        <div className="space-y-2">
          <Label htmlFor="dc-voltage" className="text-sm font-medium text-gray-700">
            ระยะจากอินเวอร์เตอร์ ถึง ตู้ไฟฟ้า
          </Label>
          <div className="relative">
            <Input
              id="dc-voltage"
              type="number"
              value={formData.dcVoltagePhase}
              onChange={(e) => handleChange('dcVoltagePhase', parseInt(e.target.value) || 0)}
              className="pr-12"
              min="0"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              เมตร
            </span>
          </div>
        </div>
      </div>

      
      <div className="mt-6 space-y-3">
        <Label className="text-sm font-medium text-gray-700">
          ระบบเครือข่ายอินเวอร์เตอร์นิต
        </Label>
        
        <RadioGroup 
          value={formData.connectionType} 
          onValueChange={handleConnectionTypeChange}
          className="flex flex-wrap gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="LAN" 
              id="lan" 
              className="text-purple-600 border-purple-300 focus:ring-purple-500"
            />
            <Label htmlFor="lan" className="text-sm font-medium cursor-pointer">
              LAN
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="WiFi" 
              id="wifi"
              className="text-purple-600 border-purple-300 focus:ring-purple-500"
            />
            <Label htmlFor="wifi" className="text-sm font-medium cursor-pointer">
              WiFi
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="other" 
              id="other"
              className="text-purple-600 border-purple-300 focus:ring-purple-500"
            />
            <Label htmlFor="other" className="text-sm font-medium cursor-pointer">
              อื่นๆ
            </Label>
          </div>
          {formData.connectionType === 'other' && (
          <div >
            <Input
              placeholder="ระบุ"
              value={formData.otherConnectionDetail}
              onChange={(e) => handleChange('otherConnectionDetail', e.target.value)}
              className="max-w-xs"
            />
          </div>
        )}
        </RadioGroup>

       
        
      </div>
    </div>
  );
};

export default InverterComponent;