18 resolve.extensions（引入模块时不带文件后缀） 和 resolve.alias（配置路径别名） 的配置

[->resolve.extensions 自动解析确定的扩展](https://webpack.docschina.org/configuration/resolve/#resolve-extensions)

[->resolve.alias 创建 import 或 require 的别名，来确保模块引入变得更简单](https://webpack.docschina.org/configuration/resolve/#resolve-alias)

工程目录结构：

```
dist
node_modules
public
 |-favicon.ico
 |-index.html
src
 |-b.vue
 |-index.js
.editorconfig
.gitignore
package.json
webpack.config.js
```

b.vue

（这里只是一个文件用于测试 resolve.extensions）

```
const add = (a, b) => {
  return a + b;
}

export default add
```


index.js

如果不设置 extensions 扩展后缀配置，那`import b from '@/b'` 会报找不到文件的错误，因为 extensions 默认支持的后缀扩展查找是 `['.wasm', '.mjs', '.js', '.json']`。

```
import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
// 使用了 @ 别名 而且省略了后缀
import b from '@/b'

function component () {
  const element = document.createElement('div');
  // lodash（目前通过一个 script 引入）对于执行这一行是必需的
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  console.log(Vue)
  console.log(Vuex)
  console.log(b)

  return element;
}

document.body.appendChild(component());

```


webpack.common.js

```
// 这里一个 . 是因为我的 webpack.config.js 是在根目录下
function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
    resolve: {
        // 自动解析确定的扩展
        extensions: ['.wasm', '.mjs', '.js', '.json', '.vue', '.jsx', '.css', '.less', 'scss'],
        // 创建 import 或 require 的别名，来确保模块引入变得更简单
        alias: {
          vue$: path.join(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
          '@': resolve('./src')
        }
   }
}
```

在给定对象的键后的末尾添加 $，以表示精准匹配。

这里的`vue`是要精确匹配的因为我们在项目中是直接这样写的：

```
import Vue from 'vue'


```

如果不是精确匹配，而是非精确匹配则会触发普通解析，这样就需要在`vue`后面在跟上具体的文件名称了，你总不想你的`vue`是这样引入的吧：

```
// 你不想这样引入吧，所以要 vue$ 精确匹配
import Vue from 'vue/vue.runtime.esm.js'

```
