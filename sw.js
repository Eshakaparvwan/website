const cacheName = "WWW_TECHSOC_MSIT_V1";
const cacheAssests = [
  "/offline.html",
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
    caches.match(e.request).then((cachedRes) => {
      if (cachedRes) {
        console.log("Page found in Cache");
        return cachedRes;
      }

      return fetch(e.request)
        .then((fetchRes) => fetchRes)
        .catch((err) => {
          const isHTMLPage =
            e.request.headers.get("accept").includes("text/html") &&
            e.request.method == "GET";

          if (isHTMLPage) return caches.match("/offline.html");
        });
    })
  );
});
