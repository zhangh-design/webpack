// import '@babel/polyfill'; // 也可以在 entry 打包出配置（单独使用 import 引入 Babel官方不推荐）

/* import 'core-js/stable';
import 'regenerator-runtime/runtime'; */

// eslint-disable-next-line no-unused-vars
const arr = [
  new Promise(() => {
    console.info('done-1');
  }),
  new Promise(() => {
    console.info('done-2');
  })
];

arr.map((item, index) => {
  console.info(index);
});
