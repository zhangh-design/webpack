/* eslint-disable no-unused-vars */
// import _ from 'lodash'
// import $ from 'jquery'

// url-loader
import avatar from './2.png';
// css文件
// import './a.scss';
import style from './a.scss'

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add(style.avatar);

var root = document.getElementById('app');
root.append(img);
