// 同步
import _ from 'lodash';
import $ from 'jquery';

const dom = $('<div>')
dom.html(_.join(['hello','world'], ' --- '));
$('body').append(dom);

// 异步
// function getComponent() {
//   // return import("lodash").then()
//   return import(/* webpackChunkName:"lodash" */ "lodash")
//     .then(({ default: _ }) => {
//       console.log("success");
//       var element = document.createElement("div");
//       element.innerHTML = _.join(["hello", "world"], "-");
//       return element;
//     })
//     .catch(error => {
//       console.log("error");
//     });
//     /* return new Promise((resolve)=>{
//       var element = document.createElement("div");
//       element.innerHTML = _.join(["hello", "world"], "-");
//       resolve(element)
//     }); */
// }

/* getComponent().then(element => {
  document.body.appendChild(element);
}); */

/* document.addEventListener("click", ()=>{
  getComponent().then(element => {
    document.body.appendChild(element);
  });
}); */

// document.addEventListener("click", () => {
// /*   var element = document.createElement("div");
//   element.innerHTML = "hello-world";
//   document.body.appendChild(element); */
//   import(/* webpackPrefetch: true */ './click.js').then(({default: _})=>{
//     _();
//   })
// });
