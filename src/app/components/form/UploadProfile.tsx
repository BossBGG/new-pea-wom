import ProfileImg from "@/assets/images/pea_profile.png"
import {ChangeEvent, useState} from "react";
import Image from "next/image";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil} from "@fortawesome/free-solid-svg-icons";

const UploadProfile = () => {
  const [profile, setProfile] = useState<string | null>(null);

  const handleUploadProfile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    }

    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfile(null);
    }
  }

  return (
    <div className="relative flex items-center justify-center">
      <label className="w-[160] h-[160] rounded-full border-6 border-[#D0BAE5] relative cursor-pointer overflow-hidden"
             htmlFor="upload-profile">
        {
          profile
            ? <div className="w-full h-full flex items-center justify-center">
              <img src={profile} alt="profile image" className="object-cover w-full h-full"/>
            </div>
            : <div>
              <Image src={ProfileImg} alt="profile image" className="object-cover w-full h-full"/>
            </div>
        }

        <input type="file" accept="image/png, image/jpeg"
               className="hidden absolute top-0 left-0 z-1"
               onChange={handleUploadProfile}
               id="upload-profile"/>
      </label>

      <div className="absolute right-[15] bottom-0 bg-[#D0BAE5] w-[32] h-[32] rounded-full flex items-center justify-center">
        <FontAwesomeIcon icon={faPencil} color="#671FAB"/>
      </div>
    </div>
  )
}

export default UploadProfile;
