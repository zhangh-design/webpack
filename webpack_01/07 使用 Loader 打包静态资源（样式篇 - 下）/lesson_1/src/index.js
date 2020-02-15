// file-loader
import avatar from './avatar.jpg'
// css文件
// import './index.scss'
import style from './index.scss'
// js
import createAvatar from './createAvatar.js'

createAvatar();

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
// img.classList.add('avatar');
img.classList.add(style.avatar);

var root = document.getElementById('root');
root.append(img);
