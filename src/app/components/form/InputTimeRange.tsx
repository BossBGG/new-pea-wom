"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock} from "@fortawesome/free-solid-svg-icons";

interface InputTimeRangeProps {
  onChange?: (minutes: number) => void;
}

export const InputTimeRange: React.FC<InputTimeRangeProps> = ({ onChange }) => {
  const [startTime, setStartTime] = React.useState("08:00");
  const [endTime, setEndTime] = React.useState("17:00");

  const calculateDuration = (start: string, end: string) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);

    let duration = (endH * 60 + endM) - (startH * 60 + startM);
    if (duration < 0) duration += 24 * 60; // ถ้าเลือกข้ามวัน

    return duration;
  };

  const duration = calculateDuration(startTime, endTime);
  const durationHours = Math.floor(duration / 60);
  const durationMinutes = duration % 60;

  React.useEffect(() => {
    if (onChange) onChange(duration);
  }, [duration, onChange]);

  return (
    <Popover>
      <PopoverTrigger asChild className="p-5">
        <Button variant="outline" className="w-full flex justify-between items-center">
          {startTime} - {endTime} ({durationHours}h {durationMinutes}m)
          <FontAwesomeIcon icon={faClock} size="lg"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="flex flex-col gap-2">
          <label className="text-sm">Start Time</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <label className="text-sm">End Time</label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
