56 webpack 配置中 resolve.alias 和 resolve.modules 的区别

先看下配置：

```
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  resolve: {
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      // 设置 vue 的别名为精确匹配，文件中就可以这样使用 import Vue from 'vue'（from 后面的 'vue' 就代表这里的配置）
      vue$: path.resolve(__dirname, '../node_modules/vue/dist/vue.runtime.min.js'),
      '@': resolve('./src')
    },
    // 告诉 webpack 解析第三方模块时应该搜索的目录
    modules: [path.resolve(__dirname, '../node_modules')]
  }
}
```

- resolve.modules 是告诉webpack它去哪里查找第三方包，相当于前缀。
- resolve.alias 是配置别名，也可以缩短路径，相当于取了一个变量在模块中import时候加在前面，也相当于前缀。

resolve.modules 的例子不好举，这里我举个 resolve.alias 的配置示例。

测试项目`src`目录截图

```
src
 |-view
    |-login
      |-page
        |-login.js
 |-index.js
```

index.js

这里的路径是不是很长。

```
import login from './view/login/page/login.js'

console.log(login)
```

解决办法配置`resolve.alias`：

```
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  resolve: {
    alias: {
      // 配置一个 login 路径的别名
      login: resolve('./src/view/login/page')
    }
  }
}

```

index.js

这样是不是简单很多了啊。

```
import login from 'login/login.js'

console.log(login)
```

