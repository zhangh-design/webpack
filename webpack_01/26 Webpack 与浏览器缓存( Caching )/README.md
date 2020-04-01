26 Webpack 与浏览器缓存( Caching )

> 这节课呢我来给大家讲解`Webpack`与浏览器缓存的一些关系，那这里浏览器缓存我们也会把它称之为`Caching`。

#### 修改lesson项目，打包配置

打开之前我们写的代码`lesson`项目
我们来改改我们的代码。

打开`src`目录下的`index.js`:

index.js

```
import _ from 'lodash';
import $ from 'jquery';

const dom = $('<div>')
dom.html(_.join(['hello','world'], ' '));
$('body').append(dom);

```

我们写了这样一段代码，然后我们进行一次`Webpack`的打包`npm run build`：

这里`npm run build`打包之后有`source-map`的文件会干扰我们后面的学习所以这里我们先把`webpack.prod.js`下的`source-map`先给注释掉。

```
C:\Users\nickname\Desktop\lesson>npm run build

> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.prod.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.prod.js
clean-webpack-plugin: removed dist
Hash: 12dd6630f2b54b720fa7
Version: webpack 4.42.0
Time: 1672ms
Built at: 2020-03-26 21:57:59
      Asset       Size  Chunks                          Chunk Names
 index.html  204 bytes          [emitted]
 main.js    8.6 KiB       0  [emitted]  main
vendors~main.chunk.js    871 KiB       1  [emitted]  vendors~main
Entrypoint main [big] = main.js main.js.map

[28] (webpack)/buildin/global.js 472 bytes {0} [built]
[51] multi core-js/modules/es.promise core-js/modules/es.array.iterator ./src/index.js 52 bytes {0} [built]
[90] ./src/index.js 1.29 KiB {0} [built]
[93] (webpack)/buildin/module.js 497 bytes {0} [built]
    + 90 hidden modules

================ 这里出现了警告 ==================

WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets:
  main.js (877 KiB)

WARNING in entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:
  main (877 KiB)
      main.js


WARNING in webpack performance recommendations:
You can limit the size of your bundles by using import() or require.ensure to lazy load some parts of your application.
For more info visit https://webpack.js.org/guides/code-splitting/
```

它会提示我们的代码有一点警告，什么原因呢？

是因为我的这个代码里面即引入了`jquery`又引入了`lodash`打包生成的文件比较大超过了它要求的`244KB`就会报一个文件过大的警告，其实啊没什么问题我们先把这个警告去掉，怎么去掉：

打开我们的`build`目录下的`webpack.common.js`加一个配置项叫做`performance`：

```
module.exports = {
    performance: false
}
```

`npm run build`打包后我们生成了一段线上的代码，当然呢大家可以看到打包输出里有一个`chunk`文件叫`vendors~main.chunk.js`，`main.js`这里文件里面放置的是我们的业务逻辑而`vendors~main.chunk.js`这个文件里面放置的是我们`node_modules`下面的
代码也就是`jquery`和`lodash`会放到`vendors~main.chunk.js`这里面来，为什么？

是因为在`webpack.common.js`里面`splitChunks`默认有一个`cacheGroups`里面会有一个配置项就是`vendors`：

```
optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
           test: /[\\/]node_modules[\\/]/,
           priority: -10,
           filename: "vendors.js" // 同步引入
        }
      }
    }
}
```

这样配置之后我们保存重新打包：

其实我们现在就是在做一些打包配置的优化，这个时候我们发现打包生成的文件啊

```
C:\Users\nickname\Desktop\lesson>npm run build

> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.prod.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.prod.js
clean-webpack-plugin: removed dist
Hash: 65b6ae2cd97c1337ece9
Version: webpack 4.42.0
Time: 1774ms
Built at: 2020-03-26 22:21:20
     Asset       Size  Chunks             Chunk Names
index.html  261 bytes          [emitted]
======= main.js是我们的逻辑 ========
   main.js    8.6 KiB       0  [emitted]  main
===== 这里的名字就是 vendors.js 了，里面就放置了 node_modules 里面我们引入的模块，包含了 jquery和lodash ========
vendors.js    871 KiB       1  [emitted]  vendors~main
Entrypoint main = vendors.js main.js
[28] (webpack)/buildin/global.js 472 bytes {1} [built]
[51] multi core-js/modules/es.promise core-js/modules/es.array.iterator ./src/index.js 52 bytes {0} [built]
[90] ./src/index.js 1.29 KiB {0} [built]
[93] (webpack)/buildin/module.js 497 bytes {1} [built]
    + 90 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [0] ./node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/lib/loader.js!./index.html 383 bytes {0} [built]
    [2] (webpack)/buildin/global.js 472 bytes {0} [built]
    [3] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module
```

---

#### output.filename配置contenthash

好接下来我们来讲这节课的内容。

我们说当我们运行打包命令生成了这个`dist`目录之后实际上我们应该把这几个文件放到服务器上，服务器上呢就可以运行这些文件。

假如我们现在打包后的代码跑在服务器上，那么实际上它的请求过程是什么样子的我们打开`Chrome`的`NetWork`，我们刷新浏览器看一下：

首先会去访问`index.html`这个页面，然后呢页面会去请求两个js文件，当用户第一次访问的时候，`vendors.js`和`main.js`这两个js文件是肯定会被请求的。

可是假设用户第二次刷新页面的时候这两个文件实际上已经被保存在了我们的浏览器里面，那第二次访问页面的时候浏览器就直接去拿缓存了，大家听好了，现在我们的用户已经访问过一次了，那在这个时候我突然要改一下我的代码，比如说：

index.js

```
import _ from 'lodash';
import $ from 'jquery';

const dom = $('<div>')
dom.html(_.join(['hello','world'], ' --- ')); // 我突然把这里改一下
$('body').append(dom);
```

我改了我的源代码，然后重新进行一次打包`npm run build`：

```
C:\Users\nickname\Desktop\lesson>npm run build

> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.prod.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.prod.js
clean-webpack-plugin: removed dist
Hash: 65b6ae2cd97c1337ece9
Version: webpack 4.42.0
Time: 1805ms
Built at: 2020-03-30 21:55:27
     Asset       Size  Chunks             Chunk Names
index.html  261 bytes          [emitted]
   main.js    8.6 KiB       0  [emitted]  main
vendors.js    871 KiB       1  [emitted]  vendors~main
Entrypoint main = vendors.js main.js
[28] (webpack)/buildin/global.js 472 bytes {1} [built]
[51] multi core-js/modules/es.promise core-js/modules/es.array.iterator ./src/index.js 52 bytes {0} [built]
[90] ./src/index.js 1.29 KiB {0} [built]
[93] (webpack)/buildin/module.js 497 bytes {1} [built]
    + 90 hidden modules
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [0] ./node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/lib/loader.js!./index.html 383 bytes {0} [built]
    [2] (webpack)/buildin/global.js 472 bytes {0} [built]
    [3] (webpack)/buildin/module.js 497 bytes {0} [built]
        + 1 hidden module
```

然后我把`dist`目录下新生成的这些文件上传到了服务器上，那大家想一下当用户
刷新的时候，它是应该`hello world`还是看到之后我们改变过的内容呢，实际上如果这个时候用户刷新页面的话它不是强制刷新啊是普通刷新，它拿到的还是我们之前`hello world`展示的这个内容。

为什么呀？

因为我们打包生成的新的文件的名字没有变，还是`vendors.js`还是`main.js`，那么用户在刷新页面的时候它去请求这两个文件发现我本地已经有缓存了，我就用本地的缓存了，就不会用你新上传上去的这两个新的文件，这样的话就会产生问题。

那为了解决这个用户浏览器上缓存文件的问题，我们可以怎么做呢？

我们可以引入一个概念叫做`contentHash`，在这块我对我的代码做一个变更，打开`webpack.common.js`找到`output`这里，我把`output`这块的内容剪切一下在`webpack.dev.js`里面我们配置一下这个`output`，那在`dev`开发环境下我不用去关心用户缓存的问题，每次我都单独打包然后用户刷新或者热模块更新，它都会帮助我们解决这个更新的问题，所以我们不用管，毕竟是在开发嘛。


webpack.dev.js

```
output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js"
}
```

那在上线的时候我们就不能这么写了`output`我们要这么去写：

webpack.common.js

你这块不仅要写一个`[name]`还要在去写一个`[contenthash]`它是和`[name]`一样的一个占位符，如果我们的源代码没有改变那么打包生成文件对应的这个`[contenthash]`永远都不会变，那你看这个英文名你就知道它的意思了，它是根据`content`文件内容产生的一个`hash`字符串，那`content`不变`hash`字符串就不会变。

```
output: {
  filename: "[name].[contenthash].js",
  chunkFilename: "[name].[contenthash].chunk.js"
}
```

webpack.common.js

（注释掉这里的 `filename` 不会不会产生 `contenthash`）

```
optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
            // filename: "vendors.js" // 同步引入
        }
      }
    }
}
```

我们来做一个实验啊，这个时候我们在打包`npm run build`：

```
Built at: 2020-03-31 12:38:55
Asset       Size  Chunks                         Chunk Names
index.html  314 bytes          [emitted]
main.3aede9e2405e647a2576.js    8.6 KiB       0  [emitted] [immutable]  main
vendors~main.76e55c1be75ed7d037cb.chunk.js    871 KiB       1  [emitted] [immutable]  vendors~main
```

大家可以看到这次打包生成的两个文件不仅有文件名，后面还会跟一个这样的`contenthash`值，我们说只要我们不改源代码文件的内容不变，那么这两个值在打包的过程中呢永远都不会变。

所以呢假设我没对源代码做更改我重新打包然后呢我把这个代码上线那没有任何的问题，打包出的文件的名字不发生任何的变化，那么用户第二次访问的时候它直接用本地的缓存OK的，因为本身你从新打包文件的内容根本就没变，所以这样的话它缓存也是OK的。

但假设我下面对源代码做了变更，找到`src`目录下的`index.js`文件：

index.js

```
import _ from 'lodash';
import $ from 'jquery';

const dom = $('<div>')
// dom.html(_.join(['hello','world'], ' --- ')); // 改变源代码注释掉这行
dom.html(_.join(['hello','world'], ' , '));
$('body').append(dom);
```

我们重新进行打包`npm run build`：

```
Built at: 2020-03-31 12:47:19
Asset       Size  Chunks                         Chunk Names
index.html  314 bytes          [emitted]
main.fc4407f0dadb50fca1ee.js   8.65 KiB       0  [emitted] [immutable]  main
vendors~main.76e55c1be75ed7d037cb.chunk.js    871 KiB       1  [emitted] [immutable]  vendors~main
Entrypoint main = vendors~main.76e55c1be75ed7d037cb.chunk.js main.fc4407f0dadb50fca1ee.js
```

这个时候大家来看啊，之前`2576`现在我们变更的是`ca1ee`，说明什么，说明`main`这个chunk对应的源代码变化了它对应的`hash`值就变化了。

在来看`vendors`，之前是`37cb`现在还是`37cb`，为什么`vendors`没有变化呢？

是因为`vendors`里面放置的是我们`jquery`和`lodash`的代码，这两个代码我们没改它对应的`hash`值就不会变。

这个时候假设我要重新打包代码，然后把代码上线我们呢就会把`dist`目录放到线上服务器上去，那大家想用户再去访问线上的这个页面的时候，会有一个什么样的流程：

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
<script type="text/javascript" src="vendors~main.76e55c1be75ed7d037cb.chunk.js"></script>
<script type="text/javascript" src="main.fc4407f0dadb50fca1ee.js"></script></body>
</html>
```

- 它会打开线上页面的`index.html`去加载这个`vendors`的js文件，`vendors`js文件和它之前请求的`vendors`js文件名字是一模一样的，所以呢它就可以用本地的缓存。

- `main`js文件对应的这个`hash`值变了，所以它就必须的去我们的服务器上重新去加载新的这个`main`js文件。

通过使用`contenthash`这种形式我们可以做到当我们重新打包代码上线的时候用户只需要更新我们有变化的代码，而没有变化的代码用户可以直接同它本地的缓存。

那这就是我们这节课要讲的`Webpack`去解决浏览器`Caching`的一个问题，那大家看到了这样的话我们基本上就把这个问题给解决了。

注意：##### 老版本Webpack的`contenthash`打包问题：

好，这块呢有的同学在去做这个`Webpack`打包的时候你的`Webpack`你的webpack版本可能比较低对于老一点的webpack4的用户呢，你会发现当你去做`npm run build`的时候即便你没有对代码做任何的变更，有可能你两次打包的`contenthash`的值是不同的，这个时候呢就需要你额外的做一个配置，所以对老版本的用户来说如果你发现啊你没改变代码但是两次打包的这个`contenthash`值是不一样的这个时候需要你额外做一个配置：

webpack.common.js

```
optimization: {
  // 老版本 webpack打包contenthash打包不一致问题配置
  runtimeChunk: {
    name: 'runtime'
  }
}
```

我们运行`npm run build`打包看一下：

```
Built at: 2020-03-31 22:08:55
                                     Asset       Size  Chunks                         Chunk Names
                                index.html  398 bytes          [emitted]
        main.aad4dcc02c34871d04af.chunk.js   2.48 KiB       0  [emitted] [immutable]  main
           runtime.b1535655bfa762463e66.js   6.11 KiB       1  [emitted] [immutable]  runtime
vendors~main.cb625356d736e9f98e1b.chunk.js    871 KiB       2  [emitted] [immutable]  vendors~main
Entrypoint main = runtime.b1535655bfa762463e66.js vendors~main.cb625356d736e9f98e1b.chunk.js main.aad4dcc02c34871d04af.chunk.js
[28] (webpack)/buildin/global.js 472 bytes {2} [built]
```

新版本我们这么配其实也没什么问题，但是你会发现它多了一个`runtime`这样的文件，我们在做一次打包在没改变源代码的情况下你会发现两个打包的`contenthash`值是一样的。

但是我们现在多生成了一个`runtime`这样的文件，这是怎么一回事呢，我来给大家讲一讲：

实际上啊当你在做`webpack`打包的时候，我们呢`main.js`里放的是业务逻辑，`vendors`文件里面放置的是我们的库，但是这个我们的业务逻辑和我们的库之间也是有关联的，那这个关联呢在`Webpack`之中呢把这些关联的代码或者说关联逻辑
处理这块内置的代码叫做`manifest`这样的一个代码，默认`manifest`呢实际上是存在于`main.js`里面的：

未配置`runtimeChunk`时打包输出的`main.js`的大小（8.6KB）：

```
main.3aede9e2405e647a2576.js    8.6 KiB       0  [emitted] [immutable]  main
```

在`webpack.common.js`里配置了`runtimeChunk`：

```
main.aad4dcc02c34871d04af.chunk.js   2.48 KiB       0  [emitted] [immutable]  main
runtime.b1535655bfa762463e66.js   6.11 KiB       1  [emitted] [immutable]  runtime
```

也存在于`vendors.js`里面，`manifest`在每次打包的时候在旧版的`Webpack`中呢可能会有差异，正式因为它的差异导致了每次打包的时候啊虽然你没有改变源代码，但是`main.js`和`vendors.js`里面的代码实际上就跟着变了，这就是为什么老版本的Webpack你去做打包的时候即便你没改源代码，你会发现它的`contenthash`值也发生变化了，原因就在于啊这个`manifest`内置的包和包之间的一个关系或者说js和js文件之间的一个关系嵌套在各自的文件里面，这个关系每次打包的时候可能会变化。

当我们去配置了`runtimeChunk`就把`manifest`这块关系相关的代码抽离出来单独
放到了一个`runtime.js`这样的文件里面去，这样的话`main.js`里面就写业务逻辑`vendors.js`文件里面就放我们的库文件，而之间的关系都放到`runtime.js`里面去，这样的话在老版本里面无论你怎么打包这个`main.js`对应的`contenthash`
和`vendors.js`对应的`contenthash`都不会变化了，因为它里面不会去有`manifest`任何的代码了，是这样的一个原理。

通过这样的配置新版本的`webpack4`和老版本的`webpack4`都能够很好的去处理这种`contenthash`这样的值了。

那这节课的内容呢讲到这差不多就结束了，其实我们就给大家讲解了如何在Webpack里面去配置`contenthash`这样的一个占位符通过它呢帮助浏览器去合理的做缓存
，通知呢我又给大家讲解了那在我们去做浏览器缓存的时候有时候会失效原因就在于`manifest`在老版本的webpack中呢会被打包到各个文件中那有可能每一次打包的时候这个`manifest`都变化，解决这个问题呢我们就可以使用这个提供的一个配置参数叫做`runtimeChunk:{name: 'runtime'}`把`manifest`和`runtime`对应的一些内容啊都提取到这个`runtime`文件里面去，这样的话就不会影响到我们的业务代码和库代码了。

好其实呢在老的一些的Webpack版本中啊去做这个缓存或者说去做这个`contenthash`的处理啊还要结组一些其它的插件，但是在webpack现在的4.0的版本中呢我们会发现其实你什么也不用做它已经帮你做的非常的完善了，所以我还是建议大家直接把你的webpack升级到最新的版本然后去利用它内置的一些新的特性就可以了。
