const APP_PREFIX = "BudgetTracker-";
const VERSION = "version_01";
const CACHE_NAME = APP_PREFIX + VERSION;
const FILES_TO_CACHE = [
        "./server.js",
        "./routes/api.js",
        "./public/index.html",
        "./public/css/styles.css",
        "./public/js/idb.js",
        "./public/js/index.js",
        "./models/transactions.js"
];
self.addEventListener('install', function(event){
        event.waitUntil(
                //open cache, find every file in array
                caches.open(CACHE_NAME).then(function(cache){
                        return cache.addAll(FILES_TO_CHANGE)
                })
        )
})