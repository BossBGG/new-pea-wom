import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppSelector } from "@/app/redux/hook";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";


interface SurveyPeriodProps {
  yearValue?: Date;
  periodValue?: string;
  onYearChange?: (date: Date | undefined) => void;
  onPeriodChange?: (value: string) => void;
}

const SurveyPeriod: React.FC<SurveyPeriodProps> = ({ 
  yearValue, 
  periodValue, 
  onYearChange, 
  onPeriodChange 
}) => {
  const [selectedYear, setSelectedYear] = useState<Date | undefined>(yearValue);
  const [period, setPeriod] = useState(periodValue || '');
  const [open, setOpen] = useState(false);
  const screenSize = useAppSelector(state => state.screen_size);

  const handleYearChange = (date: Date | undefined) => {
    setSelectedYear(date);
    setOpen(false);
    onYearChange?.(date);
  };

  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow only numbers
    if (value === '' || /^\d+$/.test(value)) {
      setPeriod(value);
      onPeriodChange?.(value);
    }
  };

  // Desktop Layout
  if (screenSize === 'desktop') {
    return (
      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            ปีที่มีความต้องการใบรับรองการผลิตพลังงานหมุนเวียน
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            {/* เลือกปี */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                ปี พ.ศ.
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-[44px] px-4 border-[#D1D5DB] bg-white",
                      !selectedYear && "text-muted-foreground"
                    )}
                  >
                    <FontAwesomeIcon icon={faCalendar} className="mr-2 h-4 w-4" />
                    {selectedYear ? (
                      format(selectedYear, "dd MMMM yyyy", { locale: th })
                    ) : (
                      <span>ปี พ.ศ.</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedYear}
                    onSelect={handleYearChange}
                    initialFocus
                    locale={th}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* จำนวนปี */}
            <div className="space-y-2">
              <Label htmlFor="period" className="text-sm font-medium text-gray-700">
                จำนวน (ปี)
              </Label>
              <Input
                id="period"
                type="text"
                value={period}
                onChange={handlePeriodChange}
                placeholder="จำนวนปี"
                className="w-full h-[44px] border-[#D1D5DB]"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout with CardCollapse
  return (

      <div className="p-4 border-1 mb-4 rounded-lg shadow-md">
        <div>
            ปีที่มีความต้องการใบรับรองการผลิตพลังงานหมุนเวียน
        </div>
        <div className="space-y-4">
          {/* เลือกปี */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              ปี พ.ศ.
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-[44px] px-4 border-[#D1D5DB] bg-white",
                    !selectedYear && "text-muted-foreground"
                  )}
                >
                  <FontAwesomeIcon icon={faCalendar} className="mr-2 h-4 w-4" />
                  {selectedYear ? (
                    format(selectedYear, "dd MMMM yyyy", { locale: th })
                  ) : (
                    <span>14 ธันวาคม 2566</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedYear}
                  onSelect={handleYearChange}
                  initialFocus
                  locale={th}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* จำนวนปี */}
          <div className="space-y-2">
            <Label htmlFor="period-mobile" className="text-sm font-medium text-gray-700">
              จำนวน (ปี)
            </Label>
            <Input
              id="period-mobile"
              type="text"
              value={period}
              onChange={handlePeriodChange}
              placeholder="10"
              className="w-full h-[44px] border-[#D1D5DB]"
            />
          </div>
        </div>
      </div>
   
  );
};

export default SurveyPeriod;