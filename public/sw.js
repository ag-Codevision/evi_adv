// Service Worker desativado - EVI Advogados 2.0
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
