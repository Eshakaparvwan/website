const cacheName = "WWW_TECHSOC_MSIT_V1";
const cacheAssests = [
  "offline.html",
  "/js/offline.js",
  "/js/hammer.min.js",
  "/css/offline.css",
];

self.addEventListener("install", (e) => {
  console.log("Installed Service Workers");

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Caching Offline Files");
        cache.addAll(cacheAssests);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  console.log("Activated Service Workers");

  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache != cacheName) {
            console.log("Clearing Old Cache");
            caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (e) => {
  console.log("Fetching from Cache");
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        console.log(res);
        if (res.status >= 400) {
          res.url = "http://127.0.0.1:5500/offline.html";
        }

        return res;
      })
      .catch((res) => {
        console.log("from cache", res);
        return caches.match(e.request);
      })
  );
});
