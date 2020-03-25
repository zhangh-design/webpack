25 CSS 文件的代码分割

> 这节课我们来讲解`Webpack`中如何对`CSS`文件进行代码分割。

[->Webpack官网](https://webpack.docschina.org/concepts/)

[->MiniCssExtractPlugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)

#### chunkFilename

之前我们讲解的都是通过`Webpack`如何对JS文件进行代码分割，这节课呢我们切换到`CSS`文件上来，那在讲解这个内容之前我们先讲一个基础的知识点给大家做一个铺垫：

我们打开我们的项目`lesson`进入到`build`目录下的`webpack.common.js`这个文件里面来，那在这里啊我们可以看到`output`这块我配置了一个`filename`如果大家以前对`Webpack`有所了解如果你见过一些`Webpack`的配置文件经常你会发现在`output`里面还会配置一个叫做`chunkFilename`我们可以在这随便写点内容：

```
output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "../dist")
}
```

经常会出现`chunkFilename`这样的一个配置项。

那`filename`和`chunkFilename`有什么样的区别呢我来给大家讲一下。

我们现在打开`src`目录下的`index.js`文件，这里面我就是这样子的一个js，异步的引入`lodash`这样的库然后创建一个`dom`挂载到页面上：

index.js

```
// 异步
function getComponent() {
  // return import("lodash").then()
  return import(/* webpackChunkName:"lodash" */ "lodash")
    .then(({ default: _ }) => {
      console.log("success");
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      return element;
    })
    .catch(error => {
      console.log("error");
    });
}

document.addEventListener("click", ()=>{
  getComponent().then(element => {
    document.body.appendChild(element);
  });
});

```

我对这段代码进行一个打包，我们来看当你配置了`chunkFilename`之后打包生成的文件会是什么样子的。

在这里啊我们运行`npm run build`：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 8dbc20ab9d9581708057
Version: webpack 4.42.0
Time: 1688ms
Built at: 2020-03-22 14:54:42
                  Asset       Size          Chunks             Chunk Names
             index.html  204 bytes                  [emitted]
                main.js    314 KiB            main  [emitted]  main
vendors~lodash.chunk.js   1.35 MiB  vendors~lodash  [emitted]  vendors~lodash
Entrypoint main = main.js
```

dist

```
dist
 |-index.html
 |-main.js
 |-vendors~lodash.chunk.js
```

打开`dist`目录大家可以看到这块直接打包就是`main.js`，而这个`vendors~lodash.chunk.js`也就是`lodash`呢它后面加了一个`chunk.js`，这是怎么回事呢？

```
entry: [
  // babel 在IE下的异步导入依赖
  "core-js/modules/es.promise",
  "core-js/modules/es.array.iterator",
  // 如果entry里面只有一个chunk那么它的key值默认是`main`
  "./src/index.js" 
],
```

`index.js`它是一个入口文件在`entry`里面，入口文件打包生成的这种js文件它呢都会走`filename`这个配置项，所以`index.js`在做打包的时候它前面这个`key`值是`main`，它打包生成的文件呢就是`main.js`，走的是`filename`这个配置项。

那`main.js`里面它会引入`lodash`，`lodash`呢又被单独打包生成了一个文件，打包生成的这个文件在整个代码的运行过程中呢`main.js`先执行然后异步的去加载这个`lodash.js`所以这个`lodash`并不是一个入口的js文件，它呢是一个被`main.js`异步加载的间接的js文件，那么如果你打包生成一个这样的一个间接的js文件呢，它就会走`chunkFilename`这个配置项，或者我们有一个更方便大家理解的方式，我们可以打开`dist`目录下的`index.html`这个文件，你可以看到在这个文件里里面我们只引入了`main.js`这个chunk文件：

index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>html 模板</title>
</head>
<body>
	<div id='root'></div>
<script type="text/javascript" src="main.js"></script></body>
</html>
```

所以`main.js`其实走的是什么，它是一个入口文件所以它走的就是`filename`这样的一个配置参数，而`lodash`在这个`index.html`里面找不到它是怎么载入的呢？

它是通过`main.js`的代码里面再去引入`lodash`对应的代码的，那如果是间接引入的这种模块的话那这个模块它打包的时候生成的文件的名字就会走`chunkFilename`这块的配置内容。

好这是一个小的知识点，那接下来呢就来给大家讲解在`Webpack`中如何进行`CSS`
的代码分割。

---

#### MiniCssExtractPlugin 初步使用 （线上环境使用和style-loader冲突）

如何进行`CSS`的代码分割，这块我们要借助`Webpack`官网提供的一个插件。

我们打开[->Webpack](https://webpack.docschina.org/concepts/)官网找到[->plugins](https://webpack.docschina.org/plugins/)在左侧列表菜单栏中找到[->MiniCssExtractPlugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)这样的一个插件。

好这个插件呢就可以帮助我们对`Webpack`中我们引入的CSS文件进行代码分割。

那我们看首先呢我改一下我们的代码，在`index.js`里面我们就不去异步引入`lodash`这个模块了，我们直接引入一个当前目录下的`./style.css`文件：

index.js

```
import './style.css'
console.log('hello world')

```

style.css

```
body {
  background: green;
}

```

webpack.common.js

（这里主要是 [->SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin/) 的配置）

```
optimization: {
  splitChunks: {
    chunks: "all" // 同步和异步代码都进行代码分割
  }
}
```

我们运行一下打包试验一下`npm run dev-build`，我们现在并没有使用任何的插件:

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 3e8d46d04948e8ec6502
Version: webpack 4.42.0
Time: 2169ms
Built at: 2020-03-22 15:46:47
                Asset       Size        Chunks             Chunk Names
           index.html  272 bytes                [emitted]
              main.js     43 KiB          main  [emitted]  main
vendors~main.chunk.js    293 KiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.chunk.js main.js
```

打包结束我们进入`dist`目录下找到`index.html`里面看一下，我们在浏览器上打开我们的页面这个时候页面的背景已经是`green`绿色了。

然后呢我们可以看到打包生成的文件只有一个`main.js`和`vendors~main.chunk.js`，也就是说啊我们现在并没有生成一个CSS文件，但是浏览器页面上已经有样式了这是怎么回事呢？

`webpack`在做打包的时候它会把`CSS`文件直接打包到JS里面这就是我们经常听说的`css in js`这样的一个概念。

那下面我希望做的事情是什么，我希望你在打包生成代码的时候如果我引入的是CSS文件那么你把`CSS`文件单独打包到`dist`目录下生成一个CSS文件而不是直接打包到js里面那这个时候我们要借助我们刚才说到的这个插件了`MiniCssExtractPlugin`。

这个插件呢它其实有一些缺陷，它的缺陷是什么，官网上的文档大家可以看到它有一个`TODO`也就是未完成的功能也就是这个插件即将要添加的功能：

```
TODO:

- HMR support
```

支持`HMR support`模块热更新，也就是现在它这个插件其实是不支持模块热更新的，这就意味着如果我在开发环境中使用这个插件，我去改变了CSS的样式那么这个样式不会及时的更新到我们的项目打包环境中，我们需要手动的刷新页面这样的话如果在开发环境中我们使用这个插件啊开发的效率就不是很高了，那这个插件我们一般会在线上环境的打包过程中使用。

那要想在线上环境的打包过程中使用这个插件我们就需要先安装这个插件：

```
C:\Users\nickname\Desktop\lesson>cnpm install --save-dev mini-css-extract-plugin
```

OK，这样的话我们就做好了这个插件的安装然后我们看怎么去使用它。

如果你想使用它，你要先在你的打包文件里面去引入这个插件，我们打开我们线上环境的配置文件，因为我们说了这个插件呢适合在线上环境做打包的时候使用，所以打开`webpack.prod.js`这个文件：

webpack.prod.js

```
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const prodConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  // development cheap-module-eval-source-map
  // production cheap-module-source-map
  plugins: [
	// 对我们引入的CSS文件进行代码分割，暂时对`HMR support`模块热更新不支持，所以建议是用在生成环境下
    new MiniCssExtractPlugin({})
  ]
};

module.exports = merge(commonConfig, prodConfig)
```

在这个文件上面我们去引入这个`mini-css-extract-plugin`这个模块，紧接着我们要使用这个插件，首先你要在`plugins`里面去配置这个插件我们要`new`一个插件出来配置参数呢我们先可以填空对象`{}`。

继续啊光这么写还不行大家可以看如果你想使用这个插件实际上还需要你对`loader`进行一些配置，也就是当你去打包CSS代码的时候以前我们最终啊会通过`style-loader`把CSS样式挂载到页面上，现在最后一步你不能使用`style-loader`了你要使用这个插件提供的`loader`把这个`CSS`文件单独生成一个文件。

所以这块我们要对`rules`里面对应的`loader`做更改，那怎么改呢，大家跟着我一起做就可以，首先我们找到`webpack.common.js`这个文件：

这里面如果我们遇到`scss`或者`css`这样的文件我们会对它进行CSS相关的处理，我把这部分在`webpack.common.js`里配置的`rules`规则剪切到`webpack.dev.js`
开发环境中，我在开发环境中独立的配置CSS打包处理的这块`loader`的内容：

webpack.dev.js

```
module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          // "css-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: true
            }
          },
          "sass-loader",
          "postcss-loader"
        ]
      },{
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
}
```

也就是在开发环境中你该使用`style-loader`跟以前一样还是去使用`style-loader`这样的`loader`。

但是在线上环境呢我们打开`webpack.prod.js`那这块我们就要做变更了：

webpack.prod.js

```
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const prodConfig = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  // development cheap-module-eval-source-map
  // production cheap-module-source-map
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader",
          // "css-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: true
            }
          },
          "sass-loader",
          "postcss-loader"
        ]
      },{
        test: /\.css$/,
        use: [
          //'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  }
      
};

module.exports = merge(commonConfig, prodConfig)

```

但是线上环境下我们就不能使用`style-loader`了，我们要使用这个插件提供给我们的`loader`替换掉`style-loader`。

OK，这样搞定之后呢我们现在打包生成一个线上的代码，因为只有线上的代码才会用到这个插件所以大家记住一定要记住打包生成线上的代码。

我们运行`npm run build`就不是`npm run dev-build`了这块大家一定要注意：

webpack.common.js

```
optimization: {
    splitChunks: {
      chunks: "async"
    }
}
```

```
C:\Users\nickname\Desktop\lesson>npm run build

> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.prod.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.prod.js
clean-webpack-plugin: removed dist
Hash: 1badbb8b85641b9cb10b
Version: webpack 4.42.0
Time: 3496ms
Built at: 2020-03-22 20:36:24
      Asset       Size  Chunks                   Chunk Names
 index.html  204 bytes          [emitted]
    main.js   21.9 KiB       0  [emitted]        main
main.js.map   97 bytes       0  [emitted] [dev]  main
Entrypoint main = main.js main.js.map
```

dist

```
dist
 |-index.html
 |-main.js
 |-main.js.map
```

然后我们看一下这个插件有没有正确的运行，点开`dist`目录大家会发现好奇怪啊我现在呢还是只有一个`main.js`这样的文件啊，你并没有把这个CSS文件单独打包出来啊，这是什么原因呢？

其实这可能是由几个原因造成的：

1. 首先呢我们打开`build`这个目录找到`webpack.dev.js`这块的代码，大家还记得嘛之前我在`optimization`里面配置了`usedExports`这样的参数：

```
// 在 development 的 mode 下打开 Tree Shaking 优化
// development 环境下不需要使用 Tree Shaking 所有我们注释掉，这里只是为了演示效果
// production 的mode下 Tree Shaking 会自动打开
optimization: {
    usedExports: true
}
```

，这个参数是给谁用的呢，它是给我们的`Tree Shaking`这样的功能使用的，在做`Tree Shaking`的时候啊`Webpack`会对所有的模块都去做`Tree Shaking`，那有一些模块我不希望它做`Tree Shaking`，怎么办？

在这我配置了一个`usedExports: true`然后呢在`package.json`里面我们就可以在`sideEffects`这个参数里面去写一些内容。

那现在我们在项目的代码里面大家看：

index.js

```
import './style.css'
console.log('hello world')

```

我要引入一个`./style.css`这样的CSS文件，那其实`Tree Shaking`就已经生效了，它就开始分析有一些CSS到底要不要引入啊它发现你引入了一个`./style.css`文件但是下面的代码也没有使用到于是它直接就把这个`./style.css`文件给干掉了。

所以要想解决这个问题，我们对`Tree Shaking`呢可以先做一个修改，打开我们的`package.json`这个文件在`sideEffects`这个参数里面我把这块变成一个数组而不是`false`了：

package.json

```
{
  "name": "lesson",
  "version": "1.0.0",
  // "sideEffects": false,
  "sideEffects": ["*.css"]
}
```

指的是对引入的CSS文件我不做`Tree Shaking`，然后之前我的这个`Tree Shaking`的配置写在`webpack.dev.js`也就是开发环境里面实际上我们应该把它写在`webpack.common.js`这里，因为不管是线上代码还是本地测试的代码我们都需要使用这个参数来告诉我们的`Webpack`有一些CSS文件你不要去做`Tree Shaking`
的处理，所以这块呢我把`usedExports: true`从`webpack.dev.js`这个环境啊剪切出来粘贴到`webpack.common.js`里面：

webpack.dev.js

```
  // 在 development 的 mode 下打开 Tree Shaking 优化
  // development 环境下不需要使用 Tree Shaking 所有我们注释掉，这里只是为了演示效果
  // production 的mode下 Tree Shaking 会自动打开
  optimization: {
    // usedExports: true
  }
```

webpack.common.js

```
optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "async"
    }
}
```

保存一下然后我们在重新打包看一下可不可以`npm run build`：

```
C:\Users\nickname\Desktop\lesson>npm run build

> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.prod.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.prod.js
clean-webpack-plugin: removed dist
Hash: 0aae028123d0a70640ee
Version: webpack 4.42.0
Time: 4224ms
Built at: 2020-03-22 20:58:43
       Asset       Size  Chunks                   Chunk Names
  index.html  243 bytes          [emitted]
    main.css   70 bytes       0  [emitted]        main
main.css.map  179 bytes       0  [emitted] [dev]  main
     main.js     22 KiB       0  [emitted]        main
 main.js.map   97 bytes       0  [emitted] [dev]  main
Entrypoint main = main.css main.js main.css.map main.js.map
```

dist

```
dist
 |-index.html
 |-main.css
 |-main.css.map
 |-main.js
 |-main.js.map
```

打包结束我们到`dist`目录下看到这个时候`main.css`就被打包出来了，所以这块呢大家一定要注意`Tree Shaking`对应的配置很难我们去发现这个小的错误，但是这块我已经给大家提出了，所以你在配置的时候以后你一定要记住有这么个点。

`main.css`里面就是我们这个页面上的`css`文件对应的一个内容：

main.css

```
body {
  background: green;
}


/*# sourceMappingURL=main.css.map*/
```

然后我们这个`.map`文件大家还记得是干什么用的吗？它是一个`source-map`里面呢存储了一些映射关系可以方便我们进行代码的调试。

好这样的话我们就实现了对CSS文件的一个`code spliting`代码分割，那借助的就是我们今天给大家讲的这个插件叫做`mini-css-extract-plugin`。

---

#### MiniCssExtractPlugin 其它配置参数的使用（filename、chunkFilename）

OK，我们继续在往下看这个插件其它的一些内容，这里有一些高级的使用方式。

大家可以看到所谓高级的使用方式：

- 一个是它做了这个环境的区分

```
new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: devMode ? '[name].css' : '[name].[hash].css',
  chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
})
```

当然官网的这个环境的区分和我们的这种`Webpack`配置文件的环境区分是有一点差异的，但是在我的这个配置环境之中呢我们也做了区分（`webpack.common.js`、`webpack.dev.js`、`webpack.prod.js`）所以其实我们已经包含了高级这个配置里面的很多内容，这里面大家可以看到这块啊它还有一个配置参数里面呢你可以配置`filename`和`chunkFilename`，那这块我们就可以配置一下：

webpack.prod.js

```
  plugins: [
    // 对我们引入的CSS文件进行代码分割，暂时对`HMR support`模块热更新不支持，所以建议是用在生成环境下
    new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[name].chunk.css'
    })
  ]
```

那做好了这个配置之后呢我们在重新运行一下打包命令`npm run build`，看一下打包生成的`css`文件名字有没有变化：

```
C:\Users\nickname\Desktop\lesson>npm run build

> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.prod.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.prod.js
clean-webpack-plugin: removed dist
Hash: 0aae028123d0a70640ee
Version: webpack 4.42.0
Time: 3150ms
Built at: 2020-03-22 21:19:37
       Asset       Size  Chunks                   Chunk Names
  index.html  243 bytes          [emitted]
    main.css   70 bytes       0  [emitted]        main
main.css.map  179 bytes       0  [emitted] [dev]  main
     main.js     22 KiB       0  [emitted]        main
 main.js.map   97 bytes       0  [emitted] [dev]  main
Entrypoint main = main.css main.js main.css.map main.js.map
```

dist

```
dist
 |-index.html
 |-main.css
 |-main.css.map
 |-main.js
 |-main.js.map
```

我们看`dist`目录它还叫`main.css`，这时候大家就能看到它打包走的是什么，它走的是`filename`这个配置项而不是`chunkFilename`。

为什么它走`filename`这样的一个配置项生成的是`.css`文件而不是`chunkFilename`这样的一个`.chunk.css`文件呢，

大家呢如果你打包生成的这个`index.html`这个文件你会发现打包生成的文件实际上会被这个页面直接的引用的：

index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>html 模板</title>
<link href="main.css" rel="stylesheet"></head>
<body>
	<div id='root'></div>
<script type="text/javascript" src="main.js"></script></body>
</html>
```

所以如果一个文件即将被这个页面直接引用那么在使用这个插件的时候它就会走`filename`这样一个配置文件的名字，如果呢它不是这样的它呢是要被间接的要引入的一个css文件那它就会走`chunkFilename`。

---

#### MiniCssExtractPlugin 合并CSS文件为一个打包文件，使用`optimize-css-assets-webpack-plugin`压缩合并后的CSS代码

好接着呢我们在做一些尝试，我们在我们的`src`目录下在创建一个`style1.css`这样的样式文件：

style1.css

```
body {
  font-size: 100px;
}

```

index.js

我们在`index.js`里面再去引入`./style1.css`

```
import './style.css'
import './style1.css'
console.log('hello world')

```

我们重新做打包`npm run build`：

```
C:\Users\nickname\Desktop\lesson>npm run build

> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.prod.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.prod.js
clean-webpack-plugin: removed dist
Hash: 2281eaece1229c72f216
Version: webpack 4.42.0
Time: 5854ms
Built at: 2020-03-23 21:29:21
       Asset       Size  Chunks                   Chunk Names
  index.html  243 bytes          [emitted]
    main.css  103 bytes       0  [emitted]        main
main.css.map  266 bytes       0  [emitted] [dev]  main
     main.js     22 KiB       0  [emitted]        main
 main.js.map   97 bytes       0  [emitted] [dev]  main
Entrypoint main = main.css main.js main.css.map main.js.map
```

dist

```
dist
 |-index.html
 |-main.css
 |-main.css.map
 |-main.js
 |-main.js.map
```

dist/main.css

```
body {
  background: green;
}

body {
  font-size: 100px;
}


/*# sourceMappingURL=main.css.map*/
```

然后点开`dist`目录大家可以看到这个时候`main.css`里面它会怎么样，它会默认的把这两个CSS文件合并到一起来，所以这个插件默认还有这样的功能。

那回过头来我们在来看一下[文档](https://webpack.docschina.org/plugins/mini-css-extract-plugin/)上面还有什么样的说明：

我们可以看到[这里](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#minimizing-for-production)刚才我们打包生成的这个文件呀实际上CSS代码没有做压缩，我希望啊单独生成的这个CSS文件还要做一下代码的压缩，怎么做呢官方的文档上面也写的很清楚：

[压缩CSS代码](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#minimizing-for-production/)

你可以使用一个插件`optimize-css-assets-webpack-plugin`这样的一个插件，所以呢我们又要去安装这样的一个压缩CSS的插件了

```
C:\Users\nickname\Desktop\lesson>cnpm install optimize-css-assets-webpack-plugin -D
```

好我们看这个插件怎么使用：

1. 首先呢你要在`Webpack`的配置文件`webpack.prod.js`中引入这个插件

webpack.prod.js

```
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const prodConfig = {
    // 其它参数请看 lesson 项目中的 webpack.prod.js 文件
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({})
     ]
  }
}

module.exports = merge(commonConfig, prodConfig);
```

我们在进行打包`npm run build`：

```
C:\Users\nickname\Desktop\lesson>npm run build                                      css-loader@3.0.0@postcss-loader/src!
./src/style1.css 288 bytes {0} [built]
> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.prod.js
C:\Users\nickname\Desktop\lesson>cnpm install optimize-css-assets-webpack-plugin -D

C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.prod.js
clean-webpack-plugin: removed dist
Hash: 40e794334023bc5e956d
Version: webpack 4.42.0
Time: 4591ms
Built at: 2020-03-23 21:47:14
      Asset       Size  Chunks                   Chunk Names
 index.html  243 bytes          [emitted]
   main.css   38 bytes       0  [emitted]        main
    main.js   73.4 KiB       0  [emitted]        main
main.js.map     88 KiB       0  [emitted] [dev]  main
Entrypoint main = main.css main.js main.js.map
```

dist

```
dist
 |-index.html
 |-main.css
 |-main.css.map
 |-main.js
 |-main.js.map
```

dist/main.css

```
body{background:green;font-size:100px}
```

然后我们看一下我们打包生成的文件`dist`目录下的`main.css`，大家可以看到这个时候它就帮我们把CSS样式自动的合并然后呢变成了一行做了代码的压缩和合并，是不是很好啊。

好讲到这呢基本上我们的样式的代码分割就讲解的差不多了，在回到[->文档](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#minimizing-for-production)我们在往下翻一翻：

---

#### MiniCssExtractPlugin 结合 splitChunksPlugin 将所有`.css`文件都打包到一个文件中，

[->文档](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#extracting-all-css-in-a-single-file)

它这里呢还会有一个更高级的用法，假如我的整个的应用里面所有的CSS文件比如说啊`src`目录里面会有多个入口（我们的lesson项目内只有一个`index.js`是入口文件）那未来呢有可能我在`webpack.common.js`中的`entry`中配置很多个入口文件：

```
entry: {
    main: './src/index.js',
    main`: './src/index`.js'
}
```

我希望所有的入口文件里引入的CSS文件都能够打包生成到一个CSS的样式文件里，那怎么办呢？

在这大家可以看啊实际上我们现在使用的这个`mini-css-extract-plugin`底层也是要借助我们的[split-chunks-plugin](https://webpack.docschina.org/plugins/split-chunks-plugin/)的。

那`split-chunks-plugin`里面呢就有一个`cacheGroups`这样的一个缓存组，你可以额外增加一个组，叫做`styles`只要我发现你的打包的文件是`.css`为后缀的这样的文件，我呢不管它是同步加载的还是异步加载的（`all`）文件统一的都把它打包都一个名字叫做`styles`这样的文件里面去。

`enforce: true`是什么意思呢？我忽略掉你默认的一些参数，比如说大家之前记的这个`minSize`、`maxSize`这些参数我都不管了我只要你是一个`.css`文件我就做代码的拆分把代码分割到`styles`这个名字的文件里面去，这样的话呢所有的文件最终都可以被打包到我们的这样的一个文件中。

```
optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
```

#### MiniCssExtractPlugin 和 entry 入口文件结合打包css文件

[->文档](https://webpack.docschina.org/plugins/mini-css-extract-plugin/#extracting-css-based-on-entry)

我们在往下看文档啊，它还有一个说明说我想根据入口的不同把CSS文件打包到不同的CSS文件里面去，这是说明意思？

它的意思是啊，比如说我有两个入口的js文件：

webpack.common.js

```
entry: {
   main:  "./src/index.js",
   main1:  "./src/index1/js"
}
```

我希望`main`这个入口文件下它里面加载的所有模块里的CSS样式把它单独打包到一个文件里去。

那`main1`对应的`index1.js`这个入口文件下引用的所有模块的CSS样式我把它打包到另外一个CSS文件里面去。

那这块配置怎么做呢？其实也是很简单的

它还是用了什么，它还是用了`splitChunksPlugin`的`cacheGroups`这样一个内容。

它配置了两个组：

第一个组里面它做了一个`test`，`entry = 'foo'`也就是如果你的入口是`foo`这样一个入口，那对应我们呢可以把这个`foo`改成`main`，如果它是`foo`这个入口下的文件的话那么我就走它对应的这个逻辑，我会把所有的这个`foo`入口下的CSS文件统一到`foo`这样的一个里面。

在往下`barStyles`，如果你的`entry = 'bar'`的话那么我会把所有这样的CSS文件打包到一个叫做`bar`这样的一个CSS文件之中。


```
entry: {
    foo: path.resolve(__dirname, 'src/foo'),
    bar: path.resolve(__dirname, 'src/bar')
},
optimization: {
    splitChunks: {
      cacheGroups: {
        fooStyles: {
          name: 'foo',
          test: (m,c,entry = 'foo') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        },
        barStyles: {
          name: 'bar',
          test: (m,c,entry = 'bar') => m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true
        }
      }
    }
}
```

所以这块呢它也是通过`cacheGroups`来进行配置完成这样的功能的，那如果大家在你的项目中有这样的css代码分割的需求，你过来找一下文档看一下它的`cacheGroups`里面这个`test`是怎么写的照着来copy一下就没有任何的问题了。


---


#### 总结

好讲解到这里呢，关于`Webpack`中CSS的代码分割就全部给大家讲解完毕了，这里面几个重点的知识点我们在回顾一下：

首先第一个知识点我们说：

```
output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    path: path.resolve(__dirname, "../dist")
}
```

`filename`和`chunkFilename`大家要搞清楚。

我们在来看第二个知识点就是我们要使用的插件`MiniCssExtractPlugin`只能使用在线上的代码打包之中，因为啊它不支持`HMR`代码热更新那如果放在开发环境中会降低开发的效率。

使用它呢我们首先要安装一下：

```
npm install --save-dev mini-css-extract-plugin
```

安装完了之后我们要替换掉`loader`里面的`style-loader`同时我们还要在`plugins`里面去使用这个插件，那使用完成之后呢我们说我们并不能把CSS拆分出来，原因在于我们少配置了一个内容，就是：

```
optimization: {
    usedExports: true, //tree shaking
}
```

这样的一个内容它呢涉及到`tree shaking`这样的一个概念，同时我们要把`package.json`里面的`sideEffects`里面配置上`*.css`:

```
  "sideEffects": [
    "*.css"
  ]
```

对于这样的文件不对它进行`tree shaking`代码的这样的筛选。

好这块也配置好了，最后我们在线上环境`webpack.prod.js`又引入了一个叫做`optimize-css-assets-webpack-plugin`这样的一个插件，

```
npm i optimize-css-assets-webpack-plugin -D
```

那通过它呢可以对我们抽离出来的这种CSS文件进行代码的合并和压缩。
