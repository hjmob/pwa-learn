var title = document.getElementById("title");
title.innerHTML = "火影忍者";

//获取用户名
var btn = document.getElementById("btn");
btn.onclick = function getUserName(){
  fetch('/getUserName')
  .then((res)=>{
    return res.json();
  })
  .then((res)=>{
    console.log(res.status)
    if( res.status == 0 ){
      title.innerHTML = res.userName;
    }
  })
}
