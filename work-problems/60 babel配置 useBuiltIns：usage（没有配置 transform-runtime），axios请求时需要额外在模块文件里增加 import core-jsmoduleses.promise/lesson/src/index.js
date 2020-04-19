// import '@babel/polyfill';
// import _join from "lodash/join";
import axios from "axios";
// window.Promise = Promise; // 通过 entry 入口配置
// import "core-js/modules/es.promise";

/* function component() {
  const element = document.createElement("div");
  element.innerHTML = _join(["Hello", "webpack"], " ");

  return element;
}

document.body.appendChild(component());
 */
axios.get("/react/api/header.json").then(res => {
  console.log(res);
});

/* const bbb = new Promise(function(resolve, reject) {
  if (true){
    console.log('1111111111111111111');
    resolve();
  } else {
    reject();
  }
}); */

/* const getData = () => {
  axios.get("/react/api/header.json").then(res => {
    console.log(res);
  });
  const promise = new Promise(function(resolve, reject) {
    if (true){
      console.log('1111111111111111111');
      resolve();
    } else {
      reject();
    }
  });
}; */

// getData();

/* setTimeout(() => {
  getData();
}, 1000); */

/***** 测试动态导入 需要 iterator和Promise 都需要手动在导入 *****/

// function getComponent() {
//   // return "111";
//   // return import("lodash")
// return import("lodash").then(() => {
//   console.log("success");
//   var element = document.createElement("div");
//   element.innerHTML = _.join(["hello", "world"], "-");
//   return element;
// });
//   /* return new Promise((resolve)=>{
//     var element = document.createElement("div");
//     element.innerHTML = _.join(["hello", "world"], "-");
//     resolve(element)
//   }); */
// }
// // getComponent()
// getComponent().then(element => {
//   document.body.appendChild(element)
// //   console.log(element);
// });

