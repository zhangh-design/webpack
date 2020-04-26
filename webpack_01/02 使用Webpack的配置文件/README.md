## 使用Webpack的配置文件

> 前言：同学们大家好这节课我来给大家讲解`webpack`的配置文件。

好这节课我们来讲`webpack`的配置。

之前呢我们说过`webpack`是一个模块打包工具它会帮你把模块打包到一起，我也说过
当你引入一个图片模块的时候和你引入一个`js`文件模块的时候打包的流程和方式肯定是不同的，假如你引入的是一个`js`文件那么呢你直接拿过这个`js`文件来执行就可以了，但是假如你引入的是一个图片文件，比如说这样：

index.js

```
var content = require('./content.png');
```

我引入的是一个`content.png`的一个文件的话，那么实际上我只是要拿到这个`.png`图片的地址就可以了我并不需要把这个图片的整个文件打包到我的整个`js`里面去，所以呢`js`的打包和图片的打包肯定是不同的，另外，你在做打包的时候哪一个文件才是打包的入口文件，打包出的文件放到哪里，`webpack`呢没有智能到你给它一个文件它就知道怎么打包的地步或者说你给它一个项目它就知道怎么去帮你打包，它没有这么智能。

它需要你通过一个配置文件告诉它到底该怎么打包，大家可能会说之前课程我去用`webpack`打包并没有看到什么配置啊它不是也能自动打包吗，大家来看，比如说又一个`lesson`项目包：

lesson

```
lesson
 |--dist
     |--main.js
 |--node_modules
 |--content.js
 |--header.js
 |--index.html
 |--index.js
 |--package.json
 |--sidebar.js
```

```
C:\Users\nickname\Desktop\lesson>npx webpack index.js
```

我呢在`lesson`这个目录下，像之前一样运行`npx webpack index.js`回车，大家看它也打包成功了，我们到`lesson`这个目录下看它并没有一个配置文件啊，这不也打包成功了嘛，实际上啊`webpack`的团队为了大家用`webpack`尽可能的爽一直在不断的丰富`webpack`的默认配置，所以你感觉上没有写任何的配置文件实际上你用的是它默认的配置文件，那么它的默认配置文件长成什么样子呢？我们可以自己来写一下：

如果你想在项目中编写`webpack`的配置文件，该怎么做呢？我们在这里在`lesson`目录下可以去写一个文件，`webpack`的默认配置文件名字叫做`webpack.config.js`。

lesson

```
lesson
 |--dist
      |--main.js
 |--node_modules
 |--content.js
 |--header.js
 |--index.html
 |--index.js
 |--package.json
 |--sidebar.js
 |--webpack.config.js
```

好大家来看啊，我先不写这个配置项里的内容，我这么来在命令行里执行这样的一个语句，我直接在`lesson`这个目录下运行`npx webpack`大家可以看到打包呢就出错了，为什么会出错呢？因为之前啊我们运行的都是`npx webpack index.js`这里`index.js`的意思是`webpack`你来帮我打包`index.js`这个文件，但是呢如果你不写这个`index.js`的话那么`webpack`就不知道你要打包的这个项目它的入口文件是哪一个了。

```
C:\Users\nickname\Desktop\lesson>npx webpack （打包会出错，没有在webpack.config.js中指定entry）

C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"

Insufficient number of arguments or no entry found.
Alternatively, run 'webpack(-cli) --help' for usage info.

Hash: 52378f98a3eabd0defeb
Version: webpack 4.41.5
Time: 53ms
Built at: 2020-02-11 09:14:23

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

ERROR in Entry module not found: Error: Can't resolve './src' in 'C:\Users\nickname\Desktop\webpack-demo'
```

但是直接运行`npx webpack`没关系，我们可以在`webpack.config.js`这个配置文件里写这个打包的配置，怎么做呢？在这里我们来编写代码：

webpack.config.js

```
// 引入一个名字叫做 path 的 Node.js 的核心模块
const path = require('path');

// 这是一个CommonJS的语法
module.exports = {
    // 在这里呢，我们就可以写配置了，这些配置呢都是webpack提供给我们的接口
    // 首先我们可以配置一个 entry ，entry的意思就是我们这个项目要做打包从哪一个文件开始打包，那很显然我们从当前目录的 index.js 开始打包
    entry: './index.js',
    // 打包文件你可以把它放到哪里去呢？我们可以在这里写一个 output 配置
    output: {
        // 打包好的文件你可以给它起一个名字
        filename: 'bundle.js' // webpack 默认是叫 main.js
        // 打包出的文件我要把它放到哪一个文件夹下，path 后面要写一个用Node.js来获取到的绝对路径地址
        // __dirname 就是指webpack.config.js这个文件当前所处路径
        path: path.resolve(__dirname, 'bundle')
    }
}
```

这么配置好之后，我们就有了这样一个`webpack`标准的配置文件，它呢要求你从`index.js`打包，打包生成的文件放到`bundle`文件夹下，生成的这个文件的名字叫做`bundle.js`。

我们配置好`webpack.config.js`后重新运行下`webpack`在来看一下是否能够正确
打包，我们运行`npx webpack`：

大家可以看到这个时候你不用填这个`index.js`，你直接运行`npx webpack`有没有生成打包文件呢？是不是生成了`bundle.js`这个打包文件啊，下面还有一个`bundle.js`。


```
C:\Users\nickname\Desktop\webpack-demo>npx webpack

C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: 7db3a5b8dd79b7f9ce94
Version: webpack 4.41.5
Time: 135ms
Built at: 2020-02-11 09:45:38
    Asset      Size  Chunks             Chunk Names
bundle.js  1.02 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./index.js 195 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

lesson

```
lesson
 |--bundle
      |--bundle.js
 |--node_modules
 |--content.js
 |--header.js
 |--index.html
 |--index.js
 |--package.json
 |--sidebar.js
 |--webpack.config.js
```

所以呢，反过来我们想一下它的流程是什么样子的，当你在项目中运行`npx webpack`的时候`webpack`并不知道自己该怎么去打包于是呢它就会找默认的配置文件，找到`webpack.config.js`这个文件然后呢它知道了我应该怎么打包我应该怎么输出帮你完成打包的流程。

#### 问题：

假设我们这个配置文件不是默认的`webpack.config.js`这个名字，我们改成其它一个名字`webpackconfig.js`我把中间的`.`给去掉了。

然后呢我重新运行`npx webpack`，大家来看这个时候它就会报错了，因为`webpack`呢找不到默认的这个配置文件，默认的配置文件必须叫`webpack.config.js`，你这个文件呢并不叫这个所以它就不认识。


```
C:\Users\nickname\Desktop\webpack-demo>npx webpack （打包会出错）

C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"

Insufficient number of arguments or no entry found.
Alternatively, run 'webpack(-cli) --help' for usage info.

Hash: ae06d35bc2dda0dad487
Version: webpack 4.41.5
Time: 54ms
Built at: 2020-02-11 10:06:32

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

ERROR in Entry module not found: Error: Can't resolve './src/index.js' in 'C:\Users\nickname\Desktop\webpack-demo'
```

但是假设我想让`webpack`也认识这个文件，用这个文件做为它的配置文件，该怎么办呢？也非常简单，我们在命令行中运行`npx webpack --config webpackconfig.js`：

`npx webpack --config webpackconfig.js`这个命令的意思是`webpack`你来帮我打包，你以哪一个文件为配置文件呢，以`webpackconfig.js`为配置文件帮我进行打包。

大家看是不是又可以正确的打包啦。

```
C:\Users\nickname\Desktop\webpack-demo>npx webpack --config webpackconfig.js

C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js" --config webpackconfig.js
Hash: 7db3a5b8dd79b7f9ce94
Version: webpack 4.41.5
Time: 127ms
Built at: 2020-02-11 10:11:05
    Asset      Size  Chunks             Chunk Names
bundle.js  1.02 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./index.js 195 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

#### 总结：

讲到这关于`webpack`最基础的知识点，大家掌握的应该不少了。

#### 优化：

那么结合这些知识点呢，我们对我们这个`lesson`这个小的项目啊做一个结构的优化。

我们打开`index.js`：

我们说啊`index.js`这个文件如果在浏览器里能不能直接运行啊？它是不能直接运行的，它必须由`webpack`打包，打包生成的这个最终的代码才可以在浏览器上执行，所以这段代码呢并不是要直接放在浏览器上运行的代码，它是我们的源码，所以呢一般来说我们就会把这些源代码放在哪里呀，放在一个名字叫做`src`的目录里。

index.js

```
// ES Moudule 模块引入方式
import Header from './header.js';
import Sidebar from './sidebar.js';
import Content from './content.js';

new Header();
new Sidebar();
new Content();
```

lesson

```
 |--src
     |--content.js
     |--header.js
     |--index.js
     |--sidebar.js
 |--index.html
 |--package.json
 |--webpack.config.js
```

OK，这样的话呢我们这些文件就都放到了`src`目录下。

接着我们再来看，我们呢是不是要把`src`目录下的`index.js`打包一下最终生成一个可以执行的`js`文件，那我们就需要重新对这个`webpack.config.js`的打包文件进行配置修改了。

webpack.config.js

```
const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist')
	}
}
```

然后呢，我们重新在命令行里运行下：

```
C:\Users\nickname\Desktop\webpack-demo>npx webpack （打包成功）

C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: 13413c8bc4df64adadd4
Version: webpack 4.41.5
Time: 107ms
Built at: 2020-02-11 10:43:41
    Asset      Size  Chunks             Chunk Names
bundle.js  1.05 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./src/header.js 162 bytes {0} [built]
[1] ./src/sidebar.js 167 bytes {0} [built]
[2] ./src/content.js 167 bytes {0} [built]
[3] ./src/index.js 183 bytes {0} [built]

（这里又一个警告，我们后面在处理）
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

#### npm scripts

改到这呢，我们还没有完成了，我们说啊现在我们在这个打包的过程中经常会用`npx webpack`这样的一个命令，但是大家如果以前用过`Vue`或者`React`你可能重来也没有使用过`npx`这个命令，而是使用`npm run `这样的一个命令，所以呢，接下来我给大家讲我们如何用`npm scripts`简化我们的打包代码。


在这里我们可以打开`package.json`这个文件，在`package.json`里面呢会有一个`scripts`这样的一个标签配置项，我们呢把这句话`test`这句配置先去掉，`scripts`是一个对象我们可以在这里配置一些内容或者说配置一些命令。

我们呢配置第一个命令叫做`bundle`，好我们配置了一个名字叫做`bundle`的`scripts`命令，当我们执行这条命令的时候我希望它帮助我们底层干的事情是什么？是帮助我们做打包，怎么写呢，你直接在这里写`webpack`就可以了，它的意思是当你运行`bundle`这个命令它呢自动就会帮你执行`webpack`这个命令，于是我们呢就可以在命令行里不运行`npx webpack`这个指令了，我们直接运行什么就可以了呢，直接运行`npm run bundle`
大家来看一样的可以帮助你打包。

#### `npm run bundle`执行解析

那这块呢涉及到的知识点叫做`npm scripts`这样的一个知识点，它的原理是什么呢，当你执行`npm run bundle`的时候实际上你在运行的就是`package.json`里面的这个`bundle`命令，这个`bundle`命令底层在帮你干什么，是不是就是在帮你执行`webpack`这个命令啊，反应比较快的同学呢，可能就会有问题了，你执行`webpack`这个命令是不是到全局的这个安装包里去找`webpack`啊，我们并没有在全局安装`webpack`这么执行可以吗？你是不是应该在这加一个`npx webpack`，实际上如果你在`scripts`标签里面去使用`webpack`的话，它呢会先到你这个工程目录下的`node_modules`里面去找是否安装了`webpack`这个指令，如果这里有呢它直接就会用了，所以即便你没有在全局安装`webpack`你在项目内使用`webpack`打包也是OK的，它的原理和`npx`很类似，那我们这么写了之后，在以后再去做打包的时候就不需要用`npx`了，直接运行配置的`npm run bundle`这个命令就可以了。


package.json

```
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    // "test": "echo \"Error: no test specified\" && exit 1",
    "bundle": "webpack"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.41.5",
    "webpack-cli": "^3.3.10"
  }
}
```

执行打包：

```
C:\Users\nickname\Desktop\webpack-demo>npm run bundle （打包成功）

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\webpack-demo
> webpack


C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: 13413c8bc4df64adadd4
Version: webpack 4.41.5
Time: 132ms
Built at: 2020-02-11 20:37:30
    Asset      Size  Chunks             Chunk Names
bundle.js  1.05 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./src/header.js 162 bytes {0} [built]
[1] ./src/sidebar.js 167 bytes {0} [built]
[2] ./src/content.js 167 bytes {0} [built]
[3] ./src/index.js 183 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

```

OK那把项目整理成这个样子大家来看，那如果你之前写过`Vue`或者`React`我们现在这样一个小型项目的目录是不是就和之前我们写`Vue`或者`React`的这个项目目录非常类似啊。

我们现在可以这样做把`index.html`放到`dist`目录里，然后我直接在浏览器上打开`dist`目录里的`index.html`，它会输出:

![image](http://i1.fuimg.com/717460/9ecd9c326571ac10.jpg)


大家可以看到`js`文件可以正常的执行，`header`、`sidebar`、`content`依次输出，那项目的这个目录结构和之前我们写`Vue`或者`React`的目录结构极其相似同时呢它又是用`webpack`做的打包。

lesson

```
 |--dist
     |--bundle.js
     |--index.html
 |--src
     |--content.js
     |--header.js
     |--index.js
     |--sidebar.js
 |--index.html
 |--package.json
 |--webpack.config.js
```

那学到这我想大家是不是对`webpack`稍微有了一点感觉啊，好那回忆一下之前我们用`webpack`做打包。

- 全局安装（global），运行的是`webpack index.js`的命令
- 局部安装（local），这个时候呢我们可以用`npx webpack index.js`，还可以用什么啊，还可以用`npm scripts`的形式在`package.json`里面配置一个`script`脚本，然后我们运行`npm run bundle`这个命令那实际上它会被翻译成什么，是不是翻译成`webpack`这个命令啊后面呢其实什么也没有因为我们有了配置文件之后就不需要再去加这个`index.js`了（`webpack index.js`）。


1. webpack index.js
2. npx webpack index.js
3. npm run bundle

上面这三种方式归根结底实际上是不是都在命令行里去运行`webpack`这个命令啊，大家看第一种你需要在命令行里去运行`webpack`这个命令，第二种你也需要在命令行里去`webpack`这个命令，第三种你虽然运行的是`npm run bundle`但是本质上还是在命令行里间接的去运行`webpack`这个命令。

讲到这呢回过头，我在来给大家补充一个非常细小的知识点：

大家还记得我们安装`webpack`的时候同时安装了一个`webpack-cli`的包，它的作用是什么呢？它的作用就是使我们可以在命令行里面正确的运行`webpack`这个命令，假设你不安装`webpack-cli`这个包那么你就没有办法在命令行里运行`webpack`或者`npx webpack`这样的指令，所以这个`webpack-cli`的作用大家现在就应该清楚了，它使得我们可以在命令行里面去使用`webpack`这个命令。

#### 总结：

好那回过头来，这几颗的内容还是比较多我们在来回顾一下，首先我们说`webpack`做打包的时候它并不知道自己该如何的打包需要配置文件来辅助它，但是一开始我们并没有写这个配置文件，是因为即使我们不写这个配置文件`webpack`默认也会有一套自己的默认配置，那你不写它就会用这套默认配置，但是在做工程打包的时候每个工程它的特点是不同的复杂度呢也不同所以一般来说我们都需要根据工程的需要自己来配置比较复杂的`webpack`这样的配置文件，这个时候呢我们就要自己来写这个配置文件了，所以我们需要在这个项目的根目录下去创建一个`webpack.config.js`这样的一个配置文件，然后在这里面去编写具体的配置内容。

首先我给大家讲了你可以配置`entry`也就是项目打包的入口文件你要写在这里，然后打包出的这个最终的文件要运行的文件放在哪里，你要把它放在这个`output`的这个配置项里进行配置，比如说打包的这个文件叫做`bundle.js`这里你就配置一个`filename`，如果呢你想把它打包到`dist`目录下你可以写一个`path`后面跟一个绝对路径，当然不写这个`path`也可以它也会帮你打包到这个`dist`目录下，为什么呢？因为如果你不写这个`path`，`webpack`内部默认会有一个默认的`path`配置项，它和你的这个`dist`目录的绝对路径是一模一样的所以其实这个不写其实也是可以的。

紧接着给大家讲了我们如何应该把项目的这个源代码放到`src`目录下，接着呢我们修改了这个`entry`把入口文件改成了`./src/index.js`，最后我们干了一件事情，我们在`package.json`里面配置了一个`npm scripts`这个`scripts`对应的这个命令的名字叫做`bundle`然后呢它底层会帮助我们执行`webpack`做打包，这么编写之后我们就不需要运行`npx webpack`这个指令了我们只需要运行`npm run bundle`就可以了，好打包之后我们生成了`dist`目录然后呢我们把这个原来在根目录下的`index.html`放到了`dist`目录下然后修改了一下引入`js`文件的相对路径，然后在运行这个网页，这个网页就可以正常的执行出我们想要的结果了。


最后我们给大家讲解了这个`webpack-cli`它的一个安装的原理它的作用。


#### 作业：

大家打开[`webpack的官网`](http://webpack.github.io/)进入到`webpack`的官网（如果打不开也可以进入[webpack中文网](https://www.webpackjs.com/)），然后呢大家点这个`DOCUMENTATION`（指南）进入到它的文档左侧有一个`Getting Started`（起步）[（中文网Getting Started地址）](https://www.webpackjs.com/guides/getting-started/)在讲解了第一章的几节课后呢大家就可以来看`Getting Starte`目录下的所有内容了，这个目录下的所有内容其实我都已经讲到过了，大家在来过一遍可以很好的巩固之前的知识点。
