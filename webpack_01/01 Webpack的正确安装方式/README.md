## Webpack的正确安装方式

> 前言：同学们大家好这节课我来给大家介绍一下`webpack`的环境搭配。

[->Webpack中文官网](https://webpack.docschina.org/concepts/)

#### Node.js 下载安装

`webpack`呢是基于`Node.js`开发的模块打包工具，所以呢，它本质上是由`Node`实现的，那我们首先呢就要安装`Node.js`这样的一个环境，大家跟我一起打开网页搜索[`Node.js`](https://nodejs.org/en/)，大家可以看到这里它有一个`12.15.0 LTS`版本和`13.8.0 Current`最新版本，我建议大家呢来安装`12.15.0 LTS`的这个版本就可以了，它呢是一个比较稳定的版本，当我们去安装这个`Node.js`的时候大家呢要尽量的安装最新版本的`Node.js`因为新版本的`Node.js`会很大程度上提高`webpack`的打包速度，如果呢大家仔细阅读过`webpack`的文档你会发现啊提升`webpack`打包速度里面有两个非常重要的点：

1. 一个是你要保持`Node.js`的版本尽量的新。
2. 另一个呢就是保持`webpack`的版本尽量的新。

高版本的`webpack`会利用`Node`新版本中的一些特性来提高它的打包速度，`webpack`的作者也提到了在某些复杂的打包情况下，在最新的`Node.js`版本下面你用`webpack 4`打包比老本版的`Node.js`下用`webpack 3`打包快了90%以上，所以呢，大家安装
`Node`的时候一定要安装最新的这个`Node`版本，但是为什么我们不安装右侧的这个`13.8.0 Current`的这个更新的版本呢？是因为这个版本里面啊它不是一个稳定的版本，它是最新版没问题但是它里面包含了一些尝试性的特性有可能呢存在一些小的bug，所以为了稳定同时又保持它版本比较新我们用这个`12.15.0 LTS`的这个版本，大家呢如果是`windows`的用户点击一下下载之后下一步下一步安装就可以了，那`Mac`的同学呢也一样你点击下载进行下一步的安装，傻瓜式的就可以帮助大家构建好你的`Node.js`的这个环境。

好当你安装完成之后呢你可以按照我下面的操作来验证一下，这里我就不演示这个安装的过程了，因为它非常傻瓜非常简单：

好，假如你安装好了`Node.js`打开你的终端也就是你的控制台命令窗口在这里你运行`node -v`回车大家可以看到它就会打印出你的`Node`版本号，这里我的版本如下：

```
C:\Users\nickname>node -v
v10.13.0
```

```
C:\Users\nickname>npm -v
6.4.1
```

接着呢大家再来运行一下`npm -v`，如果这里也正常输出了一个 npm 的版本号那就说明你安装`Node.js`的时候连同它的`npm`工具一样也安装好了，当这两个命令能输出对应的版本号就说明你`Node`安装的没有任何的问题，我们就可以接下来继续去学习`webpack`了。

#### npm init 命令构建 node 项目包

首先呢我们在我们的桌面上去创建一个`Node`的项目，我们进入到桌面，然后创建一个叫做`webpack-demo`这样的文件夹，好这个时候桌面上大家可以看到多出了一个`webpack-demo`这样的一个文件夹，好了然后我们进入到这个文件夹运行`npm init`，好这是什么意思呢？我们之前已经安装好了`npm`这个包管理工具，它是`Node.js`的一个工具它可以帮助我们以`Node`规范的形式创建一个项目或者创建一个`Node`的包文件，所以呢大家要想去用`webpack`管理项目首先你要让你的项目符合`Node`的规范，当你运行`npm init`去初始这个项目的时候这个项目就会符合`Node`的规范。

好了我们在输入`npm init`后回车，这个时候它先问你，你的这个包的名字叫什么呀是不是就叫`webpack-demo`啊我们如果是的话就回车就好了。

**注意：**`npm init`也可以写成`npm init -y`它就不会问你到底要怎么配置了，自动帮你生成一个默认的配置项。

```
C:\Users\nickname\Desktop>mkdir webpack-demo

C:\Users\nickname\Desktop>cd webpack-demo

C:\Users\nickname\Desktop\webpack-demo>npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (webpack-demo)  这里如果不需要起新名字回车就好了，默认使用`webpack-demo`
version: (1.0.0) 这个项目的版本默认是 1.0.0 没问题，回车就可以了
description:  这项目的描述呢你可以写也可以不写，我们一路回车就可以
entry point: (index.js)  好大家下面的步骤直接回车就可以了
test command:  
git repository: 
keywords: 
author:  
license: (ISC)
About to write to C:\Users\nickname\Desktop\webpack-demo\package.json:

{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
Is this OK? (yes) yes （最后呢它会问你是否配置文件或者说项目的配置是否就是这样的，我们回答 yes）
```

好这个时候呢，我们在我们的编辑器里面打开`webpack-demo`这个文件夹，大家可以看到其实`npm init`就是在我们的这个文件夹里生成了一个`package.json`这样的一个文件，它呢描述了我的这个`node`项目或者`node`的包里面的一些信息。

这里大家可以看到我的这个包的名字叫做`webpack-demo`，版本`version`是`1.0.0`就是我们之前配置的这些东西，好了在这里面呢我们可以增加一些内容，比如说
我们可以加一个`private:true`好意思是我们的这个项目是一个私有的项目它不会被发布到这个`npm`的线上仓库里面去（如果大家对`npm`不太了解那你照着我的这个代码写上去就可以了，后面呢大家可以自己去看一下`node`相关的内容，这块不了解不影响我们后面课程的学习，你只要跟着写就可以了），然后呢我们可以把这个`main`对应的配置项去掉因为我们的这个项目啊不会被外部引用我们只是自己来
用没有必要向外暴漏一个js文件，所以这块我把`main`的配置去掉，`scripts`标签里面的东西大家也可以把它先去掉，好`author`呢大家可以写成自己的名字，`license`呢如果大家想开源那可以写成`MIT`那`ISC`也是可以的，好这里我们这样的话`package.json`就配置好了。

package.json

```
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "private": true,
  // "main": "index.js",
  "scripts": {
    // "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "zhangh",
  "license": "ISC"
}
```

接下来项目初始化之后呢我们要去安装`webpack`

#### webpack的安装

`webpack`的安装有两种方式，我依次来给大家讲。


1. （不推荐）首先你可以通过全局安装的形式来安装`webpack`。

全局安装

我们呢要安装`webpack`同时安装`webpack-cli`这样的一个工具，然后呢全局安装我们后面跟一个`-g`这样的参数，`webpack`大家都知道我要安装它没问题，那么`webpack-cli`是干什么的后面我们会给大家说大家先跟着我一起安装就可以，我们点击回车让它自动进行安装。

```
C:\Users\nickname>npm install webpack webpack-cli -g

```

我们接下来看一下`webpack -v`，大家可以看到你运行`webpack -v`的时候会打印出`webpack`的这个版本号，着说明你的`webpack`已经全局的安装好了。

```
C:\Users\nickname>webpack -v
4.6.0
```

##### 注意：
但是这种全局安装的方式我非常不推荐大家使用，全局安装`webpack`有什么问题呢？我来举个例子，假如我有两个项目都用`webpack`打包那么我全局安装`webpack`，`webpack`的这个版本号是固定的就是现在的`4.6.0`，但假设我的一个项目是
通过`webpack 3`进行配置的，另一个项目呢才是通过`webpack 4`进行配置的，所以如果你全局安装的`webpack`版本号是`4.6.0`就意味着`webpack 3`的这个项目肯定是运行不起来的因为你全局安装的版本号是4，所以3的这个版本的项目肯定是跑不起来的，所以如果这个时候你想运行`webpack 3`的项目就没有办法了，那要想解决这个问题得怎么办，你得去删除掉当前的这个`webpack 4`重新安装一个`webpack 3`在运行这个`webpack`你才能启动起来之前的这个`webpack 3`的项目，但是呢假设这两个项目之间有依赖你既想启动这个`webpack 3`开发的项目又想启动`webpack 4`开发的这个项目，那有没有可能啊，如果你通过全局安装`webpack`这种方式就完全没有可能了。

2. （推荐）项目内本地安装

接下来我来讲第二种用法，就是在项目内安装`webpack`和`webpack -cli`，在讲解第二种方法之前呢首先我把现在卸载全局安装的`webpack`和`webpack -cli`


如果已经全局安装了那么想要先卸载全局安装的`webpack`版本，这个时候它就会全局的去删除`webpack`和`webpack -cli`，删除好了之后我们在运行`webpack -v`大家可以看到电脑中就找不到这个命令了。

```
C:\Users\nickname>npm uninstall webpack webpack-cli -g
```

好下面我们来讲如何在项目里面去安装`webpack`而不是全局的安装`webpack`，我们这么来安装，在命令行里面进入到`webpack-demo`这个目录里面，我们在这个目录里面去运行`npm install webpack webpack-cli --save-dev`回车，好这个时候呢我们在这个项目里面安装`webpack`已经安装成功了，我们可以打开这个项目的目录看一下，大家可以看到当你安装好了这个`webpack`之后啊目录下会多出`node_modules`这里面呢就是`webpack`和它依赖的一些包都按照在这里，安装好了之后呢同学们就会想，我运行`webpack -v`来试一下看这个时候你能不能运行`webpack -v`这个命令呢，大家可以发现根本运行不起来，因为啊当你输入`webpack`这个命令的时候`Node.js`会尝试到全局的这个模块的目录中去找`webpack`但是这个时候
`webpack`我们并没有安装在全局而是安装在项目内，所以就找不到`webpack`这个命令，但是没关系`Node.js`提供了一个命令叫做`npx`，我们呢通过`npx`来运行`webpack`大家可以看到这个时候这样去运行`webpack`这个命令是没有问题的它能够打印出我们这个`webpack`的版本，这是为什么呢？`npx`这个命令会帮助我们在当前这个项目的目录的`node_modules`文件夹里帮助我们去找`webpack`，所以呢通过`npx`我们就可以在项目的目录下去运行存在于这个目录下的`webpack`的这个安装包，所以这种方式是把我们的`webpack`安装在了项目内然后呢我们通过`npx`
去运行`webpack`就可以了。


```
C:\Users\nickname>cd C:\Users\nickname\Desktop\webpack-demo

C:\Users\nickname\Desktop\webpack-demo>npm install webpack webpack-cli --save-dev

......

C:\Users\nickname\Desktop\webpack-demo>webpack -v  （不能起效，`node`会查找全局安装的`webpack`这里我们并没有全局安装`webpack`）
'webpack' 不是内部或外部命令，也不是可运行的程序
或批处理文件。
C:\Users\nickname\Desktop\webpack-demo>npx webpack -v  （我们通过npx命令，让`node`查找运行项目内的`webpack`）

C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js" -v
4.41.5

C:\Users\nickname\Desktop\webpack-demo>
```

安装`webpack`某个具体的版本号：

```
C:\Users\nickname\Desktop\webpack-demo1>npm install webpack@4.25.0 webpack-cli --save-dev
```

那怎么看`webpack`的某个版本是否存在呢？

（windows系统下运行没有打印出所有的版本号列表信息，Mac系统未进行测试）

```
C:\Users\nickname>npm info webpack
```
如果没有列出我们还可以通过`npm show webpack@* version`命令来进行查看

```
C:\Users\nickname>npm show webpack@* version
......
webpack@4.28.1 '4.28.1'
webpack@4.28.2 '4.28.2'
webpack@4.28.3 '4.28.3'
webpack@4.32.0 '4.32.0'
webpack@4.32.1 '4.32.1'
webpack@4.32.2 '4.32.2'
......
```

#### 总结：

项目内本地安装这种方式就使得在不同项目中我们就可以使用不同的`webpack`版本，那这种`webpack`安装的方式才是我推荐的方式，好这样的话我就给大家讲解了全局安装`webpack`和在项目中安装`webpack`的两种方式，同样我也给大家讲解了如何通过这个版本号去安装具体版本的这个`webpack`我们用的是`npm install webpack@4.25.0 webpack-cli -D`这种方式大家也要学会。
