21 SplitChunksPlugin 配置参数详解（1）

> 前言：上一节我给大家讲解了代码分割以及在`Webpack`中如何使用代码分割这种技术，那实际上`Webpack`中的代码分割底层使用了`SplitChunksPlugin`这个插件，那这节课呢我将给大家讲解这个插件中可以进行配置的一些参数。

#### `magic comment`（`魔法注释`）

首先我们打开上节课的lesson项目，我们可以看到了在`index.js`这里我们的业务代码去加载了一个`lodash`这样的库（是一个异步加载），那只要是异步加载的`Webpack`打包的时候就会帮助你把异步加载的文件单独打包生成一个文件，自动做这个代码的分割。

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

我们打包`npm run dev-build`：

lesson

```
dist
 |--0.js
 |--index.html
 |--main.js
```

0.js

```
/***/ "./node_modules/_lodash@4.17.15@lodash/lodash.js":
/*!*******************************************************!*\
  !*** ./node_modules/_lodash@4.17.15@lodash/lodash.js ***!
  \*******************************************************/
/*! no static exports found */
/*! all exports used */
```

大家可以看到在`dist`目录打包生成的文件是一个`0.js`，这里面呢存储的是我们的`lodash`这个库的代码。

那我想把这个`0.js`给它改一个名字，因为呢现在这个`0`实际上是`Code Splitting`也就是代码分割产生的一个`id`的值我希望呢给它加一个可以识别的英文的名字，那怎么办？

在这种异步加载组件的代码之中呢我们有一种语法叫做`magic comment`也就是`魔法注释`，那我们只要这么写就可以了：

==（`webpackChunkName`它的语法是这样的我要给引入的这个库起一个`chunk`的名字，这个`chunk`呢就是单独打包生成的这个文件它的名字是说明呢叫做`lodash`。）==

```
function getComponent() {
  // 魔法注释是 : 
  return import(/* webpackChunkName:"lodash" */ "lodash").then(({default : _}) => {
      var element = document.createElement('div');
      element.innerHTML = _.join(['hello','world'],'-');
      return element;
  });
}

getComponent().then(element=>{
    document.body.appendChild(element)
})
```

它的意思是我异步的引入一个`lodash`这样的库，当我做代码分割的时候给这个`lodash`库单独进行打包的时候给它起的名字叫做`lodash`，当我这么写完了之后我们重新运行打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: ee17272be549b326eccd
Version: webpack 4.42.0
Time: 1914ms
Built at: 2020-03-08 15:49:45
     Asset       Size  Chunks             Chunk Names
     ======== 注意：这里还是 0.js ==========
      0.js   1.36 MiB       0  [emitted]
index.html  204 bytes          [emitted]
   main.js   35.2 KiB    main  [emitted]  main
Entrypoint main = main.js
```

回过头来看，你会发现`dist`目录里它的名字还是`0.js`这是为什么呢？

========

这里需要注意下：如果你的`Webpack`版本比较低，因为要实现异步载入`lodash`而安装了`babel-plugin-dynamic-import-webpack`这个`babel`的插件那这个`babel`的插件实际上并不是官方的一个动态加载组件的一个插件所以呢它不支持这种`magic comment`的写法，所以这块我们怎么办？

这时要在`package.json`这个文件移除在这个插件并删除`.babelrc`中的`plugins: ["dynamic-import-webpack"]`的配置。

这个插件呢它不太支持这种`魔法注释`的写法所以把它干掉。

========

取而代之我们去找一个`babel`官方提供的这种动态引入组件的插件:

[-> @babel/plugin-syntax-dynamic-import](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import/)

`cnpm install --save-dev @babel/plugin-syntax-dynamic-import`

我们呢来使用官方提供的这个插件，然后在`.babelrc`里面我们去使用这个官方的插件：

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
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}

```

在重新打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 69667772802a2dc0883e
Version: webpack 4.42.0
Time: 1763ms
Built at: 2020-03-08 16:16:40
            Asset       Size          Chunks             Chunk Names
       index.html  204 bytes                  [emitted]
          main.js   35.3 KiB            main  [emitted]  main
======= 注意：这里名字修改了 =======
vendors~lodash.js   1.36 MiB  vendors~lodash  [emitted]  vendors~lodash
Entrypoint main = main.js
```

回过来再来看`dist`目录下打包生成了一个文件，这个文件呢就不叫作`0.js`了它被变成了`vendors~lodash.js`这个文件。

好有的同学会说你这里`import(/* webpackChunkName:"lodash" */ "lodash")`不是起名叫`lodash`的吗，怎么前面又加了一个`vendors`了呢，这块
我们如果想让打包的文件名字就叫`lodash`需要改变一个配置：

打开`build`目录下的`webpack.common.js`这个文件:

在`optimization`这里我们配置了一个`SplitChunksPlugin`的配置项叫做`chunks: 'all'`实际上啊我们在这里还可以配置非常多的内容，那我们来改一下这块的内容，怎么改呢，大家跟着我一起打开Webpack的官方网站进入到[->plugins](https://www.webpackjs.com/plugins/)（插件）这样的一个目录在左侧的列表树种找到
[->SplitChunksPlugin](https://www.webpackjs.com/plugins/split-chunks-plugin/)这个插件，点击进入到这个页面你会发现它里面又非常多的内容，在这里面呢它有一个`cacheGroups`：

```
cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
    default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
}
```

我把这段复制出来粘贴到`webpack.common.js`的`splitChunks`配置内容里：

```
optimization: {
    // 同步代码的配置（异步引入的代码不需要配置 Webpack 会自动进行代码分割）
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: false,
        default: false
      }
    }
}
```

然后我把`default`改成一个false，把`vendors`也改成一个false，现在你可能不知道它的作用大家先不用知道你先改成false就成了。

我们在重新运行`npm run dev-build`：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 85ae6c8097f0cc0a5de6
Version: webpack 4.42.0
Time: 1983ms
Built at: 2020-03-08 21:16:22
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
====== 注意：这里是 lodash.js不是vendors~lodash.js =======
 lodash.js   1.36 MiB  lodash  [emitted]  lodash
   main.js   35.2 KiB    main  [emitted]  main
Entrypoint main = main.js
```

回过头来我们再看`dist`目录下打包生成的这个文件是不是名字就叫做`lodash.js`了，那`cacheGroups`到底是说明意思呢，我们在后面在来讲。

通过这个例子实际上大家可以知道啊虽然你这里使用`import`：

```
function getComponent() {
  return import(/* webpackChunkName:"lodash" */ "lodash").then(({default : _}) => {
      var element = document.createElement('div');
      element.innerHTML = _.join(['hello','world'],'-');
      return element;
  });
}
```

去异步加载一个组件可以实现代码的分割但是实际上异步组件做代码分割的时候我们的这个配置项：

```
optimization: {
    // 同步代码的配置（异步引入的代码不需要配置 Webpack 会自动进行代码分割）
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: false,
        default: false
      }
    }
}
```

对它分割的过程有没有影响呢？实际上也是有影响的如果你不配置这个东西：

```
cacheGroups: {
        vendors: false,
        default: false
      }
```

那打包生成的文件前面会带一个`vendors`，如果你配置了打包生成的文件前面就不会带`vendors`了所以这块要说明的一个问题就是无论你是做同步代码的代码分割还是做这种异步加载组件的代码分割实际上这个参数：

```
// 同步代码的配置（异步引入的代码不需要配置 Webpack 会自动进行代码分割）
splitChunks: {
  chunks: "all",
  cacheGroups: {
    vendors: false,
    default: false
  }
}
```

都会有效果，也就意味着不管是同步代码的代码分割还是做这种异步加载组件的代码分割我们都要使用哪个插件呢？

都要使用这个`split-chunks-plugin`这个插件，好这个插件里面它有非常非常多的配置参数，这节课主要就给大家讲解这些配置参数它的一些意义和作用。

---

#### splitChunks 对象配置参数详解

最开始我们可以把`splitChunks`设置成一个空的对象：

```
optimization: {
    // 同步代码的配置（异步引入的代码不需要配置 Webpack 会自动进行代码分割）
    /* splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: false,
        default: false
      }
    } */
    splitChunks: {}
}
```

重新打包我们的代码：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 69667772802a2dc0883e
Version: webpack 4.42.0
Time: 1892ms
Built at: 2020-03-08 21:31:47
            Asset       Size          Chunks             Chunk Names
       index.html  204 bytes                  [emitted]
          main.js   35.3 KiB            main  [emitted]  main
vendors~lodash.js   1.36 MiB  vendors~lodash  [emitted]  vendors~lodash
Entrypoint main = main.js
```

dist目录下依然会有这几个内容，我没配置具体的配置项打包的过程呢还可以正常的运行，这是为什么？

这是因为大家如果打开官方文档你就会看到：

[->optimization.splitChunks](https://www.webpackjs.com/plugins/split-chunks-plugin/#optimization-splitchunks)

```
This configuration object represents the default behavior of the SplitChunksPlugin.

```

也就是如果你没有配置`splitChunks`里面的任何内容，实际上它有一个默认的配置内容也就是这一段代码：

```
// [这段代码在官网上](https://www.webpackjs.com/plugins/split-chunks-plugin/#optimization-splitchunks)
splitChunks: {
    chunks: "async",
    minSize: 30000,
    minChunks: 1,
    maxAsyncRequests: 5,
    maxInitialRequests: 3,
    automaticNameDelimiter: '~',
    name: true,
    cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
        },
    default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
        }
    }
}
```

我把这段代码粘贴到这里和我写一个空对象是一模一样的，如果你没有配置内容我
就以这段代码为默认的配置项，好默认的配置项这么长一段一段都代表什么内容，我依次来给大家做讲解。

首先我们先把`cacheGroups`这块的内容置成false，不然的话它会干扰我们对配置项的理解，最后我们在给大家讲`cacheGroups`它的一个意思：

```
cacheGroups: {
    vendors: false,
    default: false
}
```

##### chunks

```
splitChunks: {
    chunks: "async"
}  
```

好我们来从`chunks`这个参数开始讲解，`chunks`里面这里配置了一个`async`它指的是在我做代码分割的时候只对异步代码生效，那如果我们把`chunks`配置成`async`那看一下打包会有一个什么样的效果。

首先我先打开`src`目录下的`index.js`大家可以看到现在我是异步的引入一个组件它符不符合`async`呢，也就是异步呢它是符合的，那么我们来看一下打包有没有效：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 85ae6c8097f0cc0a5de6
Version: webpack 4.42.0
Time: 1813ms
Built at: 2020-03-08 21:49:33
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
 lodash.js   1.36 MiB  lodash  [emitted]  lodash
   main.js   35.2 KiB    main  [emitted]  main
Entrypoint main = main.js
```

lesson

```
dist
 |-index.html
 |-lodash.js
 |-main.js
```

打包完了之后我们看`dist`目录它会多出`lodash.js`这个代码分割出来的`lodash`库，说明呢我异步的代码可以实现代码分割的这种效果。

接着我改一下我把`index.js`种异步引入`lodash`第三方库的代码注释掉

```
// function getComponent() {
//   return import(/* webpackChunkName:"lodash" */ "lodash").then(({default : _}) => {
//       var element = document.createElement('div');
//       element.innerHTML = _.join(['hello','world'],'-');
//       return element;
//   });
// }

// getComponent().then(element=>{
//     document.body.appendChild(element)
// })

```

修改成我同步的引入`lodash`

```
import _ from "lodash";

var element = document.createElement("div");
element.innerHTML = _.join(["hello", "world"], "-");
document.body.appendChild(element);
```

好然后打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 7f39946dc1a0426c45dc
Version: webpack 4.42.0
Time: 1823ms
Built at: 2020-03-08 21:53:43
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js   1.39 MiB    main  [emitted]  main
Entrypoint main = main.js
```

lesson

```
dist
 |--index.html
 |--index.js
```

在来看，大家可以看到啊对于同步的这种`lodash`库的引入有没有效果？能不能进行代码的分割？

它是没有进行代码的分割的，为什么？

就是因为你在这里配置了一个`async`：

```
optimization: {
    splitChunks: {
      chunks: "async"
    }
}
```

它只对异步代码进行这种代码的分割，那如果你想对同步和异步的代码都做这个代码的分割可以这里配置一个`all`：

```
optimization: {
    splitChunks: {
      chunks: "all"
    }
}
```

如果你配置成了`all`在来看我在进行一次打包：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 7f39946dc1a0426c45dc
Version: webpack 4.42.0
Time: 2067ms
Built at: 2020-03-08 22:00:27
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

那么这块`dist`目录下，大家可以看到啊即便你把`chunks: "all"`改成了`all`，它这里呢依然还是不会帮你做这种代码的分割，那原因是什么呢，如果这里你打包一个同步的代码`Webpack`知道其实呢你是想做代码分割的，但是它不会直接就把你引入的这个库做代码分割，它知道你同步引入了`lodash`
那么实际上啊它往下继续去看这个`splitChunks`的配置：

```
splitChunks: {
  chunks: "all",
  minSize: 30000,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3,
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    vendors: false,
    default: false
  }
}
```

看到哪个配置呢，看到`cacheGroups`这个配置里面我们要做一些配置才能实现同步的这种逻辑的代码分割：

我们把[官网](https://www.webpackjs.com/plugins/split-chunks-plugin/#optimization-splitchunks)上的`cacheGroups`的配置给拿过来

```
cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: false
}
```

我来给大家讲一下它的打包流程是什么样的：

##### vendors.test

首先当你同步引入这个`lodash`库的时候，`Webpack`会知道（配置了`chunks: 'async'`）应该对这种同步的库做一些打包，那打包怎么打包呢我们继续往下走，走到`cacheGroups`里这里有一个`vendors`这样的配置项里面有一个`test`，`test`呢它会检测你引入的这个库（比如说你在`index.js`中引入的这个`lodash`库）是否是在`node_modules`这个目录下的，很显然我们引入的这个库是通过`npm install`安装的它肯定在`node_modules`里面，那它就符合`vendors`这样一个`cacheGroups`里面配置项的要求，于是它呢就会单独把这个`lodash`打包到`vendors`这样一个组里面去，那当我们去把这个配置好了之后。

配置修改好了之后，我们保存后在进行打包：

```
F:\github-vue\workspaces\lesson2>npm run dev-build

> webpack-demo@1.0.0 dev-build F:\github-vue\workspaces\lesson2
> webpack --config ./build/webpack.dev.js


F:\github-vue\workspaces\lesson2>"node"  "F:\github-vue\workspaces\lesson2\node_
modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpac
k.dev.js
clean-webpack-plugin: removed dist
Hash: b5417d39aa135f292f60
Version: webpack 4.42.0
Time: 1409ms
Built at: 2020-03-09 12:52:52
          Asset       Size        Chunks             Chunk Names
     index.html  266 bytes                [emitted]
        main.js     34 KiB          main  [emitted]  main
vendors~main.js   1.36 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.js main.js
```

lesson

```
dist
 |-index.html
 |-main.js
 |-vendors~main.js
```

打包成功，在`dist`目录下你会发现果然这样的话代码分割就可以分割了，打开这个代码你会看到它这里面确实也是`lodash`这个第三方库，那它前面有一个`vendors~`，这个`vendors~`指的是什么？

就是我的这个同步引入的库文件符合`vendors.test`这个组的要求，所以呢我前面
会加一个`vendors~`这个组的名字，好后面这个`main.js`是什么意思呢？指的是我这段代码分割生成的代码实际上它的入口文件它的`entry`文件是`main.js`这个文件也就是我们`index.js`这个文件，那为什么这块叫做`main`呢是因为在`webpack.common.js`里面我们配置的这个入口的名字叫做`main`：

```
module.exports = {
  entry: {
    main: ['./src/index.js']
    /* lodash: './src/lodash.js',
    main: './src/index.js' */
  }
}
```

它对应实际上就是`index.js`这个文件。

那这块它的意思就是：我打包生成的这个代码分割的代码它属于`vendors`这个组
`cacheGroups: {vendors: {test: /[\\/]node_modules[\\/]/,priority: -10}}`
同时它的入口是`main.js`作为它的入口。

#### vendors.filename

有的时候啊我希望像这种库它的打包出来之后呢`vendors~main.js`你不要在后面在加一个`main.js`了，你直接呢就把所有的库都打包到一个叫做`vendors.js`这样的一个文件里面。

那这样也行，怎么做，在`cacheGroups`的`vendors`配置里面在写一个`filename`
：

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

重新打包

```
F:\github-vue\workspaces\lesson2>npm run dev-build

> webpack-demo@1.0.0 dev-build F:\github-vue\workspaces\lesson2
> webpack --config ./build/webpack.dev.js


F:\github-vue\workspaces\lesson2>"node"  "F:\github-vue\workspaces\lesson2\node_
modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpac
k.dev.js
clean-webpack-plugin: removed dist
Hash: b5417d39aa135f292f60
Version: webpack 4.42.0
Time: 1527ms
Built at: 2020-03-09 13:07:26
     Asset       Size        Chunks             Chunk Names
index.html  204 bytes                [emitted]
   main.js     34 KiB          main  [emitted]  main
   vendors.js   1.36 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors main.js
```

lesson

```
dist
 |-index.html
 |-main.js
 |-vendors.js
```

如果你这么配置，它的意思是啊: 当你去加载一个同步的代码的时候会走到这个`splitChunks`的配置项它呢会帮助你去做代码分割，一旦它发现你的这个代码是从`node_modules`引入的那它就会把这个代码打包单独放到一个文件里，这个文件就叫做`vendors.js`，所以`filename`可以帮助你把那个`vendors~main.js`种的`~main.js`给去掉。

#### chunks: 'initial' 对同步代码做代码分割

好继续我们再来去改写下我们的代码，这块实际上`chunks`大家已经了解它的作用了，如果这里我们在给它改成`async`:

```
splitChunks: {
    chunks: 'all'
    // ...
}
```

我们在打包来试一下可不可以：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 7f39946dc1a0426c45dc
Version: webpack 4.42.0
Time: 2019ms
Built at: 2020-03-09 21:33:56
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

回来咋们来看，你会发现代码分割没有用`chunks: 'async'`指的就是异步，那它只去对异步代码做代码分割如果是`all`会对同步代码和异步代码一起去做代码分割，那这里呢你也可以写一个`initial`：

```
splitChunks: {
    chunks: 'initial'
    // ...
}
```

那它指的是对同步代码做代码的分割

打包我们来试验一下：

```
C:\Users\nickname\Desktop\lesson4>npm run dev-build

> webpack-demo@1.0.0 dev-build C:\Users\nickname\Desktop\lesson4
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson4>"node"  "C:\Users\nickname\Desktop\lesson4\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 937f0383dd6a970d53f4
Version: webpack 4.42.0
Time: 1793ms
Built at: 2020-03-09 21:38:29
     Asset       Size        Chunks             Chunk Names
index.html  261 bytes                [emitted]
   main.js   34.1 KiB          main  [emitted]  main
vendors.js   1.36 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors.js main.js
```

确实可以对同步引入的`lodash`库进行代码分割。


#### 总结：

```
splitChunks: {
      chunks: 'all', // initial（同步） async（异步） all（同步和异步）
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

好在来复习下，如果我们打包一个同步的代码不仅仅会走`chunks`这个配置参数实际上它还会往下走到`cacheGroups`这个参数，那我知道你要打包一个同步的库，那怎么打包要根据我们下面的这个`cacheGroups`种配置的一个个组来进行打包，好如果我发现那么你引入的这个库实际上是在`node_modules`里面的话那么在打包的过程种呢我就会把你这个库分割到一个叫做`vendors.js`的文件里面去，这里大家要注意下啊：

就是 `chunks`和`cacheGroups`是配合起来一起使用的（在同步中）。

##### minSize

接着我们再来看，这有一个参数叫做`minSize`，好我们把`minSize`调成非常大：

```
splitChunks: {
    chunks: 'all', // initial（同步） async（异步） all（同步和异步）
    minSize: 100000000 // 30000
}
```

index.js

（还是同步引入一个`lodash`这样的库）

```
import _ from "lodash";

var element = document.createElement("div");
element.innerHTML = _.join(["hello", "world"], "-");
document.body.appendChild(element);
```

刚才呢我们打包的时候啊如果`minSize`配置的是`30000`的话你可以看到`dist`目录下有`vendor.js`也就是`Webpack`实际上会帮助我们做代码分割的。

那如果我后面加了很多的`0`变成了`minSize: 100000000`，我们在重新打包试验一下：

```

```

lesson

```
dist
 |-index.html
 |-main.js
```

好回头来看这个时候它就不做这个代码分割了，这是为什么呢？

这是因为啊它在做代码分割的时候`minSize`这个参数的作用是：我发现你引入的这个包或者说引入的这个模块或者说引入的这个库它的大小大于`30000`个字节（也就是大于`30kb`）的话我才会帮你做代码分割，如果你小于`30kb`呢我就不帮你做代码的分割，`lodash`这个第三方库它大于`30kb`所以呢你这配置成`30kb`的话它是会帮你做代码分割的，但假设你加了好多个`0`那它可能指的就是大于几MB或者大于几十MB的时候我才帮你做代码分割，所以`minSize`就是这样一个作用。

一般来所我们把这配置成`30000`也就可以了大于`30kb`的这样一个模块我才对它进行代码分割。
