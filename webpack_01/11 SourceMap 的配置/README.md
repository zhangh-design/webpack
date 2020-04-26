11 SourceMap 的配置

> 前言：同学们大家好，这节课呢我来给大家讲解`SourceMap`的配置。

[->devtool](https://www.webpackjs.com/configuration/devtool/)


```
// development devtool: 'cheap-module-eval-source-map'
// production devtool:  'cheap-module-source-map'
```


### SourceMap

那什么是`SourceMap`呢我们先一起来看一下，打开我们之前项目的代码在`webpack.config.js`这里面啊我对整个的项目做一些修正，先`dist`目录我把它删除掉，然后呢我们打开`src`目录我把`font`目录删除掉，打开`index.js`：

`index.js`里面的内容呢我也都删除掉，只打印一个`hello world`。

```
console.log('hello world');
```

好`index.scss`文件我们也把它删除掉，然后我们再去一起修改一下`webpack`的配置文件`webpack.config.js`：

```
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name]-[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
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
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          // "css-loader",
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.(woff|eot|ttf|otf|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'fonts/'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')] // 清除的文件/文件夹
    })
  ]
};

```

改完之后呢我们重新打包下我们的项目：

```
F:\github-vue\workspaces\lesson>npm run bundle
```

打包成功了，然后我们到网页上来看一下，点开浏览器的控制台这个时候控制台输出了`hello world`说明打包呢都是正确的。

然后我们在稍微改下`webpack`的配置，在这里大家可以看我们呢现在的模式是`development`也就是开发模式，在开发模式中默认`SourceMap`呢已经被配置进去了，所以我啊先把`SourceMap`给它关掉，怎么关呢把`devtool`配置项让它变成一个`none`：

webpack.config.js

```
module.exports = {
  mode: 'development',
  // 关闭 SourceMap 功能
  devtool: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

然后我们重新打包：

```
F:\github-vue\workspaces\lesson>npm run bundle
```

好这个时候呢我们再到浏览器上去看不会有任何的变化，还是会打印出`hello world`。

那么`SourceMap`到底是一个什么东西，我们看啊现在我去写一下我们的`js代码`，在`index.js`里面我给它拼错：

```
consle.log('hello world');
```

我们重新打包：

```
F:\github-vue\workspaces\lesson>npm run bundle
```

好大家可以看到即使你拼写错误打包也会正确的运行。

然后我们再到页面上刷新，大家可以看到这个时候啊控制台报错了，说：

```
Uncaught ReferenceError: consle is not defined                    index.js:2
    at eval (index.js:2)
    at Object../src/index.js (main-3544934b.js:96)
    at __webpack_require__ (main-3544934b.js:20)
    at main-3544934b.js:84
    at main-3544934b.js:87
```

`consle`你拼错了，这个`consle`你没有定义，好，但是我呢想知道到底是哪一个地方出了错，我就会点击右侧的这个`index.js:2`提示看一下我的代码哪里写错了，点击大家可以看到：

![image](http://i1.fuimg.com/717460/0a374f2867105c70.jpg)

```
/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

// eslint-disable-next-line no-undef
// 这里它会告诉你多了一个 consle 
consle.log('hello world');


/***/ })
```

好，那么这段代码大家来看这个文件里的代码是哪个文件里的代码啊，它是我们打包出来的`dist`目录下的`main.js`里的代码，我们在`main.js`里找到它报错的97行发现确实是写错了。

可是我们希望什么，我们希望当你代码写错的时候现在我们在开发你不要告诉我是
打包的这个文件里到底是哪行代码出错了，你要告诉我源代码里面的哪一句代码出错了，我希望你直接告诉我`src`目录下`index.js`里面的第一行代码出错了，而不是`dist`目录下`main.js`里面第97行代码出错了，但如果现在我们目前的打包
报错的话它会告诉我们是打包结束代码中哪一行代码有问题。

那怎么办呢？我们就可以通过`SourceMap`来做这样的事情。

#### SourceMap是一个什么样的东西

##### devtool: 'source-map'

我们现在知道了`dist`目录下`main.js`文件97行出错，`SourceMap`它是一个映射关系，它知道`dist`目录下`main.js`的第97行实际上对应的是`src`目录下`index.js`文件中的第一行，通过`SourceMap`这个映射我就可以映射出当前其实是`index.js`中第一行代码出错了。


所以`SourceMap`呢其实本质上是一个映射关系，那我们如何使用这种映射关系呢？其实非常的简单，我们只需要在`webpack.config.js`配置文件中把`devtool:'source-map'`就可以了。

webpack.config.js

```
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}
```

重新打包：

```
F:\github-vue\workspaces\lesson>npm run bundle
```

打包结束之后我们在刷新页面，大家可以在浏览器的控制台看到这个时候它报了错，但是我点开右侧的这个提示`index.js:2`直接就进入了`index.js`的源码中，里面告诉我们`index.js`第一行文件就出错了：

index.js

```
// eslint-disable-next-line no-undef
consle.log('hello world');
```

![image](http://i1.fuimg.com/717460/5d45cb2fe707aa4d.jpg)


这就是`SourceMap`它的一个意义，我们说我们想看代码错误，不是看打包过后代码哪里错了，而是源代码哪里错了，那么这个时候就会用到`SourceMap`。

大家呢可以打开[`webpack`](https://www.webpackjs.com/)官网，打开`CONFIGURATION`（[配置](https://www.webpackjs.com/configuration)）大家可以在左侧看到[`devtool`](https://www.webpackjs.com/configuration/devtool/)它的配置内容都可以在这里查看。

其实使用`devtool`我们就是在配置`SourceMap`，我们可以看到这里`devtool`对应的配置项有十几种，那么这十几种都是什么意思呢？又有什么作用呢？

我们刚才在配置文件中填写的是`source-map`，大家可以看到这里它是一个表格（下面的 `SourceMap打包配置表`），左侧表明当你在`devtool`里面填写了`source-map`这个值的时候右侧的列它告诉你一些信息，`build`（构建速度）和`rebuild`（重新构建速度）的意思是当你填写`source-map`之后啊`build`的速度是`--`（`--`在下面我们可以看到是 慢），`rebuild`的速度也是`--`（慢），说明说明：

假设你的`devtool`里面配置了`source-map`，那么打包的过程实际上是会变慢的，因为打包的过程中呢它需要构建这种映射关系。

大家打开我们的`dist`目录，你会发现啊当你`devtool:'source-map'`之后呢，你的`dist`目录下多出这样的一个`.js.map`文件，这个里面呢就是一个映射的对应关系。

lesson项目`devtool: 'source-map'`打包后的`dist`目录：

```
dist
 |--index.html
 |--main.js
 |--main.js.map
```

##### devtool: 'inline-source-map' （inline的作用）

好，那除了我们在这里填`devtool:'source-map'`之外，我们还可以填一些其它的配置项，比如说大家可以看到这里检查会出现一个前缀叫`inline`，那我们把`webpack.config.js`中的`devtool: 'inline-source-map'`看一下是什么效果。

重新打包：

```
F:\github-vue\workspaces\lesson>npm run bundle
```

打开我们的页面我们再来看浏览器的控制台，它一样的可以提示我们现在`index.js`的第一行出错了，看起来它和设置成`devtool:'source-map'`没什么区别。

那这个`inline`是怎么回事呢？

lesson项目`devtool: 'inline-source-map'`打包后的`dist`目录：

```
dist
 |--index.html
 |--main.js
```

我们在打开这个时候的`dist`目录大家可以看到这个时候那个`.js.map`文件不见了，这个`.js.map`文件哪里去了呢，其实当你用`inline-source-map`的时候你这个`.js.map`文件会被通过`DataURL`的方式直接写在打包过后的`main.js`里面，我们打开`dist`目录下的`main.js`文件然后在文件内容的最下面可以看到:

```
......
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJz
```

最下面多了一个非常长的一个字符串，这是怎么一回事啊，当我们使用`inline-source-map`的时候那个`.js.map`的文件就会变成一个`base64`的字符串被放到打包后的`main.js`的底部，好这就是`inline-source-map`的一个作用或者说呢加了`inline`之后它和`source-map`的区别就在于它把对应的`.js.map`文件直接就打包到你的js文件里面去了。

##### devtool:'cheap-inline-source-map' （cheap的作用）

好，我们再来看有的时候呢我们会发现这个`source-map`前面还会多一个`cheap`或者呢多一个`eval`这样的内容。

- 我们先来看`cheap`它的作用是什么？
我们在配置中写上`devtool:'cheap-inline-source-map'`（这些配置项都可以自由的组合），重新打包：

```
F:\github-vue\workspaces\lesson>npm run bundle
```

好，我们在浏览器上打开`dist`目录下的`index.html`，然后来看浏览器控制台的错误提示，点击打开错误提示，从提示效果来看没什么区别。

在来看我们的打包生成的文件，好像呢也是一个`base64`这样的东西也没有多打包出其他什么东西，看起来好像没问题，那这个`cheap`的意思是什么呢？

我来给大家讲解下，当我们遇到代码很大的时候如果我们的代码出了错误而恰好呢你`devtool`前面又没有加这个`cheap-`，那么这个`sourceMap`会告诉你你的代码
在第几行的第几个字符的地方出了问题，它会精确到哪一行哪一列来告诉你具体问题产生的点，但是实际上一般来说啊，这样的一个映射它比较耗费性能，我代码出错了我只希望你告诉我哪一行出错就行了那具体哪一行的第几列出错了不需要你告诉我，那如果你这写了一个`cheap-`意思就是你只要告诉我行就好了不需要告诉我列，所以它是这样的一个意思。

当你把`cheap-`写在这的时候打包的性能就会得到一定的提升（因为不会分析列只需要分析行就可以了，相对`source-map`肯定是有一定的提升）。

官方文档上看打包的配置表，只要你前面加了`cheap-`这样的一些内容的时候，你会发现它的`build`，我们看啊举这个例子`cheap-source-map`它`build`的速度呢
就变成了一个加号`+`这说明什么呢`+ 比较快`，它呢只帮你精确到行不帮你精确到列了。

其实啊这个`cheap-`还有一个作用，如果你写了它那么我的这样`source-map`只针对我的业务代码，比如说：我的业务代码现在就是`index.js`这个文件，那么我的`SourceMap`只会去映射这个文件和它打包生成的`main.js`之间的一个关系，它不会管一些我们引入的第三方模块，比如说：`loader`里面这些东西的一些问题如何做映射他只会管我们的业务代码。

##### devtool: 'cheap-module-inline-source-map' （module的作用）

那如果你呢想让这个`cheap-`不仅管业务代码还管`loader`里面的一些`SourceMap`的话或者说还管一些第三方模块里面的一些代码错误映射的话那你可以在这在加一个`module`：

```
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-inline-source-map',
  entry: {
    main: './src/index.js'
  }
}
```

所以`module`这个东西大家我们的`devtool`的官方文档，你可以看到这里配置表中`module`也是经常出现的，那这个`module`出现的意思就是我不仅管我自己业务代码里的错误我还管一些其它的`loader`啊第三方模块啊里面的一些错误，这就是`module`的一个作用。

##### devtool: 'eval' （eval的作用）

那么讲完了`cheap`讲完了`module`我们还讲了`inline`还讲了`source-map`，还有一个东西我们没说，就是这个`eval`。

那这块呢我们可以把`eval`写在这，`eval`是打包速度最快的一种方式。

```
module.exports = {
  mode: 'development',
  devtool: 'eval',
  entry: {
    main: './src/index.js'
  }
}
```

我们运行下`npm run bundle`:

```
F:\github-vue\workspaces\lesson>npm run bundle
```

这个时候我们再看下我们的打包，在浏览器控制台点击错误这个时候一样可以帮助我们定位到这个`consle`这个`index.js`的第一行，没有任何的问题。

那`eval`是怎么一回事呢？

现在来看设置成`eval`和设置成`cheap-module-inline-source-map`这些效果是一样的，我们看`dist`目录：

```
dist
 |--index.html
 |--main.js
```

![image](http://i1.fuimg.com/717460/f964606a72814cd0.jpg)

在打开`main.js`大家可以看啊，`dist`目录下没有任何的`.map`结尾的文件，同时呢底下也没有那个`base64`的内容了，但是大家可以看到有一个这样的代码在`main.js`里面：

```
/***/ (function(module, exports) {

eval("// eslint-disable-next-line no-undef\r\nconsle.log('hello world');\r\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ })
```

`consle.log`这个代码它会以`eval`的形式执行而且后面还会跟一个`sourceURL`直接指向当前的`index.js`。

所以`eval`呢这种方式，和其它的这种用`source-map`打包方式不太一样，它是通过`eval`这种js的执行形式来生成`SourceMap`的对应关系的。

好，`eval`这种方式是执行效率最快性能最好的一种打包方式。

但是呢针对于比较复杂的这种代码的情况下，如果用`eval`呢它提示出来的内容可能并不全面。


#### SourceMap 最佳实践

##### 开发环境

如果你在开发环境中`mode: 'development'`去使用这种`SourceMap`的话我建议大家使用`cheap-module-eval-source-map`：

```
module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: './src/index.js'
  }
}
```

那么在实践过程中呢你会发现这种方式它提示出来的错误是比较全的，同时它的打包速度又是比较快的。

##### 生产环境

那如果说我现在开发的代码啊要放到线上环境`mode: 'production'`，那一般上线的代码呢我们一般没有必要让它有一个`SourceMap`的映射，我们直接把它放到线上就好了。

但是有的时候一旦线上的代码出了问题，我希望呢也能够通过一个`SourceMap`快速的定位问题，那么线上代码`devtool`里面我们怎么配呢？

```
module.exports = {
  mode: 'production',
  devtool: 'cheap-module-source-map',
  entry: {
    main: './src/index.js'
  }
}
```

这样的话呢，它的提示效果会更好一些，所以呢大家记得就好，因为这块啊关于`SourceMap`的配置实际上相应的内容还是很多的，那如果大家一个个记实在是太多了，也没有太大的必要。


##### SourceMap打包配置表

devtool | 构建速度 | 重新构建速度 | 生产环境 | 品质(quality)
---|---|---|---|---
(none)  | +++  | +++ | yes  | 打包后的代码 
eval  | +++  | +++ | no | 生成后的代码 
cheap-eval-source-map  | + | ++ | no | 转换过的代码（仅限行） 
cheap-module-eval-source-map | o | ++ | no | 原始源代码（仅限行）
eval-source-map  | --  | + | no | 原始源代码 
cheap-source-map  | + | o | no | 转换过的代码（仅限行）
cheap-module-source-map | o | - | no | 原始源代码（仅限行）
inline-cheap-source-map  | +  | o | no | 转换过的代码（仅限行）
inline-cheap-module-source-map  | o | - | no | 原始源代码（仅限行） 
source-map  | --  | --  | yes | 原始源代码 
inline-source-map  | --  | --  | no | 原始源代码 
hidden-source-map  | --  | --  | yes | 原始源代码 
nosources-source-map  | --  | --  | yes | 无源代码内容

```
+++ 非常快速, ++ 快速, + 比较快, o 中等, - 比较慢, -- 慢 
```

### 总结

好这就是这节课要给大家讲解的`SourceMap`这块的知识，那需要大家记住几个点：

1. SourceMap解决的问题是什么？

它解决的是当我们打包生成的代码出了错误的时候，如果不用`SourceMap`我们只能知道打包出来的代码第几行出错了，但是我们并不知道它对应的源代码是哪 里出错了，所以我们需要使用这个`SourceMap`帮我们做一个源代码和目标生成代码之间的一个映射。
2. 我们说`devtool`接收的`SourceMap`的配置参数可以有非常多的类型，但是即使它很多，我们也可以抽象出一些共用的概念在里面，大家可以看到啊:
- 如果带`source-map`那就说明怎么样，他会自动的生成一个`.map`的文件，所以大家记得一开始我只配置了一个`source-map`那么它会生成一个这个`.map`这样的文件啊。
- 那加了一个`inline`它就会把打包生成的这个文件放到我们的打包生成的这个`main.js`里面去，也就是打包的这个`.map`文件被合并到对应的打包生成的目标文件里面去了。
- 那加了`cheap`又是什么意思呢？它指的是第一点：我只提示你第几行出错了，不提示你第几列出错了，第二点：我只负责业务代码里的错，那打包过程中一些`loader`里的报出的错误我不管。
- `module`的意思是什么呢？你别不管`loader`里的错误和第三方库的错误，你要管除了你业务代码之外，你`loader`里面出的错误也要管。
- `eval`，它呢可以通过`eval`的方式帮助我们对一些代码进行打包或者配合`source-map`对我们的代码进行一些打包，把对应的我们的业务代码以及`source-map`
通过`eval`的方式一起来执行，这样的话会提高我们打包的速度。

3. 那最后我给大家讲了真正在我们配置`webpack`的时候一般来说我们会有几个固定的配置项：
- 也就是当我们在开发环境中的时候一般来说我们会用这个`cheap-module-eval-source-map`。
- 那如果在开发环境下，我们一般会用`cheap-module-source-map`这样的一个配置项。

