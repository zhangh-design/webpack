// import { add, minus } from './a.js'
// import _ from 'lodash'
/* import Vue from 'vue'
import VueX from 'vuex'
import VueRouter from 'vue-router' */
// import './a.scss'

// console.log(add, minus, Vue, VueX, VueRouter)

// import "core-js/modules/es.promise";
// import "core-js/modules/es.array.iterator";

// function getComponent() {
//   return import(/* webpackChunkName:"lodash" */ "lodash").then(({default : _}) => {
//       var element = document.createElement('div');
//       element.innerHTML = _.join(['hello','world'],'-');
//       return element;
//   });
// }

// getComponent().then(element=>{
//     document.body.appendChild(element)
// })

/* const promise = new Promise(function (resolve, reject) {
  // ... some code

  resolve('some code');
});
promise.then(val => console.log(val)) */
import axios from 'axios'
import $ from 'jquery'
import $1 from 'jq'
// file-loader
import avatar from './2.png'
// eslint-disable-next-line no-undef
console.info(axios, $('#app'), $1('#app'));
// css文件
var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('app');
// root.classList.add('abc');
// root.append(img);
$1(root).append(img);
