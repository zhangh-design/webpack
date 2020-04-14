12 项目工程在 webpack 里面怎么指定 vue 的不同版本，vue.js vue.runtime.js 等不同版本

[->对不同构建版本的解释](https://cn.vuejs.org/v2/guide/installation.html#%E5%AF%B9%E4%B8%8D%E5%90%8C%E6%9E%84%E5%BB%BA%E7%89%88%E6%9C%AC%E7%9A%84%E8%A7%A3%E9%87%8A)

Vue 的 runtime 版本是 只包含运行时版 的js文件，运行时版本相比完整版体积要小大约 30%，所以应该尽可能使用这个版本。

如果你仍然希望使用完整版`vue.js`、`vue.min.js`，则需要在打包工具里配置一个别名。

默认不配置别名（像下面这样指定 运行时版本）那么版本是 完整版。

如果以字符串的形式编写`tempalte`需要使用完整版。

```
// 需要编译器
new Vue({
  template: '<div>{{ hi }}</div>'
})
```

如果直接写 render 函数或者使用 .vue 文件则使用 运行时版本就可以了。

```
// 不需要编译器
new Vue({
  render (h) {
    return h('div', this.hi)
  }
})
```


---

webpack 配置（开发环境）：

开发环境我觉得其实不配置别名问题也不大，反正运行在 webpack-dev-server 中。

```
const path = require('path');

module.exports = {
  mode: 'development',
  resolve: {
    alias: {
      // 没有被压缩，有警告和调试模式
      vue$: path.join(__dirname, './node_modules/vue/dist/vue.runtime.js')
    }
  }
}

```


webpack 配置 （生产环境）

```
const path = require('path');

module.exports = {
  mode: 'development',
  resolve: {
    alias: {
      // 压缩后的运行时版本
      vue$: path.join(__dirname, './node_modules/vue/dist/vue.runtime.min.js')
    }
  }
}
```
