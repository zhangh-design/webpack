22 SplitChunksPlugin 配置参数详解（2）

[->理解webpack4.splitChunks](https://www.cnblogs.com/kwzm/p/10314438.html)

#### minSize: 0 （设置成0的意思）和cacheGroups.default

我先把`src`目录下的`index.js`中的代码都注释掉然后在`src`目录新建一个`test.js`的文件：

test.js

```
export default {
  name: 'hello world'
}

```

index.js

```
import test from './test.js'
console.info(test.name);
```

然后在我的`index.js`这个入口文件里面我们引入当前目录下的`test.js`。

`test`这个我们自己写的小的模块它是非常非常的小的它可能连`1KB`都不到，那么我们看配置里面：

```
splitChunks: {
  chunks: 'all',
  minSize: 30000,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  automaticNameDelimiter: '~',
  name: true,
  cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      filename: 'vendors.js'
    },
    default: false
  }
}
```

只有大于`30KB`的这种模块我在打包的时候才会做代码分割，那现在我们这个模块肯定小于`30KB`所以呢肯定不应该做代码分割，那我们试下是不是这样的：

```
F:\github-vue\workspaces\lesson2>npm run dev-build

> webpack-demo@1.0.0 dev-build F:\github-vue\workspaces\lesson2
> webpack --config ./build/webpack.dev.js


F:\github-vue\workspaces\lesson2>"node"  "F:\github-vue\workspaces\lesson2\node_
modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpac
k.dev.js
clean-webpack-plugin: removed dist
Hash: 145bdb669390e4a5e1b0
Version: webpack 4.42.0
Time: 5220ms
Built at: 2020-03-10 12:48:04
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js   32.1 KiB    main  [emitted]  main
Entrypoint main = main.js
```

lesson

```
dist
 |-index.html
 |-main.js
```

大家来看是不是没有做代码分割啊，那如果我们把`minSize`改成`0`：

```
splitChunks: {
    chunks: 'all',
    minSize: 0
}
```

也就是只要大于0的这个模块打包的时候我都做代码分割，那行不行：

```
F:\github-vue\workspaces\lesson2>npm run dev-build

> webpack-demo@1.0.0 dev-build F:\github-vue\workspaces\lesson2
> webpack --config ./build/webpack.dev.js


F:\github-vue\workspaces\lesson2>"node"  "F:\github-vue\workspaces\lesson2\node_
modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpac
k.dev.js
clean-webpack-plugin: removed dist
Hash: 145bdb669390e4a5e1b0
Version: webpack 4.42.0
Time: 4740ms
Built at: 2020-03-10 12:51:05
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js   32.1 KiB    main  [emitted]  main
Entrypoint main = main.js
```

lesson

```
dist
 |-index.html
 |-main.js
```

来看一下，大家看它还是没有做代码分割啊，你不是说只要大于0的话引入的模块都做代码分割的吗，那为什么现在没有做代码分割呢？

原因是其实当你在引入这个`test`模块的时候它已经符合`minSize`大于0的一个要求了，`Webpack`已经知道应该对它进行代码分割了，但是它会继续往下执行配置对于同步的模块引入它会走哪个配置参数啊：

它会走`cacheGroups`那么我们来看`vendors`这个配置组里面我们引入的这个`test`模块符不符合这个组的要求？它在不在`node_modules`这个目录下呢它是不在`node_modules`这个目录下的，所以打包生成的文件不会放到`vendors.js`里面去（代码分割的文件不会放到`vendors.js`里面去），那它放到哪里呢，它自己就不知道了所以这个时候我们`default`又是`false`它连默认放到哪都不知道，怎么办？

我们呢把`default`这段默认的配置从[官网](https://www.webpackjs.com/plugins/split-chunks-plugin/#optimization-splitchunks)上粘贴过来：

```
splitChunks: {
  chunks: 'all',
  minSize: 0,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  automaticNameDelimiter: '~',
  name: true,
  cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      filename: 'vendors.js'
    },
    // default: false
    default: {
      // 为什么要注释 minChunks: 2 ？
      /**
       这里需要你理解 chunk 是什么，这里的 2 并不是你 import 的次数超过 2，import 的是 module

      chunk 包含着 module，可能是一对多也可能是一对一，一般一个 chunk对应一个bundle

      所以如果我们是单页面（一个chunk一个bundke），那么其实 default 如果设置的是 2 这个缓存组也就不会进行代码的分割
      **/
      // minChunks: 2,
      /*
        这两个配置可以在单页面（一个chunk一个bundke）中将 import 引入的 src 目录下的 module 不论大小都分割到 default 这个组里，一般不建议这么做
        minChunks: 1,
        minSize: 0,
      */
      priority: -20,
      reuseExistingChunk: true
    }
  }
}
```

这里呢`default.minChunks`我先给它去掉，`priority`呢保留`reuseExistingChunk`也保留，`priority`这个参数我们后面再来讲。

我们再来打包：

```
F:\github-vue\workspaces\lesson2>npm run dev-build

> webpack-demo@1.0.0 dev-build F:\github-vue\workspaces\lesson2
> webpack --config ./build/webpack.dev.js


F:\github-vue\workspaces\lesson2>"node"  "F:\github-vue\workspaces\lesson2\node_
modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpac
k.dev.js
clean-webpack-plugin: removed dist
Hash: b421d9ecf45f38deca45
Version: webpack 4.42.0
Time: 2271ms
Built at: 2020-03-11 12:28:28
          Asset       Size        Chunks             Chunk Names
default~main.js   3.66 KiB  default~main  [emitted]  default~main
     index.html  266 bytes                [emitted]
        main.js   31.2 KiB          main  [emitted]  main
Entrypoint main = default~main.js main.js
[0] multi ./src/index.js 28 bytes {default~main} [built]
[./src/index.js] 670 bytes {default~main} [built]
[./src/test.js] 41 bytes {default~main} [built]
```

lesson

```
dist
 |-default~main.js
 |-index.html
 |-main.js
```

可以看到这个时候我们已经完成了代码分割，它会把代码分割到`default`这样的一个组里名字是`default~main.js`指的是它属于`default`这个组同时它的入口文件是`main.js`这个文件，那你也可以给它在来配置一个`filename`参数：

```
default: {
  // minChunks: 2,
  priority: -20,
  reuseExistingChunk: true,
  filename: 'common.js'
}
```

让它都打包到一个`common.js`的文件里，那从新运行`npm run dev-build`：

```
F:\github-vue\workspaces\lesson2>npm run dev-build

> webpack-demo@1.0.0 dev-build F:\github-vue\workspaces\lesson2
> webpack --config ./build/webpack.dev.js


F:\github-vue\workspaces\lesson2>"node"  "F:\github-vue\workspaces\lesson2\node_
modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpac
k.dev.js
clean-webpack-plugin: removed dist
Hash: b421d9ecf45f38deca45
Version: webpack 4.42.0
Time: 2003ms
Built at: 2020-03-11 12:34:29
     Asset       Size        Chunks             Chunk Names
 common.js   3.66 KiB  default~main  [emitted]  default~main
index.html  260 bytes                [emitted]
   main.js   31.2 KiB          main  [emitted]  main
Entrypoint main = common.js main.js
[0] multi ./src/index.js 28 bytes {default~main} [built]
[./src/index.js] 670 bytes {default~main} [built]
[./src/test.js] 41 bytes {default~main} [built]
```

lesson

```
dist
 |-common.js
 |-index.html
 |-main.js
```

我们再来看这个时候啊你的这个`test.js`这个模块啊就会被做代码分割，分割到哪里去呢，分割到`default`这个组里面对应的这个`common.js`这个文件里了，我们打开`common.js`：

你可以看到这里`test.js`确实在这里。

```
/***/ "./src/test.js":
/*!*********************!*\
  !*** ./src/test.js ***!
  \*********************/
/*! exports provided: default */
/*! exports used: default */
```

OK，所以呢你会发现当我们去同步的加载一些模块的时候，做代码分割的时候上面的这些配置项：

```
chunks: 'all',
minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块
minChunks: 1,
maxAsyncRequests: 5,
maxInitialRequests: 3,
automaticNameDelimiter: '~',
name: true,
```

实际上跟`cacheGroups`这里的东西都是有关联的，那讲到这`minSize`这块也给大家讲解清除了，好我们给它恢复成`30kb`。

##### maxSize

我们再来看`maxSize`它呢可配可不配，我简单的介绍下就可以了。

比如说呢你打包了一个`lodash`这样的第三方库：

index.js

```
/* import test from './test.js'
console.info(test.name); minSize设置为0然后结合cacheGroups.default一起 */

import _ from 'lodash';

var element = document.createElement('div');
element.innerHTML = _.join(['hello', 'world'], '-');
document.body.appendChild(element);
```

你打包了一个`lodash`，`lodash`这个文件有多大呢，有`1MB`多，那你可以呢在`maxSize`这块填一个`50000`字节也就是50KB：

```
chunks: 'all',
minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块
maxSize: 50000, // 50kb （lodash 1MB）
minChunks: 1,
```

好但是你打包的这个`lodash`实际上是`1MB`，如果这个时候你没配置这个`maxSize`那你引入`lodash`的时候它是`1MB`那我怎么办呢，我直接把这个`lodash`单独
做一个代码分割生成一个`1MB`的`lodash`这样的文件就可以了。

但是假设这配置了一个`50KB`的`maxSize`那打包的时候它会再一次对这个`1MB`的
`lodash`这样的一个分割出来的代码尝试进行二次的拆分，看一看能不能把这个`1MB`的`lodash`在拆分成20个`50KB`左右的分割出来的代码，那如果能呢就最好了但一般来说像`lodash`这种库进行二次拆分呢一般是拆不了的，所以即便即配了`maxSize`实际上`lodash`打包出来的还是一个`1MB`的库。

我们可以试验一下：

```
F:\github-vue\workspaces\lesson2>npm run dev-build

> webpack-demo@1.0.0 dev-build F:\github-vue\workspaces\lesson2
> webpack --config ./build/webpack.dev.js


F:\github-vue\workspaces\lesson2>"node"  "F:\github-vue\workspaces\lesson2\node_
modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpac
k.dev.js
Hash: 32e0cba0665b25039e1d
Version: webpack 4.42.0
Time: 2200ms
Built at: 2020-03-11 12:58:55
      Asset       Size                          Chunks             Chunk Names
 index.html  265 bytes                                  [emitted]
main~._m.js   34.3 KiB                        main~._m  [emitted]  main~._m
 vendors.js   1.36 MiB  vendors~main~._node_modules__l  [emitted]  vendors~main~
._node_modules__l
```

dist目录下大家可以看到以前如果我没有配置`maxSize`那么打包生成一个`vendors.js`就够了，现在呢`vendors.js`又被拆分了一下这里面呢又会多一个`main~._m.js`和`main~._m vendors.js` 这样的一个东西，所以呢它会对这个`lodash`再次进行更细一步的代码分割。

那这块的话一般来说`maxSize`我们配置的还是比较少的，所以大家了解一下`maxSize`就行了。

##### 注意：
新版的`Webpack`（我安装的是`4.41.6`的版本）如果`maxSize`配置成`50KB`的话打包没有报错，但是没有生成`dist`目录，这里还是建议不配置或者配置成`maxSize: 0`。

#### minChunks

那`minChunks`这是一个什么意思呢？

`minChunks`指的是当一个模块被用了至少多少次的时候才对它进行代码分割，这里我们填的`1`，那看一下我们在我们的入口文件里面`index.js`只去引入了一次`lodash`满足这个`minChunks: 1`这样的条件，所以它会做代码分割。

那假设我把它改成`minChunks: 2`，我们重新运行一下`npm run dev-build`打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 7f39946dc1a0426c45dc
Version: webpack 4.42.0
Time: 1973ms
Built at: 2020-03-11 21:33:43
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js   1.39 MiB    main  [emitted]  main
Entrypoint main = main.js
```

lesson

```
dist
 |-index.html
 |-main.js
```

看一下我们打包生成的文件夹你会发现它就不做这个代码分割了，为什么？

因为它发现入口文件里面只用了几次`lodash`，只用了一次`lodash`的引入小于我们这里配置的这个`2`所以呢它就不会做代码分割了。


#### maxAsyncRequests

那么接下来呢我们在看一下下面的几个配置参数，那这块呢有个`maxAsyncRequests`指的是同时加载的模块数最多是`5`个，举个例子来说啊：

假如我的这个代码分割，分割的非常厉害那引入了10个类库呢就分割成了10个js的代码，那你打开网页的时候同时要加载10个代码它就违反了什么？

违反了`maxAsyncRequests`设置成5的这样一个要求，同时只能加载5个请求，那`Webpack`遇到这个参数会怎么办呢？在打包前5个库的时候它会帮你生成5个js文件
当然如果超过5个呢它就不会在做代码分割了。

#### maxInitialRequests

`maxInitialRequests`指的是整个网站首页进行加载的时候或者说入口文件进行加载的时候入口文件里面可能会引入其它的js文件或者其它的库，那入口文件引入的库如果做代码分割最多也只能分割出3个这样的js文件，如果超过3个呢就不会再做代码分割了。

这块的东西一般来说我们不用去改变默认的配置值，放在这按照默认的配置实际上就可以了。

#### automaticNameDelimiter

在来看这个`automaticNameDelimiter`它的意思是呢，打包分割代码的文件生成的时候这个文件中间啊会有一些连接符，我们来看一下实际上之前已经见过这个问题了。

我们把`vendors`这块的`filename`把它注释掉并且把`minChunks`修改回`1`：

```
minChunks: 1,
cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      // filename: "vendors.js"
    },
    default: {
        priority: -20,
        reuseExistingChunk: true,
        filename: 'common.js'
    }
}
```

重新打包我们的代码：

```
C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 937f0383dd6a970d53f4
Version: webpack 4.42.0
Time: 1635ms
Built at: 2020-03-11 21:54:13
          Asset       Size        Chunks             Chunk Names
     index.html  266 bytes                [emitted]
        main.js   34.1 KiB          main  [emitted]  main
vendors~main.js   1.36 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.js main.js
```

lesson

```
dist
 |-index.html
 |-index.js
 |-vendors~main.js
```

大家可以看到啊`dist`目录下这个时候会生成一个`vendors~main.js`指的是我在`vendors`这个组里面入口是`main.js`，这两个单词中间它用了一个`~`波浪线连接
，那`automaticNameDelimiter`指的就是这个组和文件之间它呢如果做文件名的连接的时候要用这个`~`做一个连接符。


#### name: true

`name: true`指的是打包生成的文件我起什么名字呢，`cacheGroups`里面这个`filename`我让它有效，所以这块呢`name: true`一般呢我们也不会去改变它的一个默认配置。

#### cacheGroups

那`cacheGroups`之前也给大家讲了，当我打包同步代码的时候`cacheGroups`上面配置的参数会有效，然后呢会继续往下走这个`cacheGroups`的一个配置内容，我们会根据`cacheGroups`来决定我要分割出来的代码到底放到哪个文件里面去，那如果这里面你配置了`filename: 'vendors.js'`这个参数它的意思就是如果你引入的文件大于`minSize: 30000`并引入了超过一次`minChunks: 1`同时满足`maxAsyncRequests:5`和`maxInitialRequests: 3`这两个需求，那么它就可以做代码分割了。

那到底分割到哪里去呢？

我们在`cacheGroups`这里面去看，如果它是从`node_modules`里面引入的模块那我就把它打包到配置的`filename: 'vendors.js'`的`vendors.js`里面来，`cacheGroups`它名字起成`缓存组`是有它的原因的：

比如说呢，我同时引入了一个`lodash`还引入了一个`jquery`：

安装`jquery.js`

```
F:\github-vue\workspaces\lesson2>cnpm install jquery -S
```

然后我在我的`index.js`代码里面去引入这个`jquery`：

```
import _ from 'lodash';
import jquery from 'jquery'

var element = document.createElement('div');
element.innerHTML = _.join(['hello', 'world'], '-');
document.body.appendChild(element);
```

假设没有这个`cacheGroups`，我们去引入了一个`lodash`和引入了一个`jquery`，那么代码打包会怎么样呢？

它发现`jquery`大于`minSize: 30000`配置的`30KB`我要做代码分割就会生成一个`jquery`这样的打包文件，它发现`lodash`大于`30KB`我又生成一个`lodash`这样的文件，但是假如你想把`jquery`和`lodash`放在一起单独生成`vendors.js`文件，那没有`cacheGroups`你就做不到了，有了`cacheGroups`实际上它相对于一个缓存组，那你打包`jquery`的时候我先不着急生成这个`jquery`的文件我先放到这里组里缓存着，打包`lodash`的时候我发现`lodash`也符合这个组的要求我也缓存到这个组里面，当最终所有的模块都分析好了之后我呢把符合`vendors`这个组的所有的模块打包到一起去，把符合`default`这个组的模块打包到一起去，所以呢`cacheGroups`起名叫做缓存组它
是有它的道理的。


#### cacheGroups.vendors.priority和cacheGroups.default.priority

接着我们再来看`priority`指的是什么。

```
cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      filename: "vendors.js"
    },
    // default: false
    default: {
      priority: -20,
      reuseExistingChunk: true,
      filename: 'common.js'
    }
}
```

假设我引入`jquery`这个组件或者说第三方模块，它呢符不符合`vendors`这个组的要求`node_modules`下的一个`jquery`它是符合的，那它符不符合`default`这个组的要求呢它也是符合的因为`default`这个组里面根本就没有配置`test`这个规则意思就是所有的模块都符合`default`这个组的要求，所以这两个组都符合，那`jquery`到底是放到`common.js`里面呢还是放到`vendors.js`里面呢，实际上是根据这个`priority`来判断的，那它的值越大它的优先级就越高（比如说：-10的优先级就高于-20），所以呢`jquery`会被打包到优先级高的这个组里面也就会放到`vendors.js`里面去。

我们试验一下：

1：

```
cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      filename: "vendors.js"
    },
    // default: false
    default: {
      priority: -20,
      reuseExistingChunk: true,
      filename: 'common.js'
    }
}
```

-10是大于-20的，所以会打包到`vendors.js`这里面去。

我们打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 35efe478afdb1008da76
Version: webpack 4.42.0
Time: 2057ms
Built at: 2020-03-12 21:13:38
     Asset       Size        Chunks             Chunk Names
index.html  261 bytes                [emitted]
   main.js   34.4 KiB          main  [emitted]  main
vendors.js   2.13 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors.js main.js
```

2：

```
cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      filename: "vendors.js"
    },
    // default: false
    default: {
      priority: 20,
      reuseExistingChunk: true,
      filename: 'common.js'
    }
}
```

20是大于-10的，所以会打包到`common.js`这里面去。

我们打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: b3a6adfaa9fc5be65f0d
Version: webpack 4.42.0
Time: 1714ms
Built at: 2020-03-12 21:14:02
     Asset       Size        Chunks             Chunk Names
 common.js   2.13 MiB  default~main  [emitted]  default~main
index.html  260 bytes                [emitted]
   main.js   31.2 KiB          main  [emitted]  main
Entrypoint main = common.js main.js
```

#### reuseExistingChunk: true

那还有最后一个参数`reuseExistingChunk: true`。

那假设啊我有一个模块

index.js

```
import a from 'a.js'
import b from 'b.js'


```
那假设这个`a`模块里面它又去使用了`b`模块，好那在打包`a`模块的时候如果它符合代码分割的要求，那它就会走到下面的`cacheGroups`这里，如果它又符合`default`这个组，那么`a.js`文件呢就会被打包到`common.js`这里面来。

在打包`a.js`这个模块的时候，因为`a.js`这么模块里面呢实际上它又引入了`b.js`这个模块所以正常的来说`b.js`代码也被打包到`common.js`里面来。

但是如果你配置了`reuseExistingChunk: true`它会去看其实`b.js`这个模块在`index.js`中已经被引入过，那如果在之前的逻辑里面我打包的时候已经把`b.js`这个模块呢放到了某个地方，现在在打包`a.js`这个模块的时候如果在用到`b.js`模块，那么`a`模块里的`b`模块就不会放到
`common.js`里面去了，那`common.js`里面用到`a`模块那`a`又用到`b`，它会直接去复用之前已经被打包到某一个地方的那个`b`对应的模块。

所以`reuseExistingChunk: true`指的是如果一个模块啊已经被打包过了，那我在打包的时候就忽略这个模块
直接使用之前被打包过的那个模块就可以了。

#### 总结

好讲解到这里我们终于把`splitChunks`默认的这个配置项给大家都讲解完毕了。

那其实这里面最重点的内容，最难的内容是什么就是在做同步代码的打包过程中：

```
chunks: "all", // initial（同步） async（异步） all（同步和异步）
minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块
// maxSize: 0, 可以不配置（建议不配置）
minChunks: 1, // 模块引入的次数
maxAsyncRequests: 5, // 一般不用改
maxInitialRequests: 3, // 一般不用改
automaticNameDelimiter: "~",
name: true,
```

上面的这些配置项有效，那如果我发现打包的文件符合上面的配置逻辑，实际上这个文件不会被直接的进行代码分割还会走到`cacheGroups: {}`这个缓存分组里面
去，如果你的这个文件符合缓存分组的一些要求它就会把这个文件打包到分组对应的这个最终的文件里面去。

那关于`Webpack`中`splitChunksPlugin`这个插件的配置其实还有很多配置项我们
并没有讲解，大家可以跟我一起打开[Webapck](https://www.webpackjs.com/concepts/)的官方网站我们找到[splitChunksPlugin](https://www.webpackjs.com/plugins/split-chunks-plugin//)然后呢你可以看到它下面呢又非常多的关于参数的说明，其实绝大多数东西我在这里都已经给大家讲解完毕了，那如果有一些细节没有讲到大家呢只要过来把这个文档读一遍就可以了。
