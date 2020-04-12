15 使用 Babel 处理 ES6 语法（1）

> 前言：这节课我来给大家讲解如何结合`Webpack`与`Babel`，使我们能够在代码里面编写`ES6`的语法。

[->Babel](https://www.babeljs.cn/)

[->polyfill](https://www.babeljs.cn/docs/babel-polyfill)

[->useBuiltIns](https://babeljs.io/docs/en/babel-polyfill#usage-in-node-browserify-webpack)

[->Babel 7.4.0版本的更新内容，及官方的升级建议](https://babeljs.io/blog/2019/03/19/7.4.0)

[->Babel7 转码- corejs3 的更新](https://segmentfault.com/a/1190000020237817?utm_source=tag-newest)

[->useBuiltIns 使用的时候](https://coding.imooc.com/learn/questiondetail/116693.html)

让浏览器能够识别es6的语法
1、需要安装的插件：babel-loader、@babel/preset-env、@babel/polyfill。
- babel-loader不会执行转换，只是把webpack和babel打通；
- @babel/preset-env执行es6语法转换es5,只是部分转换（比如：let、const、箭头函数），主要负责语法转换；
- @babel/polyfill弥补ES5缺失的变量或者函数（Promise、数据的map、new Set()），主要负责内置方法和函数；
- useBuiltIns:"usage",只打包已经用到的API语法，可以减少文件体积（Babel在7.4.0以上版本后想要下载依赖corejs）
- 还要在安装 corejs@3的版本并设置版本 corejs:3（官网是这样说的：corejs: 2仅支持全局变量（例如Promise）和静态属性（例如Array.from），corejs: 3还支持实例属性（例如[].includes））
- 设置了useBuiltIns:"usage"之后就不需要在文件中单独导入 `import "@babel/polyfill";`了。

因为默认 @babel/preset-env 只会转换语法，也就是我们看到的箭头函数、const一类。
如果进一步需要转换内置对象、实例方法，那就得用polyfill, 这就需要你做一点配置了。

首先打开我们之前的项目，清除掉`index.js`里面的内容：

index.js

```
// eslint-disable-next-line no-unused-vars
const arr = [new Promise(() => {}), new Promise(() => {})];

arr.map(item => {
  console.log(item);
})

```

好写完之后呢，我们就行一个项目的打包：

```
F:\github-vue\workspaces\lesson>npx webpack

F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 74b3643358c4dce1f290
Version: webpack 4.41.6
Time: 822ms
Built at: 2020-02-24 12:15:08
     Asset       Size  Chunks             Chunk Names
index.html  260 bytes          [emitted]
   main.js   4.46 KiB    main  [emitted]  main
Entrypoint main = main.js
```

lesson

```
dist
 |--index.html
 |--main.js
src
 |--index.js
.browserslistrc
index.html
package.json
postcss.config.js
webpack.config.js
```

大家看啊我这里用的是`npx webpack`使用`webpack`命令做打包，而没有使用`npm run start`用`webpack-dev-server`做打包，原因就是我要看一下打包生成的这`main.js`文件，那如果你`webpack-dev-server`做打包，打包生成的文件呢都在内存里面你是看不到的，所以这里我直接用`npx webpack`做打包。

我们打开`dist`目录下的`main.js`代码来看：

找到最后的几行，前面的这些呢都是`Webpack`自动生成的一些代码，那后面的这几行代码呢实际是我们的`src`目录下`index.js`里面的代码打包生成的内容。

```
/***/ (function(module, exports) {

eval("// eslint-disable-next-line no-unused-vars\r\nconst arr = [new Promise(() => {}), new Promise(() => {})];\r\n\r\narr.map(item => {\r\n  console.log(item);\r\n})\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/YjYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuY29uc3QgYXJyID0gW25ldyBQcm9taXNlKCgpID0+IHt9KSwgbmV3IFByb21pc2UoKCkgPT4ge30pXTtcclxuXHJcbmFyci5tYXAoaXRlbSA9PiB7XHJcbiAgY29uc29sZS5sb2coaXRlbSk7XHJcbn0pXHJcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ })
```

你可以看到这里`const arr = [new Promise(() => {}), new Promise(() => {})]`后面的呢`arr.map(item => {\r\n  console.log(item);\r\n})`原封不动
，你在`src`目录下写的什么东西，`Webpack`打包生成的内容就是什么东西，那么这个时候就会有一些问题。

我们说这段代码能不能在浏览器上正确的运行呢，我们来试试？

```
F:\github-vue\workspaces\lesson>npm run start
```

我们起一下我们的服务器，在浏览器的控制台里面我们来看啊：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa8dECI*u5GVzvskXYOnrjrgUPdN5GXk*JTeAB6mCU*2w3Pl*HkIWOUW2CiOL0bVvGl3PyJfleOi.pvppXDpGrdU!/b&bo=KwIOAQAAAAARBxY!&rf=viewer_4&t=5)

它可以打印出这个`Promise`对象好像是没什么问题的，这又是什么原因呢？这是因为`Chrome`浏览器它呢非常与时俱进我们`ES6`规范里的很多东西它都做了实现，所以我们在里面直接写`ES6`的代码`Chrome`浏览器都能够正常的运行，但假如我们在`IE`浏览器里面去打开`http://localhost:8080/`这个地址，尤其是低版本的一些`IE`浏览器（包括：国产的一些浏览器）你会发现执行就会报错了，为什么呢？

因为这些浏览器执行的也是我们刚才看到的`main.js`里面打包生成的代码，那里面呢它是`ES6`的代码，这些浏览器不支持`ES6`的代码就会导致我们的程序会报错误，这个时候我们就想如果我们在`src`目录下去写这种`ES6`的代码，但是通过`Webpack`打包`npx webpack`进行打包如果打包生成的文件啊它能够把这个`ES6`的代码
都转换成`ES5`的代码，也就是生成的这个`main.js`文件里面打包生成的这个代码呀能够把这个`ES6`的语法转换成`ES5`的语法，这样的话所有的浏览器运行这段代码都不会有问题了。


##### 要想实现这样的一个打包的功能，我们该怎么做呢？

我们需要借助`Babel`来帮助我们实现这样的一个需求。

打开[Babel](https://www.babeljs.cn/)的官方网站我们来看一下，大家可以看到啊下面的框内我们用`let`定义了一个内容左侧是`ES6`的语法，右侧是`Babel`转换过后的语法，你可以看到`Babel`呢可以把`ES6`的语法转换成`ES5`的语法这正是我们想要的功能。

在`Webpack`的打包过程中呢，如果来使用`Babel`很多同学呢可能不太清楚，其实`Babel`的官方网站上给了我们非常方便的指南。

我们打开官方网站最顶部的[->设置](https://www.babeljs.cn/setup)选项：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa3wU*7xidTVgHLx*81nmfOMdT9r5vTUOMUEdIxtHFFLi6h2g5tsyNgEJPMd6iHf1QbUJ1ZsBQHn0Nmn*oFX9En0!/b&bo=NAQ.AQAAAAARBz8!&rf=viewer_4&t=5)

第一步我们要选中我们使用`Babel`的场景`Choose your tool (try CLI)`，在里面看有一个`Webpack`，意思就是我要在`Webpack`里面使用`Babel`，那我点击一下`Webpack`这个选项。

##### Installation

它会告诉我们首先你要安装`babel-loader`和`@babel/core`这两个库，那看到`loader`呢大家应该很敏感它肯定是帮助`Webpack`做打包来使用的一个工具，那`@babel/core`呢实际上是`Babel`的一个核心库，它能够让`Babel`去识别`js`代码里的内容然后呢把这个js中的`ES6`的代码转换成`ES5`语法出来。

那么我们就来安装一下这两个包：

```
F:\github-vue\workspaces\lesson>cnpm install --save-dev babel-loader @babel/core
```

##### Usage

接着我们再来看，它会告诉你下一步`Usage`你要在你的`Webpack`的配置项里面增加一个规则，如果检测到你的文件是js文件的话，那么使用`babel-loader`来进行一下语义上的分析。


```
module: {
  rules: [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
  ]
}
```

我们呢就把这段`{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }`复制过来，放到`webpack.config.js`里面我们在`rules`里面加一条规则（如果检测到你的文件是`js文件`就使用`Babel-loader`帮助你去分析一下这个js里面的这个语法到底是一个什么情况）。

###### `exclude`参数是什么意思呢？
如果你的js文件在`node_modules`里面，那么我就不使用这个`babel-loader`了，为什么呀，`node_modules`里面的代码实际上是一些第三方的代码，我们没必要对这些第三方代码进行`ES6`转`ES5`的操作，第三方的模块其实它已经帮助我们早就做好 转义这一步，我们没必要在做一遍。

所以呢只有你的文件在你的`src`目录下，这个时候`babel-loader`才会生效，如果它在`node_modules`里面我们就不适用`babel-loader`。

exclude 就是排除在外，大致就是只有这个js文件不再`node_modules`里面的我才使用这个`babel-loader`就这么一个意思。

webpack.config.js

```
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // development cheap-module-eval-source-map
  // production cheap-module-source-map
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:8].[ext]',
            outputPath: 'images/',
            // 字节
            limit: 10240
          }
        }
      }
    ]
  }
}
```

##### @babel/preset-env

好，这步我们也配置好了，然后呢我们看这个包也安装完了，那我们在往下去看，它会让我们呢在去安装一个`@babel/preset-env`这个模块。

好我来讲下为什么要安装这个模块，当我们使用`babel-loader`处理js文件的时候
实际上这个`babel-loader`啊只是`Webpack`和`Babel`做通信的一个桥梁，你用了`babel-loader`之后呢`Webpack`和`Babel`做了打通，但实际上`babel-loader`并
不会帮助你把js文件里面的`ES6`语法翻译成`ES5`的语法，你还需要借助一些其它的模块才能够帮你把`ES6`的语法翻译成`ES5`的语法。

那我们看到的这个官网上的`@babel/preset-env`就是这样的一个模块。

所以呢我们来安装一下`@babel/preset-env`：

```
F:\github-vue\workspaces\lesson>cnpm install @babel/preset-env --save-dev
```

`@babel/preset-env`这个模块里面包含了所有`ES6`转换成`ES5`的一些翻译规则，你安装使用了它之后呢就可以在打包的过程中，把我们所有的js代码翻译成`ES5`的语法了。

好当然安装好了之后还要做一个配置，怎么配置呢？

我们在使用`loader`的时候可以给`loader`一个`options`这样的一个配置参数

```
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
}
```

这样的话我们就配置好了这个`@babel/preset`的这样一个工具，然后我们再去做`Webpack`打包的时候`ES6`的语法应该就可以翻译成`ES5`的语法了。

那我们来试验一下：

```
F:\github-vue\workspaces\lesson>npx webpack

F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 5658d4d62cf1324d1185
Version: webpack 4.41.6
Time: 2292ms
Built at: 2020-02-24 16:52:29
     Asset       Size  Chunks             Chunk Names
index.html  260 bytes          [emitted]
====== 注意下这里的打包还没有使用 @babel/polyfill 大小是4.5kb，下面安装了@babel/polyfill 后会有比较 =========
   main.js   4.45 KiB    main  [emitted]  main
Entrypoint main = main.js

```

然后我们来看一下啊，到`dist`目录下来看`main.js`，大家可以看到`const`的这个语法被翻译成了`var`的语法，是不是`ES6`转`ES5`了啊，我们在往后看`Promise`中的这种箭头函数`() => {}`被转换成了普通函数`function () {}`。

main.js

```
/***/ (function(module, exports) {

eval("// eslint-disable-next-line no-unused-vars\nvar arr = [new Promise(function () {}), new Promise(function () {})];\narr.map(function (item) {\n  console.log(item);\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/YjYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcclxuY29uc3QgYXJyID0gW25ldyBQcm9taXNlKCgpID0+IHt9KSwgbmV3IFByb21pc2UoKCkgPT4ge30pXTtcclxuXHJcbmFyci5tYXAoaXRlbSA9PiB7XHJcbiAgY29uc29sZS5sb2coaXRlbSk7XHJcbn0pXHJcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ })
```

那实际上这样的话我们就完成了`ES6`转`ES5`这样的一个语法转换，但是光做到这一点还是不够，为什么呢？

因为比如说`Promise`这样新的语法变量，包括数组里面的`map`这个方法，在低版本的浏览器里实际上还是不存在的，你虽然做了语法解释或者语法翻译，但是只翻译了一部分，还有一些对象或者函数其实在低版本浏览器还是没有的，所以呢这个时候你不仅要使用`@babel/preset-env`做语法的转换，你还要把它缺失的这些变量或者函数补充到低版本的浏览器里。

那怎么补充呢？

##### @babel/polyfill

我们需要借助`babel/polyfill`这样的一个工具帮我们做这些变量或者函数在低版本浏览器的补充。

我们打开[Babel](https://www.babeljs.cn/)的官网点击进入[文档](https://www.babeljs.cn/docs/)，左侧啊大家可以看到有一个叫做[polyfill](https://www.babeljs.cn/docs/babel-polyfill)的菜单，我们点击进入。

如果想使用这个`polyfill`啊，我们先要安装：

```
F:\github-vue\workspaces\lesson>cnpm install --save @babel/polyfill
```

（这是至 Babel 7.4.0之后的配置，@babel/polyfill仍然还需要安装还需要额外在安装 core-js，不然打包错报错）

```
F:\github-vue\workspaces\lesson>cnpm install core-js@3 --save
```

安装好了之后我们怎么办？

我们只需要在我们所有代码运行之前先去引入`@babel/polyfill`来补充我们缺少的这些内容就可以了（Babel 7.4.0版本以上的配置请看 lesson 示例）。

```
import "@babel/polyfill";
```

把它放到哪呢，把它放到我们的`src`目录下`index.js`这个业务代码的最上面：

index.js

```
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

```

好这样写就可以了。

好现在我们的代码基本上就已经完善了，那我们先看啊在之前当我们没用`@babel/polyfill`的时候，我们打包生成一个文件，`main.js`只有多大只有4.5kb，但是现在我们安装好了`@babel/polyfill`我们在从新运行一下打包命令。

```
F:\github-vue\workspaces\lesson>npx webpack

F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: removed dist
Hash: 09cbf1ddbad3474643a5
Version: webpack 4.41.6
Time: 3475ms
Built at: 2020-02-24 17:18:05
     Asset       Size  Chunks             Chunk Names
index.html  260 bytes          [emitted]
======== 注意这里：使用了 @babel/polyfill后文件变成了962kb了，没使用之前是4.5kb =============
   main.js    962 KiB    main  [emitted]  main
```

##### useBuiltIns: 'usage' （配置了之后，就不需要在引入 import "@babel/polyfill"; ）

你可以看到`main.js`一下子变成多大了变成了962KB，这多的内容是什么呀，就是`@babel/polyfill`呢要去弥补一些低版本浏览器不存在的一些内容，所以呢它要自己去帮你做`Promise`的实现帮你去做`map`方法的实现，然后把这些实现呢在加入到`main.js`里面，所以`main.js`就会变的特别的大。

好当然了我们现在我们只用了这种`Promise`的语法只用了`map`语法，那还有其它很多没有用到的一些`ES6`的语法呢，实际上我们这样去引入`@babel/polyfill`的时候它也一并打包到这个`main.js`里面了，那我不需要你把其它一些没用的这种语法也打包到`main.js`里面，我只需要你帮助我实现一下`Promise`帮助我实现一下这个`map`方法就行了。

所以呢理论上来说我们的包其实不用`962KB`这么大，可以让它小一点，我们只需要一个非常简单的配置，就可以实现我们这个想法：

打开`webpack.config.js`，在`presets`这里我呢给`@babel/preset-env`一个新的参数`useBuiltIns: 'usage'`：

[->useBuiltIns](https://babeljs.io/docs/en/babel-polyfill#usage-in-node-browserify-webpack)

它的意思是什么呢，它的意思是当我做这个`@babel/polyfill`填充的时候去往这个页面上啊去加一些低版本浏览器可能不存在的特性的时候，我不是把所有的特性都加进来，我是根据你的业务代码来决定到底要加什么的，比如说：

你这里业务代码里用到了`Promise`那我就去加`Promise`的代码。

你用到了这个`map`那我就去加`map`这个方法，如果你在`index.js`里没用到`map`那我压根就不把`map`打包到`main.js`里。

`useBuiltIns: 'usage'`就是这个意思。

```
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      presets: [['@babel/preset-env'], {
        useBuiltIns: 'usage',
        // 需要安装 core-js@3 版本是3
        corejs: {
            version: 3
        }
      }]
    }
}
```

当我们写了这样一个配置项之后，我们再来做页面的打包：

```
F:\github-vue\workspaces\lesson>npx webpack

F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: removed dist
Hash: 90a4d0de0cab6c07a259
Version: webpack 4.41.6
Time: 2384ms
Built at: 2020-02-25 12:20:06
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
========= 大家可以看到 现在只有 244KB了 ==========
   main.js    244 KiB    main  [emitted]  main
```
