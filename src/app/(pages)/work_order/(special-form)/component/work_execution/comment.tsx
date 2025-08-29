import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import CardCollapse from '../CardCollapse';
import { useAppSelector } from "@/app/redux/hook";

interface CommentProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
}

const Comment: React.FC<CommentProps> = ({ 
  value = '', 
  onChange, 
  maxLength = 250 
}) => {
  const [comment, setComment] = useState(value);
  const screenSize = useAppSelector(state => state.screen_size);
  
  // ใช้ 50 ตัวอักษรสำหรับ mobile, 250 ตัวอักษรสำหรับ desktop
  const characterLimit = screenSize === 'mobile' ? 50 : maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Limit character count
    if (newValue.length <= characterLimit) {
      setComment(newValue);
      onChange?.(newValue);
    }
  };

  const currentLength = comment.length;

  // Mobile version with CardCollapse
  if (screenSize === 'mobile') {
    return (
      <CardCollapse title="หมายเหตุเพิ่มเติม">
        <div className="p-4">
          <div className="space-y-3">
            <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
              หมายเหตุเพิ่มเติม
            </Label>
            
            <textarea
              id="comment"
              value={comment}
              onChange={handleChange}
              placeholder="กรอกหมายเหตุเพิ่มเติม"
              className="flex min-h-[80px] w-full rounded-md border  bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none border-[#D1D5DB] focus:border-[#671FAB] focus:ring-[#671FAB] md:text-sm"
              maxLength={characterLimit}
              rows={3} 
            />
            
            <div className="flex justify-end">
              <span className={`text-sm ${currentLength > characterLimit - 10 ? 'text-red-500' : 'text-gray-500'}`}>
                {currentLength}/{characterLimit}
              </span>
            </div>
          </div>
        </div>
      </CardCollapse>
    );
  }

  // Desktop version (original style without CardCollapse)
  return (
    <div className="p-4 border-1 mb-4 rounded-lg shadow-md border-[#E1D2FF] ">
      <div className="space-y-2">
        <Label htmlFor="comment" className="text-sm font-medium text-gray-700">
          หมายเหตุเพิ่มเติม
        </Label>
        
        <textarea
          id="comment"
          value={comment}
          onChange={handleChange}
          placeholder="กรอกหมายเหตุเพิ่มเติม"
          className="flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none border-[#D1D5DB] focus:border-[#671FAB] focus:ring-[#671FAB] md:text-sm"
          maxLength={characterLimit}
        />
        
        <div className="flex justify-end">
          <span className={`text-sm ${currentLength > characterLimit - 20 ? 'text-red-500' : 'text-gray-500'}`}>
            {currentLength}/{characterLimit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comment;