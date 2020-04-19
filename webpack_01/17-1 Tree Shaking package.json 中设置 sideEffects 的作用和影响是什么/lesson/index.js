/* eslint-disable no-unused-vars */
// import _ from 'lodash'
// import $ from 'jquery'

// import './a.js'

import { add } from "./a.js";
// console.log(add(1, 2))
// import { add } from "./a.js";
add(1, 2);
// url-loader
import avatar from "./2.png";
// css文件
import "./a.scss";

setTimeout(() => {
  console.log(Array.prototype.hello);
}, 2000);

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add("avatar");

var root = document.getElementById("app");
root.append(img);
