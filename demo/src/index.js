/* import gg from './g.js'

console.log(gg); */

import moment from 'moment'
// import 'moment/locale/zh-cn'
// 设置语言
moment.locale('zh-cn');
const r = moment().endOf('day').fromNow();
console.log(r);
