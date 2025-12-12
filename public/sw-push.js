// Push Notification Handler for Service Worker
// v1.7.12 - WOM Frontend

self.addEventListener('push', function(event) {
  console.log('[SW] Push received:', event);
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'แจ้งเตือน', body: event.data.text() };
    }
  }

  const title = data.title || 'WOM Notification';
  const options = {
    body: data.body || data.message || 'คุณมีการแจ้งเตือนใหม่',
    icon: '/icon-wom-192x192.png',
    badge: '/icon-wom-192x192.png',
    data: {
      url: data.url || '/',
      workOrderNo: data.workOrderNo,
      notificationId: data.notificationId,
      type: data.type
    },
    tag: data.tag || 'wom-notification',
    requireInteraction: false,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event.notification.data);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

self.addEventListener('notificationclose', function(event) {
  console.log('[SW] Notification closed:', event.notification.tag);
});
