/* 23/11: notificaciones Web Push del Registro (recordatorio a los 30 min de la consulta). Lo carga el service worker
   de vite-plugin-pwa con importScripts (vite.config.web.ts). El contenido llega cifrado y sólo trae Nº de orden y lo que
   falta (nunca nombre ni documento): {titulo, cuerpo, url}. Tocar la notificación abre la app en esa ficha. */
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { cuerpo: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Registro Neurovascular', {
    body: d.cuerpo || '', icon: 'icono-192.png', badge: 'icono-192.png', tag: d.url || 'rnv',
    renotify: true, requireInteraction: true, data: { url: d.url || '' } }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const destino = new URL('./' + ((e.notification.data && e.notification.data.url) || ''), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(L => {
    for (const c of L) if (c.url.startsWith(self.registration.scope)) { c.postMessage({ rnv: 'abrir', url: destino }); return c.focus(); }
    return self.clients.openWindow(destino);
  }));
});
