// file-loader
import avatar from './avatar.jpg'
import style from './index.scss'

function createAvatar(){
    var img = new Image(); // 插件一个 image标签
    img.src = avatar; // 让它的src属性赋值为avatar
    // img.classList.add('avatar');
    img.classList.add(style.avatar);

    var root = document.getElementById('root');
    root.append(img);
}

export default createAvatar
