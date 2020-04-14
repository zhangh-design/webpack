07 entry.vendor （webpack 3）结合 CommonsChunkPlugin 分割第三方库，减小构建包的体积

[->先看下 Webpack 官网上对 entry.vendor 的介绍](https://webpack.docschina.org/concepts/entry-points/#%E5%88%86%E7%A6%BB-app-%E5%BA%94%E7%94%A8%E7%A8%8B%E5%BA%8F-%E5%92%8C-vendor-%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93-%E5%85%A5%E5%8F%A3)：

[->webpack打包生成多个vendor的配置方法](https://www.cnblogs.com/zaifeng0108/p/7268271.html)

---
#### 分离 app(应用程序) 和 vendor(第三方库) 入口

在 webpack < 4 的版本中，通常将 vendor 作为单独的入口起点添加到 entry 选项中，以将其编译为单独的文件（与 CommonsChunkPlugin 结合使用）。而在 webpack 4 中不鼓励这样做。而是使用 optimization.splitChunks 选项，将 vendor 和 app(应用程序) 模块分开，并为其创建一个单独的文件。不要 为 vendor 或其他不是执行起点创建 entry。

**注意：**

1. entry.vendor 分离第三方库是 webpack 3 中的配置
2. entry.vendor 需要和 CommonsChunkPlugin配合一起使用，否则虽然已经把第三方库分离出来单独创建了一个名为 `vendor.js`的文件，但是主文件`main.js`的体积大小并没有缩小，还需要在配置 `CommonsChunkPlugin`在构建时过滤掉配置的`vendor`中指定的要分离的库。

---

这里使用 "webpack": "^3.10.0" 版本。

用webpack打包项目的时候，一般喜欢把一些公用的库打包的vendor.js里面，比如像react，react-router，redux，vue，vue-router，vuex，lodash，jquery等。

随着引入的库越来越多，vendor文件也变得越来越大，于是考虑打包成两个vendor，把和react相关的库打包成一个vendor，其他的库打包成另外一个vendor。按照webpack的文档开始配置，需要注意有两个比较坑的地方。

示例 lesson 项目结构

```
dist -- 打包输出目录
 |-main.js
 |-vendor.js
 |-vendor1.js
node_modules -- 插件包依赖
src
 |-index.js
index.html
package.json
webpack.config.js
```

package.json

```
{
  "name": "test3",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^3.10.0"
  },
  "dependencies": {
    "jquery": "^3.5.0",
    "loadsh": "^0.0.4",
    "vue": "^2.6.11",
    "vue-router": "^3.1.6",
    "vuex": "^3.1.3"
  }
}

```

webpack.config.js

```
const path = require('path');
const webpack = require('webpack');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 默认将 entry 的入口起点指向 src 目录
  context: path.resolve(__dirname, './src'),
  // 配置了 context 所以路径写成 ./ 当前目录下即可
  entry: {
	main: './index.js',
	vendor: ['lodash','jquery'],
	vendor1: ['vue']
  },
  output: {
    // output.filename一定不要写死了，要配置成可替换的，类似filename: '[name].js'形式
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
	  names: ["vendor", "vendor1"],
      minChunks: Infinity
    })
  ]
}

```


index.js

```
import _ from 'lodash'
import Vue from 'vue'
import $ from 'jquery'

const dom = $('<div>')
dom.html(_.join(['hello','world','bye'], ' --- '));
$('body').append(dom);

console.info(Vue)

```

##### 两次打包体积分析（没有配置 entry.vendor和配置了entry.vendor）

没有在 entry 中配置 vendor 时打包输出的体积（lodash、jquery、vue）


```
E:\vue-local\project\test3>npm run build

> test3@1.0.0 build E:\vue-local\project\test3
> webpack

Hash: 5bf7c2517be6bd353490
Version: webpack 3.10.0
Time: 887ms
  Asset     Size  Chunks                    Chunk Names
main.js  1.08 MB       0  [emitted]  [big]  main
   [2] ./index.js 195 bytes {0} [built]
    + 8 hidden modules
```

设置

```
entry: {
	main: './index.js',
	vendor: ['lodash','jquery'],
	vendor1: ['vue']
  },
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
	  names: ["vendor", "vendor1"],
      minChunks: Infinity
    })
  ]
```

后，构建打包输出体积：


```
E:\vue-local\project\test3>npm run build

> test3@1.0.0 build E:\vue-local\project\test3
> webpack

Hash: 2e3925bb0fd7096d1ce8
Version: webpack 3.10.0
Time: 858ms
     Asset     Size  Chunks                    Chunk Names
 vendor.js   830 kB       0  [emitted]  [big]  vendor
   main.js  1.04 kB       1  [emitted]         main
vendor1.js   249 kB       2  [emitted]         vendor1
   [5] ./index.js 195 bytes {1} [built]
   [9] multi lodash jquery 40 bytes {0} [built]
  [10] multi vue 28 bytes {2} [built]
    + 8 hidden modules
```

在`index.html`中使用公共库的坑：

我们在 CommonsChunkPlugin 中的配置时下面这样的：

```
plugins: [
    new webpack.optimize.CommonsChunkPlugin({
	  names: ["vendor", "vendor1"],
      minChunks: Infinity
    })
  ]
```

对应的是`"vendor", "vendor1"`，那如果我在`index.html`中以`script`标签的形式引入就必须按照从右往左的顺序：

如果顺序不对在浏览器上打开`index.html`时会报`webpackJsonp is not defined`的错误。

（那我这里时手动添加的，我们也可以使用`html-webpack-externals-plugin`来自动导入这些js文件到index.html中）

index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>test webpack 3.10.0 entry.vendor</title>
</head>
<body>
<div id="app">test webpack 3.10.0 entry.vendor</div>
<!-- 注意这里的 vendor1 vendor main 的导入顺序 -->
<script src="./vendor1.js"></script>
<script src="./vendor.js"></script>
<script src="./main.js"></script>
</body>
</html>
```

