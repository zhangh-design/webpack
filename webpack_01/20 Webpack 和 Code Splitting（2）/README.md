20 Webpack 和 Code Splitting（2）

#### splitChunks: {chunks: 'all'} 同步代码进行代码分割

在一些项目之中我们呢会通过对代码公用部分进行一些拆分来提升我们项目运行的速度，那这种代码的拆分就是这节课要给大家讲的核心概念`Code Splitting`。

所以讲到这里大家应该搞清楚了`Code Splitting`它的概念了，没有`Code Splitting`我们写代码可不可以，完全没有任何的问题，但是有了`Code Splitting`我们通过对代码进行拆分那就可以让我们的代码执行的性能更高一些或者让用户体验更好一些。

那我们说`Code Splitting`它是不是和`Webpack`有关系呢？

其实在没有`Webpack`之前我们通过这种自己对代码进行拆分也可以有效的提升我们项目的性能，所以`Code Splitting`本质上是和`Webpack`没有任何关系的。

那为什么只要一提到`Webpack`很多时候我们在各个地方都能够听说到`Webpack`里面有`Code Splitting`这样的一个东西，现在我们说`Code Splitting`已经和`Webpack`有所绑定了呢，这是因为啊其实`Webpack`有一些插件
可以非常容易的帮我们实现`Code Splitting`也就是代码分割这样的功能，在`Webpack 4`里面有一个插件叫做`SplitChunksPlugin`这个插件呢直接就和`Webpack`做了捆绑你都不用安装直接就可以用。

那呢如果你使用这种插件在去做代码分割的时候你会发现它非常的简单，那我们做个对比：

大家来看啊现在我们做的这种代码分割实际上是自己做的代码分割，怎么说呢我们知道我们要引入一个`Lodash`的库，所以我们自己呀把一个打包输出的`main.js`拆成了`lodash.js`和`main.js`，自己动手做了这件事情所以呢它不够智能。

那在`Webpack`里面实际上通过它自带的一些插件呢，可以智能的帮助我们做`Code Splitting`。

那我们来看`Webpack`怎么自动的去做代码分割：

我们删除掉上一节中创建的`lodash.js`，修改`index.js`中的代码同时在修改`webpack.common.js`中的`entry`入口配置删除掉`lodash`的配置。

lesson

```
build
 |-webpack.common.js
 |-webpack.dev.js
 |-webpack.prod.js
src
 |-index.js
.babelrc
.browserslistrc
index.html
package.json
postcss.config.js

```

webpack.common.js

```
entry: {
    main: ['./src/index.js']
    // lodash: './src/lodash.js', 重新修改成一个 Chunk
    // main: './src/index.js'
  },
```

index.js

```

import _ from 'lodash'; 

console.info(_.join(['a', 'd', 'c'],'***'));
console.info(_.join(['a', 'c', 'c'],'***'));

```

这样的话代码就恢复到最开始的情况了，我们的库和我们的业务逻辑写在一起。

接下来我们呢可以在`Webpack`的配置项里面做一个配置，点开`webpack.common.js`找到最底部，我们可以在这里加一个`optimization`这样的一个配置项，这块呢之前我们也用过（在开发环境下打开`Tree Shaking`优化的时候用过`optimization: {usedExports: true}`），在这里配置项里面我们可以配置一个`splitChunks: {chunks: all}`这样一个简单的配置内容。

webpack.common.js

```
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
}
```

你可以暂时先这么理解它的意思就是：

我要帮你去做代码分割了，那它怎么帮你去做代码分割呢我们现在重新打包来看一下啊。

重新打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: b4c478683e3e7bf1c317
Version: webpack 4.42.0
Time: 2217ms
Built at: 2020-03-07 20:56:27
          Asset       Size        Chunks             Chunk Names
     index.html  266 bytes                [emitted]
========= 注意：这里自动分割出了两个 Chunks 文件 =============     
        main.js   32.8 KiB          main  [emitted]  main
vendors~main.js   1.36 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.js main.js
```

lesson

```
dist
 |--index.html
 |--main.js
 |--vendors~main.js
```


好我们来看一下啊，打包生成的`dist`目录下有一个`main.js`同时还有一个`vendors~main.js`。

我们打开`main.js`来看翻到最底部：

`main.js`里有`index.js`里的业务逻辑但是它里面并没有`lodash`这个第三方库，大家可以看到并没有`lodash`。


```
/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lodash */ \"./node_modules/_lodash@4.17.15@lodash/lodash.js\");\n/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_0__);\n\nconsole.info(lodash__WEBPACK_IMPORTED_MODULE_0___default.a.join(['a', 'd', 'c'], '***'));\nconsole.info(lodash__WEBPACK_IMPORTED_MODULE_0___default.a.join(['a', 'c', 'c'], '***'));//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/YjYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJzsgXHJcblxyXG5jb25zb2xlLmluZm8oXy5qb2luKFsnYScsICdkJywgJ2MnXSwnKioqJykpO1xyXG5jb25zb2xlLmluZm8oXy5qb2luKFsnYScsICdjJywgJ2MnXSwnKioqJykpO1xyXG4iXSwibWFwcGluZ3MiOiJBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ }),
```

而打开`vendors~main.js`然后我们往下去翻大家可以看到这个文件里面把`lodash`单独的提取出来了。


vendors~main.js

```
/***/ "./node_modules/_lodash@4.17.15@lodash/lodash.js":
/*!*******************************************************!*\
  !*** ./node_modules/_lodash@4.17.15@lodash/lodash.js ***!
  \*******************************************************/
/*! no static exports found */
/*! exports used: default */
```

也就是之前我们需要手动的去自己去做代码分割，但是通过`Webpack`一个简单的配置，只在`webpack.common.js`做了一个非常简单的配置：

```
optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
```

你会发现`Webpack`自己就知道了，当遇到这种公用的类库的时候我就会自动的帮你把这个类库打包生成一个文件，把你的业务逻辑在拆分成一个文件自动就帮你实现了这种`Code Splitting`。

好这就是为什么我们经常说`Webpack`中的`Code Splitting`因为有了`Webpack`它会自动的借助插件帮助你实现`Code Splitting`那你在做代码分割就非常简单了，所以说代码分割是`Webpack`中非常有竞争的一个功能。

#### 总结

那么讲到这呢我们在一个小的总结：

我们说`Code Splitting`代码分割其实没有`Webpack`这个概念也存在，通过合理的代码分割可以让我们的项目运行的性能更高，那以前没有`Webpack`的时候我们需要手动的去思考代码怎么做分割合适然后呢自己对代码进行分割，但是有了`Webpack`之后我们只需要在`Webpack`的配置里面去使用几个简单的配置项，`Webpack`它就知道了我们的代码怎么做分割最为合适，它就自动帮我们做了分割不需要我们去考虑这个事情了，这就是`Webpack`里面的代码分割。

---

#### 异步代码加载自动会进行代码分割（也就是不用配置`optimization: {splitChunks: {chunks: 'all'}}`）

当然`Webpack`里面的代码分割不仅仅可以通过这样一个配置项帮我们完成：

```
optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
```

我们呢还可以通过另外的一种方式进行`Webpack`中的代码分割。

我们来给大家举一个例子：

index.js

```
import _ from 'lodash'; // 先加载 lodash 这个模块

// 在执行下面的业务逻辑
console.info(_.join(['a', 'd', 'c'],'***'));
console.info(_.join(['a', 'c', 'c'],'***'));
```

我们呢打开`src`下面的`index.js`文件，之前的代码大家可以看到我呢是先引入`lodash`这个库然后呢调用了这个库里的方法，它是一个同步的执行顺序也就是先去加载`lodash`这个模块再去往下执行，它是一个同步的逻辑那处理这种同步的逻辑`Webpack`呢借助刚才的`splitChunks`配置它会去分析什么样的模块改给它打包生成一个单独的文件做这种代码分割。

那实际上我们除了同步的去引入一些模块之外还可以去做异步模块的引入。

我来给大家写一段代码大家来看：

index.js

（我来写一个方法，这个方法呢实际上是`Webpack`官网上的一个方法）

```
function getComponent() {
  return import("lodash").then(({default : _}) => {});
}

```

实际上这块我是在异步加载`lodash`这个文件，也就是一开始这个`index.js`文件里面并没有`lodash`这个库我是通过这种`JSONP`的形式去获取`lodash`这个库的代码然后获取完了之后呢`then()`方法会执行，在`webpack 4`里面呢`then()`方法接收的内容我们一般会这么写（这是考虑到`CommonJS`它的导出代码的一个情况做的一点兼容）所以这块直接写成`default : _`就可以了。

实际上你引入的这个`lodash`库会被放到哪个变量里呢，会被放到`_`这个变量里然后拿到这个`lodash`对应的库之后，我们可以在这样写：

index.js

```
function getComponent() {
  return import("lodash").then(({default : _}) => {
      var element = document.createElement('div');
      element.innerHTML = _.join(['hello','world'],'-');
      return element;
  });
}

getComponent().then(element=>{
    document.body.appendChild(element)
})
```

好来看这个那内容啊，我们定义了一个函数这个函数呢会异步的加载`lodash`这个库当加载完成功之后它会插件一个`div`标签内容是`hello world`，然后呢把这个 `div`标签返回出去。

那下面呢我们就可以执行这个函数了，这个函数呢它执行之后返回的是这个`import`这个`import`呢实际上返回值又是一个`Promise`所以呢你可以接收到它返回的内容，`Promise`里面它接收的参数是什么就是你`return`的这个`element`，所以在`then(element)`获取到`element`之后我们呢可以把它挂到`body`上。

好大家来看这段代码的意思是什么，我调用`getComponent()`异步的去获取`lodash`这个库，获取到这个库之后我插件一个`element`返回回来，返回回来`then`方法就会接收到这个`element`也就是`lodash`这个库加载好了元素也创建好了，那我把元素挂载到页面上，总的是这样一个逻辑。

那这样的一个逻辑我们对它进行一个打包，看它打包生成的结果是什么样子的：

===========
#### 注意：

==（如果使用的`Webpack`版本较低那么会出现下面的报错，我这里使用的是`4.41.6`的版本没有出现这个报错，应该是`Webpack`已经支持这种异步`import`的语法了）==

如果打包出现:
 
```
Support for the experimental syntax 'dynamicImport' isn't currently enabled
```
它的报错说：`dynamicImport`也就是动态的这种异步获取`lodash`这种语法啊是试验性质的语法，现在我们的代码实际上是不支持这种语法的编写的。
 
那如果我们想去写这种试验性质的语法改怎么做呢？

这个时候啊需要我们用`babel`对这种语法做转换那么呢就就要依赖一个`babel`的插件。

 
安装：

```
cnpm i babel-plugin-dynamic-import-webpack -D
```

配置：

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
  ],
  "plugins": ["dynamic-import-webpack"]
}
```

这样的话呢`babel`帮我们去转义这种异步的实验性质的语法。

但是这个插件不支持`魔法注释`的功能因为这个插件并不是`babel`官方提供的，如果要使用`魔法注释`（下一节中有说明`魔法注释`的作用）请按照`babel`官方的插件`@babel/plugin-syntax-dynamic-import`

`npm install --save-dev @babel/plugin-syntax-dynamic-import`

[->@babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import/)

===========

我们`npm run dev-build`打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 648fd6136f210c62638e
Version: webpack 4.42.0
Time: 2546ms
Built at: 2020-03-08 09:27:11
     Asset       Size  Chunks             Chunk Names
      0.js   1.36 MiB       0  [emitted]
index.html  204 bytes          [emitted]
   main.js   35.2 KiB    main  [emitted]  main
Entrypoint main = main.js
```

lesson

```
dist
 |--0.js
 |--index.html
 |--main.js
```

OK，没有任何的问题打包已经成功结束了，这个时候我们在打开`dist`目录大家可以看到`main.js`打开这个文件我们往下翻，这个文件里有的是`index.js`里的代码剩下呢没有其它的代码了。

main.js

```
/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

eval("/* import _ from 'lodash'; \r\n\r\nconsole.info(_.join(['a', 'd', 'c'],'***'));\r\nconsole.info(_.join(['a', 'c', 'c'],'***'));\r\n */\nfunction getComponent() {\n  return __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.t.bind(null, /*! lodash */ \"./node_modules/_lodash@4.17.15@lodash/lodash.js\", 7)).then(({\n    default: _\n  }) => {\n    var element = document.createElement('div');\n    element.innerHTML = _.join(['hello', 'world'], '-');\n    return element;\n  });\n}\n\ngetComponent().then(element => {\n  document.body.appendChild(element);\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJicQUFDQTs7OztBQUtBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ }),
```

好再来看`0.js`这个文件里大家可以看到`lodash`被打包到了这个`0.js`文件里，

0.js

```
/***/ "./node_modules/_lodash@4.17.15@lodash/lodash.js":
/*!*******************************************************!*\
  !*** ./node_modules/_lodash@4.17.15@lodash/lodash.js ***!
  \*******************************************************/
/*! no static exports found */
/*! all exports used */
```

### 总结

什么意思呢？

也就是`Webpack`在做同步性质的打包的时候，也就是（最开始我们写的`main.js`的时候直接`import`导入的）：

```
import _ from 'lodash'; 

// 业务逻辑

```

这种形式的时候`Webpack`会去分析我们的代码把该提取的代码提取成一个文件来单独的存放，自动的做这种代码的分割。

那现在假设我们的代码是异步加载的，对异步加载的代码`Webapck`也会去做代码的分割，比如说我加载的这个`lodash`第三方库文件是异步加载的：

```
function getComponent() {
  return import("lodash").then(({default : _}) => {
      var element = document.createElement('div');
      element.innerHTML = _.join(['hello','world'],'-');
      return element;
  });
}

getComponent().then(element=>{
    document.body.appendChild(element)
})
```

那么这个库就会被单独的放到一个文件里面去。

所以现在大家应该知道了实际上`Webpack`的代码分割有两种方式:

- 一种呢是借助`Webpack`里面的配置，也就是`webpack.common.js`里面的这个配置：

```
optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
```

然后去编写我们的同步代码，那这个配置结合我的同步代码它回去分析我们同步代码里的内容，做代码的分割。

- 另一种形式是呢即便我们不配置这个：

```
optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
```

我们也这种异步的载入组件的方式，那异步载入的组件也会自动的被打包到一个单独的文件里，这也是另外一种`Webpack`的代码分割。

这两种代码分割的方式大家要区分好，记住好，这样的话呢实际上这节课该给大家介绍的内容就差不多了。

##### 那我们最后再来做一个总结：

因为关于`Webpack`的这种代码分割啊确实有一点绕，所以呢我要给大家整体的思路先捋清楚。

首先代码分割，和`Webpack`无关，这点大家要清楚它是单独的一个概念用来提升我们整个项目的性能。

那么`Webpack`中实现代码分割有两种方式：

1. 同步代码想做代码分割怎么做（从上往下顺序执行的这种代码）
   只需要在`webpack.common.js`中做`optimization`的配置即可
2. 异步代码，异步代码指的是什么，指的是（import）这种语法引入的这种异步组件或者模块对应的代码，那这种异步代码无需做任何配置，会自动进行代码分割
，放置到新的目录当中。   
   
好这就是呢这节课我们给大家讲的几点，那大家呢可以反复看一下把这几个知识点
都弄懂就可以了。
