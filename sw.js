const CACHE_NAME = "dota2-coach-audio-v1";

const AUDIO_ASSETS = [
  "assets/按 control 加 f1 编队.wav",
  "assets/中路买假眼.wav",
  "assets/中路神符快要刷新.wav",
  "assets/中路神符已经刷新.wav",
  "assets/中路六分钟神符马上刷新。.wav",
  "assets/准备拉野。.wav",
  "assets/准备拉野！中路六分钟神符马上刷新。.wav",
  "assets/莲花马上刷新.wav",
  "assets/莲花已经刷新.wav",
  "assets/经验符马上刷新，请注意！.wav",
  "assets/经验符已经刷新.wav",
  "assets/赏金符快刷新.wav",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(AUDIO_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("dota2-coach-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== location.origin) {
    return;
  }

  const assetPath = decodeURIComponent(url.pathname.split("/").pop() || "");
  const isAudioAsset = AUDIO_ASSETS.some((asset) => asset.endsWith(assetPath));
  if (!isAudioAsset) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    }),
  );
});
