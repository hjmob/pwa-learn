var version = new Date().getTime();

//兼容性检测
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.register('/sw.js?v=' + version,{
    scope:'/'
  })
  .then(function(registration) {
    console.log('作用域是：', registration.scope);
  }).catch(function(err) {
    console.log('错误： ', err);
  });
}

//上线事件
window.addEventListener('online', function() {
    alert("上线了")
});

//下线事件
window.addEventListener('offline', function() {
  alert("网络不给力")
});
