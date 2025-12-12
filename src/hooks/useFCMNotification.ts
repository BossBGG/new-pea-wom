import { useState, useEffect, useCallback } from 'react';
import { NotificationStrategyFactory } from '@/services/notification/NotificationStrategyFactory';
import type { NotificationStrategy } from '@/types/NotificationStrategy';
import {useAppSelector} from "@/app/redux/hook";

export function useFCMNotification(onNewNotification?: () => void) {
  const [strategy, setStrategy] = useState<NotificationStrategy | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userToken = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    const initStrategy = async () => {
      try {
        console.log("[FCM] Initializing strategy...");
        const selectedStrategy = NotificationStrategyFactory.createStrategy();
        await selectedStrategy.initialize();
        console.log("[FCM] Strategy initialized:", selectedStrategy.getType());
        setStrategy(selectedStrategy);
      } catch (err) {
        console.error("[FCM] Init error:", err);
        setError(err instanceof Error ? err.message : "Failed to initialize");
      }
    };

    initStrategy();
  }, []);

  const subscribe = useCallback(
    async (userId: string, deviceId: string, deviceName?: string) => {
      if (!strategy) {
        setError("Strategy not initialized");
        return null;
      }

      try {
        const token = await strategy.subscribe((payload) => {
          console.log("[Notification] Received:", payload);

          // Show browser notification when app is in foreground
          if (Notification.permission === "granted") {
            try {
              const notification = new Notification(
                payload.notification?.title || "แจ้งเตือน",
                {
                  body: payload.notification?.body || "",
                  icon: "/favicon.ico",
                  data: payload.data,
                  requireInteraction: true,
                  tag: "wom-notification",
                }
              );

              notification.onclick = () => {
                window.focus();
                notification.close();
              };
            } catch (err) {
              console.error("[Notification] Error creating notification:", err);
            }
          }

          // Trigger refresh callback
          if (onNewNotification) {
            onNewNotification();
          }

          // Dispatch custom event for navbar
          window.dispatchEvent(new CustomEvent("notification-received"));
        });

        if (!token) {
          setError("Failed to get token");
          return null;
        }

      const baseUrl = window.__ENV__?.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:3333';
      const response = await fetch(`${baseUrl}/api/v1/push-notifications/fcm/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          userId,
          fcmToken: token,
          deviceId,
          deviceName,
          deviceType: 'web',
        }),
      });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("[FCM] Subscribe error:", response.status, errorData);

          if (
            response.status === 400 &&
            errorData.message?.includes("Token limit reached")
          ) {
            throw new Error("DEVICE_LIMIT_REACHED");
          }

          throw new Error(`Subscription failed: ${response.status}`);
        }

        localStorage.setItem("fcm_last_subscribe", Date.now().toString());
        setIsSubscribed(true);
        return token;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Subscription failed";
        setError(errorMsg);
        return null;
      }
    },
    [strategy]
  );

  // Auto-subscribe if permission granted
  useEffect(() => {
    const autoSubscribe = async () => {
      console.log("[FCM] Auto-subscribe check:", {
        permission: Notification.permission,
        hasStrategy: !!strategy,
      });

      if (Notification.permission !== "granted" || !strategy) {
        console.log(
          "[FCM] Skip auto-subscribe:",
          Notification.permission !== "granted"
            ? "permission not granted"
            : "no strategy"
        );
        return;
      }

      const lastSubscribe = localStorage.getItem("fcm_last_subscribe");
      const daysSince = lastSubscribe
        ? (Date.now() - parseInt(lastSubscribe)) / (1000 * 60 * 60 * 24)
        : 999;

      // Get userId from JWT token
      const authToken = localStorage.getItem("token");
      if (!authToken) return;

      try {
        const payload = JSON.parse(atob(authToken.split(".")[1]));
        const userId = payload.sub;
        const deviceId = `web_${navigator.userAgent.substring(0, 50)}`;

        if (!userId) return;

        // Always setup callback on page load
        console.log(
          "[FCM] Setting up callback (days since subscribe:",
          daysSince.toFixed(2),
          ")"
        );
        await subscribe(userId, deviceId);
      } catch (err) {
        console.error("[FCM] Auto-subscribe error:", err);
      }
    };

    if (strategy) {
      autoSubscribe();
    }
  }, [strategy, subscribe, onNewNotification]);

  const unsubscribe = useCallback(async () => {
    if (!strategy) return;

    try {
      await strategy.unsubscribe();
      setIsSubscribed(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unsubscribe failed");
    }
  }, [strategy]);

  return {
    strategy,
    isSubscribed,
    error,
    subscribe,
    unsubscribe,
    strategyType: strategy?.getType(),
  };
}
