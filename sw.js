// Keeps the app working offline: the app files are cached on install, book covers and fonts as they are used.
const VERSION = "planner-v3";
const APP = ["./", "index.html", "ai.bundle.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(APP)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Never cache API calls or book search results.
  if (url.hostname === "api.anthropic.com" || url.pathname.endsWith("/search.json")) return;
  const sameOrigin = url.origin === self.location.origin;
  if (sameOrigin && (req.mode === "navigate" || APP.some((p) => url.pathname.endsWith(p.replace("./", "/"))))) {
    // App files: use the network when online so updates arrive, fall back to the cache offline.
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })
      .catch(() => caches.match(req).then((r) => r || caches.match("index.html"))));
    return;
  }
  if (url.hostname === "covers.openlibrary.org" || url.hostname.endsWith("gstatic.com") || url.hostname === "fonts.googleapis.com") {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); return res; })));
  }
});
