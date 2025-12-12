import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faPrint} from "@fortawesome/free-solid-svg-icons";
import {useAppSelector} from "@/app/redux/hook";
import {
  ConfirmCreateWorkOrderPopup,
  StartWorkPopup,
  EndWorkPopup,
} from "@/components/ui/popup";
import {useRouter} from "next/navigation";
import {showError, showProgress, showPrompt, showSuccess} from "@/app/helpers/Alert";
import {cancellableStatuses, completeWorkByWorkOrderNo} from "@/app/api/WorkOrderApi";
import {ApiResponse} from "@/app/api/Api";
import ModalCancelWorkOrder from "@/app/(pages)/work_order/modal-cancel-work-order";

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
  id: string
  workOrderNo: string
  disabled: boolean
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
                                                                         id,
                                                                         workOrderNo,
                                                                         disabled
                                                                       }) => {
  const router = useRouter();
  const commonButtonClass = "h-[44px] px-6 font-medium w-full md:w-auto mb-3 md:mb-0";

  // Popup states
  const [showConfirmCreatePopup, setShowConfirmCreatePopup] = useState(false);
  const [showEndWorkPopup, setShowEndWorkPopup] = useState(false);
  const [showCancelWorkOrder, setShowCancelWorkOrder] = useState(false);

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
    setShowEndWorkPopup(true)
  };

  const handleConfirmFinishWorkOrder = async () => {
    setShowEndWorkPopup(false)
    showProgress()
    const res = await completeWorkByWorkOrderNo(workOrderNo)
    resSuccessOrError(res, "จบงานสำเร็จ")
  }

  const handleCancelWorkOrder = () => {
    setShowCancelWorkOrder(true)
  };

  const resSuccessOrError = (res: ApiResponse, message: string) => {
    if(res.status === 200) {
      if(res.data.error) {
        showError(res.data.message || "")
      }else {
        showSuccess(message).then((res) => {
          router.push('/work_order')
        })
      }
    }
  }

  // Close all popups
  const closeAllPopups = () => {
    setShowConfirmCreatePopup(false);
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
        <div className="flex flex-wrap items-center md:gap-3 gap-0 md:w-auto w-full">
          {
            cancellableStatuses.includes(workOrderStatusCode) &&
            (
              <div className="md:w-auto w-full">
                <Button
                  className={`${commonButtonClass} pea-button-outline`}
                  variant="outline"
                  onClick={handleCancelWorkOrder}
                >
                  ยกเลิกใบสั่งงาน
                </Button>
              </div>
            )
          }

          {
            !["B","J","T","X","Y","Z"].includes(workOrderStatusCode) && !disabled ?
            <div className="md:w-auto w-full">
              <Button
                className={`${commonButtonClass} pea-button-outline`}
                variant="outline"
                onClick={onSave}
              >
                บันทึก
              </Button>
            </div> :
              <div className="w-full md:w-auto">
                <Button className="rounded-full text-[#671FAB] bg-white border-1 hover:bg-white border-[#671FAB] cursor-pointer w-full md:w-auto">
                  <FontAwesomeIcon icon={faPrint} className="mr-2" />
                  พิมพ์เอกสาร
                </Button>
              </div>
          }


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
            currentStep === totalSteps - 1 && !disabled
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
                : workOrderStatusCode === "K" //กำลังปฏิบัติงาน
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

      <EndWorkPopup open={showEndWorkPopup}
                    onClose={closeAllPopups}
                    onConfirm={handleConfirmFinishWorkOrder}/>

      <ModalCancelWorkOrder open={showCancelWorkOrder}
                            onClose={() => {
                              setShowCancelWorkOrder(false)
                            }}
                            id={id}
      />
    </div>
  );
};

export default WorkOrderActionButtons;
