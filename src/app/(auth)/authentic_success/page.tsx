'use client'
import {useEffect} from "react";

const AuthenTicSuccess = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const targetOrigin = window.location.origin;

    if(code) {
      try {
        if(window.opener) {
          //popup (desktop)
          window.opener.postMessage({ code }, targetOrigin);
          window.close()
        }else {
          //mobile or tablet
          localStorage.setItem("oauth_code", code)
          window.location.href = targetOrigin;
        }
      }catch (e) {
        console.error("Auth callback error:", e);
      }
    }
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full absolute">
      <h1 className="font-bold">เข้าสู่ระบบสำเร็จ</h1>
    </div>
  )
}


export default AuthenTicSuccess;
