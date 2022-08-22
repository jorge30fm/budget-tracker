const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
	// "./../server.js",
	"./index.html",
	"./css/styles.css",
	"./js/idb.js",
	"./js/index.js",
	//"../models/transaction.js",
];
self.addEventListener("install", function (event) {
	event.waitUntil(
		//open cache, find every file in array
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

//activate service worker
self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then(function (keyList) {
			let cacheKeepList = keyList.filter(function (key) {
				return key.indexOf(APP_PREFIX);
			});
			cacheKeepList.push(CACHE_NAME);

			return Promise.all(
				keyList.map(function (key, i) {
					if (cacheKeepList.indexOf(key) === -1) {
						return caches.delete(keyList[i]);
					}
				})
			);
		})
	);
});
