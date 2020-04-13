Library 的打包

[->外部扩展(externals)](https://www.webpackjs.com/configuration/externals/)

> 前言：

之前都是讲解如何给我们的业务代码进行打包，那假设我们要开发一个库比如说：一个组件库或者呢一个函数库的时候，那这样的库代码我们应该如何通过 webpack 进行打包呢，我们一起来看一下。

首先我在我的桌面上去创建一个文件夹，这个文件夹呢我给它起名叫做`library`也就是一个库文件夹，今天我们要创建一个非常简单的函数库。

首先第一步我们要去初始化我们的库项目，cmd 命令窗口进入到这个文件夹我们输入`npm init -y`：

```
C:\Users\nickname\Desktop\library>npm init -y
Wrote to C:\Users\nickname\Desktop\library\package.json:

{
  "name": "library",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {

  },
  "keywords": [],
  "author": "zhangh",
  "license": "ISC"
}
```

这样的话它就会帮助我们把这个库文件变成一个`node module`也就是 node 模块，那里面就会多出一个`package.json`文件。

打开我们的`library`这个项目，进入到`package.json`这里面：

`name` 我的库的名字就叫做`library`。

`main` 它的入口呢是`index.js`。

`description` 描述没有。

`license` 呢你可以把它写成`MIT`完全开源的一个协议

其它都不变，入口文件`main`我们现在不知道是怎么回事我们现在就先不动，然后我们来写我们的库代码。

首先我们来创建一个文件夹叫做`src`，在这里面我创建一个`math.js`，在创建一个`string.js`

libray

```
src
 |-math.js
 |-string.js
package.json
webpack.config.js
```

math.js

```
export function add(a, b) {
  return a + b;
}

export function minus(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}

export function division(a, b) {
  return a / b;
}

```

这样的话我写了四个函数，分别是加减乘除，把它放在`math.js`这个文件里面。

我们再去写一个关于字符串处理的函数

string.js

```
export function join(a, b) {
  return a + " " + b;
}
```

OK，然后我们再去写一个`index.js`文件，它是一个公告的入口文件：

index.js

```
import * as math from "./math.js";
import * as string from "./string.js";

// 统一把这两个库给暴露出去
export default { math, string };

```

这就是我们的一个库，我们的这个库提供了一些方法，包括 加减乘除和字符串的处理，那源代码写完了，对于一个库来说我们呢实际上和新建一个项目业务上进行打包一开始没有太大的区别，这个库如果我直接给外部使用，比如说我给浏览器使用那浏览器肯定是运行不了这段代码的，所以呢我们还需要通过 webpack 对这个库做一个打包。

首先在项目之中，我们进入到`library`对于的目录去安装 webpack 以及 webpack-cli：

```
C:\Users\nickname\Desktop\library>cnpm install webpack webpack-cli --save-dev
```

我们把 webpack 给安装好，同时呢我们在项目中去创建一个 webpack 的配置文件，叫做`webpack.config.js`。

在package.json里面我们在写一个脚本叫做`build`：

package.json

```
  "scripts": {
    "build": "webpack"
  }
```

这里我写一个命令叫做`webpack`就可以了。

接着呢我们去配置下 webpack 对应的配置文件`webpack.config.js`：

```
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "library.js"
  }
};
```

然后我们去打包生成下我们的代码`npm run build`：

```
C:\Users\nickname\Desktop\library>npm run build

> library@1.0.0 build C:\Users\nickname\Desktop\library
> webpack


C:\Users\nickname\Desktop\library>"node"  "C:\Users\nickname\Desktop\library\node_modules\.bin\\..\_webpack@4.42.1@webpack\bin\webpack.js"
Hash: 13254ea443984804f70e
Version: webpack 4.42.1
Time: 626ms
Built at: 2020-04-11 15:00:57
     Asset      Size  Chunks             Chunk Names
library.js  1.31 KiB       0  [emitted]  main
Entrypoint main = library.js
[0] ./src/index.js + 2 modules 423 bytes {0} [built]
    | ./src/index.js 153 bytes [built]
    | ./src/math.js 214 bytes [built]
    | ./src/string.js 56 bytes [built]
```

OK，我们已经生成了一个`library.js`这样一个文件，这个文件呢就是我们要给别人去使用的一个文件。

如果我们正常这个代码只是我们的业务代码，那到这这个代码就打包结束了，但是我们现在写的是一个库，这个库呢不是我们自己要用的，是要给别人去用的那别人会怎么用呢？

##### libraryTarget: "umd"

大家去想一下，别人可能有很多种用法，比如说：
- import library from 'library'
- const library = require('library')
- require(['library'], function(){})
- <script src='library.js'></script>

`import` es6 `module`的语法也可能是`require('library')`这个`CommonJs`的语法来引入我们的库，还可能通过`require(['library'], function(){})` AMD的语法来引入我们的库。

也就是外部去引入我们的库啊，可能会有非常多的方法，那我们呢如果想让我们的库在外部可以被这样的引用，那我们可以做一个配置：

`libraryTarget: "umd"` 它的意思就是：不管在`CommonJs`的环境还是这个`AMD`的环境或者你直接`import`，实际上加了`libraryTarget: "umd"`之后，这个`u`呢是`universally`就是‘通用’的意思，不管你通过任何形式去引入我这个库我呢都可以让你正确的引入的到，这个就是`libraryTarget`配置`umd`的意思。

好当然有的时候啊，我不仅仅可以这么去引入，我还希望你怎么引入呢？

我还希望你通过这样一个`script`标签去引入我的js：

```
<script src='library.js'></script>
```

##### library: 'library' （后面单引号内的名字可以随意写）

我希望你引入这个js文件之后啊，可以通过`library`这个全局变量来去使用我的这个库，那如果你还有这样一个需求，该怎么办呢，比如说你想用`library.math`？

好，那你就在`webpack.config.js`里面再去配置一个参数叫`library`那你可以起一个名字就叫做`library`，好它的意思是：

首先`umd`我支持你的上面几种引入的语法，但是呢我不支持你已`script`标签形式的语法，这个时候打包生成的代码我把它挂载到了一个页面的全局变量上叫做`library`的这样一个变量上面，这样你通过`script`标签去引入这个`library.js`这个文件也是没有任何问题的，当我把`library`和`libraryTarget`这两个内容配置好了之后啊，我做一次打包`npm run build`：

```
C:\Users\nickname\Desktop\library>npm run build

> library@1.0.0 build C:\Users\nickname\Desktop\library
> webpack


C:\Users\nickname\Desktop\library>"node"  "C:\Users\nickname\Desktop\library\node_modules\.bin\\..\_webpack@4.42.1@webpack\bin\webpack.js"
Hash: d9f3df0fdf1290d103dd
Version: webpack 4.42.1
Time: 406ms
Built at: 2020-04-11 15:29:07
     Asset      Size  Chunks             Chunk Names
library.js  1.54 KiB       0  [emitted]  main
Entrypoint main = library.js
[0] ./src/index.js + 2 modules 423 bytes {0} [built]
    | ./src/index.js 153 bytes [built]
    | ./src/math.js 214 bytes [built]
    | ./src/string.js 56 bytes [built]
```

生成的代码变成`1.54KB`，那这段代码也就是`dist`目录下的`library.js`，如果别的业务代码去引入我的这个库的时候啊，可以通过上面这几种方式来引入了，我们可以拿这个`script`标签
来做一个测试啊，

我在`dist`目录下新建一个`index.html`文件引入当前的`library.js`：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src='./library.js'></script>
</head>
<body>

</body>
</html>
```

然后我们运行这个页面啊，实际上这就是我们说的当我们这个库做好了之后给别人用，那别人可以使用这个`script`标签来去用这个库，现在它已经引入了这个库了，那么我们刚才在这里：

```
library: 'library'
```

配置了一个`library: 'library'`名字就叫`library`，那我说了它的意思是什么啊，它的意思是
会在全局变量里面增加一个`library`这样的一个变量，那我们去打开这个`index.html`页面，然后我们点开控制台啊，在这里我们输入`library`回车大家可以看到：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*dQsLkQsSznQ2VIqeGLOcB5.CVcNrl8uAhUfh*t*2kGE9QlR*S7G7VuPYIjIO3Q1SQ!!/b&bo=8wHzAAAAAAARBzE!&rf=viewer_4&t=5)

这是不是就是我们这个库里的内容啊有`math`有`string`，都帮助我们导出出来了。

假设呢我不填这个`library: 'library'`重新做一次打包：

```
output: {
    path: path.resolve(__dirname, "dist"),
    filename: "library.js",
    // library: 'library',  // 指定库的全局变量
    libraryTarget: "umd", // 支持库引入的方式 AMD、CJS、EM module、CDN
    libraryExport: 'default' // 导出的默认对象，（不需要在业务代码里在 .default 来取出 library 里的操作函数了）
}
```

我们在浏览器上在输入`library`这个变量就会提示不存在：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*cL.ayyOvFfWLgWF7J7jXBHTW72CJPm38jvEOhAwer8EXTPfe9tX*djwlAkvIV20rg!!/b&bo=8gGVAAAAAAARB1Y!&rf=viewer_4&t=5)

##### libraryTarget: "this"

好，这时一般来说我们做库打包的时候啊经常会配置的两个东西，一个是`libraryTarget`一个是`library`，当然呢这么去写其实就OK了，但是这两个参数有的时候它是配合着来使用的，

比如说啊这个`library`它是一个核心，意思是我呢要打包生成一个全局的变量，好`libraryTarget`呢它指的是这个全局变量挂在哪里，如果是`umd`啊其实它俩是没什么关系的，但假设你写一个`this`，

怎么翻译这段话呢就是说我现在我的这个库就不支持`es6 module`、`CommonJS`和`AMD`这三种导入方式了，因为你已经不是`umd`了所以你不支持`CommonJS`和`AMD`这种语法，但是你会在全局上挂一个`library`这样一个变量，挂在哪呢？

挂在全局的`this`上面，所以呢如果我们这么去打包大家来看`npm run build`：

```
C:\Users\nickname\Desktop\library>npm run build

> library@1.0.0 build C:\Users\nickname\Desktop\library
> webpack


C:\Users\nickname\Desktop\library>"node"  "C:\Users\nickname\Desktop\library\node_modules\.bin\\..\_webpack@4.42.1@webpack\bin\webpack.js"
Hash: aa517f67223ba49a0fb1
Version: webpack 4.42.1
Time: 459ms
Built at: 2020-04-11 15:53:10
     Asset      Size  Chunks             Chunk Names
library.js  1.33 KiB       0  [emitted]  main
Entrypoint main = library.js
[0] ./src/index.js + 2 modules 423 bytes {0} [built]
    | ./src/index.js 153 bytes [built]
    | ./src/math.js 214 bytes [built]
    | ./src/string.js 56 bytes [built]
```

在去刷新我们的页面，我们在控制台里输入`this.library`回车大家可以看到就可以获取到我这个库下面的函数：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*VDdS2rBjl0OJdQ9cv..bNBqL9Lc38mMOPumJoCeCOgNs6zvD9jXyXKorZiyUA0DkQ!!/b&bo=9AEvAQAAAAARB.s!&rf=viewer_4&t=5)

好，当然因为我们现在是在这个页面的最外层直接去引入这个`library`所以呢你这个`library`如果挂在`this`上面其实也就相当于你挂载到直接就挂载到页面上，所以`library`上是有东西的。

##### libraryTarget: "window"

好当然这块不仅仅你可以去填一个`this`，你还可以填`window`，也就是我`library`这个变量会挂载到`window`上面，那其实在我们现在浏览器环境下啊如果是这种引入方式的话其实`window`和我们去引入这个刚才说的`this`没有太大的区别。

##### libraryTarget: "global"

当然如果你是在`Node.js`环境下这块还可以写一个`global`，如果在`node.js`环境下去引入我们的这个库的话那么你可以通过`global.library`来获取到我库里的内容。

但一般来说呢如果我们打包一个正常的库的话，这里一般我们会填一个`umd`，上面呢在配置一个`library`这样可以保证模块的引入可以正确的引入，那在`script`标签的形式下这块也可以正确的引入。

---

#### externals: {lodash: '_'} 库代码中不将 lodash 打包到最终的输出文件中，减小包的体积和防止用户的代码中也会引入 lodash 导致重复引入

好接下来呢，我们在去讲除了打包库的时候我们要配这样的一个`libraryTarget`和`library`额外的参数之外呢，我们还要做一件事情，我给大家举另外一个例子。

我呢打开`string.js`这个文件，

string.js

```
export function join(a, b) {
  return a + " " + b;
}

```

在这里面啊我以前是自己写的字符串拼接，但是现在我突然发现`lodash`里面有一个功能很好所以我就希望啊在这个库里我去使用`lodash`：

我呢安装`lodash`

```
cnpm install lodash --save
```

然后我们在`string.js`里这么写：

```
import _ from "lodash";

export function join(a, b) {
  // return a + " " + b;
  return _.join([a, b], " ");
}

```

好我的库的源代码就改写成这个样子了，其实功能是一样的，那我们在进行一次打包`npm run build`：

```
C:\Users\nickname\Desktop\library>npm run build

> library@1.0.0 build C:\Users\nickname\Desktop\library
> webpack


C:\Users\nickname\Desktop\library>"node"  "C:\Users\nickname\Desktop\library\node_modules\.bin\\..\_webpack@4.42.1@webpack\bin\webpack.js"
Hash: ec96682c8424c7ea0661
Version: webpack 4.42.1
Time: 2891ms
Built at: 2020-04-11 19:57:23
     Asset      Size  Chunks             Chunk Names
library.js  72.6 KiB       0  [emitted]  main
Entrypoint main = library.js
```

打包生成的代码这个时候，变成了`72.6KB`，因为我的库里面多引入了一个`lodash`这样的库，好看起来好像没什么问题，但是我们现在是一个库文件别人呢会去使用我们的库文件它会怎么用？

```
// 又重新使用了 lodash
import _ from lodash
// 它会这样引入去使用
import library from 'library'

// ...
```

好在别人使用我们这个库的同时它也有可能重新去使用了`lodash`，这样的话就很有可能造成一个问题，也就是我们的库代码`library`里面已经打包了一次`lodash`，而现在用户的业务代码里又打包了一次`lodash`，所以在最终用户的代码里面就很容易存在两份`lodash`的代码，那为了解决这个问题，我们需要在我们的库里面去做另外一个配置：

我们呢打开我们的`webpack.config.js`，在这里面我们可以配置一个`externals`然后我们可以写一个数组也可以写一个对象，我们先写个数组吧简单一点：

```
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  externals: {lodash: '_'},
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "library.js",
    library: 'library',  // 指定库的全局变量
    libraryTarget: "umd" // 支持库引入的方式 AMD、CJS、EM module、CDN
    // libraryTarget: "this", // 只支持 script 标签，通过 this.library 或者 library 来获取导出对象
    // libraryTarget: "window",  // 和 this 一样
    // libraryTarget: "global" // node.js 环境下，通过 global.library 获取导出对象
    // libraryTarget: "commonjs2" // 导出对象只能使用 commonjs 的语法导入，开发 vue 服务器渲染项目时需要指定成这个，因为 node 环境只支持 commonjs 导入和导出语法。
  }
};

```

保存，然后我们重新打包：

```
C:\Users\nickname\Desktop\library>npm run build

> library@1.0.0 build C:\Users\nickname\Desktop\library
> webpack


C:\Users\nickname\Desktop\library>"node"  "C:\Users\nickname\Desktop\library\node_modules\.bin\\..\_webpack@4.42.1@webpack\bin\webpack.js"
Hash: ed3d8c70274b3db774c5
Version: webpack 4.42.1
Time: 465ms
Built at: 2020-04-11 20:09:30
     Asset      Size  Chunks             Chunk Names
library.js  1.64 KiB       0  [emitted]  main
Entrypoint main = library.js
```

大家看这个时候代码从`72.6 KiB`又变成了`1.64 KiB`。

那`externals`它的意思是什么呢？它的意思是你打包的过程中啊如果遇到了`lodash`这个库，你就忽略这个库不要把它打包到你的代码里面去。

那么大家想这个时候我在外部要使用`library`这个库，也就是别人使用我们这个库那它如果直接这么写：

```
import library from 'library'

// 这样使用不行，因为 library 里没有打包 lodash
console.info(library.default.join('hello', 'world'))
```

使用可不可以啊，不可以，因为我这个库里要用`lodash`但是我这个库里自己又没有`lodash`所以你在用我这个库的时候，你要往上面在你的业务代码里在去引入一下`lodash`：

```
import _ from 'lodash'
import library from 'library'

console.info(library.default.join('hello', 'world'))
```

这样的话你引入了`lodash`，我库里面就可以用到你在你业务代码里引入的`lodash`的代码了，这样的话即避免了两次 lodash 的打包又可以让我们的代码正确的运行，所以一般来说在我们做库打包的时候`externals`也是一个常见的配置项。

这里呢`externals`不仅仅可以是这样的一个数组也可以是一个对象，在这里面呢你可以这么写：

```
externals: {
    lodash: {
        commonjs: 'lodash'
    }
}
```

[-> 大家呢可以打开`externals`这块配置的api](https://www.webpackjs.com/configuration/externals/)，我们来看一下啊它可以支持很多配置，支持`commonjs`、`commonjs2`、`root`和`AMD`我们呢来降解两个，讲解`commonjs`和`root`大家就明白是怎么回事了：

```
externals: {
    lodash: {
        commonjs: 'lodash'
    }
}
```

好在这我写了一个`commonjs: 'lodash'`，它的意思就是如果我这个库在`commonjs`这个
环境下被使用，也就是比如说别人在使用我们库的时候，这是一个`commonjs`的环境，它呢要这样写：

（这里假设我们处在 commonJs 的开发环境中，那么 library 的引入当然也必须是 require 的语法）

```
// 变量名字必须是lodash
const lodash = require("lodash");
const library = require("library");
```

这样的一个`commonjs`的写法，如果在外部`commonjs`这个环境下使用我的这个库，如果遇到这样的代码我要求`lodash`去加载的时候名字必须叫做`lodash`，所以呢你在业务代码里去加载`lodash`的时候它的名字必须是`lodash`而不能起成`_`下划线这样的东西。

接着我们继续来看，如果你配置了一个`root`：

```
externals: {
    lodash: {
        commonjs: 'lodash',
        root: "_" // 指向全局变量
    }
}
```

那意思是什么呢，就是说你既不用`commonjs`也不用这个`es module`更不用`AMD`这种形式去引入`lodash`这个库，你呢这个`lodash`库是通过全局的一个`script`标签引入进来的那么我就要求你这个`script`标签必须在页面上注入一个名字叫做`_`下划线的全局变量，这样的话我下面的`library`这个库才能正确的执行，所以它是这样的一个配置，但一般来说没有特殊要求的话大家可以把这里配置成一个:

```
externals: {
    lodash: 'lodash'
}
```

就可以了，它的意思就是在任何环境下你的引入的这个 `lodash` 的名字啊都给它起作`lodash`。

所以呢如果你是`es module`的形式的话，你也记得在引入`library`库之前先`import lodash from 'lodash'`，这个名字呢给它起成`lodash`就可以了。

---

好那这节课呢关于库打包的内容就给大家讲解了几个非常基础的内容，首先呢：

`externals` 这块的配置，表示的是我的`lodash`在打包库的时候不打包到库的代码里面去而是让业务代码去加载，那怎么加载`externals`这里面可以去配置一些配置项，用对象配置的形式可以配置区分不同的环境，`lodash`对应的名字。

我们又讲了`library`和`libraryTarget`指的是那我这个库在外部可以被怎么样的引入，那`umd`指的是`commonjs`、`AMD`都可以去正确的引入，那`library`指的是在这个`script`标签引入的情况下呢它会往全局注入一个`library`配置的参数名称变量，

当然如果下面它改成`libraryTarget: 'this'`，这个个`library`配置的参数名称变量会被注入到全局的`this`对象中，

如果写成`libraryTarget: 'window'`就会注入到`window`上，

如果配置为`libraryTarget: 'global'`,在`node.js`里面就会注入到`global`这个全局变量对象里。

那一般来说我们这里配置成`umd`就可以了。

当然大家不要觉得打包一个库就这么简单，实际上如果你真正的做一个`node`的这样的一个大型的库文件或者呢去做一些`ui`组件的库你会发现真正自己去写一个库代码的打包文件的时候它是非常复杂的，因为呢它里面还会涉及到一些按需加载啊一些`tree shaking`啊相关的内容，所以呢配置一个库其实非常的复杂，需要你对`node`对`es module`对各种各样对`commonjs`这些东西非常的了解。

那我们这个`library`这个库怎么才能让别人非常方便的使用到呢，首先呢我们要做这样的几个配置，打开我们的`package.json`文件：

package.json

```
main: './dist/library.js'
```

在这里面呢我们把入口`main`这个入口改成什么呢，改成当前`dist`目录下的`library.js`，表示对于我的这样的一个项目代码来说，最终要给别人使用的是`dist`目录下的`library.js`文件，所以当我们写成这样的话我们这个库的一些配置就全都做好了。

后面就是发布到`npm`上了，这个大家百度一下就知道了，这里就不再多说了。
