09 Entry 与 Output 的基础配置

> 前言：同学们大家好，之前呢我们学习了`webpack`中`loader`以及`plugin`的概念，这节课呢我们来学习一点简单的内容。

[->entry and context](https://www.webpackjs.com/configuration/entry-context/)

[->output](https://www.webpackjs.com/configuration/output/)

#### Entry 与 Output 的基础配置

##### output.filename 打包输出文件名称

那我们将一起学习 Entry 与 Output 的基础配置 ，打开我们之前配置的`webpack.config.js`这个`webpack`的配置文件，在这里面我们配置了一个`entry`以及`output`这样的配置项。

`entry`顾名思义就是打包的入口文件，我现在配置的是入口文件是`src`目录下的`index.js`，之前我给大家讲过那实际上`entry`
这块你可以写一个字符串表示呢打包的入口是`src`目录下的`index.js`，打包生成的文件默认生成的名字是什么呢？默认的名字叫做`main.js`，但是在下面大家仔细来看我在`output`里面把`filename`做了一个更改叫做`bundle.js`所以这个时候你打包`index.js`生成输出的这个文件应该还是叫做`bundle.js`，我们可以实验一下：

webpack.config.js

```
entry: {
    main: "./src/index.js"
},
output: {
    filename: "bundle.js",
    // path 不写其实也可以，默认就会打包到 dist 目录
    path: path.resolve(__dirname, "dist")
}
```


来到我们的命令行，我们运行`npm run bundle`：

```
C:\Users\nickname\Desktop\lesson_3>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_3
> webpack


C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: removed dist
Hash: de1e35f68a9156d8603c
Version: webpack 4.41.6
Time: 2175ms
Built at: 2020-02-16 14:08:38
                     Asset       Size  Chunks             Chunk Names
                 bundle.js   24.7 KiB    main  [emitted]  main
fonts/iconfont.15896c7.eot   2.14 KiB          [emitted]
fonts/iconfont.a1f61df.ttf   1.98 KiB          [emitted]
fonts/iconfont.cc88877.svg   1.62 KiB          [emitted]
                index.html  197 bytes          [emitted]
======== 大家看这里是 bundle.js ==========
Entrypoint main = bundle.js
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js?!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js!./src/index.scss] ./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss 3.69 KiB {main} [built]
[./src/font/iconfont.eot?t=1543245201565] 70 bytes {main} [built]
[./src/font/iconfont.svg?t=1543245201565] 70 bytes {main} [built]
[./src/font/iconfont.ttf?t=1543245201565] 70 bytes {main} [built]
[./src/index.js] 374 bytes {main} [built]
[./src/index.scss] 735 bytes {main} [built]
    + 3 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/lib/loader.js!./index.html] 365 bytes {0} [built]
    [./node_modules/_webpack@4.41.6@webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {0} [built]
    [./node_modules/_webpack@4.41.6@webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module

```

lesson

```
dist
 |--font
 |--bundle.js
 |--index.html
```

好大家呢在回到`dist`目录大家可以看到打包生成的文件还是`bundle.js`。

那如果我把`filename`这个配置给注释掉，它默认的打包生成的文件名字叫做`main.js`，我们在实验一下：

```
C:\Users\nickname\Desktop\lesson_3>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_3
> webpack


C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: removed dist
Hash: fc89a61dfdac9a9d41d4
Version: webpack 4.41.6
Time: 1304ms
Built at: 2020-02-16 14:11:23
                     Asset       Size  Chunks             Chunk Names
fonts/iconfont.15896c7.eot   2.14 KiB          [emitted]
fonts/iconfont.a1f61df.ttf   1.98 KiB          [emitted]
fonts/iconfont.cc88877.svg   1.62 KiB          [emitted]
                index.html  195 bytes          [emitted]
                   main.js   24.7 KiB    main  [emitted]  main
======== 大家看这里是 main.js ==========
Entrypoint main = main.js
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js?!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js!./src/index.scss] ./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss 3.69 KiB {main} [built]
[./src/font/iconfont.eot?t=1543245201565] 70 bytes {main} [built]
[./src/font/iconfont.svg?t=1543245201565] 70 bytes {main} [built]
[./src/font/iconfont.ttf?t=1543245201565] 70 bytes {main} [built]
[./src/index.js] 374 bytes {main} [built]
[./src/index.scss] 735 bytes {main} [built]
    + 3 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/lib/loader.js!./index.html] 365 bytes {0} [built]
    [./node_modules/_webpack@4.41.6@webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {0} [built]
    [./node_modules/_webpack@4.41.6@webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module
```

大家再来看`dist`目录下的文件名是不是叫做`main.js`啊，所以我们恢复到之前的代码，大家应该知道当我在`entry`里面去写这样一个字符串的话它等价于`entry`里面去写一个对象。

下面两种写法是等价的：

```
// entry: './src/index.js',
entry: {
    main: "./src/index.js"
}
```

那这里对象的键是`main`表示打包生成的文件名字我们应该叫做`main.js`，接着这个时候我有另一个需求，我希望什么呢？我希望啊现在我把`src`目录下的`index.js`反复打包两次生成两个文件，那第一个文件呢叫做`main.js`，第二个文件呢叫做`sub.js`。

这个时候如果我的`output`配置成`filename: bundle.js`我们看一下会有什么样的效果：

打包：

```
C:\Users\nickname\Desktop\lesson>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson
> webpack


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: pausing due to webpack errors
Hash: cc5ea6bddafc7e372ece
Version: webpack 4.41.6
Time: 1527ms
Built at: 2020-02-16 19:40:36
                     Asset       Size  Chunks             Chunk Names
                 bundle.js   24.7 KiB    main  [emitted]  main
fonts/iconfont.15896c7.eot   2.14 KiB          [emitted]
fonts/iconfont.a1f61df.ttf   1.98 KiB          [emitted]
fonts/iconfont.cc88877.svg   1.62 KiB          [emitted]
                index.html  197 bytes          [emitted]
Entrypoint main = bundle.js
Entrypoint sub =
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js?!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js!./src/index.scss] ./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss 3.69 KiB {main} {sub} [built]
[./src/font/iconfont.eot?t=1543245201565] 70 bytes {main} {sub} [built]
[./src/font/iconfont.svg?t=1543245201565] 70 bytes {main} {sub} [built]
[./src/font/iconfont.ttf?t=1543245201565] 70 bytes {main} {sub} [built]
[./src/index.js] 374 bytes {main} {sub} [built]
[./src/index.scss] 735 bytes {main} {sub} [built]
    + 3 hidden modules

====== 这里打包直接报错了 =======
ERROR in chunk sub [entry]
bundle.js
Conflict: Multiple chunks emit assets to the same filename bundle.js (chunks main and sub)
```

你可以发现打包啊直接出错了，说什么呢？你打包是多个文件但最后呢你把打包的这个文件生成的这个文件都叫`bundle.js`，所以这就有问题，我再来解释下为什么打包会出现错误：

现在你要打包文件生成两个文件，一个叫`main`一个叫`sub`，但是这两个文件最终都会被起名叫做`bundle.js`这样的话名字就重复了就冲突了。

想要解决这个问题，我们可以怎么做？

我们可以把`filename`这个名字啊替换成什么？替换成一个`占位符`，`output`里面的占位符可以支持几个这样的配置内容，比如说：`[hash]`、`[name]`、`[id]`
都可以，这里我们可以用`[name]`：

```
entry: {
    main: "./src/index.js",
    sub: "./src/index.js"
},
output: {
    filename: "[name].js",
    // path 不写其实也可以，默认就会打包到 dist 目录
    path: path.resolve(__dirname, "dist")
}
```

这个`[name]`指的是什么呢？就是打包`entry`对应的这个键值，那如果这里我写了占位符`[name]`它会有一个什么样的效果呢？

当我去打包第一次这个`index.js`的时候这个文件打包会放到一个文件里，这个文件放到哪里呢，`filename`中配置的`[name]`就是指的我第一个打包文件的`main`键名称，所以第一次打包也就是打包`main: './src/index.js'`的时候它会被放到`main.js`然后输出出来，第二次打包`sub: './src/index.js'`的时候这个时候`filename`中配置的占位符`[name]`对应的是什么呢，对应的是上面的`sub`键名称，所以第二次打包的时候这个`./src/index.js`会被打包到`sub.js`里面去，那么我们这么配置好了，在来实验一下：

打包：

```
C:\Users\nickname\Desktop\lesson>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson
> webpack


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: d09a215e6d6c3914069c
Version: webpack 4.41.6
Time: 1538ms
Built at: 2020-02-16 19:57:17
                     Asset       Size  Chunks             Chunk Names
fonts/iconfont.15896c7.eot   2.14 KiB          [emitted]
fonts/iconfont.a1f61df.ttf   1.98 KiB          [emitted]
fonts/iconfont.cc88877.svg   1.62 KiB          [emitted]
                index.html  248 bytes          [emitted]
                   main.js   24.7 KiB    main  [emitted]  main
                    sub.js   24.7 KiB     sub  [emitted]  sub
======== 大家看这里 [name] 的占位符生成了两个文件 ===========                    
Entrypoint main = main.js
Entrypoint sub = sub.js
```

lesson

```
dist
 |--fonts
 |--index.html
 |--main.js
 |--sub.js
```

首先打包没有报任何的错误，然后我们再看`dist`目录下 会打包出一个`main.js`又会打包出一个`sub.js`，然后我们在打开`index.html`：

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
<script type="text/javascript" src="main.js"></script>
<script type="text/javascript" src="sub.js"></script></body>
</html>
```

打开`index.html`你会发现一个很奇妙的事情，`webpack`会自动的把`main.js`和`sub.js`放到打包生成的这个`index.html`之中，那怎么就放进来了，是因为之前我们在打包配置文件里面使用了`html-webpack-plugin`它发现了现在我们打包要输出两个文件，这个时候它就会把这两个文件都放到`index.html`这个模板里面对应的这个`body`标签里，所以这个功能是`html-webpack-plugin`帮助我们做的。

这样的话呢我们就给大家讲解了`entry`和`output`在打包多个文件的时候那它应该如何的去配置。

### publicPath.publicPath 加载外部资源文件


有的时候呢，还有这样一个场景我们说打包完的文件啊`index.html`我会把这个文件给后端做为一个后端的入口文件，但是我会把这些`js文件`上传到一个`CDN`这样的一个域名下面，那么我们打包生成的这个`index.html`前面呢或者说我就不希望它显示`main.js`或者`sub.js`了，


```
<!--不希望是main.js和sub.js-->
<script type="text/javascript" src="main.js"></script>
<script type="text/javascript" src="sub.js"></script>
```

我希望呢它前面在多一个对应的`CDN`地址的这样一个域名，比如说：

```
<script type="text/javascript" src="http://cdn.com/main.js"></script>
<script type="text/javascript" src="http://cdn.com/sub.js"></script>
```

，我希望呢打包完成之后它注入到我`index.html`上的这个打包的js文件啊前面多带一个`CDN`的域名，那现在我们手动的去改这个`index.html`肯定不靠谱。

我们可以在`output`里面配置一个内容，打开`webpack.config.js`：


```
output: {
    publicPath: 'http://cdn.com.cn/', （这只是一个测试地址）
    filename: "[name].js",
    // path 不写其实也可以，默认就会打包到 dist 目录
    path: path.resolve(__dirname, "dist")
}
```

output里面增加一个`publicPath`这里面呢我就可以增加一个`CDN`的地址了，我们在这写完之后重新运行一次打包。


```
C:\Users\nickname\Desktop\lesson>npm run bundle
```

index.html

```
<script type="text/javascript" src="http://cdn.com.cn/main.js"></script>
<script type="text/javascript" src="http://cdn.com.cn/sub.js"></script>
```

然后我们再看，这个时候打开`dist`目录打开`index.html`大家可以看到所以引入的js文件前面都会加一个`CDN`这样的地址，所以呢如果我们的项目后台用`index.html`而静态资源放到`CDN`上的情况下呢，这个时候我们就会用到`output`里面对应的`publicPath`这样的一个配置项。


---


那`output`中的`publicPath`、`filename`、`path`这几个东西呢是常用的几个配置项。

那关于`output`相应的配置项其实还有非常非常多的内容
，我们可以打开`webpack`的官网来看一下，[->output](https://www.webpackjs.com/configuration/output/) 里面支持的配置参数大家可以看它支持的配置参数特别的多。

这里呢我给大家讲了`publicPath`，我们还讲了`filename`，然后呢我们再来看其实下面还有非常非常多的内容，比如：`output.path`，这些内容呢大家都应该自己照着这个文档来过一遍。


那课程讲到这我要给大家，留这阶段的作业了：

首先我要求大家回去把[->output](https://www.webpackjs.com/configuration/output/)这块的内容简单的过一遍，有些内容呢你还没法理解，有些课程讲完之后你才能理解output对应的一些配置项，不过呢你最好先来整体的过一遍。

那[->entry and context](https://www.webpackjs.com/configuration/entry-context/)这块的内容呢大家也可以简单的看一下，但不要求大家全看懂，看一下就可以了。

我们的重点在`GUIDES`（[指南](https://www.webpackjs.com/guides/)）目录下，大家可以看到现在有一个部分的内容叫做`Output Management`（[管理输出](https://www.webpackjs.com/guides/output-management/)）大家呢回头把`管理输出`这块的内容一定要仔仔细细一行一行的仔细阅读，
这里面给大家讲解的就是我给大家讲的这个`html-webpack-plugin`以及`clean-webpack-plugin`。

[`plugins`](https://www.webpackjs.com/plugins/)这个目录我们也打开，进入到`plugins`这个目录呢我建议大家把`html-webpack-plugin`这个插件相应的配置项仔细的读一读，当然在这个页面上它介绍`html-webpack-plugin`的参数介绍的很少，那我们应该怎么去看完整的这个`plugin`的配置项呢，在最下面的 [配置](https://github.com/jantimon/html-webpack-plugin#configuration) 这块大家可以看到有一个[`插件文档`](https://github.com/jantimon/html-webpack-plugin#configuration)我们点击进入 会进入这个插件对应的github对应的官方网址，在这里面呢你可以看到这个`webpack`的插件下面它支持非常多的配置参数，比如：`title`、`filename`、`template`、`favicon`、`meta`，如果呢你能把右侧的关于配置参数的说明仔细的读一读试一试也是一件非常好的事情。

