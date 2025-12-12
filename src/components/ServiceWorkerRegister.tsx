'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Disabled: FCM uses firebase-messaging-sw.js instead
    // sw.js conflicts with FCM service worker
  }, [])

  return null
}
