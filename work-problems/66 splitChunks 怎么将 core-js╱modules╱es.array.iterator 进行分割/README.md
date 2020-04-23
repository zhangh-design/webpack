66 splitChunks 怎么将 core-js╱modules╱es.array.iterator 进行分割

#### 场景：

这个问题是我在使用 动态import 导入的功能在 ie 环境下遇到的。

我的业务代码是这样的：

```
function getComponent() {
  return import(/* webpackChunkName:"lodash" */ "lodash").then(({default : _}) => {
      var element = document.createElement('div');
      element.innerHTML = _.join(['hello','world'],'-');
      return element;
  });
}

getComponent().then(element=>{
    document.body.appendChild(element)
})
```

动态导入import和魔法注释，我在 chrome 浏览器上能运行的很好，但是在 ie 环境下却出现报错

![image](https://img.mukewang.com/szimg/5e6ca44e084e638f06610093.jpg)

解决办法就是：

在 entry 的入口中增加如下：

```
entry: {
  iterator: "core-js/modules/es.array.iterator",
  Promise: "core-js/modules/es.promise",
  main: "./src/index.js"
}
```

需要手动 babel 的 es6 支持 `iterator`和`Promise`手动导入。

#### 问题：

但这样也出来了一个问题就是 splitChunks 在分割模块的时候会把`iterator`和`Promise`也单独分割成一个文件（我使用的是chunks: 'all' 所以同步和异步的引入都会进行分割），但是这样就增加了 http 的请求数量，所以我想能不能把这些 babel 的支持文件单独分割到一个文件中。


#### 解决配置：

```
'core-js-base': {
  name: 'core-js-base',
  test: /[\\/]node_modules[\\/]_core-js@2.6.11@core-js|_core-js@3.6.5@core-js[\\/]/,
  priority: -10,
  filename: utils.assetsPath('js/vendor/core-js-base.[chunkhash].js')
}
```

