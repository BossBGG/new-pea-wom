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
  }

  /*async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
      updateViaCache: 'none',
    })
  }*/

  useEffect(() => {
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
            clearAlert()
          } else {
            authRedirect()
            clearAlert()
          }
        } catch (err) {
          authRedirect()
          console.log('err >>>>', err)
          clearAlert()
        }
      })
    }else {
      router.push('/');
    }
  }, []);

  return null;
}

const clearAlert = () => {
  setTimeout(()=>{
    dismissAlert()
  }, 3000)
}

export default ClientWrapper;
