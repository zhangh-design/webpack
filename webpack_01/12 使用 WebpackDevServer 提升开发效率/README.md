12 使用 WebpackDevServer 提升开发效率

> 前言：同学们大家好，这节课我来带大家使用`WebpackDevServer`提升我们项目的开发效率，当然呢我们不仅仅会去讲`WebpackDevServer`，我们还会扩充其它的两个知识点，下面我们一起来学习这部分的内容。

我们打开上节课的代码，不知道大家发没发现这样的一个情况，每一次我改变完了我们的代码，如果能正确的在浏览器上运行都需要怎么办呢？

我们是不是都需要手动的打开命令行，去运行`npm run bundle`这个命令重新打包一次，然后在手动的去打开`dist`目录下的`index.html`，每一次都要这么办才能实现代码的重新编译和运行，这样的话呢实际上我们的开发效率是非常低下的。

那我们希望实现这样的一个功能：

我希望如果我改了`src`目录下的源代码那么`dist`目录自动就会重新打包，这样的话我呢在去页面上看效果就简单多了，就不用每一次都去重新在运行`npm run bundle`这样的命令。

好要想实现这样的功能，有三种做法我们一个个来学习：

#### 1：--watch

首先第一种，打开这个`package.json`当我们运行`npm run bundle`的时候实际上
在运行`webpack`这个命令。

package.json

```
"scripts": {
    "bundle": "webpack"
}
```

我们可以给它加一个参数叫做`-- watch`，好这个时候我这个打包的命令就不叫`bundle`了，我们给它起名叫做`watch`。

package.json

```
"scripts": {
    "bundle": "webpack",
    "watch": "webpack --watch"
}
```

保存一下`package.json`，我们来实验一下：


```
F:\github-vue\workspaces\lesson>npm run watch

> webpack-demo@1.0.0 watch F:\github-vue\workspaces\lesson
> webpack --watch


F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js" --watch

webpack is watching the files…

clean-webpack-plugin: removed dist
Hash: 40279581d8795a5924b8
Version: webpack 4.41.6
Time: 893ms
Built at: 2020-02-19 16:39:02
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js   4.22 KiB    main  [emitted]  main
Entrypoint main = main.js
[./src/index.js] 66 bytes {main} [built]
Child html-webpack-plugin for "index.html":
     1 asset
    Entrypoint undefined = index.html
    [./node_modules/_html-webpack-plugin@3.2.0@html-webpack-plugin/lib/loader.js
!./index.html] 383 bytes {0} [built]
    [./node_modules/_webpack@4.41.6@webpack/buildin/global.js] (webpack)/buildin
/global.js 472 bytes {0} [built]
    [./node_modules/_webpack@4.41.6@webpack/buildin/module.js] (webpack)/buildin
/module.js 497 bytes {0} [built]
        + 1 hidden module

```

当我加了一个`watch`参数的时候它是什么意思呢，意思就是`webpack`会帮我们去`watch`监听它打包的文件，只要它打包的文件发生变化，它呢自动的就会重新打包，我们来看一下是不是这样的效果。

我们先看`src`目下的`index.js`展示的是`hello world`：

index.js

```
console.log('hello world');
```

我手动在浏览器上打开`index.html`，打开控制台会看到打印出来的是`hello world`。

好这个时候我改变源代码：

index.js

```
console.log('hello world!apple');
```

保存后我们这次不需要在手动去打包，直接刷新我们的页面大家可以看到浏览器控制台马上就打印出了`hello world!apple`。

那么只要我们的源代码发生了变化`webpack`呢就能监听到你的打包文件发生了变化它就会重新打包，重新打包呢`dist`目录下的文件就发生了变化，那你在去刷新这个页面的时候展示就是最新打包生成的这个文件。

好这是第一种做法。

#### 2：webpack-dev-server

安装：
```
cnpm i webpack-dev-server --save-dev
```

这里需要注意下：安装`webpack-dev-server`这个插件的时候会同时把`lodash`这个库安装进去，所以如果碰到没有使用npm安装`lodash`这个库但是在项目内导入`lodash`的函数又能使用，那可能就是因为你安装了`webpack-dev-server`。

第一种做法呢还不够好，我希望什么呢我希望有的时候假设：我第一次运行`npm run watch`的时候自动的实现帮我打包同时呢自动把浏览器还能帮我打开，同时呢还可以去模拟一些服务器上的特性，这个时候啊光光通过这个`webpack --watch`这个配置就不行了。

我们呢可以借助`WebpackDevServer`来帮助我们实现更加酷炫的效果，所以接下来呢我来给大家讲`WebpackDevServer`。

##### contentBase: './dist'

我们试验一下在`webpack`的配置里面我们加一个`devServer`这样的一个配置:

webpack.config.js

```
devServer: {
    contentBase: './dist'
}
```

这里我们要写一个最基础的配置项：
- contentBase：我的服务器要起在哪一个文件夹下，因为我打包生成的文件都会放到`dist`目录下，所以呢我要借助`WebpackDevServer`帮助我们起一个服务器，这个服务器它的根路径在哪，就是在当前目录下的`dist`文件夹下。

好当我们做了`devServer`的配置之后，我们呢在去写一个`package.json`里面的脚本：

package.json

```
"scripts": {
    "bundle": "webpack",
	"watch": "webpack --watch",
	"start": "webpack-dev-server"
}
```

这里我们叫`start`我们运行`webpack-dev-server`就可以了，好，当然了我们先试一下：

我们需要先安装`webpack-dev-server`到项目内：

```
F:\github-vue\workspaces\lesson>cnpm i webpack-dev-server -D
```

安装完成后，然后我们运行`npm run start`：

```
F:\github-vue\workspaces\lesson>npm run start

> webpack-demo@1.0.0 start F:\github-vue\workspaces\lesson
> webpack-dev-server


F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack-dev-server@3.10.3@webpack-dev-server\bin\webpack-dev-ser
ver.js"
i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from ./dist
clean-webpack-plugin: removed dist
i ｢wdm｣: Hash: bd38ef65fed48b24ef54
Version: webpack 4.41.6
Time: 1563ms
Built at: 2020-02-19 17:20:41
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js    894 KiB    main  [emitted]  main
Entrypoint main = main.js
[0] multi ./node_modules/_webpack-dev-server@3.10.3@webpack-dev-server/client?ht
tp://localhost:8080 ./src/index.js 40 bytes {main} [built]
// 这里省略了一些打包输出信息
i ｢wdm｣: Compiled successfully.
```


大家可以看到这个时候啊，它会告诉我们现在已经帮助我们起了一个服务器在`http://localhost:8080/`上，我们呢可以直接在浏览器上去访问这个地址：

![image](http://i2.tiimg.com/717460/2ac230f6ad420a66.jpg)

这个时候页面在浏览器上正常打开，我们打开控制台显示的是`hello world!apple`。

然后呢我们再来改一下我们的源代码：

index.js

```
console.log('hello world!apple!!!!!!');
```

好，当这个代码发生改变的时候`webpack-dev-server`也能感知到我打包的文件发生了变化，那么它会帮我们去重新启动`webpack-dev-server`这个时候我们再去访问`http://localhost:8080/`大家可以看到后面的`!`都已经输出来了。

而且它有一个非常好的特性是什么呢？

我们在来修改下`index.js`的源码：

index.js

```
console.log('hello world!apple#####');
```

保存源代码，大家来看这个时候啊我把它改成`#`然后在回到浏览器的页面上，我并没有做任何的刷新，控制台上输出的内容已经自动的变成了`hello world!apple#####`。

所以`webpack-dev-server`它比`--watch`好在哪里呢？

`webpack-dev-server`它不但会监听到我文件发生了改变，重新帮我们打包它还会自动的帮助我们重新刷新这个浏览器，所以用它呢可以更方便的提升我们代码开发的效率。

##### open: true

这个时候我们在关闭下浏览器，我们呢对`webpack-dev-server`在做额外的一个配置：

现在在`webpack.config.js`里面你只配置了一个`contentBase`，我可以在这里在配置一个`open`这样的属性把它变为`true`，那这是什么意思呢？它的意思是在启动`webpack-dev-server`的时候也就是当你运行`npm run start`的时候`webpack-dev-server`会被启动，启动的时候`open`指的是它会自动的帮你打开一个浏览器然后自动的访问你的这个服务器的地址也就是`http://localhost:8080/`：

```
module.exports = {
  devServer: {
    contentBase: './dist',
    open: true
  }
}
```

配置了`open: true`后有这么神奇吗？我们来看一下：

重新打包

```
C:\Users\nickname\Desktop\lesson>npm run start
```

大家可以看到它自动的帮我们打开了一个`http://localhost:8080/`这样的一个页面。


##### 那为什么我们要开这样一个`webpack-dev-server`服务器呢

大家如果写过`Vue`或者`React`都知道有的时候我们在前端要去写这个`ajax`请求
，如果你直接通过`file:///C:/Users/nickname/Desktop/lesson_3/index.html`这种`file`文件协议的形式打开这个`index.html`那如果在这个页面上去触发`ajax`请求就不行了，因为如果你想发`ajax`请求就要求你所在的这个`index.html`必须在一个服务器上通过`http`协议的方式打开，但是如果用`file`文件协议肯定是不行的，这就是为什么我们要借助`webpack-dev-server`来帮助我们开启一个`WEB`服务器的原因，那开启一个`WEB`服务器，接着在我们的`index.js`里面在去发`ajax`请求就没有任何的问题了。

因为如果你运行`npm run start`：

```
F:\github-vue\workspaces\lesson>npm run start
```

开启了一个`WEB`服务器的话，那么你的代码实际上是在`http://localhost:8081/`这个地址上去访问的，那其实它是一个`http`的网址所以在它上面在去发`ajax`请求什么的都不会有任何的问题，所以一般大家也会看到当你去使用`Vue脚手架工具`或者`React脚手架工具`它都会帮助你开启一个服务器，那这个服务器实际上大多数情况下呀都是直接使用这个`webpack-dev-server`帮助我们开启出来的。

##### proxy 代理

好我在额外去扩展一些东西，大家都知道不管写`React`或者`Vue`里面都有一个`proxy`的配置，实际上它是帮助我们去做跨域的这种接口模拟的时候要使用的一个接口代理。

那为什么在`Vue`或者`React`之中可以使用这个接口代理呢？

是因为`Vue`或者`React`脚手架的底层都使用了`webpack-dev-server`，如果你打开[webpack](https://www.webpackjs.com/)的官网进入到`CONFIGURATION`（[配置](https://www.webpackjs.com/configuration/)）我们在左侧列表树中找到[`devServer`](https://www.webpackjs.com/configuration/dev-server/)，大家来看啊，这里它会有个配置项叫做[proxy](https://www.webpackjs.com/configuration/dev-server/#devserver-proxy)，好你可以在`devServer`的配置项里面去填
写`proxy`：

webpack.config.js

```
module.exports = {
    devServer: {
        contentBase: './dist',
        open: true,
        proxy: {
          '/api': 'http://localhost:3000'
        }
  }
}
```

如果用户访问`/api`这个地址的话，也就是访问`http://localhost:8081/api`这个路径的话它会帮你直接转发到`http://localhost:3000`这个地址，那之所以之前的那几个脚手架呢都能支持`proxy`它的底层原理就在于它使用了`webpack-dev-server`而`webpack-dev-server`它本质上就支持这种跨域的代理，所以呢各个脚手架里面都能够支持这种`proxy`的配置。


好，那么我们继续往下看`webpack-dev-server`里面啊除了可以配置`contentBase`和`open`之外还可以配置非常非常多的内容，我们随便打开它的配置项你可以看到啊你可以找到像很多常用的配置项，比如所：

- open （之前我们已经用到了）
- port （指定要监听请求的端口号）
  大家可以看到默认端口号是`8080`，所以你开启的服务器运行在`8080`的端口上
  ，你呢如果想让它变成`8090`那你可以在`devServer`下面配置在配置一个`port`的端口号。

```
devServer: {
	port: 8090
}
```

那么你打开官网除了这些配置项之外啊其实还有非常非常多其它的关于`devServer`的配置内容，我们打开官网啊你可以看到左侧这一排都是关于`webpack-dev-server`的配置项有兴趣的同学呢可以自己来提前预习一下。

##### 命令行接口(command line interface) （webpack 命令行窗口运行语法）


我们打开`webpack`的官方网站进入到`API`（[API](https://www.webpackjs.com/api/)）左侧这里有一个[命令行接口(command line interface)
](https://www.webpackjs.com/api/cli/)大家可以看到点开之后有很多的内容然后呢你可以点一点看一下。


![image](http://i2.tiimg.com/717460/795b0fad0526ddce.jpg)

其实它的意思是在命令行里面你可以怎么去写一些`webpack`的执行语法，比如说你可以在命令行里写：

使用配置文件的用法

```
webpack <entry> [<entry>] -o <output>
```

所以你可以在命令行里这些写：

（如果是项目内安装的`webpack`的同学可以在`package.json`文件里增加一个`npm`的指令，因为局部安装`webpack`如果直接在命令行里运行`webpack`这个指令会是得到`webpack不是内部或外部命令`的提示。）

命令窗口（全局安装`webpack`）：
```
webpack src/index.js -o bundle.js
```

（局部安装`webpack`，使用`npm`命令 `webpack run bbb`）
```
"scripts": {
	"bbb": "webpack src/index.js -o bundle.js"
  }
```


它的意思就是在命令行里面我们运行`webpack`做文件的打包，入口文件呢是`index.js`打包输出的文件呢叫做`bundle.js`，这个`-o`呢是`output`的一个简写

如果你想在命令行里面做一些`webpack`命令的运行的时候，你不知道有什么语法供你使用，那么你就到[API](https://www.webpackjs.com/api/)这里去查[命令行接口(command line interface)](https://www.webpackjs.com/api/cli/)都在这里面

##### Node.js API （webpack 提供了 Node.js API，可以在 Node.js 运行时下直接使用。）

好我们再来看还有一个[Node.js API](https://www.webpackjs.com/api/node/)，那`Node.js API`是什么意思呢？

假设你想在`Node`里面去运行`webpack`，那么它的一些接口呢都在这里[webpack](https://www.webpackjs.com/api/node/#webpack-)。

我们看我们在`Node`里面引入了`webpack`，直接调用`webpack`传了一个`config`参数，之所以能够`webpack`括号传入`config`让它去运行，是因为在[Node.js API](https://www.webpackjs.com/api/node/)里面就提供了`webpack()`这样的方法。

server.js（示例代理里面没有写server.js，这里只是举个例子）

```
const webpack = require('webpack')

const config = require('./webpack.config.js')
const complier = webpack(config)
```

你也可以看到这里方法里面我们就是可以传递一些参数，它不但可以传递第一个参数也就是`配置对象`，还可以传递一个回调函数，所以呢如果你在`Node`里面需要调`webpack`做事情的话你就要到[Node.js API](https://www.webpackjs.com/api/node/)里去查询就行了。


```
const webpack = require("webpack");

webpack({
  // 配置对象
}, (err, stats) => {
  if (err || stats.hasErrors()) {
    // 在这里处理错误
  }
  // 处理完成
});
```


![image](http://i2.tiimg.com/717460/f5ae233b6bab9ad5.jpg)


### 作业

我要求大家打开[webpack](https://www.webpackjs.com/)的官方文档进入打开`GUIDES`（[指南](https://www.webpackjs.com/guides/)），完整的把`Development`（[开发](https://www.webpackjs.com/guides/development/)） 这块的文档给它读完，我这节课给大家讲的内容就是这部分的内容。

读完`Development`这部分文档呢大家也可以自己点开`CONFIGURATION`（[配置](https://www.webpackjs.com/configuration/)）去看一下之前我们将的这个[`DevTool`](https://www.webpackjs.com/configuration/devtool/)也就是`SourceMap`这块的内容。

顺带着呢也看看这节课我们讲的[`开发中 Server(devServer)`](https://www.webpackjs.com/configuration/dev-server/)
对应的配置内容，那大家看一下主要有个大致的映象以后我们做配置的时候你要知道到哪里去查。
