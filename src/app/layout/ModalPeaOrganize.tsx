import Modal from "@/app/layout/Modal";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {Options, User} from "@/types";
import {getPeaOfficeList, updatePeaOffice} from "@/app/api/LoginApi";
import {showError, showProgress, showSuccess} from "@/app/helpers/Alert";
import {useAppDispatch, useAppSelector} from "@/app/redux/hook";
import InputSearchSelect from "@/app/components/form/InputSearchSelect";
import {setUserProfile} from "@/app/redux/slices/UserSlice";

interface ModalPeaOrganizeProps {
  open: boolean;
  onClose: () => void;
}

const ModalPeaOrganize = ({
                            open,
                            onClose
                          }: ModalPeaOrganizeProps) => {
  const [value, setValue] = useState<string>('');
  const [peaOfficeOptions, setPeaOfficeOptions] = useState<Options[]>([]);
  let user: User = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchPeaOfficeOptions()
    if(user.selectedPeaOffice) {
      setValue(user.selectedPeaOffice);
    }
  }, []);

  const fetchPeaOfficeOptions = async (search: string = '') => {
    setIsLoading(true)
    await getPeaOfficeList(search).then(res => {
      if (res.data && res.status === 200) {
        let data = res.data.data || [];
        if (data.length > 0) {
          let options: Options[] = []
          data.map((d) => {
            options.push({
              label: `${d.regiongroup} : ${d.peaNameFull} [${d.office}]`,
              value: d.office
            })
          })
          console.log('options >>>> ',options)
          setPeaOfficeOptions(options);
        }
      }
    }).finally(() => {
      setIsLoading(false);
    })
  }

  const onSubmit = async () => {
    showProgress()
    let item = {
      username: user.username,
      newPeaOffice: value
    }

    await updatePeaOffice(item).then(res => {
      if (res.data && res.data.status_code === 200) {
        user = {
          ...user,
          selectedPeaOffice: value
        }
        dispatch(setUserProfile(user))
        showSuccess('เปลี่ยนการไฟฟ้าสำเร็จ')
      }else {
        showError(res.data.message || '')
      }
    })
  }

  return (
    <Modal open={open} onClose={() => onClose()}
           title="เปลี่ยนการไฟฟ้า"
           footer={<FooterModal cancel={onClose} submit={() => onSubmit()}/>}
    >
      <InputSearchSelect selectOptions={peaOfficeOptions}
                         fetchOptions={fetchPeaOfficeOptions}
                         loading={isLoading}
                         onChange={(val: string) => setValue(val)}
                         value={value}
      />
    </Modal>
  )
}

const FooterModal = ({
                       cancel,
                       submit
                     }: { cancel: () => void; submit: () => void }) => (
  <div className="w-full flex flex-wrap justify-between items-center">
    <div className="p-2 w-1/2">
      <Button
        className="text-[#671FAB] w-full bg-white hover:bg-white border-1 border-[#671FAB] rounded-full font-semibold md:text-start text-center cursor-pointer"
        onClick={() => cancel()}
      >
        ยกเลิก
      </Button>
    </div>
    <div className="p-2 w-1/2">
      <Button className="pea-button w-full" onClick={() => submit()}>
        บันทึก
      </Button>
    </div>
  </div>
)

export default ModalPeaOrganize;
