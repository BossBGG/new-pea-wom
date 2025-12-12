import type { NotificationStrategy } from '@/types/NotificationStrategy';
import { FCMStrategy } from './FCMStrategy';
import { APNsStrategy } from './APNsStrategy';
import { PollingStrategy } from './PollingStrategy';

export class NotificationStrategyFactory {
  static createStrategy(): NotificationStrategy {
    const isIOSSafari = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                        /Safari/.test(navigator.userAgent) && 
                        !/CriOS|FxiOS/.test(navigator.userAgent);
    
    const isMacSafari = /Macintosh/.test(navigator.userAgent) &&
                        /Safari/.test(navigator.userAgent) &&
                        !/Chrome|Chromium|Edg/.test(navigator.userAgent);
    
    const supportsPush = typeof window !== 'undefined' &&
                         'Notification' in window && 
                         'serviceWorker' in navigator;
    
    if (isIOSSafari || !supportsPush) {
      console.log('[Strategy] Using Polling (iOS Safari or no push support)');
      return new PollingStrategy();
    }
    
    if (isMacSafari) {
      console.log('[Strategy] Using APNs (macOS Safari)');
      return new APNsStrategy();
    }
    
    console.log('[Strategy] Using FCM');
    return new FCMStrategy();
  }
}
