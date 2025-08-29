'use client';
import {useEffect} from 'react';
import {checkMaintenanceModeApi} from "@/app/api/MaintenanceApi";
import {useRouter} from "next/navigation";
import {Maintenance} from "@/types";
import {useAppSelector} from "@/app/redux/hook";
import {dismissAlert, showProgress} from "@/app/helpers/Alert";

const ClientWrapper = () => {
  const router = useRouter();
  const authenticate = useAppSelector((state) => state.auth.token);

  const authRedirect = () => {
    if(!authenticate) {
      router.push('/login');
    }

    setTimeout(()=>{
      dismissAlert()
    }, 1800)
  }

  /*async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
  }*/

  useEffect(() => {
    const code_keycloak = localStorage.getItem("oauth_code");
    if(code_keycloak) {
      localStorage.removeItem("oauth_code");
    }

    if ('serviceWorker' in navigator) {
      // registerServiceWorker()
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service Worker is registered', registration);
      }).catch((error) => {
        console.log('Service Worker registration failed', error);
      });
    }

    console.log('navigator.onLine >>>> ', navigator.onLine)
    if(navigator.onLine) {
      showProgress()
      checkMaintenanceModeApi().then(res => {
        try {
          const data = res.data.data || {} as Maintenance;
          if (res.data.status_code === 200 && data.key === 'maintenance_mode' && data.value == 'true') {
            router.push('/maintenance_mode');
            setTimeout(()=>{
              dismissAlert()
            }, 3000)
          } else {
            authRedirect()
          }
        } catch (err) {
          authRedirect()
          console.log('err >>>>', err)
          setTimeout(()=>{
            dismissAlert()
          }, 3000)
        }
      })
    }else {
      router.push('/');
    }
  }, []);

  return null;
}

export default ClientWrapper;
