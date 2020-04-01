(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],{

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(52);
__webpack_require__(80);
module.exports = __webpack_require__(90);


/***/ }),

/***/ 90:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(91);
/* harmony import */ var core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(50);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(27);
/* harmony import */ var jquery__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(jquery__WEBPACK_IMPORTED_MODULE_2__);

// 同步


var dom = jquery__WEBPACK_IMPORTED_MODULE_2___default()('<div>');
dom.html(lodash__WEBPACK_IMPORTED_MODULE_1___default.a.join(['hello', 'world'], ' --- '));
jquery__WEBPACK_IMPORTED_MODULE_2___default()('body').append(dom); // 异步
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

/***/ })

},[[51,1,2]]]);