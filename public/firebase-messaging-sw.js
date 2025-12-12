importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js"
);
importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/7.0.0/workbox-sw.js"
);

// Load environment config
let firebaseConfig = {
  apiKey: "AIzaSyCbG9WWJdojOpMJD1Qx5Lvm2UHjUVYODCQ",
  authDomain: "pea-wom-dev.firebaseapp.com",
  projectId: "pea-wom-dev",
  storageBucket: "pea-wom-dev.firebasestorage.app",
  messagingSenderId: "226186087770",
  appId: "1:226186087770:web:16fdc0e3efa08c5575b763",
};

// Try to load config from env-config.js if available
try {
  importScripts("/env-config.js");
  if (self.__ENV) {
    firebaseConfig = {
      apiKey: self.__ENV.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey,
      authDomain:
        self.__ENV.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
        firebaseConfig.authDomain,
      projectId:
        self.__ENV.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
      storageBucket:
        self.__ENV.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
        firebaseConfig.storageBucket,
      messagingSenderId:
        self.__ENV.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
        firebaseConfig.messagingSenderId,
      appId: self.__ENV.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId,
    };
  }
} catch (e) {
  console.log("[SW] Using default Firebase config");
}

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Firebase Cloud Messaging
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "WOM Notification";
  const notificationOptions = {
    body: payload.notification?.body || "คุณมีการแจ้งเตือนใหม่",
    icon: "/icon-wom-192x192.png",
    badge: "/icon-wom-192x192.png",
    data: {
      url: payload.data?.url || "/",
      workOrderNo: payload.data?.workOrderNo,
      notificationId: payload.data?.notificationId,
      type: payload.data?.type,
      ...payload.data,
    },
    tag: payload.data?.tag || "wom-notification",
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Push Notification Handler
self.addEventListener("push", function (event) {
  console.log("[SW] Push received:", event);
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "แจ้งเตือน", body: event.data.text() };
    }
  }
  const title = data.title || "WOM Notification";
  const options = {
    body: data.body || data.message || "คุณมีการแจ้งเตือนใหม่",
    icon: "/icon-wom-192x192.png",
    badge: "/icon-wom-192x192.png",
    data: {
      url: data.url || "/",
      workOrderNo: data.workOrderNo,
      notificationId: data.notificationId,
      type: data.type,
    },
    tag: data.tag || "wom-notification",
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification Click Handler
self.addEventListener("notificationclick", function (event) {
  console.log("[SW] Notification clicked:", event.notification.data);
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "/";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Notification Close Handler
self.addEventListener("notificationclose", function (event) {
  console.log("[SW] Notification closed:", event.notification.tag);
});

// Workbox PWA Configuration
if (workbox) {
  console.log("Workbox loaded successfully");

  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  // Precache static files
  // workbox.precaching.precacheAndRoute([
  //   { url: "/manifest.json", revision: "1" },
  //   { url: "/icon-wom-192x192.png", revision: "1" },
  //   { url: "/icon-wom-512x512.png", revision: "1" },
  //   { url: "/offline", revision: "1" },
  // ]);

  // Cache strategies
  workbox.routing.registerRoute(
    /\/_next\/static.+\.js$/i,
    new workbox.strategies.CacheFirst({
      cacheName: "next-static-js-assets",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 86400,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-image-assets",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 64,
          maxAgeSeconds: 2592000,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    /\.(?:css|less)$/i,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: "static-style-assets",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 86400,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ sameOrigin, url }) => sameOrigin && url.pathname.startsWith("/api/"),
    new workbox.strategies.NetworkFirst({
      cacheName: "apis",
      networkTimeoutSeconds: 10,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 16,
          maxAgeSeconds: 86400,
        }),
      ],
    })
  );

  workbox.routing.registerRoute(
    ({ sameOrigin, url }) => sameOrigin && !url.pathname.startsWith("/api/"),
    new workbox.strategies.NetworkFirst({
      cacheName: "pages",
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 32,
          maxAgeSeconds: 86400,
        }),
      ],
    })
  );
} else {
  console.log("Workbox failed to load");
}
