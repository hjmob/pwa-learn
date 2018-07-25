let cacheName = 'cache-version-187';
let isSaveHtml = false;//是否保存html

//用于判断用户第一次注册service worker,不提示更新
let isFirstServiceWorker = true;
let version = 37;

let cacheSource = [
  `/javascripts/test.js?v=${version}`,
  `/images/huoying.jpg?v=${version}`,
  `/stylesheets/style.css?v=${version}`
]

//安装阶段跳过等待，直接进入 active
self.addEventListener('install', function(event) {
      let p = Promise.all([// 清理旧版本
        caches.keys().then(function (cacheList) {
            return Promise.all(
                cacheList.map(function (cName) {
                    isFirstServiceWorker = false;
                    if (cName !== cacheName) {
                        return caches.delete(cName);
                    }
                })
            );
        }),
        caches.open(cacheName).then(cache => cache.addAll(cacheSource))
    ]);
    p.then(()=>{
      self.skipWaiting()
    })

    event.waitUntil(p);
});

self.addEventListener('activate', event => {
  let p = self.clients.claim();
  if( ! isFirstServiceWorker ){
    p.then(()=>{
      //向主进程发送消息，提醒用户更新
      self.clients.matchAll().then(clientList => {
          clientList.forEach(client => {
              //client.postMessage('reload');
          })
      });
    })
  }

  event.waitUntil(p);

});

//监听fetch请求事件，除 sw.js 请求不监听外，其他资源都会被监听
self.addEventListener('fetch', function(event) {
  //可以看到哪些东西会触发fetch事件
  console.log("请求地址:",event.request.url)

  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      if (response) {
        return response;
      }

      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        function(fetchResponse) {
          if(!fetchResponse || fetchResponse.status !== 200) {
            return fetchResponse;
          }

          var responseToCache = fetchResponse.clone();

          if( isSaveHtml ){
            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
          }else{//不保存html
            if( checkFileExt( responseToCache.url ) ){
              caches.open(cacheName)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
            }
          }

          return fetchResponse;
        }
      );
    })
  );
});

//检测文件后缀名是否在白名单中
function checkFileExt(filename){
   var flag = false; //状态
   var arr = ["jpg","png","gif",'css','js',"webp","woff"];
   //取出上传文件的扩展名
   var index = filename.lastIndexOf(".");
   var ext = filename.substr( index + 1 );

   for( var i = 0; i < arr.length; i++ ){
     if( ext.indexOf(arr[i]) > 0 ){
      flag = true;
      break;
     }
   }
   return flag;
}
