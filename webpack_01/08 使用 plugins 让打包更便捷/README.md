08 使用 plugins 让打包更便捷

> 前言：同学们大家好，在之前的课程中呢，我给大家讲解了`loader`这个概念在`webpack`中我们使用`loader`可以完成不同文件类型的打包，这节课我来通过一些例子给大家讲解如何使用`webpack`中的`plugins`，也就是`webpack`中的插件来使我们的打包更加的便捷。

[->++html-webpack-plugin++](https://www.webpackjs.com/plugins/html-webpack-plugin/)

[->++clean-webpack-plugin github++](https://github.com/johnagan/clean-webpack-plugin) （并非官方推荐的一个第三方插件）

[->++clean-webpack-plugin 慕课网++](https://www.npmjs.com/package/clean-webpack-plugin) 

[->++output-management 管理输出++](https://www.webpackjs.com/guides/output-management/)

### html-webpack-plugin 简化HTML文件的创建

我们打开之前的`webpack`的项目`lesson`，之前大家记得吗？我在`dist`目录下有一个`index.html`文件，这个文件呢是我手动的拷贝到`dist`目录下的，那假设我呢一开始把`dist`目录删除掉然后我进行`webpack`对项目大打包：

```
C:\Users\nickname\Desktop\lesson>npm run bundle
```

好这个时候打包已经完成了，这个时候我们打开`dist`目录你会发现这里并没有`index.html`文件，那么你就需要手工的往里去增加一个`index.html`，再把项目根目录下的`index.html`的内容拷贝到手动增加的这个`index.html`中，这样的话是不是就很麻烦啊，那每一次打包如果我们都这么做那也太麻烦了，那有什么办法可以帮助我们解决这个问题呢？

下面我就给大家讲解一个`webpack`的插件，这个插件呢就能够帮助我们解决这个问题。

首先我们打开[`webpack`](https://www.webpackjs.com/concepts/)的官方网站，在这里我们点开`PLUGINS`（[插件](https://www.webpackjs.com/plugins/)）在这里我们去找一个[html-webpack-plugin](https://www.webpackjs.com/plugins/html-webpack-plugin/)，那我们来根据它的文档对它做一个安装，然后看一下它能实现一个什么样的效果。

安装插件：

```
C:\Users\nickname\Desktop\lesson>cnpm i html-webpack-plugin -D
```

好这个时候呢我们的这个`html-webpack-plugin`这样的一个`webpack`插件已经安装好了，那`webpack`的插件是什么？我一会来给大家总结，我们先尝试用一下它看它能实现一个什么样的效果，怎么用呢大家仔细来看。

如果你想用一个`webpack`的插件，首先你要引入这个`webpack`的插件，然后在`webpack`配置的这个对象里面有一个`plugins`这样的一个数组，把你对应的插件在`plugins`数组里实例化一下，所以呢我们来这样来写：

webpack.config.js

```
//引入 html-webpack-plugin 插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "development",
  // entry: './src/index.js',
  entry: {
    main: "./src/index.js"
  },
  output: {
    filename: "bundle.js",
    // path 不写其实也可以，默认就会打包到 dist 目录
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/",
            // 字节
            limit: 10240
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          // "css-loader",
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
              // modules: true
            }
          },
          "sass-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.(woff|eot|ttf|otf|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  // 实例化插件
  plugins: [new HtmlWebpackPlugin()]
};

```

当我们写完这一段话大家来看啊，我现在并没有`dist`目录，我重新打包大家可以看一下有什么效果，


```
C:\Users\nickname\Desktop\lesson_3>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_3
> webpack


C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: aab518bdd7ed7781fe6c
Version: webpack 4.41.6
Time: 2199ms
Built at: 2020-02-16 09:57:30
                     Asset       Size  Chunks             Chunk Names
                 bundle.js   24.7 KiB    main  [emitted]  main
fonts/iconfont.15896c7.eot   2.14 KiB          [emitted]
fonts/iconfont.a1f61df.ttf   1.98 KiB          [emitted]
fonts/iconfont.cc88877.svg   1.62 KiB          [emitted]
                index.html  182 bytes          [emitted]
Entrypoint main = bundle.js
```

打包完成，我们到`dist`目录下，大家可以看到`dist`目录下怎么样，是不是自动帮你生成了一个`index.html`，大家可以看到它不但帮我们生成了一个`html`文件
，还怎么样？，是不是还在底部把打包出来的`bundle.js`引入到了这个html文件中啊，好这就是`webpack`对应的插件它的作用。


自动生成的`index.html`：

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  </head>
  <body>
  <script type="text/javascript" src="bundle.js"></script></body>
</html>
```

`html-webpack-plugin`这个插件会干什么呢？

大家呢可以拿笔记一下，`html-webpack-plugin`这个插件会在打包结束后，自动生成一个`html`文件，并把打包生成的`bundle.js`自动引入到这个html文件中。

那么当它完成了这两件事情之后，我们说我们的页面能不能展示出来呢？我们可以在浏览器上打开这个`index.html`，大家看页面上什么内容都没有，这到底是为什么呀？

index.js

```
var root = document.getElementById('root');
// 这里注意我们不是模块化的，所以 css-loader 里配置的 modules: true 要去掉
import './index.scss'

// 使用iconfont字体 class类中的 iconfont 是估计的名称 后面的 icon-changjingguanli 是图标在index.scss文件中的名称
root.innerHTML='<div class="iconfont icon-changjingguanli">abc</div>';

```

大家看我们打开`src`目录下的`index.js`，你会看到我们代码的逻辑是什么，我们代码的逻辑是找到`id`是`root`的这个DOM节点，然后呢把我这个`div`标签挂载到`root`这个节点下，但是问题是大家来看我打包生成的这个`index.html`上有没有这个`div`id是`root`这个标签啊？是不是没有啊，一开始它生成的这个`index.html`是没有`<div id='root'></div>`这段代码的，那假如我手动给它加上这个`<div id='root'></div>`我们在来看页面啊是不是浏览器上的页面就显示出来一个图标了啊。

手动加上`<div id='root'></div>`的`dist`目录下的`index.html`文件：

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  </head>
  <body>
    <div id='root'></div>
  <script type="text/javascript" src="bundle.js"></script></body>
</html>
```

好，所以说明什么呢？所以说明`html-webpack-plugin`这个插件啊在打包结束后生成的这个`index.html`它里面少了一个`id`是`root`的`div`标签，好了我希望它能够自动的生成这个`html`文件的时候里面就有这个`id`是`root`的`div`标签
那怎么办？

我们可以在`webpack.config.js`这个文件里面对这个`html-webpack-plugin`做一个配置，这个配置接受一个参数叫做`template`它可以接收一个模板文件，那么实际上我可以在我的项目根目录下插件一个`index.html`的模板，然后怎么样呢？我们来写一个`html`的模板：

模板`index.html`

```
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>html 模板</title>
</head>
<body>
	<div id='root'></div>
	<script src='./bundle.js'></script>
</body>
</html>
```

好，接着我们在`webpack.config.js`里面这个模板用的是哪一个呢？用的就是根目录下的`index.html`，好当我们做了这个`template`的模板配置之后，我们呢再去打包一下。

webpack.config.js

```
//引入 html-webpack-plugin 插件
var HtmlWebpackPlugin = require("html-webpack-plugin");
plugins: [new HtmlWebpackPlugin({
    template: './index.html'
  })]
```

重新打包：

```
C:\Users\nickname\Desktop\lesson_3>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_3
> webpack


C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 6d76aa74e5cc48b4ac95
Version: webpack 4.41.6
Time: 2862ms
Built at: 2020-02-16 10:32:38
                     Asset       Size  Chunks             Chunk Names
                 bundle.js   24.7 KiB    main  [emitted]  main
fonts/iconfont.15896c7.eot   2.14 KiB          [emitted]
fonts/iconfont.a1f61df.ttf   1.98 KiB          [emitted]
fonts/iconfont.cc88877.svg   1.62 KiB          [emitted]
                index.html  255 bytes          [emitted]
Entrypoint main = bundle.js
```

打包结束之后呢，我们再来看打开`dist`目录找到`index.html`大家会惊讶的看到这块是不是多了一个`id`是`root`的`div`标签啊，这是怎么回事呢？我们说`html-webpack-plugin`它的作用是：当打包完成之后它会生成一个html的文件这个时候
它生成的html是以哪一个html为模板生成的呢，就是以根目录下的`index.html`做为模板生成的，所以第一步它生成了一个以根目录下`index.html`为模板的html文件，第二步它会把你打包生成的`bundle.js`注入到你的这个打包生成的`index.html`文件中，所以大家可以看到它是不是帮你注入了`bundle.js`这个文件啊。

好，当`html-webpack-plugin`帮我们完成了这两件事情之后，我们在浏览器上在查看`index.html`的时候大家可以看到这个时候直接打包出的这个`index.html`可以直接被访问了，这样的话我们以后在做打包的时候就方便多了。

##### `plugin`的一个作用以及怎么执行的

好通过这个例子，我想给大家讲一下在`webpack`之中，`plugin`的一个作用：可以在`webpack`运行到某个时刻的时候，帮你做一些事情。

如果大家学过`Vue`或者`React`，大家应该听说过生命周期函数这个东西，那`plugin`其实很像生命周期函数，怎么说呢？比如说：

`html-webpack-plugin`它呢就会在某一个时刻自动的帮你干一些事情，那这个时刻是什么时刻呢？就是当我们整个打包过程结束之后的这一个时刻，那它会帮我们干什么呢？会帮我们生成一个`html`文件，然后把打包生成的结果注入到这个`html`文件当中。

那其它的一些插件还会在另外的一些时刻帮助`webpack`来做一些事情，那比如说：你刚打包的某一个时刻，比如说你打包js文件的某一个时刻，那在这些时刻你都可以让`webpack`帮你做一些事情，那如果你想让它帮你做一些事情，那么你就可以用一些`plugin`，`plugin`就是在某一个时刻帮你做这些事情的那个东西。


---

### clean-webpack-plugin 自动清除打包目录插件

好，讲完了`html-webpack-plugin`，我们在给大家讲一个插件，这个插件有什么用呢？我来先给大家讲一个例子：比如说啊大家来看，现在在打包的过程中我打包的这个生成文件它的名字现在叫`bundle.js`，那我呢可以给它换一个名字，比如说叫做`dist.js`，保存一下然后我们重新打包：


```
C:\Users\nickname\Desktop\lesson>npm run bundle
```

大家看`dist`目录下就会多出一个`dist.js`这个文件请看下面的项目目录：

lesson

```
dist
 |--fonts
 |--bundle.js
 |--dist.js
 |--index.html
src
 |--font
 |--index.js
 |--index.scss
.browserslistrc
index.html
package.json
postcss.config.js
webpack.config.js
```

也就是我们新打包出的这个文件，然后呢`index.html`由于我们使用`html-webpack-plugin`这块呢也会多出一个`dist.js`的引用，但是我们看`dist`目录下`bundle.js`依然存在，为什么呀？是因为`bundle.js`是我们上次打包生成的`bundle.js`那这次打包我们生成的`dist.js`继续放到了`dist`目录里，上次打包生成的`bundle.js`呢并没有被删除掉，所以呢，有的时候呢这就会造成问题，我们希望做到的一点是什么？

我们啊希望重新打包的时候，能够自动的帮我们把`dist`目录先删除然后呢在去执行打包，这样的一个流程我们在打开`dist`目录就不会有上次打包的`bundle.js`了，要实现这个功能呢，我们就可以借助一个`clean-webpack-plugin`。

安装插件：

```
C:\Users\nickname\Desktop\lesson_3>cnpm install clean-webpack-plugin -D
```

好这个时候呢`clean-webpack-plugin`已经安装好了，那我们就在`webpack.config.js`配置文件中使用`clean-webpack-plugin`这个插件。

webpack.config.js

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new CleanWebpackPlugin({
      //在命令窗口中打印`clean-webpack-plugin`日志
      verbose: true,
      //清除的文件/文件夹
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "dist")] 
    })
]
```

那怎么去用它大家还记得嘛，我要在`plugins`这个数组里面去把它添加进来，我们加一个`new CleanWebpackPlugin(['dist'])`那它呢也接收一个参数这里我们可以填一个数组在数组里面我们填上`dist`表示的是当我在打包之前我呢会使用`clean-webpack-plugin`这个插件帮助我们去删除`dist`目录下的所有内容。

好那么`clean-webpack-plugin`是在打包之前会被运行的，而`html-webpack-plugin`是在打包之后在被运行的。

好了在写完这两个`plugin`之后呢，我们重新打包：

```
C:\Users\nickname\Desktop\lesson>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_3
> webpack


C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
========== 这里大家看 clean-webpack-plugin 生效了 verbose: true 时打印 =========
clean-webpack-plugin: removed dist
Hash: de1e35f68a9156d8603c
Version: webpack 4.41.6
Time: 1648ms
Built at: 2020-02-16 13:30:11
                     Asset       Size  Chunks             Chunk Names
                   dist.js   24.7 KiB    main  [emitted]  main
fonts/iconfont.15896c7.eot   2.14 KiB          [emitted]
fonts/iconfont.a1f61df.ttf   1.98 KiB          [emitted]
fonts/iconfont.cc88877.svg   1.62 KiB          [emitted]
                index.html  195 bytes          [emitted]
Entrypoint main = dist.js
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js?!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js!./src/index.scss] ./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss 3.69 KiB {main} [built]
[./src/font/iconfont.eot?t=1543245201565] 70 bytes {main} [built]
[./src/font/iconfont.svg?t=1543245201565] 70 bytes {main} [built]
[./src/font/iconfont.ttf?t=1543245201565] 70 bytes {main} [built]
[./src/index.js] 374 bytes {main} [built]
[./src/index.scss] 735 bytes {main} [built]
    + 3 hidden modules
========== 这里大家看 html-webpack-plugin 生效了 =========    
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/lib/loader.js!./index.html] 365 bytes {0} [built]
    [./node_modules/_webpack@4.41.6@webpack/buildin/global.js] (webpack)/buildin/global.js 472 bytes {0} [built]
    [./node_modules/_webpack@4.41.6@webpack/buildin/module.js] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module

```

好打包结束，我们在打开`dist`目录在看到果然之前的`bundle.js`就不再了，那么就说明我们的`clean-webpack-plugin`也就正常的生效了。

##### 打包的流程

好，好过来我们来看下打包的流程，当我们运行`npm run bundle`的时候大家可以看到首先`clean-webpack-plugin`会在你的打包流程执行之前就先执行帮助你清理这个`dist`目录它会说你这个`dist`目录已经被移除了`clean-webpack-plugin: removed dist`，好当`clean-webpack-plugin`这个插件运行完了之后我们开始进入到打包的环节，当整个打包环节都结束之后呢，你可以在最下面看到`html-webpack-plugin`开始执行然后呢他会生成一个`index.html`，在`index.html`中呢它也会把我们生成的js放到这个html文件之中。


---


### 结语

好这样的话呢这节课我们就给大家讲解了两个`webpack`里面比较常用的插件，分别是`html-webpack-plugin`和`clean-webpack-plugin`。

也给大家讲清楚了`plugin`的作用，在`webpack`中如果你想在某些打包的节点上去做一些操作的话你就可以使用各种各样的插件来帮你实现这样的功能，那`webpack`有多少这样的插件呢，我们可以打开官网来看找到`html-webpack-plugin`这里页面看左侧的列表有一推的插件，这些呢都可以帮助我们完成各种各样我们想要做的事情，这只是官网推荐使用的一些`plugin`，实际上有一些第三方的`plugin`并没有被官网收录进来，那这些`plugin`还有非常多的内容，所以呢使用`webpack`如果你一个一个`plugin`去学那多了去了。

所以我们应该怎么去使用`plugin`呢？

实际上当我们想去实现一些功能的时候，这个时候我们可以到百度上去搜索一些`webpack`相应的配置，然后呢找到这个配置里面它会告诉我们可能会用到哪些`plugin`，然后我们再去查这些`plugin`的说明文档学习使用就可以了。
