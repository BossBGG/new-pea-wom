import {faSignature, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ChangeEvent, useState} from "react";
import {showConfirm} from "@/app/helpers/Alert";

const SignatureUpload = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    }

    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
    }
  }

  const deleteSignature = () => {
    showConfirm('ต้องการลบลายเซ็นอิเล็กทรอนิกส์นี้ใช่หรือไม่ ?').then(isConfirm => {
      if(isConfirm) {
        //TODO call api delete signature
      }
    })
  }

  return (
    <div className="relative">
      <label htmlFor="upload-signature"
             className="cursor-pointer border-1 z-1 border-[#D0BAE5] rounded-[20px] p-[30px] flex flex-col items-center justify-center relative">
        {
          selectedFile ?
            <div className="relative top-0 left-0 cursor-pointer w-[100%] h-[400]">
              <img src={selectedFile} alt="Preview" className="w-full h-full z-0 object-cover"/>
            </div>
            :
            <div className="flex flex-col items-center justify-center">
              <div className="w-[100] h-[100] bg-[#F4EEFF] rounded-[20px] flex items-center justify-center mb-4">
                <FontAwesomeIcon icon={faSignature} color="#671FAB" size="4x"/>
              </div>

              <div className="font-semibold mb-1">อัปโหลดลายเซ็นอิเล็กทรอนิกส์</div>
              <div className="text-[#4A4A4A] mb-1">รองรับสกุลไฟล์ .png หรือ .jpg ขนาดสูงสุด 10 MB</div>
              <div className="text-[#4A4A4A] font-semibold underline">อัปโหลดที่นี่</div>
            </div>
        }

        <input type="file" className="hidden absolute top-0 w-full h-full cursor-pointer"
               onChange={handleUpload}
               id="upload-signature"
               accept="image/png, image/jpeg"/>
      </label>

      {
        selectedFile &&
        <div className="right-[2.5rem] bottom-[1rem] cursor-pointer absolute z-10 w-[44] h-[44] bg-[#FFD4D4] rounded-[10] flex items-center justify-center"
             onClick={() => deleteSignature()}
        >
          <FontAwesomeIcon icon={faTrashCan} color={'#E02424'}/>
        </div>
      }
    </div>

  )
}

export default SignatureUpload;
