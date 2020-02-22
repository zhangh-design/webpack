/* import './style.css'

var btn = document.createElement('button')
btn.innerHTML = '新增'
document.body.appendChild(btn)
btn.onclick = function(){
    var div = document.createElement('div');
    div.innerHTML = 'item'
    document.body.appendChild(div)
}
 */

import counter from './counter.js'
import number from './number.js'

// 执行一次 counter()
counter();
// 执行一次 number()
number()

if(module.hot){
    // 如果 number.js这个文件发生了变化，那么我就会执行后面的函数
    module.hot.accept('./number',() => {
        document.body.removeChild(document.getElementById('number'));
        // 让 number() 重新执行一次
        number()
    })
}