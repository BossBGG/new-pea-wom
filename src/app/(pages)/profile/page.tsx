"use client";
import ProfileBreadcrumb from "@/app/(pages)/profile/breadcrumb";
import React, { useEffect, useState } from "react";
import {
  dismissAlert,
  showError,
  showProgress,
  showSuccess,
} from "@/app/helpers/Alert";
import { User } from "@/types";
import ProfileDetail from "@/app/(pages)/profile/detail";
import SignatureTypeLayout from "@/app/(pages)/profile/signature_type_layout";
import SignatureUpload from "@/app/components/form/SignatureUpload";
import { useBreadcrumb } from "@/app/context/BreadcrumbContext";
import UploadProfile from "@/app/(pages)/profile/upload-profile";
import {
  deleteSignature,
  getProfile,
  uploadProfileApi,
  uploadSignatureApi,
} from "@/app/api/ProfileApi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setUserProfile } from "@/app/redux/slices/UserSlice";

const Profile = () => {
  type signatureType = "name" | "signature" | string;
  const { setBreadcrumb } = useBreadcrumb();
  const [profile, setProfile] = useState<User>({} as User);
  const userData: User = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  // const [profile, setProfile] = useState<PEAProfile>({} as PEAProfile);
  const [signatureTypeSelected, setSignatureSelectedType] =
    useState<signatureType>("name");

  useEffect(() => {
    setBreadcrumb(<ProfileBreadcrumb />);
    fetchUserProfile();
  }, [setBreadcrumb]);

  const fetchUserProfile = async () => {
    showProgress();
    await getProfile().then((res) => {
      const data = res.data.data || ({} as User);
      setSignatureSelectedType(data.signatureType || "name");
      setProfile(data);
      dispatch(setUserProfile(data));
      dismissAlert();
    });
  };

  const onUpload = async (file: File) => {
    showProgress();
    const formData = new FormData();
    formData.append("profileImage", file);
    await uploadProfileApi(userData.uuid, formData)
      .then((res) => {
        if (res.status === 201 && res.data.data) {
          showSuccess("อัปโหลดรูปโปรไฟล์สำเร็จ");
        }
      })
      .finally(() => {
        setTimeout(() => {
          fetchUserProfile();
        }, 1000);
      });
  };

  const onUploadSignature = async (file: File | string) => {
    showProgress();
    const formData = new FormData();
    formData.append("signatureImage", file);
    await uploadSignatureApi(userData.uuid, formData)
      .then((res) => {
        if (res.status === 201 && res.data.data) {
          showSuccess("อัปโหลดลายเซ็นอิเล็กทรอนิกส์สำเร็จ")
        }
      })
      .finally(() => {
        setTimeout(() => {
          fetchUserProfile();
        }, 1000);
      });
  };

  const onRemoveSignature = async () => {
    showProgress();
    await deleteSignature(userData.uuid)
      .then((res) => {
        if (res.status === 200) {
          showSuccess("ลบลายเซ็นอิเล็กทรอนิกส์สำเร็จ").then((res) => {
            fetchUserProfile();
          });
        } else {
          showError(res.data.message || "ลบลายเซ็นอิเล็กทรอนิกส์ไม่สำเร็จ");
        }
      })
      .finally(() => {
        setTimeout(() => {
          fetchUserProfile();
        }, 1000);
      });
  };

  return (
    <div className="">
      <div className="border-1 border-[#E1D2FF] rounded-[20px] p-[20px] flex flex-wrap">
        <div className="w-full mb-3 lg:mb-0 lg:w-1/2 pr-10">
          <div className="flex justify-center mb-3">
            <UploadProfile
              onUpload={onUpload}
              value={profile.profileImageUrl || null}
              fetchData={fetchUserProfile}
            />
          </div>

          <div className="text-center text-[#671FAB] font-bold text-[24px] mb-5">
            <div>{profile.employeeCode}</div>
            <div>
              {profile.prefix} {profile.firstName} {profile.lastName}
            </div>
          </div>

          <ProfileDetail label="รหัสพนักงาน" value={profile.username} />
          <ProfileDetail label="คำนำหน้าชื่อ" value={profile.prefix} />
          <ProfileDetail
            label="ชื่อ - สกุล"
            value={`${profile.firstName} ${profile.lastName}`}
          />
          <ProfileDetail label="ตำแหน่ง" value={profile.position} />
          <ProfileDetail label="สังกัด" value={profile.department} />
          <ProfileDetail label="เบอร์โทร" value={profile.phoneNumber} />
          <ProfileDetail label="อีเมล" value={profile.email} />
        </div>

        <div className="w-full lg:w-1/2 bg-[#F7EFFF] p-[20px] rounded-[20px]">
          <div className="font-bold text-[24px] text-center mb-3">
            ลายเซ็นอิเล็กทรอนิกส์
          </div>

          <div className="bg-white rounded-[20px] p-4">
            <div className="font-bold mb-3">เลือกรูปแบบลายเซ็น</div>

            <div className="flex flex-wrap text-[#671FAB] mb-5">
              <SignatureTypeLayout active={signatureTypeSelected === "name"}>
                <label htmlFor="signature_name_type" className="cursor-pointer">
                  <input
                    type="radio"
                    id="signature_name_type"
                    className="mr-2"
                    value={signatureTypeSelected}
                    checked={signatureTypeSelected === "name"}
                    onChange={() => setSignatureSelectedType("name")}
                  />
                  รูปแบบชื่อ-นามสกุล
                </label>
              </SignatureTypeLayout>

              <SignatureTypeLayout
                active={signatureTypeSelected === "signature"}
              >
                <label htmlFor="signature_file_type" className="cursor-pointer">
                  <input
                    type="radio"
                    id="signature_file_type"
                    className="mr-2"
                    value={signatureTypeSelected}
                    checked={signatureTypeSelected === "signature"}
                    onChange={() => setSignatureSelectedType("signature")}
                  />
                  ลายเซ็นอัปโหลด
                </label>
              </SignatureTypeLayout>
            </div>

            <div>
              <div className="font-bold mb-3">ตัวอย่าง</div>

              {signatureTypeSelected === "name" ? (
                <div className="border-1 border-[#D0BAE5] text-[20px] rounded-[12px] p-5 flex flex-col items-center justify-center">
                  <div className="text-[#1F2024] mb-3">
                    {profile.firstName} {profile.lastName}
                  </div>
                  <div className="text-[#A6A6A6]">{profile.position}</div>
                </div>
              ) : (
                <SignatureUpload
                  onUpload={onUploadSignature}
                  value={profile.signatureImageUrl}
                  onRemoveSign={onRemoveSignature}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
