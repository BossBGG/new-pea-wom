import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useAppSelector } from "@/app/redux/hook";
import {
  ConfirmCreateWorkOrderPopup,
  StartWorkPopup,
  EndWorkPopup,
} from "@/components/ui/popup";
import { useRouter } from "next/navigation";

interface WorkOrderActionButtonsProps {
  currentStep: number;
  totalSteps: number;
  onGoBack: () => void;
  onNext: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onComplete: () => void;
  onSave?: () => void;
  // Optional: custom button texts
  confirmText?: string;
  completeText?: string;
  nextText?: string;
  saveText?: string;
  cancelText?: string;
  backText?: string;
  // Optional: hide specific buttons
  showSaveButton?: boolean;
  showCancelButton?: boolean;
}

const WorkOrderActionButtons: React.FC<WorkOrderActionButtonsProps> = ({
  currentStep,
  totalSteps,
  onGoBack,
  onNext,
  onCancel,
  onConfirm,
  onComplete,
  onSave,
  // Default texts
  confirmText = "ยืนยันสร้างใบสั่งงาน",
  completeText = "จบงาน",
  nextText = "ถัดไป",
  saveText = "บันทึก",
  cancelText = "ยกเลิก",
  backText = "ย้อนกลับ",
  // Default visibility
  showSaveButton = true,
  showCancelButton = true,
}) => {
  const screenSize = useAppSelector((state) => state.screen_size);
  const router = useRouter();
  const commonButtonClass = "h-[44px] px-6 font-medium";

  // Popup states
  const [showConfirmCreatePopup, setShowConfirmCreatePopup] = useState(false);
  const [showStartWorkPopup, setShowStartWorkPopup] = useState(false);
  const [showEndWorkPopup, setShowEndWorkPopup] = useState(false);

  // Handle confirm create work order
  const handleConfirmCreate = () => {
    setShowConfirmCreatePopup(true);
  };

  const handleConfirmCreateConfirm = () => {
    setShowConfirmCreatePopup(false);
    setShowStartWorkPopup(true);
  };

  const handleStartWorkConfirm = () => {
    setShowStartWorkPopup(false);
    setShowEndWorkPopup(true);
  };

  const handleBeginWorkConfirm = () => {
    setShowEndWorkPopup(false);
    // Navigate to WorkOrderDetailsWaiting
    router.push(
      "/work_order/component/workorder-details/WorkOrderDetailsWaiting"
    );
  };

  // Close all popups
  const closeAllPopups = () => {
    setShowConfirmCreatePopup(false);
    setShowStartWorkPopup(false);
    setShowEndWorkPopup(false);
  };

  // Determine button layout based on step
  const renderButtons = () => {
    // Step 1 and 2: ยกเลิก, บันทึก, ถัดไป
    if (currentStep === 0 || currentStep === 1) {
      if (screenSize === "mobile") {
        return (
          <div className="flex flex-col space-y-3 mt-6">
            {/* First Row - Back and Next */}
            <div className="flex space-x-3">
              {/* <Button
                className={`${commonButtonClass} pea-button-outline flex-1`}
                variant="outline"
                onClick={onGoBack}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                {backText}
              </Button> */}
              <div className="flex space-x-3">
                <Button
                  className={`${commonButtonClass} cancel-button  flex-1`}
                  variant="outline"
                  onClick={onCancel}
                >
                  {cancelText}
                </Button>
              </div>

              <Button
                className={`${commonButtonClass} pea-button flex-1`}
                onClick={onNext}
              >
                {nextText}
              </Button>
            </div>

            {/* Second Row - Save */}
            <div className="flex space-x-3">
              <Button
                className={`${commonButtonClass} pea-button-outline flex-1`}
                variant="outline"
                onClick={onSave}
              >
                {saveText}
              </Button>
            </div>
          </div>
        );
      }

      // Desktop layout for step 1 and 2
      return (
        <div className="flex justify-between items-center mt-6">
          {/* Left side - Back button */}
          <div className="flex items-center space-x-3">
            {/* <Button
              className={`${commonButtonClass} pea-button-outline`}
              variant="outline"
              onClick={onGoBack}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              {backText}
            </Button> */}
            <Button
              className={`${commonButtonClass} cancel-button`}
              variant="outline"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          </div>

          {/* Right side - Cancel, Save, Next buttons */}
          <div className="flex items-center space-x-3">
            <Button
              className={`${commonButtonClass} pea-button-outline`}
              variant="outline"
              onClick={onSave}
            >
              {saveText}
            </Button>

            <Button
              className={`${commonButtonClass} pea-button`}
              onClick={onNext}
            >
              {nextText}
            </Button>
          </div>
        </div>
      );
    }

    // Step 3: ยกเลิก, บันทึก, ยืนยันสร้างใบสั่งงาน
    if (currentStep === 2) {
      if (screenSize === "mobile") {
        return (
          <div className="flex flex-col space-y-3 mt-6">
            {/* First Row - Back and Confirm Create */}
            <div className="flex space-x-3">
              {/* <Button
                className={`${commonButtonClass} pea-button-outline flex-1`}
                variant="outline"
                onClick={onGoBack}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                {backText}
              </Button> */}
              <div className="flex space-x-3">
                <Button
                  className={`${commonButtonClass} cancel-button flex-1`}
                  variant="outline"
                  onClick={onCancel}
                >
                  {cancelText}
                </Button>
              </div>

              <Button
                className={`${commonButtonClass} pea-button flex-1`}
                onClick={handleConfirmCreate}
              >
                {confirmText}
              </Button>
            </div>

            {/* Second Row - Save */}
            <div className="flex space-x-3">
              <Button
                className={`${commonButtonClass} pea-button-outline flex-1`}
                variant="outline"
                onClick={onSave}
              >
                {saveText}
              </Button>
            </div>
          </div>
        );
      }

      // Desktop layout for step 3
      return (
        <div className="flex justify-between items-center mt-6">
          {/* Left side - Back button */}
          <div className="flex items-center space-x-3">
            {/* <Button
              className={`${commonButtonClass} pea-button-outline`}
              variant="outline"
              onClick={onGoBack}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              {backText}
            </Button> */}

            <Button
              className={`${commonButtonClass} cancel-button`}
              variant="outline"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          </div>

          {/* Right side - Cancel, Save, Confirm Create buttons */}
          <div className="flex items-center space-x-3">
            <Button
              className={`${commonButtonClass} pea-button-outline`}
              variant="outline"
              onClick={onSave}
            >
              {saveText}
            </Button>

            <Button
              className={`${commonButtonClass} pea-button`}
              onClick={handleConfirmCreate}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      );
    }

    // Default layout for other steps
    if (screenSize === "mobile") {
      return (
        <div className="flex flex-col space-y-3 mt-6">
          <div className="flex space-x-3">
            <Button
              className={`${commonButtonClass} pea-button-outline flex-1`}
              variant="outline"
              onClick={onGoBack}
            >
              <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
              {backText}
            </Button>

            <Button
              className={`${commonButtonClass} pea-button flex-1`}
              onClick={onNext}
            >
              {nextText}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-3">
          <Button
            className={`${commonButtonClass} pea-button-outline`}
            variant="outline"
            onClick={onGoBack}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            {backText}
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            className={`${commonButtonClass} pea-button`}
            onClick={onNext}
          >
            {nextText}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderButtons()}

      {/* Popups */}
      <ConfirmCreateWorkOrderPopup
        open={showConfirmCreatePopup}
        onClose={closeAllPopups}
        onConfirm={handleConfirmCreateConfirm}
      />

    </>
  );
};

export default WorkOrderActionButtons;



