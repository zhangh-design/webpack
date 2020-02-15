// file-loader
import avatar from './avatar.jpg'
// vue-loader
import Header from './header.vue'
// css文件
import './index.css'

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('root');
root.append(img);

