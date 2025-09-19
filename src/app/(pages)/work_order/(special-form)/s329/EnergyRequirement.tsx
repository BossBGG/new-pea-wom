import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAppSelector } from "@/app/redux/hook";


interface EnergyRequirementProps {
  surveyValue?: string;
  sourceValue?: string;
  onSurveyChange?: (value: string) => void;
  onSourceChange?: (value: string) => void;
}

const EnergyRequirement: React.FC<EnergyRequirementProps> = ({ 
  surveyValue, 
  onSurveyChange, 

}) => {
  const [selectedSurvey, setSelectedSurvey] = useState(surveyValue || '');

  const screenSize = useAppSelector(state => state.screen_size);

  const surveyOptions = [
    { value: 'need_survey', label: 'ต้องการซื้อใบรับรองพลังงานหมุนเวียน' },

  ];



  const handleSurveyChange = (newValue: string) => {
    setSelectedSurvey(newValue);
    onSurveyChange?.(newValue);
  };



  // Desktop Layout
  if (screenSize === 'desktop') {
    return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div className="space-y-4">
          {/* สำรวจความต้องการใช้พลังงานสะอาด */}
          <div className="space-y-2">
            <Label htmlFor="survey-requirement" className="text-sm font-medium text-gray-700">
              สำรวจความต้องการใบรับรองการผลิตพลังงานหมุนเวียน
            </Label>
            <Select value={selectedSurvey} onValueChange={handleSurveyChange}>
              <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                <SelectValue placeholder="ต้องการสำรวจพลังงานแสงอาทิตย์" />
              </SelectTrigger>
              <SelectContent>
                {surveyOptions.map((option) => (
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
  }

  // Mobile Layout with CardCollapse
  return (
    
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div>
            สำรวจความต้องการใบรับรองการผลิตพลังงานหมุนเวียน
          </div>
        <div className="space-y-4">
          
          {/* สำรวจความต้องการ */}
          <div className="space-y-2">
            <Select value={selectedSurvey} onValueChange={handleSurveyChange}>
              <SelectTrigger className="w-full h-[44px] border-[#D1D5DB]">
                <SelectValue placeholder="ต้องการสำรวจพลังงานแสงอาทิตย์" />
              </SelectTrigger>
              <SelectContent>
                {surveyOptions.map((option) => (
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

export default EnergyRequirement;