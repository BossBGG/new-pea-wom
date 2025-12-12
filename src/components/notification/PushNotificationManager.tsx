'use client'
import { useFCMNotification } from '@/hooks/useFCMNotification'

export function PushNotificationManager() {
  // Initialize FCM - auto-subscribe logic is in the hook
  useFCMNotification()
  
  return null
}
