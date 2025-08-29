"use client";
import Image from "next/image";
import WOMLogo from "@/assets/images/logo_wom.png";
import ThaiDLogo from "@/assets/images/thai_d_auth.png";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "@/app/helpers/Alert";
import { LoginApi } from "@/app/api/LoginApi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hook";
import { setToken } from "@/app/redux/slices/AuthSlice";
import { setUserProfile } from "@/app/redux/slices/UserSlice";

type UserType = "PEA" | "VENDOR";

interface AuthTypeButtonProps {
  label: string;
  userTypeSelected: UserType;
  onClick: (value: UserType) => void;
  authType: UserType;
}

const AuthTypeButton: React.FC<AuthTypeButtonProps> = ({
  label,
  userTypeSelected,
  onClick,
  authType,
}: AuthTypeButtonProps) => {
  const defaultClass = "py-[8] px-[12] w-1/2 rounded-4xl cursor-pointer";
  const activeClass = "bg-[#E1D2FF] text-[#671FAB]";

  return (
    <button
      className={`${defaultClass} ${
        userTypeSelected === authType && activeClass
      }`}
      onClick={() => onClick(authType)}
    >
      {label}
    </button>
  );
};

const Login = () => {
  const [userType, setUserType] = useState<"PEA" | "VENDOR">("PEA");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authenticate = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (authenticate) {
      router.push("/work_order");
    }
  }, []);

  const authenticKeycloak = () => {
    const KEYCLOAK_CLIENT_ID =
      window.__ENV__?.NEXT_PUBLIC_KEY_CLOAK_CLIENT_ID || "";
    const KEYCLOAK_REDIRECT_URI =
      window.__ENV__?.NEXT_PUBLIC_KEYCLOAK_REDIRECT_URI || "";

    if (!KEYCLOAK_CLIENT_ID) {
      console.error("❌ KEYCLOAK_CLIENT_ID is empty!");
      alert(
        "Keycloak Client ID is not configured. Check environment variables."
      );
      return;
    }

    if (!KEYCLOAK_REDIRECT_URI) {
      console.error("❌ KEYCLOAK_REDIRECT_URI is empty!");
      alert(
        "Keycloak Redirect URI is not configured. Check environment variables."
      );
      return;
    }
    const params = new URLSearchParams({
      client_id: KEYCLOAK_CLIENT_ID,
      redirect_uri: KEYCLOAK_REDIRECT_URI,
      response_type: "code",
      scope: "openid",
    });

    const authUrl =
      "https://sso2.pea.co.th/realms/pea-users/protocol/openid-connect/auth?" +
      params.toString();
    const popupWidth = 400;
    const popupHeight = 450;
    const left = screen.width / 2 - popupWidth / 2;
    const top = screen.height / 2 - popupHeight / 2;
    const isMobile = /iPhone|iPad|iPod/.test(navigator.userAgent);
    let popupWindow: Window | null = null;

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popupWindow?.closed) {
        clearInterval(checkClosed);
      }
    }, 1000);

    const handleMessage = async (event: MessageEvent) => {
      if (!event.origin.includes(window.location.origin)) return;
      const { code } = event.data;

      // Clean up
      clearInterval(checkClosed);
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }

      if (code) {
        LoginApi(code)
          .then((res) => {
            if (res.data?.status_code === 200 && res.data.data) {
              dispatch(setToken(res.data.data.api_token));
              dispatch(setUserProfile(res.data.data.user));
              router.push("/work_order");
              showSuccess("เข้าสู่ระบบสำเร็จ");
            } else {
              console.error("Login response error:", res.data);
              showError(
                "เข้าสู่ระบบไม่สำเร็จ: " +
                (res.data?.message || "Unknown error")
              );
            }
          })
          .catch((error) => {
            console.error("Login API error:", error);
            showError("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
          });
      } else {
        showError("เข้าสู่ระบบไม่สำเร็จ");
      }
    };

    if(isMobile) {
      window.location.href = authUrl
    }else {
      popupWindow = window.open(
        authUrl,
        "keycloak_login",
        `width=${popupWidth}, height=${popupHeight}, top=${top}, left=${left}, scrollbars=yes, resizable=yes`
      );

      window.addEventListener("message", handleMessage, { once: true });
    }
  };

  return (
    <div className="flex flex-wrap h-screen">
      <div className="w-full xl:w-1/2 h-[45%] xl:h-full">
        <Image
          src={WOMLogo}
          alt="WOM logo login"
          className="w-full h-full xl:p-3 object-cover rounded-bl-[100px] rounded-br-[100px] xl:rounded-0"
          priority={true}
        />
      </div>

      {/*<div className="w-full md:w-1/2 h-[390px] md:h-full bg-center bg-no-repeat bg-cover rounded-4xl"
           style={{backgroundImage: `url(${WOMLogo.src})`}}>
      </div>*/}

      <div className="w-full xl:w-1/2 h-1/2 xl:h-full flex flex-col items-center justify-center">
        <div className="w-4.8/5 md:w-4.5/5 xl:w-3/5 text-center">
          <div className="font-bold text-[24px]">
            ระบบ Work Order Management
          </div>

          <div className="bg-[#F8F8F8] text-[#4A4A4A] rounded-4xl my-6 p-1 font-semibold w-full">
            <AuthTypeButton
              label="พนักงาน กฟภ."
              userTypeSelected={userType}
              onClick={() => setUserType("PEA")}
              authType="PEA"
            />
            <AuthTypeButton
              label="พนักงานรับจ้าง"
              userTypeSelected={userType}
              onClick={() => setUserType("VENDOR")}
              authType="VENDOR"
            />
          </div>

          <button
            className="pea-button font-bold mt-9 mb-21 w-[100%] !py-[12] cursor-pointer"
            onClick={() => authenticKeycloak()}
          >
            เข้าสู่ระบบด้วย Keycloak
          </button>

          <div className="text-[#45058E]">Or continue with</div>

          <div className="flex justify-center mt-7 cursor-pointer">
            <Image
              src={ThaiDLogo}
              alt="thai d logo for authenticate"
              className="w-[65] h-[65]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
