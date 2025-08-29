import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PopupConfirm from "@/assets/images/popup_confirm.png";
import PopupStartwork from "@/assets/images/popup_startwork.png";

interface PopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

const Popup: React.FC<PopupProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  icon
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6" showCloseButton={true}>
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Icon */}
          {icon && (
            <div className="w-20 h-20 flex items-center justify-center">
              {icon}
            </div>
          )}
          
          {/* Title */}
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {title}
          </DialogTitle>
          
          {/* Message */}
          <p className="text-gray-600 text-sm">
            {message}
          </p>
          
          {/* Buttons */}
          <div className="w-full pt-4">
            <Button
              onClick={onConfirm}
              className="w-full bg-[#671FAB] hover:bg-[#671FAB]/90 text-white rounded-full py-3 mb-3"
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Pre-configured popup variants
export const ConfirmCreateWorkOrderPopup: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  const icon = (
    <div className="relative">
     <img src={PopupConfirm.src} alt="" className='w-24 h-20'/>
    </div>
  );

  return (
    <Popup
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="ยืนยันสร้างใบสั่งงาน?"
      message="ท่านต้องการยืนยันการสร้างใบสั่งงานนี้หรือไม่?"
      confirmText="ยืนยัน"
      icon={icon}
    />
  );
};

export const StartWorkPopup: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  const icon = (
    <div className="relative">
     <img src={PopupStartwork.src} alt="" className='w-24 h-20'/>
    </div>
  );

  return (
    <Popup
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="เริ่มปฏิบัติงาน?"
      message="ท่านต้องการเริ่มปฏิบัติงาน 'ใช่ หรือ ไม่' "
      confirmText="เริ่มปฏิบัติงาน"
      icon={icon}
    />
  );
};

export const EndWorkPopup: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}> = ({ open, onClose, onConfirm }) => {
  const icon = (
    <div className="relative">
     <img src={PopupConfirm.src} alt="" className='w-24 h-20'/>
    </div>
  );

  return (
    <Popup
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="ยืนยันการจบงาน ใช่หรือไม่?"
      message="เมื่อทำการจบงานจะไม่สามารถแก้ไขข้อมูลได้อีก !"
      confirmText="จบงาน"
      icon={icon}
    />
  );
};

export default Popup;