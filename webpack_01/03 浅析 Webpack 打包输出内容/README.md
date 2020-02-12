## 03 浅析 Webpack 打包输出内容

> 前言：同学们大家好这节课呢我们把之前遇到的一些没有讲到的知识点在给大家补充一下。

我们呢非常简单的说一说在打包过程种遇到的一些问题。

#### npm run bundle 打包输出分析

首先咱们在命令行里面重新的对我们的`lesson`项目进行一次打包：


```
C:\Users\nickname\Desktop\webpack-demo>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\webpack-demo
> webpack


C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: 9b7e6b0d7827c10c78bd
Version: webpack 4.41.5
Time: 132ms
Built at: 2020-02-12 13:45:30
    Asset      Size  Chunks             Chunk Names
bundle.js  1.36 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./src/index.js 159 bytes {0} [built]
[1] ./src/header.js 187 bytes {0} [built]
[2] ./src/sidebar.js 193 bytes {0} [built]
[3] ./src/content.js 193 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

```


好大家来看在我们做`webpack`打包的时候它输出了非常多的这个提示命令，那我们来依次给大家讲讲输出的这些信息都是什么意思。

首先大家可以看到一个`Hash`值也就是哈希值，这个`Hash`值代表的是本次打包对应的唯一一个`Hash`值。

好`Version`它的意思是我们的这次打包使用的版本是`webpack 4.41.5`这个版本。

我们继续来看`Time`指的是当前这个包整体的打包耗时是`132ms`。

接着我们在往下看，我们可以看到有一个`Asset`这样的一个字段下面呢对应的是一个`bundle.js`这个文件它表示的是我们打包出了一个`bundle.js`文件，`Size`指的是这个文件的大小是`1.36KiB`，`Chunks`指的是什么呢？大家首先来看这个`Chunks`后面有一个`s`我们说现在我们打包出来的只有一个文件有的时候我们做复杂打包时会打包出很多文件，每一个文件都会有一个自己的`id`值，那`Chunks`里面不仅放的是自己的这个文件对应的`id`值，有可能`bundle.js`在大型项目种还和其它的一些`js`文件有关系那么其它的打包出来的这些`js`文件的`id`也会放到`bundle.js`这个`Chunks`下面的这个字段中。

好在往后看`Chunk Names`指的是什么？它和`Chunks`基本上没有太大的区别，`Chunks`里面放的是每一个文件对应的`id`，而`Chunk Names`放的是每一个`js`文件对应的名字，好，这块这个`main`是哪来的？我来给大家讲解一下实际上当我们在写`webpack`配置的时候我们写的是`entry: './src/index.js'`后面跟了一个字符串这种配置的方式实际上是对：

```
entry: {
    main: './src/index.js'
}
```

上面这种形式的简写，好我们呢把代码写成这样然后重新进行一次打包：

```
C:\Users\nickname\Desktop\webpack-demo>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\webpack-demo
> webpack


C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: 9b7e6b0d7827c10c78bd
Version: webpack 4.41.5
Time: 128ms
Built at: 2020-02-12 20:36:11
    Asset      Size  Chunks             Chunk Names
bundle.js  1.36 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./src/index.js 159 bytes {0} [built]
[1] ./src/header.js 187 bytes {0} [built]
[2] ./src/sidebar.js 193 bytes {0} [built]
[3] ./src/content.js 193 bytes {0} [built]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

```

大家可以看到打印出的效果是一模一样的，然后我们来看`dist`目录下还是有一个`bundle.js`没有任何的区别，所以呢这个时候大家可以看到我的这个入口文件对应呢它有一个名字叫做`main`所以呢这个`Chunk Names`里面放的这个`main`就是你`entry`配置的这个`main`。

webpack.config.js

```
const path = require('path');

module.exports = {
	// entry: './src/index.js',
	entry: {
		main: './src/index.js'
	},
	output: {
		filename: 'bundle.js',
		// path 不写其实也可以，默认就会打包到 dist 目录
		path: path.resolve(__dirname, 'dist')
	}
}
```

好我们继续在往下看，那它会告诉我们整个打包过程中入口文件`Entrypoint`是哪一个，也就是`main`这个入口，在配置文件里面也就是刚才给大家讲的在`webpack.config.js`中配置的`main: './src/index.js'`就是我们的入口文件。

```
Entrypoint main = bundle.js
```

接着往下它会进行打包首先打包`index.js`里面会用到`header.js`、`sidebar.js`和`content.js`，讲到这上面的打包输出的内容大家应该清楚它的意思了。

```
[0] ./src/index.js 159 bytes {0} [built]
[1] ./src/header.js 187 bytes {0} [built]
[2] ./src/sidebar.js 193 bytes {0} [built]
[3] ./src/content.js 193 bytes {0} [built]
```

#### `mode`打包环境配置 （`production`、`development`）

继续呢我们再看，最下面打包输出了一个警告`WARNING`，那警告是什么意思呢？

```
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

```

它说我们在`webpack`配置的时候没有指定打包的环境或者打包的模式，这个模式是什么意思，我们首先来看打包出来的`bundle.js`这段代码，这个代码是被压缩成一行的代码，其实如果我们在配置项里面没有填这个模式的话，==模式默认是：`production`==，如果我把`mode`填上`production`咱们呢在进行一次打包：

bundle.js

```
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:! ......
```

webpack.config.js

```
const path = require('path');

module.exports = {
	mode: 'production',
	// entry: './src/index.js',
	entry: {
		main: './src/index.js'
	},
	output: {
		filename: 'bundle.js',
		// path 不写其实也可以，默认就会打包到 dist 目录
		path: path.resolve(__dirname, 'dist')
	}
}
```

填上`mode`之后，我们在进行一次打包：

```
C:\Users\nickname\Desktop\webpack-demo>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\webpack-demo
> webpack


C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: 1f794a0baefa81db9c30
Version: webpack 4.41.5
Time: 134ms
Built at: 2020-02-12 20:57:27
    Asset      Size  Chunks             Chunk Names
bundle.js  1.36 KiB       0  [emitted]  main
Entrypoint main = bundle.js
[0] ./src/index.js 159 bytes {0} [built]
[1] ./src/header.js 187 bytes {0} [built]
[2] ./src/sidebar.js 193 bytes {0} [built]
[3] ./src/content.js 193 bytes {0} [built]
```

它就不会报任何错误了，也不会报任何警告，然后呢打包出的文件`bundle.js`我们来看和之前没有写`mode`的没有任何的区别，和之前打包出的文件也是一样的，
所以如果我们不配置这个`mode`是`production`它呢就会警告我们你没有配置但是本质上它底层呢还是会帮我们把这个`mode`设置成`production`。

那假设`mode`是`production`，那么你打包出的文件就会被压缩，好如果你不想被它压缩你可以把它改成什么啊，我们看之前报的那个警告这里面呢除了填写`production`之外你还可以填写一个`development`，我们来写一下：

webpack.config.js

```
const path = require('path');

module.exports = {
	mode: 'development',
	// entry: './src/index.js',
	entry: {
		main: './src/index.js'
	},
	output: {
		filename: 'bundle.js',
		// path 不写其实也可以，默认就会打包到 dist 目录
		path: path.resolve(__dirname, 'dist')
	}
}
```

好，我们在重新打包：

```
C:\Users\nickname\Desktop\webpack-demo>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\webpack-demo
> webpack


C:\Users\nickname\Desktop\webpack-demo>"node"  "C:\Users\nickname\Desktop\webpack-demo\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: 14084f0d6141819d8d50
Version: webpack 4.41.5
Time: 107ms
Built at: 2020-02-12 21:09:24
    Asset      Size  Chunks             Chunk Names
bundle.js  5.38 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/content.js] 193 bytes {main} [built]
[./src/header.js] 187 bytes {main} [built]
[./src/index.js] 159 bytes {main} [built]
[./src/sidebar.js] 193 bytes {main} [built]
```

好回头在来看`bundle.js`大家可以看到当你把这个`mode`设置成`development`的时候，代码有没有被压缩过啊？没有被压缩，然后我们尝试在浏览器上执行这段代码看好不好用，大家可以看到这个`bundle.js`一样可以执行，所以大家应该知道
`mode`的作用了，当你在`webpack`配置里面设置`mode`是`development`的时候那么`bundle.js`它是不被压缩的一段`js`代码，当你设置成`production`的时候那么它是一段被压缩的代码这就是`mode`的一个作用，当你把`mode`填上之后在打包就不会报错了。



bundle.js

```
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
......
```

### 总结：

好了那么讲到这呢我们基本上就把之前课程里遇到的一些打包的输出内容给大家讲解完了。
