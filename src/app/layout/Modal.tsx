import {Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";

interface ModalProps {
  title: string,
  children: React.ReactNode,
  footer: React.ReactNode,
  open: boolean,
  onClose: () => void,
}

const ModalFilter = ({
                       title,
                       children,
                       footer,
                       open,
                       onClose
                     }: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[85%] overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            <div className="text-[#160C26] text-left text-[20px]">{title}</div>
          </DialogTitle>
        </DialogHeader>

        {children}

        <DialogFooter className="w-full">
          <DialogClose asChild>
            {footer}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ModalFilter;
