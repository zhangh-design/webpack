23 Lazy Loading 懒加载，Chunk 是什么？

> 前言：这节课我们来讲解`Lazy Loading`懒加载的概念，以及`Chunk`究竟是什么，实际上这两部分的内容在之前的章节里我们都有用到，只不过没有提炼出来它的核心概念。

#### Lazy Loading 懒加载 是什么

打开我们的`lesson`项目：

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

index.js

```
// 同步
import _ from 'lodash';

var element = document.createElement('div');
element.innerHTML = _.join(['hello', 'world'], '-');
document.body.appendChild(element);

// 异步
function getComponent () {
  return import(/* webpackChunkName:"lodash" */ 'lodash').then(({ default: _ }) => {
    var element = document.createElement('div');
    element.innerHTML = _.join(['hello', 'world'], '-');
    return element;
  });
}

getComponent().then(element => {
  document.body.appendChild(element)
})

```

现在我同步的引入了`lodash`这个模块，然后我用`lodash`的`join`函数生成一个字符串挂载到页面上，那这是一段同步的代码。

那下面注释的这段代码呢实现的是一模一样的功能，但是它用的是一种异步加载组件的方式去加载`lodash`这个模块。

那实际上同学们就会有疑问：

上面同步的代码非常的简洁你为什么要写成下面这种异步的代码呀，好，写成下面这种代码是因为下面这种代码的写法可以实现一种`懒加载`的行为。

我们对`index.js`中的代码做一个改进：

现在我们是怎么样的呀，我们是只要页面一运行就会去加载`lodash`然后去生成一个元素挂载到页面上，那假设我写这么一段代码：

```
function getComponent () {
  return import(/* webpackChunkName:"lodash" */ 'lodash').then(({ default: _ }) => {
    var element = document.createElement('div');
    element.innerHTML = _.join(['hello', 'world'], '-');
    return element;
  });
}

/* getComponent().then(element=>{
    document.body.appendChild(element)
}) */

document.addEventListener('click', () => {
  getComponent().then(element => {
    document.body.appendChild(element)
  })
})
```

大家来看这是什么意思，当我们页面执行这段js代码的时候`getComponent()`方法一开始并不会执行而只有你点击了一下页面，然后它才会加载这个`lodash`的模块
然后运行里面的代码往页面上挂载一个内容。

我们改写成这样对代码进行一次打包：

（这里打包的时候注意下：splitChunks.cacheGroups.vendors.filename 配置项需要注释掉，因为：filename只有在模式为initial（同步）下才有效，而我们这里是异步的引入所以设置了filename会报错）

ie下运行请参考[->ie环境下的动态 import 导入需要的兼容性配置](https://github.com/zhangh-design/webpack/tree/master/webpack_01/22-1%20ie%20%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%8A%A8%E6%80%81%20import%20%E5%AF%BC%E5%85%A5%E9%9C%80%E8%A6%81%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E9%85%8D%E7%BD%AE)

```
F:\github-vue\workspaces\lesson2>npm run dev-build

> webpack-demo@1.0.0 dev-build F:\github-vue\workspaces\lesson2
> webpack --config ./build/webpack.dev.js


F:\github-vue\workspaces\lesson2>"node"  "F:\github-vue\workspaces\lesson2\node_
modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpac
k.dev.js
clean-webpack-plugin: removed dist
Hash: 41c1d96e8976290efdd2
Version: webpack 4.42.0
Time: 2291ms
Built at: 2020-03-13 12:55:46
            Asset       Size          Chunks             Chunk Names
       index.html  204 bytes                  [emitted]
          main.js   35.5 KiB            main  [emitted]  main
vendors~lodash.js   1.36 MiB  vendors~lodash  [emitted]  vendors~lodash
Entrypoint main = main.js
```

dist

```
dist
 |-index.html
 |-main.js
 |-vendors~lodash.js
```

然后我们打开`dist`目录你可以看到现在：

`vendors~lodash.js`被打包出来了，因为我们说过`import`这种形式引入的异步的模块我们都会单独的对它做代码分割生成一个文件。

`main.js`放的是我们的一些业务代码，比如说：`document.addEventListener`这种都会放到`main.js`里面（`babel`转义`es6`高级函数的代码也会同步打包到`main`.js中这样`main.js`文件的大小就会变大比较大，如果配置了`cacheGroups`那么会根据缓存组进行代码的分割），那我们打开`dist`目录下的`index.html`我们把它在浏览器上打开，点开浏览器的控制台我们点击`NetWork`我们现在刷新页面，大家可以看到当我页面一刷新的时候只加载了`index.html`文件和`main.js`，而我们打包的这个`vendors~lodash.js`有没有加载啊，没有加载，为什么呢？

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*VJyz0*Vz0E3o.4iNjztpWQ06RnPCShBvh4y8.McYVxxx9eArelDV4upaifpCZWjFg!!/b&bo=bAI.AQAAAAARB2E!&rf=viewer_4&t=5)

因为一开始`index.js`执行的时候它用不上这个`lodash`，所以呢通过动态`import`这种语法写的这种组件现在你没有执行到`import`这一块的代码所以呢它就不会去加载`vendors~lodash.js`代码。

好当我点击了页面上任何一个位置之后`getComponent()`函数才会执行这个时候`import`这个语句才会执行才会去加载`lodash`对应的这个模块，那我们是不是这样的：

当我点击页面上任何一个区域的时候，大家可以看到`vendors~lodash.js`被加载了，然后`hello-world`被显示出来了

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*dwzFBpWgYc4cNb50ZROx9WxAtDB*7mEGwsmz61VvdnX0tjbC2dBD9Nwq4YhEf5HHg!!/b&bo=GwJIAQAAAAARB2A!&rf=viewer_4&t=5)

所以大家可以看到，通过`import`这种语法有一些模块就可以对它进行懒加载，一开始的时候我并不需要加载`lodash`那么我们就不执行`getComponent()`那里面这个`import`就不会被执行，所以呢它就不会去加载`lodash`，当我在页面上点击某个区域的时候执行了`getComponent()`的时候它才会去加载`lodash`。

这样的话`lodash`加载变成了一个不一定什么时候才会被执行的一个加载，所以呢
它是一个懒加载，那这就是懒加载的一个概念其实懒加载指的就是通过`import`来去异步的加载一个模块，但是到底什么时候去加载这个模块实际上是不一定的要看你代码怎么去写，你什么时候真正的去执行这个`import`语法的时候它对应的这个模块才会被载入，这就是模块懒加载的一个概念。

那模块懒加载它有什么样的好处呢，借助`import`这种语法啊我们可以让我们的页面加载速度更快，比如说：

我刷新页面的时候根本用不到`lodash`这个库，那么我只需要加载`main.js`就行了，`lodash`这块的代码不会被额外载入到页面上所以这块js加载的速度就会很快
页面很快的就会展示出来。

那如果大家之前写过`React`或者`Vue`这样的框架代码的话你会知道它里面有路由的概念也就是访问不同地址的时候会展示不同页面组件
，那实际上如果你呢这些页面的代码都打包在一个文件里然后呢你去访问这个项目的时候，你访问首页的时候实际上你把其它的一些详情页啊列表页的内容一起都加载了，那实际上首页的时候只需要首页的代码它不需要其它页面的代码，那遇到这种情况下你就可以把首页单独通过`Webpack`做一个代码的分割，那详情页做一个代码的分割然后列表页在做一个代码的分割，那当我们做路由切换的时候通过这种异步组件的形式在把对应页面的代码载入进来执行就可以了，这样的话每个页面的速度呢加载起来会有所提升。

好懒加载实际上并不是`Webpack`里面的一个概念而是`ESModule`里面的一个概念所以呢它和`Webpack`本质上关系不大，`Webpack`只不过是能够识别出这种`import`语法然后对它引入的模块进行代码分割而已，所以呢这块这节课先给大家去讲解一下这种懒加载的一个概念，实际上就是`import`这个语法。

那`import`这个语句：

```
import(/* webpackChunkName:"lodash" */ "lodash").then(()=>{})
```

大家看后面可以跟一个`then`说明呢它返回的是一个`promise`类型那也就意味着
如果你想在你的代码里面去使用这种`import`你必须要使用`babel-polyfill`这样的一个东西，因为在低版本浏览器下它很有可能不支持`promise`这样的一个语法
所以你要想用它记得一定要使用`babel-polyfill`。

那我们的项目当中使没使用`babel-polyfill`呢实际上我们已经使用过了：

```
"devDependencies": {
    "@babel/core": "^7.8.4",
    "@babel/plugin-syntax-dynamic-import": "^7.8.3",
    "@babel/preset-env": "^7.8.4",
    "babel-loader": "^8.0.6",
},
"dependencies": {
    "@babel/polyfill": "^7.8.3",
    "core-js": "^3.6.4"
}
```

大家可以打开`..babelrc`我们在这里设置了`@babel/preset-env`：

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
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}

```

我们在看`webpack.common.js`：

```
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader"
}
```

当加载js文件的时候实际上我们用到了`babel-loader`而且呢我们应该还在`.babelrc`做过一些配置我们用了`"useBuiltIns": "usage"`同时呢我们在项目的`package.json`里面应该也安装过了`@babel/polyfill`。

（其实不安装`@babel/polyfill`也行因为呢`@babel/preset-env`新的版本里面应该已经内置了`@babel/polyfill`这样的一个东西，当我们配置了`"useBuiltIns": "usage"`这样的一个参数之后呢，实际上在我们的项目里面写代码的话它会检测我们的环境如果呢这个环境里没有`promise`它其实底层已经自动的会调`@babel/polyfill`帮助我们去往这个环境里注入`promise`这样的东西，所以结合之前我们`Webpack`里做的配置现在我们可以放心大胆的在这里使用`Promise`，使用`import`语句动态导入不会有任何问题的）


好，讲到这关于我们第一个知识点也就是`Lazy Loading 懒加载`的概念就给大家讲完了。

---

#### Chunk 是什么

那么第二个知识点我要给大家讲`Chunk`是什么，那现在讲`Chunk`呢就比较合适了，大家可以看到现在因为有了代码分割我的`index.js`打包过后会被拆分成两个`js`文件，那么在`webpack`打包的过程中生成了几个js文件，那么每一个文件我们都把它叫做一个`Chunk`。

dist

```
dist
 |-index.html
 |-main.js   // chunk
 |-lodash.js // chunk
```

那`main.js`是一个`Chunk`，`lodash.js`也是一个`Chunk`。

我们可以回过来看一下打包的过程：

大家可以看啊在这个打包的命令行里面，你可以看到`main.js`它的`Chunk`是`main`而`lodash.js`它的`Chunk`是`lodash`所以呢每一个文件实际上都是一个`Chunk`，这块这个概念大家要搞清楚了。

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 49e8db0cee2dccc2be61
Version: webpack 4.42.0
Time: 2513ms
Built at: 2020-03-15 19:47:10
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
 lodash.js   1.35 MiB  lodash  [emitted]  lodash
   main.js    314 KiB    main  [emitted]  main
Entrypoint main = main.js
```


好，那这个`Chunk`有一些什么样的意义呢？

我们打开`webpack.common.js`，找到之前我们做的一长串的配置：

```
    splitChunks: {
      chunks: "all", // initial（同步） async（异步） all（同步和异步）
      minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块 （默认值是30000字节也就是30kb）
      // maxSize: 0, 可以不配置（建议不配置）
      minChunks: 1, // 模块引入的次数
      maxAsyncRequests: 5, // 一般不用改
      maxInitialRequests: 3, // 一般不用改
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        // vendors: false,
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          // filename: "vendors.js" // 同步引入
        },
        // default: false
        default: {
          priority: -20,
          reuseExistingChunk: true,
          // filename: 'common.js'
        }
      }
    }
```

在这里`splitChunks`做代码分割的时候我们在这里有个配置项`minChunks`，好这块就出现了一个`Chunk`关键字，那`minChunks`是什么意思？

大家可能之前觉得好像你理解了实际上我相信绝大多数同学理解的并不一定对。

我呢把`minChunks`改成`2`然后我来举个例子：

假设我现在要引入`lodash`这样的一个第三方的模块那到底要不要对它进行代码分割呢？

- 首先`chunks: "all"`它是满足的。
- `minSize: 30000`那`lodash`库呢也大于`30KB`也是满足的。
- 但是能不能满足`minChunks: 2`呢要看，怎么看呢，假设我们的整个项目打包运行过后啊在`dist`目录下会生成
很多个`Chunk`文件，那如果有两个以上的这个文件里面需要依赖`lodash`那么我就需要对`lodash`进行`Code Splitting`代码分割也就是单独的生成一个`lodash.js`这样的一个打包文件对它进行代码分割，那假设整个项目打包之后呢我们`dist`目录下有很多个`Chunk`文件但是只有一个`Chunk`用到了`lodash`这个库，那么`minChunks`我们配置的是`2`但是实际上所有的打包生成的`Chunks`里面只有一个用到`lodash`它是小于`2`那么`lodash`就不会被进行代码分割，所以`minChunks`指的是到底打包生成的这些`Chunk`里面有几个用了`lodash`，那至少有两个用到`lodash`的时候我才对代码进行分割。

所以呢要想理解`minChunks`这个参数大家必须得把`Chunk`这个概念搞清楚，那么这节课你也把它搞清楚了这个参数呢我相信大家一定没有什么问题了。


好，回到最开始大家记得吗，当我讲解`Code Splitting`的时候最开始的时候我们在`webpack.common.js`里面的`optimization.splitChunks`里什么都没有配置，只配置了一个`chunks: "all"`：

```
optimization: {
    splitChunks: {
        chunks: "all"
    }
}
```

就可以了，为什么其它的不需要配置呢，是因为如果我们不配置其它的参数其它的就会使用默认项配置：

```
minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块 （默认值是30000字节也就是30kb）
// maxSize: 0, 可以不配置（建议不配置）
minChunks: 1, // 模块引入的次数
maxAsyncRequests: 5, // 一般不用改
maxInitialRequests: 3, // 一般不用改
automaticNameDelimiter: "~",
name: true,
cacheGroups: {
// vendors: false,
vendors: {
  test: /[\\/]node_modules[\\/]/,
  priority: -10,
  // filename: "vendors.js" // 同步引入
},
// default: false
default: {
  // minChunks: 2,
  priority: -20,
  reuseExistingChunk: true,
  // filename: 'common.js'
}
}
```

，那现在我们也对这个默认项那现在我们也对这个默认项没有太多的变更，所以呢你用这个默认项就可以了，`chunks: "all"`下面的配置你都可以把它删除掉，然后默认项的这个`chunks`它默认值是`asyns`这块呢我不仅仅希望对异步的代码进行代码分割还需要对同步的代码做代码分割所以这块把`Chunks`改成`all`就可以了，这就是为什么一开始我们这里只写一个`Chunks: "all"`即可。

好，代码分割呢实际上我们在真正的`Webpack`的配置之中啊你可以直接写成这样就可以了：

```
optimization: {
    splitChunks: {
      chunks: "all"
    }
}
```

让它自动的帮你做一些代码的打包分割就没什么问题，`Webpack`呢做这个代码分割其实也比较合理也比较正确。

但是有的时候你就是想按照自己的一些风格和方法去做代码的打包的话那么你自己在过来根据我之前讲的这个配置参数对它的默认参数做一些修改让它的代码分割符合你的要求即可。

讲解到这那这节课两个核心的知识点就给大家讲解完毕了：

- Lazy Loading 懒加载，它指的是我们`import`这种语法，可以让我们在页面执行的时候需要某些模块的时候在去请求某些模块的源代码，不需要一次性把所有的代码都加载到页面上，这是一个它的非常好的特性。
- 我们第二个知识点讲解到了`Chunk`这个概念，`Chunk`指的是我们整个项目完成打包之后，`dist`目录下有几个`js`文件那么我们每一个文件其实都是一个`Chunk`也就是打包的一个片段。
