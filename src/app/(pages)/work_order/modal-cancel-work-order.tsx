import Modal from "@/app/layout/Modal";
import InputTextArea from "@/app/components/form/InputTextArea";
import {useEffect, useState} from "react";
import {showError, showProgress, showSuccess} from "@/app/helpers/Alert";
import {cancelWorkOrder} from "@/app/api/WorkOrderApi";
import {useRouter} from "next/navigation";
import {cn} from "@/lib/utils";

interface ModalCancelWorkOrderProps {
  open: boolean
  onClose: () => void,
  id: string
}

const ModalCancelWorkOrder = ({
                                open,
                                onClose,
                                id
                              }: ModalCancelWorkOrderProps) => {
  const [note, setNote] = useState<string>("");
  const router = useRouter()

  useEffect(() => {
    setNote("")
  }, [open]);

  const submitCancelled = async () => {
    try {
      showProgress()
      const res = await cancelWorkOrder(id, {note})
      if(res.status === 200) {
        if(res.data.error) {
          onClose()
          showError(res.data.message || "")
        }else {
          onClose()
          showSuccess("ยกเลิกใบสั่งงานสำเร็จ").then(() => {
            router.push('/work_order')
          })
        }
      }
    } catch (e) {
    }
  }

  const ModalFooter = () => {
    return (
      <div className="flex justify-center w-full">
        <button onClick={onClose}
                className="text-[#a6a6a6] border-1 border-[#a6a6a6] rounded-md px-10 py-2 mr-3 cursor-pointer">
          ปิด
        </button>
        <button className={
          cn(
            'text-white bg-[#671FAB] py-2 px-3 rounded-md cursor-pointer',
            !note && '!cursor-default bg-gray-400'
            )
        }
                onClick={() => submitCancelled()}
                disabled={!note}
        >
          ยืนยันยกเลิกใบสั่งงาน
        </button>
      </div>
    )
  }

  return (
    <Modal title={"ต้องการยกเลิกใบสั่งงานหรือไม่ ?"}
           open={open}
           onClose={onClose}
           footer={<ModalFooter/>}
    >
      <div>
        <InputTextArea data={note} onChange={setNote}/>
      </div>
    </Modal>
  )
}

export default ModalCancelWorkOrder;
