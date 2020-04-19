babel配置 "useBuiltIns": "usage"（没有配置 transform-runtime），axios请求时需要额外在模块文件里增加 import "core-jsmoduleses.promise"或者 window.Promise = Promise

**项目结构：**

```
src
 |-index.js
.babelrc
.browserslistrc
package.json
index.html
postcss.config.js
webpack.config.js
```

.babelrc

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        // 这个 corejs 一定要配置，Babel在7.4.0以后需要安装corejs这个核心库
        "corejs": {
          "version": 3
        },
        "targets": {
          "chrome": "67",
          "ie": "11"
        }
      }
    ]
  ]
}

```

index.js

```
import axios from "axios";
// window.Promise = Promise;  // 和下面一个任选一个
// import "core-js/modules/es.promise";

axios.get("/react/api/header.json").then(res => {
  console.log(res);
});

// 直接 Promise 是不会有任何问题的，因为我们使用的 babel/polyfill 并且设置了 "useBuiltIns": "usage" 将使用到的 es6 高级函数进行转义而不是默认将全部 es6 的高级语法进行转义从而导致打包后的 chunk 非常大
/* const bbb = new Promise(function(resolve, reject) {
  if (true){
    console.log('1111111111111111111');
    resolve();
  } else {
    reject();
  }
}); */

```

运行 `npm run start` 启动 `webpackDevServer` 在 IE 11 浏览器运行`index.html`时
报了一个错误：

```
SCRIPT5009: “Promise”未定义
eval code (437) (50,3)
```

这个错误的原因是因为 axios 内部是一个动态 `import` 的语法执行，所以 babel 在 ie 低版本浏览器端的兼容就要在这个模块里手动导入 `Promise` 的实现。

解决办法由两种：

1. 在模块里手动导入

index.js

```
// window.Promise = Promise;  // 和下面一个任选一个
// import "core-js/modules/es.promise";


```

2. 修改 webpack.config.js 配置文件的 entry

数组写法

```
module.exports = {
  entry: [
    "core-js/modules/es.promise",
    "./src/index.js"
  ]
}
```

对象写法

```
entry: {
  // main: ["./src/index.js"]
  Promise: "core-js/modules/es.promise",
  main: "./src/index.js"
}
```
