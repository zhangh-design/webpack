17 Tree Shaking 概念详解

> 前言：同学们大家好，这节课我来给大家讲解一个`Webpack`中新的知识点叫做`Tree Shaking`。

（在webpack 4版本中，直接对生产环境配置mode:'production'，即可启用tree shaking，并将代码压缩）

那我们一起在我们的工程里面看一下`Tree Shaking`指的是什么，打开我们之前写的代码，进入到`src`目录下的`index.js`这个文件里面：

#### When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.（如果使用了`useBuiltIns: 'usage'`在src中的业务代码里`babel-polyfill`会自动帮你引入需要转换的ES6函数）

index.js 

（我们删除掉 index.js 中的代码，只保留下一个 `polyfill`的导入）

```
import '@babel/polyfill'; // 也可以在 entry 打包出配置（单独使用 import 引入 Babel官方不推荐）

```

.babelrc

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        // 这个 corejs 一定要配置，Babel在7.4.0以后想要安装corejs这个核心库
        "corejs": {
          "version": 3
        },
        "targets": {
          "chrome": "67"
        }
      }
    ]
  ]
}
```

webpack.config.js

（`babel-loader` 的`options`配置以及转移到了`.babelrc`文件中）

```
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // development cheap-module-eval-source-map
  // production cheap-module-source-map
  entry: {
    main: ['./src/index.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]  
  }
}
```

好，我们`npx webpack`重新做一次打包我们看一下现在的一个情况：

```
C:\Users\nickname\Desktop\lesson_3>npx webpack

C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"

=========== 注意：看这里有对 babel-polyfill 的配置警告 ===========

  When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
  Please remove the direct import of `core-js` or use `useBuiltIns: 'entry'` instead.
clean-webpack-plugin: removed dist
Hash: 3cee32d15cd277d31de7
Version: webpack 4.41.6
Time: 1672ms
Built at: 2020-03-01 10:33:36
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js   4.24 KiB    main  [emitted]  main
Entrypoint main = main.js
```

好了，它呢实际上会报一个警告，什么意思啊？

实际上在我们这个版本的`Webpack`下面，也就是一个比较新的`Webpack 4`这样的一个`Webpack`的版本下面，如果你在`Webpack.config.js`里面配置了`babel-loader`相关的内容其实呢我们已经把它移到`.babelrc`这个文件里了，如果你在`.babelrc`这里对`@babel/preset-env`设置了`"useBuiltIns": "usage"`这样的一个配置参数的话，那么实际上我们之前的代码里面你不去引入这个`import '@babel/polyfill'`也是可以的，所以呢它会告诉你其实如果你用了
``useBuiltIns: 'usage'``那么`@babel/polyfill`会自动的帮你去引入你就没有必要在你的业务代码里去引入这个`import '@babel/polyfill'`了，所以我们在`index.js`中把`import '@babel/polyfill'`给去掉这样的话呢就更简洁了。

#### Tree Shaking

我们这节课来编写这样的一个模块，我创建一个文件叫`math.js`：

math.js

（现在我可以放心大胆的在这里使用`ES6`的语法了，为什么呢？因为我们已经对`babel`进行了配置，我们已经使用了`babel/preset-env`这样的话我们的项目在打包的时候会把我们`ES6`的代码转换成`ES5`的代码，所以在源代码中你想写`ES6`你可以随便的来写了）

```
export const add = (a, b) => {
  console.log(a + b);
};
export const minus = (a, b) => {
    console.log(a - b);
  };

```

接着在`index.js`里面我们引入`add`这个方法：

index.js

```
import { add } from "./math.js";

add(1, 2);

```

好这个时候呢实际上我们是调用加法这个方法来计算`1+2`的值，我们来打一下包看一下对应的页面能不能输出结果：

```
C:\Users\nickname\Desktop\lesson_3>npx webpack
```

好打包完成，我们找到`dist`目录下的`index.html`我们在浏览器里打开它，然后打开浏览器控制台看到输出了`3`这样的内容，好说明代码已经正确的运行了。

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa0hLKN0l2PINSSOBJcG0y.VNo21xKg2PQSZSyCq4Nl3Fqb6X97wFETR7ajcJij7Z.Y9yAutY1hMew554WhfYajk!/b&bo=EAFqAAAAAAARB0s!&rf=viewer_4&t=5)


然后我们来看，实际上在`index.js`里面我们引入了`math.js`里面的`add`方法，但是我并没有引入`minus`这个方法这个时候我们刚才去做`Webpack`的打包生成了对应的打包文件，我们去看一下`main.js`的内容：

main.js

（dist/main.js）

（我们在main.js里面直接搜索`console.log`）

```
/*! exports provided: add, minus */

const add = (a, b) => {\n  console.log(a + b);\n};\nconst minus = (a, b) => {\n  console.log(a - b);\n};
```

你可以看到打包生成的文件里面有`add`这个方法同时`minus`这个方法也存在于这个文件里，实际上在我们的这个打包文件里面你可以看到`/*! exports provided: add, minus */` `add`和`minus`这两个方法都有，意思就是`index.js`你虽然只引入了`add`这一个方法但是我把`math.js`里所有的内容都打包生成到了`main.js`这个打包出的文件里，那这有没有必要啊？

这是没有必要的，因为我们的业务代码里面只用`add`方法你帮我把这个`minus`方法也打包进来那就多此一举了，它会使得我们的`main.js`文件变得很大。

那最理想的打包方式是，我引入什么你帮我打包什么要想实现这个功能那么`Webpack`里面在`2.0`以后的版本里面呢已经提供了`Tree Shaking`这个概念。

`Tree Shaking`如果你翻译成中文它就是`摇树`的意思，它呢实际上就是把一个模块里没用的东西都摇晃掉，一个模块呢你可以把它理解成一颗树（比如说：`math.js`这个文件它呢是一个模块它里面会导出很多的内容，这些内容呢你可以把它理解成一颗小的树形结构）而在`index.js`这里我只会引入这个树的一部分那我引入的部分你帮我做打包，而不引入的东西你帮我去剔除掉摇晃掉这就是`Tree Shaking`这样的一个概念。

在`Webpack`中要想实现`Tree Shaking`我们该怎么做呢？

##### 注意：
<font color=#DC143C size=2 >首先`Tree Shaking`它只支持`ES Module`模块的引入这块大家要记住，也就是指
只支持这种 `import` 模块的引入</font>
，如果你使用这种:

```
const add = require('./math.js')
```

`CommonJS`的引入方式，`Tree Shaking`是不支持的，这是因为`import`的这种`ES`的模块引入，它呢底层是一个静态引入的方式，而`CommonJS`呢它是一个动态引入的方式，`Tree Shaking`只支持静态引入的这样一个方法，所以它只支持`ES Module`这种模块的引入，这点大家一定要记得。

那么接下来我们来看`Tree Shaking`如何的做配置：

首先打开`webpack.config.js`现在我们的模块`mode`是一个`development`的模式
，那`development`的模式默认它是没有`Tree Shaking`这个功能的，你要想把它加上，怎么加呢，首先在`webpack.config.js`下面你可以配置一个`optimization`的配置对象，这里我们在配置一个参数叫做`usedExports:true`意思就是`Webpack`你在打包的时候看看哪些导出的模块被使用了我们在做打包，所以呢你要使用`Tree Shaking`在开发环境里面你加一个：

```
optimization: {
    usedExports:true
}
```

webpack.config.js

```
const path = require('path');

module.exports = {
  mode: 'development', // 注意：这里是开发环境，生产环境的话默认是打开的
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')] // 清除的文件/文件夹
    })
  ],
  optimization: {
    usedExports:true  
  }
}
```

这样就配置OK了，接着我们要在`package.json`里面在去写一个配置项，`package.json`里面我们写什么呢？下一个`"sideEffects": false`：

##### "sideEffects": false/"sideEffects": ["*.css"]

package.json

```
{
  "name": "webpack-demo",
  "sideEffects": false,
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "bundle": "webpack",
    "watch": "webpack --watch",
    "start": "webpack-dev-server",
    "bbb": "webpack src/index.js -o bundle.js"
  }
}
```

好，`"sideEffects": false`是什么意思，我们说啊如果你配置了`Tree Shaking`
那么`Webpack`只要打包一个模块就会运用`Tree Shaking`这种方式进行模块的打包：

假如你引入了一个`@babel/polyfill`，`@babel/polyfill`它实际上并没有导出任何的内容（在它的内部之前我也给大家讲了`babel/polyfill`这种模块它实际上是在`window`对象上绑定了一些全局变量（比如说：Promise）这样的东西，所以说它并没有直接导出模块）但是假如你用了`Tree Shaking`有可能`Tree Shaking`发现你怎么没有导出任何的内容，那么它可能啊直接就把这个`@babel/polyfill`给它打包的时候忽略掉了，那么我们需不需要这个`@babel/polyfill`呢，实际上我们是需要的，但是因为这个模块没有导出任何的内容你用了`Tree Shaking`完全的忽略掉了那么打包就出错了，所以我们有的时候对这种文件需要做一个特殊的设置那`package.json`里面的这个`sideEffects: false`就是做这样设置来使用的。

比如说：对这个`@babel/polyfill`文件你不希望对它进行`Tree Shaking`那怎么做呢？

你就在`package.json`文件里配置`sideEffects: []`配置一个数组把`@babel/polyfill`给填上：

```
"sideEffects": ["@babel/polyfill"],
```

好，那么对于`@babel/polyfill`这个文件呢在打包的时候`Tree Shaking`就不会对它有任何的作用，而对其它的模块呢`Tree Shaking`你该怎么办就怎么办。

但是这里啊我把`"sideEffects": false`设置成了`false`，原因是什么，原因是在我的业务逻辑里面我们并不需要引入这种`@babel/polyfill`这样的包我们只有一个`import { add } from math.js`这样的代码，那这个代码是需要做`Tree Shaking`的，所以呢我们没有不需要做`Tree Shaking`的代码，所以`package.json`这里你把`sideEffects`设置成`false`就可以了，意思就是`Tree Shaking`正常的对所有的模块都进行优化没有特殊要处理的东西。

好，一般来说啊你需要在`sideEffects`这里填写一些什么样的东西呢?

除了`@babel/polyfill`这样的文件如果你在你的代码里面需要引入一些`.css`的样式文件（比如：`import  './style.css'`）：

index.js

```
import './style.css'
import { add } from "./math.js";

add(1, 2);

```

那么实际上只要引入一个模块`Tree Shaking`呢就会去看这个模块导出了什么和你引入了什么，如果你没有用到的就会帮你干掉这个导入，但是`style.css`显然它没有导出任何的内容那如果你这么写`Tree Shaking`去解析样式就会把这个样式忽略掉我们的代码呢就可能会有问题。

所以在`package.json`里面一般呢我们还会把这个`.css`文件给它写上去：

package.json

```
// "sideEffects": false,
"sideEffects": [
    "*.css"
],
```

意思就是如果遇到了任何的`.css`文件那么也不需要去使用`Tree Shaking`这块我在简单的介绍下：

现在呢我先给`sideEffects`改成`false`，打包出来的`main.js`啊我们先来看：

```
/***/ "./src/math.js":
/*!*********************!*\
  !*** ./src/math.js ***!
  \*********************/
/*! exports provided: add, minus */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"add\", function() { return add; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"minus\", function() { return minus; });\nconst add = (a, b) => {\n  console.log(a + b);\n};\nconst minus = (a, b) => {\n  console.log(a - b);\n};//# sourceURL=[modu
```

显示的是`/*! exports provided: add, minus */`然后已经把`add`和`minus`这两个方法都打包在这个包里，那现在我的`Tree Shaking`已经配置好了，首先`optimization`这块我们配置了`usedExports: true`，接着我们在`package.json`里面配置好了`sideEffects`，然后我们重新做一次代码的打包：

```
C:\Users\nickname\Desktop\lesson_3>npx webpack
```

main.js

```
/***/ "./src/math.js":
/*!*********************!*\
  !*** ./src/math.js ***!
  \*********************/
/*! exports provided: add, minus */
/*! exports used: add */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return add; });\n/* unused harmony export minus */\nconst add = (a, b) => {\n  console.log(a + b);\n};\nconst minus = (a, b) => {\n  console.log(a - b);\n};//# sourceURL=[module]\
```

然后我们在打开`main.js`,大家可以看到啊这个时候`a+b`这个`add`方法存在，可是呢这个`minus`方法依然也存在，你可能会觉得这个`Tree Shaking`好像没有生效啊？

其实它已经生效了我们看之前它只有一个`/*! exports provided: add, minus */`而现在又多了一个`/*! exports used: add */`，指的是我现在这个模块提供了两个方法但是只有一个方法`add`这个方法被使用了虽然它没有把这个`minus`方法去除掉，但是现在`Webpack`打包的时候它已经知道只有`add`被使用了而`minus`并没有使用，在`Webapck`的这个`development`开发环境下做打包的时候即使你用了`Tree Shaking`它也不会把你的代码直接从打包生成的这个`main.js`文件里去除掉，它只是会在这个代码里面提示你一下，之所以是这样子啊是因为我们在开发环境生成的这个代码啊需要做一些调试，如果`Tree Shaking`把一些代码删除掉的话那么在做调试的时候可能代码对应的行数`Source Map` 啊对应的行数什么的就都错了。

所以开发环境下`Tree Shaking`还会保留这些代码，好了真正如果我们要对我们的代码打包上线把这个`development`变成`production`的时候，好这个时候`Tree Shaking`就会生效了，当然如果你要打包上线把这个`mode: "production"`的话首先`devtool:`这块之前我给大家讲过`production`环境下一般我们会使用这个`cheap-module-source-map`同时呢`production`这个模式下其实`Tree Shaking`自动的一些配置就已经写好了，那在`development`环境下面我们甚至都不需要写这个:

```
optimization: {
    usedExports: true
  }
```

这个配置项，所以这块其实是要把它注释掉的，但是`package.json`里面的`sideEffects: false`你还是要写一下的。

好当我们做好了`production`这个环境的配置之后，我们呢在来重新做一个项目的打包：

```
C:\Users\nickname\Desktop\lesson_3>npx webpack
```

打包好了之后我们来看`dist`目录下`Source Map`会生成一个`main.js.map`这样的一个`Source Map`文件，那`main.js`我们打开因为我们是打包生成线上的代码`production`这个环境下它会把打包生成的代码全部做压缩：

main.js

```
function(e,t,r){"use strict";r.r(t);var n,o;n=1,o=2,console.log(n+o)}
```

大家可以看到这里`a+b`这样的一个`add`方法被压缩过大家可以看到，但是我们在搜索`a-b`另外一个对应的`console.log`你根本就搜不到，这就说明在我们打包生成线上代码的时候它已经把`minus`这个源代码里的内容给它剔除掉了，这个`Tree Shaking`的功能就已经生效了。

好这块呢同学可能有点不太理解，这个`production`的 mode 和`development`的 mode 它们之间的区别是什么，为什么要有这两个`mode`呢，好这块的内容我们先
不着急讲我们放在下节课给大家细细道来，这节课大家只要把`Tree Shaking`这个
概念搞清楚就可以了。

### 复习

- `Tree Shaking`就是当我引入一个模块的时候我不引入这个模块所有的代码我只引入它需要的代码，这就需要借助`Webpack`里面自带的这个`Tree Shaking`功能帮助我们实现。

- 那`Tree Shaking`只支持`ES Module`也就是`import`这种的模块引入，如果你是`CommonJS`这样的模块引入`Tree Shaking`是不支持的。

- 配置`Tree Shaking`其实非常的简单，那首先打开`webpack.config.js`如果你的模式是`production`那么你其实`Tree Shaking`这块根本不需要添加新的配置就可以了（默认是打开的），只需要把这个`devtool`改成`cheap-module-source-map`即可，那如果你是`development`你的`devtool`也就是`Source Map`的形式是`cheap-module-eval-source-map`这个时候呢你要在下面加一个：

```
optimization: {
    usedExports: true
  }
```

来配置这个`Tree Shaking`。

然后接着我们来看`Tree Shaking`除了要在`webpack.config.js`里面要做配置之外还要在`package.json`里面去写一个`sideEffects`，如果某些文件你不需要做`Tree Shaking`（比如说：css文件，`@babel/polyfill`这样的js模块）那么你可以把它通过数组的形式配置在`sideEffects`里面就可以了：

```
// "sideEffects": false,
  "sideEffects": [
    "*.css"
  ],
```

如果没有要配置的内容那这里你填一个`false`（"sideEffects": false）也是可以的。


### 注意：

- development模式下，不管设置"sideEffects": false 还是 “sideEffects”: [".css"],style.css都不会被tree shaking，页面样式还是会生效，结论就是，开发模式下，对于样式文件tree shaking是不生效的
- production模式下，“sideEffects”: false页面样式不生效，说明样式文件被tree shaking了；然后设置"sideEffects": [".css"]样式生效，说明样式文件没有被tree shaking，结论就是，生产模式下，对于样式文件tree shaking是生效的
