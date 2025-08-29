import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PackageDetail from './PackageDetail';


interface BusinessTypePackageProps {
  value?: string;
  onChange?: (value: string) => void;
  currentStep?: number;
}

// S322 Business Type Package Component
const BusinessTypePackage: React.FC<BusinessTypePackageProps> = ({ 
  value = '', 
  onChange,
  currentStep = 0
}) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [showPackageDetail, setShowPackageDetail] = useState(false);

  const businessOptions = [
    { value: 'manufacturing', label: 'ธุรกิจการผลิต' },
    { value: 'trading', label: 'ธุรกิจการค้า' },
    { value: 'service', label: 'ธุรกิจบริการ' },
    { value: 'agriculture', label: 'ธุรกิจการเกษตร' },
    { value: 'technology', label: 'ธุรกิจเทคโนโลยี' },
    { value: 'other', label: 'อื่นๆ' }
  ];

  const packageOptions = [
    { value: 'package1', label: 'Package 1 - ระบบไฟฟ้าแบบครบวงจร (35,000 บาท)' },
    { value: 'package2', label: 'Package 2 - ระบบไฟฟ้าแบบมาตรฐาน (25,000 บาท)' },
    { value: 'package3', label: 'Package 3 - ระบบไฟฟ้าแบบพื้นฐาน (20,000 บาท)' },
    { value: 'package4', label: 'Package 4 - ระบบไฟฟ้าแบบเบื้องต้น (10,000 บาท)' }
  ];

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  const handlePackageSelect = (packageId: string) => {
    handleValueChange(packageId);
    setShowPackageDetail(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
      case 1:
      case 2:
        // Steps 0, 1, 2 - Show business type selector
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="business-type" className="text-sm font-medium text-gray-700">
                ประเภทธุรกิจ
              </Label>
              <Select value={selectedValue} onValueChange={handleValueChange}>
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

              <div className="flex items-center justify-between">
                  <Label htmlFor="package" className="text-sm font-medium text-gray-700">
                    Package
                  </Label>
                  <button
                    onClick={() => setShowPackageDetail(true)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium underline"
                  >
                    รายละเอียด Package
                  </button>
                </div>
                <Select value={selectedValue} onValueChange={handleValueChange}>
                  <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                    <SelectValue placeholder="เลือกแพ็กเกจบริการ" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>
        );

      case 3:
        // Step 3 - Show package selector with detail link
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 shadow-sm">
            <div className="space-y-4">
              

              {/* Package Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="package" className="text-sm font-medium text-gray-700">
                    Package
                  </Label>
                  <button
                    onClick={() => setShowPackageDetail(true)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium underline"
                  >
                    รายละเอียด Package
                  </button>
                </div>
                <Select value={selectedValue} onValueChange={handleValueChange}>
                  <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                    <SelectValue placeholder="เลือกแพ็กเกจบริการ" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Package Info */}
              {selectedValue && packageOptions.find(opt => opt.value === selectedValue) && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-green-800 font-medium">
                      แพ็กเกจที่เลือก: {packageOptions.find(opt => opt.value === selectedValue)?.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderStepContent()}
      
      <PackageDetail
        isOpen={showPackageDetail}
        onClose={() => setShowPackageDetail(false)}
        onSelectPackage={handlePackageSelect}
      />
    </>
  );
};

export default BusinessTypePackage;