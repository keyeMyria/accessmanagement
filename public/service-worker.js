"use strict";var precacheConfig=[["/public/assets/icons/icon_128x128.3daa4052825efedee69d85aaf3d46a22.png","3daa4052825efedee69d85aaf3d46a22"],["/public/assets/icons/icon_192x192.ed3dff52dfbcddc8c9914995056609de.png","ed3dff52dfbcddc8c9914995056609de"],["/public/assets/icons/icon_256x256.dd9cc1c9191a8bc233e7b870ecc82983.png","dd9cc1c9191a8bc233e7b870ecc82983"],["/public/assets/icons/icon_384x384.107ca7e251b0fba185070cbfc2954722.png","107ca7e251b0fba185070cbfc2954722"],["/public/assets/icons/icon_512x512.63a5d5c6a7eade7d8bf3f3bb9322b6e3.png","63a5d5c6a7eade7d8bf3f3bb9322b6e3"],["/public/assets/icons/icon_96x96.83f6c5d1d04c42fbd3ed073699468539.png","83f6c5d1d04c42fbd3ed073699468539"],["/public/css/main.css","5e91a4cb0e1b8613ade1ee4185c48228"],["/public/css/main.rtl.css","37cc1ffd2dfac4011d8401fc2fe496ef"],["/public/index.html","3486691ea81b8a321b2899a1d790228e"],["/public/manifest.1be5bc28f76a5ee2f4e1b7c40515adf8.json","1be5bc28f76a5ee2f4e1b7c40515adf8"]],cacheName="sw-precache-v3-my-domain-cache-id-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,n){var t=new URL(e);return"/"===t.pathname.slice(-1)&&(t.pathname+=n),t.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(n){return new Response(n,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,n,t,c){var r=new URL(e);return c&&r.pathname.match(c)||(r.search+=(r.search?"&":"")+encodeURIComponent(n)+"="+encodeURIComponent(t)),r.toString()},isPathWhitelisted=function(e,n){if(0===e.length)return!0;var t=new URL(n).pathname;return e.some(function(e){return t.match(e)})},stripIgnoredUrlParameters=function(e,n){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return n.every(function(n){return!n.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var n=e[0],t=e[1],c=new URL(n,self.location),r=createCacheKey(c,hashParamName,t,/\.\w{8}\./);return[c.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(n){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!n.has(t)){var c=new Request(t,{credentials:"same-origin"});return fetch(c).then(function(n){if(!n.ok)throw new Error("Request for "+t+" returned a response with status "+n.status);return cleanResponse(n).then(function(n){return e.put(t,n)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var n=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(t){return Promise.all(t.map(function(t){if(!n.has(t.url))return e.delete(t)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var n,t=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),c="index.html";(n=urlsToCacheKeys.has(t))||(t=addDirectoryIndex(t,c),n=urlsToCacheKeys.has(t));var r="http://localhost:8080/index.html";!n&&"navigate"===e.request.mode&&isPathWhitelisted([],e.request.url)&&(t=new URL(r,self.location).toString(),n=urlsToCacheKeys.has(t)),n&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(t)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(n){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,n),fetch(e.request)}))}});
