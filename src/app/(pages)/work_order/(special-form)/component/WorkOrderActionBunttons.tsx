import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {useAppSelector} from "@/app/redux/hook";
import {
  ConfirmCreateWorkOrderPopup,
  StartWorkPopup,
  EndWorkPopup,
} from "@/components/ui/popup";
import {useRouter} from "next/navigation";
import {showConfirm} from "@/app/helpers/Alert";

interface WorkOrderActionButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  onComplete: () => void;
  onSave?: () => void;
  workOrderStatusCode: string;
  isEdit: boolean,
  isExecute: boolean,
}

const WorkOrderActionButtons: React.FC<WorkOrderActionButtonsProps> = ({
                                                                         currentStep,
                                                                         totalSteps,
                                                                         onNext,
                                                                         onCancel,
                                                                         onConfirm,
                                                                         onComplete,
                                                                         onSave,
                                                                         workOrderStatusCode,
                                                                         isEdit,
                                                                         isExecute,
                                                                       }) => {
  const router = useRouter();
  const commonButtonClass = "h-[44px] px-6 font-medium w-full md:w-auto";

  console.log('totalSteps >>> ', totalSteps)
  console.log('currentStep >>> ', currentStep)

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
    // Call the onConfirm prop to let parent handle navigation
    onConfirm();
  };

  const handleFinishWorkOrder = () => {

  };

  const handleCancelWorkOrder = () => {
    showConfirm('', 'คุณต้องการยกเลิกใบสั่งงานใช่หรือไม่ ?').then((isConfirm) => {
      if(isConfirm) {
        //TODO call api cancel work order
      }
    })
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
    return (
      <div className="flex flex-wrap justify-between items-center mt-6">
        {/* Left side - Back button */}
        <div className="flex items-center space-x-3 md:w-auto w-full">
          <Button
            className={`${commonButtonClass} cancel-button`}
            variant="outline"
            onClick={onCancel}
          >
            ยกเลิก
          </Button>
        </div>

        {/* Right side - Save, Create, Next, Finish */}
        <div className="flex flex-wrap items-center space-x-3">
          <div className="md:w-auto w-full">
            <Button
              className={`${commonButtonClass} pea-button-outline`}
              variant="outline"
              onClick={handleCancelWorkOrder}
            >
              ยกเลิกใบสั่งงาน
            </Button>
          </div>

          <div className="md:w-auto w-full">
            <Button
              className={`${commonButtonClass} pea-button-outline`}
              variant="outline"
              onClick={onSave}
            >
              บันทึก
            </Button>
          </div>


          {
            currentStep < totalSteps - 1
              && (
                <div className="md:w-auto w-full">
                  <Button
                    className={`${commonButtonClass} pea-button`}
                    onClick={onNext}
                  >
                    ถัดไป
                  </Button>
                </div>
              )
          }

          {
            currentStep === totalSteps - 1
              ? workOrderStatusCode === 'W' //รอเปิดใบสั่งงาน
                ?
                  (
                   <div className="md:w-auto w-full">
                     <Button
                       className={`${commonButtonClass} pea-button`}
                       onClick={handleConfirmCreate}
                     >
                       ยืนยันสร้างใบสั่งงาน
                     </Button>
                   </div>
                  )
                : workOrderStatusCode === 'O' //กำลังปฏิบัติงาน
                  ? (
                    <div className="md:w-auto w-full">
                      <Button
                        className={`${commonButtonClass} pea-button`}
                        onClick={handleFinishWorkOrder}
                      >
                        จบงาน
                      </Button>
                    </div>
                  ) : ''
              : ''
          }
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderButtons()}

      {/* Popups */}
      <ConfirmCreateWorkOrderPopup
        open={showConfirmCreatePopup}
        onClose={closeAllPopups}
        onConfirm={handleConfirmCreateConfirm}
      />
    </div>
  );
};

export default WorkOrderActionButtons;
