/* Sattvic Kitchen service worker.
 * Bump VERSION whenever you deploy changes so old caches are cleared. */
const VERSION = "v1";
const SHELL = `sk-shell-${VERSION}`;
const FONTS = `sk-fonts-${VERSION}`;
const PHOTOS = `sk-photos-${VERSION}`;
const MAX_PHOTOS = 400;

const SHELL_FILES = [
  "./",
  "index.html",
  "css/styles.css",
  "js/data.js",
  "js/app.js",
  "manifest.json",
  "images/icons/icon-192.png",
  "images/icons/icon-512.png",
  "images/d30-dinner-veg-laksa.jpg",
  "images/i34-mapo-tofu.jpg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  const keep = [SHELL, FONTS, PHOTOS];
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

// App files: network first (always fresh when online), cache when offline.
async function networkFirst(req) {
  const cache = await caches.open(SHELL);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req, { ignoreSearch: true })) ||
      (req.mode === "navigate" ? cache.match("index.html") : Response.error());
  }
}

// Google Fonts: serve cached copy, refresh in background.
async function staleWhileRevalidate(req) {
  const cache = await caches.open(FONTS);
  const cached = await cache.match(req);
  const fresh = fetch(req).then((res) => {
    if (res.ok || res.type === "opaque") cache.put(req, res.clone());
    return res;
  }).catch(() => cached);
  return cached || fresh;
}

// Recipe photos (Wikimedia/Unsplash): cache first. Fetch with CORS so the
// cached entry is a real (non-opaque) response and doesn't bloat storage.
async function photoCacheFirst(req) {
  const cache = await caches.open(PHOTOS);
  const cached = await cache.match(req.url);
  if (cached) return cached;
  try {
    const res = await fetch(req.url, { mode: "cors", credentials: "omit" });
    if (res.ok) {
      await cache.put(req.url, res.clone());
      trim(PHOTOS, MAX_PHOTOS);
    }
    return res;
  } catch {
    try { return await fetch(req); } catch { return Response.error(); } // app shows emoji fallback
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    e.respondWith(networkFirst(req));
  } else if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(staleWhileRevalidate(req));
  } else if (req.destination === "image" && /(^|\.)(wikimedia\.org|unsplash\.com)$/.test(url.hostname)) {
    e.respondWith(photoCacheFirst(req));
  }
});
