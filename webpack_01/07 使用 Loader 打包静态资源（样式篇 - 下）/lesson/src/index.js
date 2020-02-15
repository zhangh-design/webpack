// file-loader
import avatar from './avatar.jpg'
// css文件
import './index.scss'

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('root');
// root.classList.add('abc');
root.append(img);

