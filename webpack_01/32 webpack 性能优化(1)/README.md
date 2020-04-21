32 webpack 性能优化(1)

这节课我们来讲解提升 Webpack 打包速度的方法。

当我们去打包一个大型项目的时候，如果使用过 webpack 的同学肯定会有这样的体验，在做打包的时候有的时候一次打包完成需要耗费非常多的时间，所以当我们去打包这样比较大型的项目的时候就要考虑到使用一些方法来提升 webpack 的打包效率，那我们可以怎么做呢？

我们首先来看第一个方法：

1. 跟上技术的迭代（Node、Npm、Yarn），这是什么意思呢，如果我们想提升 Webpack 的打包速度
我们可以升级我们 Webpack 的版本或者升级我们的 Node 版本，Npm 包管理器的版本那为什么升级这些工具可以提高 Webpack 的打包速度呢，大家想 Webpack 每一个版本在做更新的时候内部肯定会做很多的优化，所以如果我们更新了 Webpack 的版本那么 Webpack 打包的速度肯定会有所提升，那 Webpack 呢又是建立在 Node 这样的一个 JS 运行环境之上的，如果 Node 进行了升级那就意味着 Node 它的运行效率会得到提升，Webpack 运行在 Node 之上很显然它的速度也会有所提升的，同样当我们安装了新版本的 Npm 或者 Yarn 这样的管理工具之后呢模块之间如果遇到一些相互引用的情况下新的这种包管理工具可以更快的帮我们分析一些包依赖或者呢做一些包的引入，那这也会间接的提升 Webpack 的打包速度，所以我说如果想提升 Webpack 的打包速度那第一步你要跟上技术的迭代在项目中呢尽可能使用比较新的 Webpack 、 Node 、 Npm 和 Yarn的版本。


好接着我们来看第二点，我们可以在通过尽可能少的模块上应用 Loader 来提升 Webpack 的打包速度，这怎么理解呢？

我来给大家举一个例子，大家现在跟着我一起打开 [27 Shimming 的作用] 这一章中的源代码 `lesson`，我们可以通过 webpack 的一些配置让一个模块的 this 指向 window

index.js

```
console.log(this === window ); // true
```

webpack.common.js

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{loader: 'babel-loader'},{loader: 'imports-loader?this=>window'}]
        // loader: "babel-loader"
      }
    ]
  }
}
```

我们可以通过 Webpack 的一些配置让一个模块的 this 指向 window ，怎么做？

咱们看一下 build 目录下的 webpack.common.js 这个文件当时我们使用了一个`imports-loader`
在这里填写了`this=>window`，那他呢就可以让我们的一个js文件或者说呢一个js的模块在加载的时候里面的 this 指向 window 这样的一个全局对象。

现在呢我可以把这个`imports-loader?this=>window`的`loader`给删除掉，因为这不是一个非常好的选择一般我们不会这么去做。

在往下去看，我们这里的配置基本有什么：

入口`entry`是一个`index.js`

遇到 js 文件呢我们使用`babel-loader`处理，遇到图片文件使用`url-loader`，图片呢小于`10240`字节我们就用 base64 来显示，如果大于`10240`字节呢我们就把它变成文件来存储。

处理字体使用了`file-loader`。

下面呢使用了几个标准的插件`HtmlWebpackPlugin`、`CleanWebpackPlugin`，当然呢这个`webpack.ProvidePlugin`其实它会在全局里面提供几个这样的变量供我们使用，当然这块呢我可以不用它因为它呢不是特别标准的一个写法

```
plugins: [
    new webpack.ProvidePlugin({
       $: 'jquery',
       _: 'lodash',
       // _join 等于 lodash里面的join方法
       _join: ['lodash', 'join']
    })
]
```

在下面我们有一系列的优化配置，我们把运行时的一些 webpack 源代码或者说呢运行时它要用到的代码放到了名字叫做 `runtime` 的一个 chunk 里面去。

`usedExports: true`意思是在`package.json`里面：

```
"sideEffects": [
    "*.css"
  ]
```

这块的`css` 文件不会进行`tree Shaking`。

```
optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
            name: 'vendors'
        }
      }
    }
}
```

`splitChunks` 里面我们配置了一点内容也就是所有来至于`node_modules`这样的第三方模块的引入我都会把这些模块的代码放到一个`vendors`这样的一个文件里面或者一个 chunk 里面去存放。

`performance: false` 我们不显示打包过程的一个性能问题。

把它打包生成的文件呢我们都放到`dist`目录下

```
output: {
  filename: "[name].js",
  chunkFilename: "[name].chunk.js",
  path: path.resolve(__dirname, "../dist")
}
```

这就是`webpack.common.js`我们配置的作用。

---

在看一下`webpack.dev.js`这块的一些内容无非也就是对`scss`文件或者`css`文件的一些处理，还加上了一个

```
plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
```

热模块更新的一个插件。

---

我们在来看一下`webpack.prod.js`里面做了一些什么样的处理，一样的当处理`scss`或者`css`文件的时候我们会使用`MiniCssExtractPlugin.loader`去把 css 文件单独抽象出来打包成独立的文件，那下面呢我们会使用一个

```
optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  }
```

对 css 文件进行一些压缩，好下面呢也是对这个插件的一些配置就不多说了

```
plugins: [
    // 对我们引入的CSS文件进行代码分割，暂时对`HMR support`模块热更新不支持，所以建议是用在生成环境下
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].chunk.css"
    })
  ]
```

#### 在尽可能少的模块上应用 Loader （include 和 exclude）优化 loader 的加载目录

那针对这几个配置文件我们可以如何的去做 Webpack 的打包速度的提升呢，我们一点点来改？

首先打开 webpack.common.js 大家看到这里写的就非常的合适：

```
{
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }]
        // loader: "babel-loader"
      },
```

如果遇到是 js 的模块，这里我明确的写了`exclude: /node_modules/`也就是不是`node_modules`里面的 js模块 才会去使用`babel-loader`。

如果你不写这个`babel-loader`会怎么样，如果你在你的源代码里面引入了一个`node_modules`下面的第三方模块的js文件的话：

```
import _ from 'lodash'

```

你在这里如果不配置这个`exclude: /node_modules/`它也会执行这个`babel-loader`，但是这次`loader`的执行有没有任何的意义呢？

其实是没有任何的意义的，因为一般我们去引入第三方的模块的这种js文件的时候，这个js文件已经被打包编译过了，你没有必要在这在对它进行一个`babel`的es6转es5的转义了，所以呢如果你这么去写：

```
{
    test: /\.js$/,
    // exclude: /node_modules/,
    use: [{loader: 'babel-loader'}]
    // loader: "babel-loader"
}
```

让它额外的进行一次转义的话就会降低打包的速度，所以在这我们可以加一个`exclude: /node_modules/`就可以很好的提高 js 模块的打包速度。

当然大家注意啊，这里不仅可以写`exclude`这样的一个语法，你还可以写一个`include`这样的一个语法，那`include`后面呢我们可以使用`Path.resolve`这个函数：

```
{
    test: /\.js$/,
    // exclude: /node_modules/,
    include: Path.resolve(__dirname, '../src'),
    use: [{loader: 'babel-loader'}]
    // loader: "babel-loader"
}
```

那它的意思是什么呢？ 当我遇到一个js文件或者js模块的时候只有它在哪个文件夹下呢，只有它在我们的`src`源代码文件夹下我去引入这样的文件的时候才会去使用`babel-loader`做一下语法的转换，那如果你去引入其它目录下比如说啊这个`node_modules`目录下的一些文件的话那就不会去走这个`babel-loader`。

##### 强调：

在这里再次强调我们可以通过`include`或者`exclude`这样的语法去约定只有某一些文件夹下的这种模块被引入的时候才去使用某一个`loader`，从而降低`loader`
被频繁执行的这种频率，因为`loader`它的这个转化或者编译的这个过程被更少量
的执行了，所以这种呢也可以提升 Webpack 的打包速度。

那大家可以去考虑一下像这种图片文件：

```
{
    test: /\.(jpg|png|gif|jpeg)$/,
    use: {
      loader: "url-loader",
      options: {
        name: "[name]-[hash:8].[ext]",
        outputPath: "images/",
        // 字节
        limit: 10240
      }
    }
}
```

是否可以也去使用这种`include`或者`exclude`语法呢？

实际上图片文件你没有必要去加这种`include`或者`exclude`的语法，因为不管你引入哪里的图片实际上都需要这个`url-loader`帮你打包到这个`dist`目录下，它不像这个 js 文件，那有一些 js 文件 已经编译过了没必要在做这个语法的转换，那图片不是所有的图片都需要在打包的过程种被打包，所以图片这块呢就没有必要去加这个`include`或者`exclude`了，所以呢这种`include`或者`exclude`的语法也并不适用于每一个`loader`具体呢要根据情况来定。

不过大家记住一点就好合理的使用`include`或者`exclude`确实可以降低`loader`的执行频率从而可以提高打包速度。


---

#### Plugin 尽可能精简并确保可靠

好我们再来看，第三个可以优化 Webpack 打包速度的点，也就是尽可能少的使用`plugins`，同时呢确保`plugins`的可靠性。

打开我们的代码`webpack.prod.js`在这里我给大家举个例子：

我们现在呢打包生成线上代码的时候使用了 webpack.prod.js 这个文件，那打包生成线上代码的时候为了让代码呢尽可能的小用户加载的速度尽可能的快，所以我们需要对代码做压缩。

这里呢我就使用了一个`optimize-css-assets-webpack-plugin`这样的一个插件，

```
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
   optimization: {
     minimizer: [new OptimizeCSSAssetsPlugin({})]
   }
}

```

对我们的 css 文件进行了代码的压缩。

可是如果在开发环境下那我们需不需要对代码做压缩呢，实际上是不需要对代码做压缩的，因为开发环境下代码只有我自己用我不需要考虑用户加载速度的问题，所以我们在 webpack.dev.js 这里面就没有去使用刚才我们用到的这个插件，那在 dev 环境下不使用这个插件实际上在 dev 打包的过程种呢它就不需要对代码进行压缩了，那大家想如果你不对代码进行压缩
那么是不是就节约了代码压缩这部分的打包时间啊，是不是你的打包速度就更快了呢。

所以我们说在 webpack 做打包的时候有一些没有必要使用的插件，那不用去使用它的时候你就不要用它，不然的话它会降低你的打包速度。

同时呢大家要注意，实际上在做代码打包的时候我在给大家讲解这些插件的时候，一般使用的都是 webpack 官方网站上推荐使用的一些插件，那为什么呢？

这些插件它的性能往往经过了官方的测试是比较快的，那有的时候呢我们可以自己去写一些插件，那如果再用我们自己写的一些插件的时候或者在用一些第三方公司
或者个人写的插件的时候这些插件呢它做的一些事情它有可能会帮助我们解决打包过程种想要解决的一些问题，但是这些插件的性能得不到保障所以你使用它们的话
很有可能会降低你的打包速度，所以大家在使用一些 webpack 插件的时候你要注意你使用的这些插件最好是社区里面验证过的性能比较好的插件。

那在下面一章的课程当中我也会给大家讲解 Webpack 种插件实现的原理，了解了这些原理之后你也会更加深刻的了解到为什么 Webpack 这些插件它呢有可能会去影响到我们打包的速度的

那讲到这我们第三个优化点也讲解完了，那插件呢要合理的使用，不要使用一些冗余的没有意义的一些插件，同时呢也要选择那些性能比较好官方推荐过的或者社区认可的插件来使用。

#### 好回顾下三个优化点：

- 跟上技术的迭代（Node Npm Yarn）
- 在尽可能少的模块上应用 Loader
- Plugin 尽可能精简并确保可靠


