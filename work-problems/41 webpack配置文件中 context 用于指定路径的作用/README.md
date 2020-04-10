webpack配置文件中 context 用于指定路径的作用

项目结构：

demo

```
dist
 |-bundle.js
public
 |-
 |-index.html
src
 |-index.js
.gitignore
package.json
webpack.config.js
```

目录中的dist是我打包出来的文件，而src中的文件是我书写的源文件，而webpack.config.js中的代码是这样的

webpack.config.js

```
/* eslint-disable no-unused-vars */
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, './src'),
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

---

先看下 webpack 官网上对 [->`context`](https://webpack.docschina.org/configuration/entry-context/#context) 属性的介绍：

#### context

基础目录，绝对路径，用于从配置中解析入口起点(entry point)和 loader

```
module.exports = {
  //...
  context: path.resolve(__dirname, 'app')
};
```

默认使用当前目录，但是推荐在配置中传递一个值。这使得你的配置独立于 CWD(current working directory - 当前执行路径)。

---

看这段代码，其实我们就可以猜到context的作用了，如果没有这个context，那我们的entry应该怎么写，是不是应该书写成：

```
module.exports = {
  // context: path.resolve(__dirname, './src'),
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

还好我src中就一个index.js，要是来10个或者100个，那要多写多少个src，所以我们可以看到context的作用，它就是会将entry的根路口指向src这个文件夹。

