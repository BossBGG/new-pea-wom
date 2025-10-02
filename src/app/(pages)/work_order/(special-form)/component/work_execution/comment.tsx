import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import CardCollapse from '../CardCollapse';
import { useAppSelector } from "@/app/redux/hook";

interface CommentOptions {
  isReadOnly?: boolean;
  initialValue?: string;
}

interface CommentProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength?: number;
  options?: CommentOptions;
}

const Comment: React.FC<CommentProps> = ({
  value = '',
  onChange,
  maxLength = 250,
  options = {}
}) => {
  const { isReadOnly = false, initialValue} = options;

  const [comment, setComment] = useState(initialValue || value ||
    (isReadOnly ? 'หมายเหตุเพิ่มเติมสำหรับงานนี้' : '')
  );
  const screenSize = useAppSelector(state => state.screen_size);

  // ใช้ 50 ตัวอักษรสำหรับ mobile, 250 ตัวอักษรสำหรับ desktop
  const characterLimit = screenSize === 'mobile' ? 50 : maxLength;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isReadOnly) return;

    const newValue = e.target.value;

    // Limit character count
    if (newValue.length <= characterLimit) {
      setComment(newValue);
      onChange?.(newValue);
    }
  };

  const currentLength = comment.length;

  const renderContent = () => {
    return (
      <div className="p-0 md:p-4 border-0 md:border-1 mb-4 rounded-lg shadow-none md:shadow-md border-[#E1D2FF] ">
        <div className="space-y-3 -mt-5 md:mt-0">
          <div>หมายเหตุเพิ่มเติม</div>

          <textarea
            id="comment"
            value={comment}
            onChange={handleChange}
            placeholder="กรอกหมายเหตุเพิ่มเติม"
            maxLength={characterLimit}
            readOnly={isReadOnly}
            disabled={isReadOnly}
            rows={4}
            className="w-full p-3 rounded-md border-1"
          />

          {!isReadOnly && (
            <div className="flex justify-end">
              <span className={`text-sm ${currentLength > characterLimit - 20 ? 'text-red-500' : 'text-gray-500'}`}>
                {currentLength}/{characterLimit}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    screenSize !== 'mobile'
      ? renderContent()
      : (
        <CardCollapse title="หมายเหตุเพิ่มเติม">
          <div className="p-4">
            {renderContent()}
          </div>
        </CardCollapse>
      )
  )
};

export default Comment;
