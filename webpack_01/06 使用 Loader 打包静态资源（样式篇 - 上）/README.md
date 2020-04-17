06 使用 Loader 打包静态资源（样式篇 - 上）

> 前言：同学们大家好，这节课我继续给大家讲解`loader`使用相关的内容，我们来讲使用`loader`打包静态资源里面的样式。

#### webpack 如何打包 css 样式文件

[->style-loader](https://www.webpackjs.com/loaders/style-loader/)

[->css-loader](https://www.webpackjs.com/loaders/css-loader/)

[->sass-loader](https://www.webpackjs.com/loaders/sass-loader/)

[->postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)

好，在浏览器上打开我们之前的`index.html`页面，我现在呢有这么一个需求：

我需要让图片的大小变成`150*150`的图片，所以呢我就需要写一个`css`的样式来修饰这张图片，那到我们的源代码之中：

在`src`目录下我可能就需要写一个样式文件叫做`index.css`文件：

index.css

```
.avatar{
    width: 150px;
    height: 150px;
}
```

然后我需要`index.js`在渲染这个图片的时候让它有这个`class`的名字，那怎么办呢？我们这样来写：

index.js

```
// file-loader
import avatar from './avatar.jpg'
// vue-loader
import Header from './header.vue'
// css文件
import './index.css'

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('root');
root.append(img);
```

好那我的代码写成这样，页面上的图片能出现变成`150*150`的效果吗？肯定是不可以的，我们打包下试一试：

重新打包：

```
C:\Users\nickname\Desktop\lesson>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson
> webpack


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 78cb85264069dc47ad83
Version: webpack 4.41.6
Time: 665ms
Built at: 2020-02-14 15:01:51
            Asset      Size  Chunks             Chunk Names
        bundle.js  16.4 KiB    main  [emitted]  main
images/avatar.jpg  19.3 KiB          [emitted]
Entrypoint main = bundle.js

ERROR in ./src/index.css 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> .avatar{
|     width: 150px;
|     height: 150px;
 @ ./src/index.js 6:0-20
```

它肯定会提示，它不知道怎么处理`.css`这种文件，我们到页面上来看我们说`webpack`只知道如何打包`.js`文件，它不知道当你引入一个`.css`文件的时候你要干什么，所以代码执行到这打包`import './index.css'`这行代码的时候就会报错了，这个时候我需要`webpack`知道如何打包`.css`文件，那怎么做呢？

我们需要在`webpack.config.js`里面去做一个配置:

当我们去打包`.css`文件的时候我们一般要用到两个`loader`分别是：

- style-loader
- css-loader

webpack.config.js

```
const path = require('path');
// 查阅文档发现v15版的vue-loader配置需要加个VueLoaderPlugin
// 并且不设置 VueLoaderPlugin 的话打包会报错提示需要设置 VueLoaderPlugin 对象
const VueLoaderPlugin = require('vue-loader/lib/plugin');

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
	},
	plugins:[
		new VueLoaderPlugin()
	],
	module: {
		rules: [
			{
				test: /\.(jpg|png|gif)$/,
				/* use: {
					loader: 'file-loader',
					options: {
						// placeholder 占位符
						// name: '[name]_[hash].[ext]'
						name: '[name].[ext]',
						outputPath: 'images/'
					}
				} */
				use: {
					loader: 'url-loader',
					options: {
						name: '[name].[ext]',
						outputPath: 'images/',
						// 字节
						limit: 10240
					}
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader','css-loader']
			},
			{
				test: /\.vue$/,
				use: {
					loader: 'vue-loader'
				}
			}
		]
	}
}
```

我们先不管这两个`loader`是干什么的，一会在来解释，我们先看打包之后是否能够正确打包。

我们先安装`style-loader`和`css-loader`：

```
C:\Users\nickname\Desktop\lesson>npm install style-loader css-loader -D
```


我们在命令行里面运行`npm run bundle`:


```
C:\Users\nickname\Desktop\lesson>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson
> webpack


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: c4cff8320afad652abb4
Version: webpack 4.41.6
Time: 749ms
Built at: 2020-02-14 15:17:45
            Asset      Size  Chunks             Chunk Names
        bundle.js  28.4 KiB    main  [emitted]  main
images/avatar.jpg  19.3 KiB          [emitted]
Entrypoint main = bundle.js
```

这个时候打包可以看到打包就成功了，然后我们再到`index.html`页面上看一下：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa29qzT3rrUOcJuH9PAweHPS3fvxjLIMhlUgIYZVmOLRS.BOf2O0Cyv08GLbrA2..prUS7XGtCVMZ.2F7lktxMoU!/b&bo=mgJAAQAAAAARB.k!&rf=viewer_4&t=5)

图片确实变小了，然后我们打开浏览器的控制台看一下宽高确实是`150*150`没有任何的问题。

##### 我们来研究下打包的流程是怎么样子的？

首先我在`index.js`中引入了一个`index.css`文件，那正常来说`webpack`不知道怎么打包`.css`文件，现在我们在`webpack.config.js`中做了配置，`webpack`看到`.css`文件就会用`css-loader`和`style-loader`来帮助我们打包，那打包好了之后我们的`js`里面就有了样式相关的内容，然后呢我给`img`标签添加了一个`avatar`的一个css类名，我们看页面上`img`标签确实有了一个`avatar`这样的class名，那样式也有了，class名字也有了，当然它就变成了`150*150`宽高的这个东西了。


```
<img src="images/avatar.jpg" class="avatar">
```

webpack.config.js

```
{
	test: /\.css$/,
	use: ['style-loader','css-loader']
}
```

好那么这块我们对应的`css-loader`和`style-loader`它的作用是什么呢？

我来给大家讲一下，现在我们的`css`其实非常的简单我们可以把它写的复杂点，在`src`目录下我在插件一个`avatar.css`文件，然后我把`index.css`文件中的内容拷贝到`avatar.css`里面来，`index.css`里面的内容这个时候我们写什么呢？


avatar.css

```
.avatar{
    width: 150px;
    height: 150px;
}
```

index.css

```
@import './avatar.css'
```

好，那现在的逻辑是`index.js`引入`index.css`，`index.css`又去通过css引入的语法去引入`avatar.css`好那页面在重新打包：


```
C:\Users\nickname\Desktop\lesson>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson
> webpack


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 70a1aa9c2cea6a0ccdef
Version: webpack 4.41.6
Time: 813ms
Built at: 2020-02-14 20:11:24
            Asset      Size  Chunks             Chunk Names
        bundle.js  29.6 KiB    main  [emitted]  main
images/avatar.jpg  19.3 KiB          [emitted]
Entrypoint main = bundle.js
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js!./src/avatar.css] 306 bytes {main} [built]
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js!./src/index.css] 420 bytes {main} [built]
[./node_modules/_vue-loader@15.9.0@vue-loader/lib/index.js?!./src/header.vue?vue&type=script&lang=js&] ./node_modules/_vue-loader@15.9.0@vue-loader/lib??vue-loader-options!./src/header.vue?vue&type=script&lang=js& 31 bytes {main} [built]
[./node_modules/_vue-loader@15.9.0@vue-loader/lib/loaders/templateLoader.js?!./node_modules/_vue-loader@15.9.0@vue-loader/lib/index.js?!./src/header.vue?vue&type=template&id=4f272926&] ./node_modules/_vue-loader@15.9.0@vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/_vue-loader@15.9.0@vue-loader/lib??vue-loader-options!./src/header.vue?vue&type=template&id=4f272926& 212 bytes {main} [built]
[./src/avatar.jpg] 61 bytes {main} [built]
[./src/header.vue] 1.1 KiB {main} [built]
[./src/header.vue?vue&type=script&lang=js&] 292 bytes {main} [built]
[./src/header.vue?vue&type=template&id=4f272926&] 236 bytes {main} [built]
[./src/index.css] 599 bytes {main} [built]
[./src/index.js] 331 bytes {main} [built]
    + 3 hidden modules
```

大家回过来看一样的效果，在这个的打包过程中`css-loader`帮我们干了一件什么样的事情呢？
- `css-loader`会帮我们分析出几个`.css`文件之间的关系最终把这些`.css`文件合并成一段css。
- 那`style-loader`它的作用是什么呢？在得到`css-loader`生成的css内容之后
`style-loader`会把这段内容挂载到页面的`head`部分，大家来看我们浏览器的页面上`head`部分会有一个`style`标签，这个标签是谁挂载上来的呢？就是`style-loader`帮我们挂载上来的，所以我们说在处理`.css`这种文件打包的时候我们一定要用`css-loader`配合`style-loader`一起来使用。

```
<head>
	<meta charset="UTF-8">
	<title>这是最原始的网页开发</title>
<style>.avatar{
    width: 150px;
    height: 150px;
}</style><style></style></head>
```


---

#### Scss 、Less文件的处理

[->sass-loader](https://www.webpackjs.com/loaders/sass-loader/)

好接着我们继续往下来讲。

我们说有的时候啊想在我的代码里面不写`css`，而是去写一些`Scss`、`Less`这种比较新潮的样式文件，那么如果我们去写`Sass`、`Less`这种文件，那么应该怎么写呢？

这里啊我做一下修改，首先我把`index.css`改成`index.scss`这样的文件，然后我把`avatar.css`里面的代码剪切粘贴到`index.scss`这个文件，之后啊我把`avatar.css`文件删除掉就可以了。

lesson

```
src
 |--avatar.jpg
 |--index.scss
 |--index.js
index.html
package.json
webpack.config.js
```

index.js

```
// file-loader
import avatar from './avatar.jpg'
// css文件
import './index.scss'

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('root');
root.append(img);

```


然后呢，我们现在做的事情就是什么，我们现在做的事情就是`index.js`去引入`index.scss`这个文件，好，现在我们引入的这个样式文件就不再是一个普通的css文件了，而是一个`scss`这样的文件，那这块我们就可以按照`scss`语法对这个样式做一下改进。

index.scss

```
body{
    .avatar{
        width: 150px;
        height: 150px;
    }
}

```

好那么我们重新打包大家想一下能不能运行？肯定是不能运行的，为什么，因为`index.js`你引入`.scss`结尾的文件，`webpack`根本不知道该怎么办，所以这个时候又要去改`webpack`的配置了，在这里我可以把`css`改成`scss`，当遇到`.scss`文件就用`css-loader`打包之后在用`file-loader`做处理。

webpack.config.js

```
{
	// 把原先的 css 改成了 scss
	test: /\.scss$/,
	use: ['style-loader','css-loader']
}
```

好改成这样我们在打包试一下：


```
C:\Users\nickname\Desktop\lesson_1>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_1
> webpack


C:\Users\nickname\Desktop\lesson_1>"node"  "C:\Users\nickname\Desktop\lesson_1\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 15e2d4d1592b1dcc5705
Version: webpack 4.41.6
Time: 200ms
Built at: 2020-02-14 20:39:06
    Asset      Size  Chunks             Chunk Names
bundle.js  4.34 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/index.js] 432 bytes {main} [built]
```

大家看好像打包成功了，对不对，我们回到浏览器页面上查看，你会发现有没有用啊？好像页面上样式没有了，我们打开控制台来看一下，点开图片`class=avatar`这个`class`还在，我们在点开`head`标签大家可以看到这根本就不是一个`css`的语法，这是原始的`scss`语句那浏览器当然不能识别啦，所以当我们说当我们去打包`.scss`文件的时候还需要借助其它额外的`loader`帮助我们把`scss`的语法翻译成`css`的语法，那这个时候呢我们要使用`sass-loader`来帮助我们去做`scss`
文件的一个编译。

index.html （打包后）

```
<html lang="en"><head>
	<meta charset="UTF-8">
	<title>这是最原始的网页开发</title>
<style>body{
    .avatar{
        width: 150px;
        height: 150px;
    }
}
</style></head>
<body>
	<p>这是我们的网页内容</p>
	<div id="root"><img src="images/avatar.jpg" class="avatar"></div>
	<script src="./bundle.js"></script>

</body></html>
```

好了`sass-loader`的使用我们可以参考`webpack`官方网站上对`sass-loader`的介绍。



那么`sass-loader`使用文档上会告诉我们，如果你想使用`sass-loader`你要按照`sass-loader`和`node-sass`这两个包，所以我们来按照下这两个包：

```
C:\Users\nickname\Desktop\lesson_1>npm install sass-loader node-sass -D
```

完成按照之后我们在`webpack.config.js`里面在配置`sass-loader`：

webpack.config.js

```
{
	test: /\.scss$/,
	use: ['style-loader','css-loader','sass-loader']
}
```

在增加了`sass-loader`之后我们再次进行打包：

```
C:\Users\nickname\Desktop\lesson_1>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_1
> webpack


C:\Users\nickname\Desktop\lesson_1>"node"  "C:\Users\nickname\Desktop\lesson_1\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: b7350add7c40253b8e35
Version: webpack 4.41.6
Time: 1785ms
Built at: 2020-02-14 20:56:35
            Asset      Size  Chunks             Chunk Names
        bundle.js    18 KiB    main  [emitted]  main
images/avatar.jpg  19.3 KiB          [emitted]
Entrypoint main = bundle.js
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./src/index.scss] 303 bytes {main} [built]
[./src/avatar.jpg] 61 bytes {main} [built]
[./src/index.js] 284 bytes {main} [built]
[./src/index.scss] 659 bytes {main} [built]
    + 2 hidden modules
```

打包好了之后我们再来看页面，这个时候大家可以看到页面上`width`和`height`是不是都是150了，我们看这个图片明显的变小了。

index.html

```
<html lang="en"><head>
	<meta charset="UTF-8">
	<title>这是最原始的网页开发</title>
<style>body .avatar {
  width: 150px;
  height: 150px; }
</style></head>
<body>
	<p>这是我们的网页内容</p>
	<div id="root"><img src="images/avatar.jpg" class="avatar"></div>
	<script src="./bundle.js"></script>

</body></html>
```


这样的话我们`scss`文件的打包就带大家实现完成了，这里面我们用了一个`sass-loader`大家可以看到现在我们已经有三个`loader`了，在`webpack`配置里面`loader`是有先后顺序的，`loader`的执行顺序是从下到上，从右到左，所以当我们去打包一个`.scss`文件的时候首先会执行`sass-loader`对`scss`代码进行一个翻译
，翻译成css代码之后给到`css-loader`然后都处理好了之后在给到`style-loader`挂载到页面上，是这样的一个顺序，所以大家一定记得，`loader`是从下到上，从右到做的一个执行顺序。

webpack.config.js

```
{
	test: /\.scss$/,
	use: [
	    'style-loader',
	    'css-loader',
	    'sass-loader'
	]
}
```

#### postcss-loader 自动添加css厂商前缀 `webkit`、`moz`、`ms`

[->postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)

好紧接着我们继续来看，我们说有的时候我们会在代码里写这样的一些语句：

index.scss

```
body{
    .avatar{
        width: 150px;
        height: 150px;
        /*用于测试自动添加厂商前缀 postcss-loader和autoprefixer*/
		/*它的意思是我要把我的 avatar 标签偏移100px*/
		transform: translate(100px, 100px);
		display: flex;
    }
}

```

我重新打包一下：

```
C:\Users\nickname\Desktop\lesson_1>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_1
> webpack


C:\Users\nickname\Desktop\lesson_1>"node"  "C:\Users\nickname\Desktop\lesson_1\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 44fdeb4abfca5ecb5e86
Version: webpack 4.41.6
Time: 550ms
Built at: 2020-02-14 21:08:55
            Asset      Size  Chunks             Chunk Names
        bundle.js    18 KiB    main  [emitted]  main
images/avatar.jpg  19.3 KiB          [emitted]
Entrypoint main = bundle.js
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./src/index.scss] 342 bytes {main} [built]
[./src/avatar.jpg] 61 bytes {main} [built]
[./src/index.js] 284 bytes {main} [built]
[./src/index.scss] 659 bytes {main} [built]
    + 2 hidden modules
```

然后在打开页面看到页面中的图片会有100px的偏移：

index.html

```
<html lang="en"><head>
	<meta charset="UTF-8">
	<title>这是最原始的网页开发</title>
<style>body .avatar {
  width: 150px;
  height: 150px;
  transform: translate(100px, 100px); }
</style></head>
<body>
	<p>这是我们的网页内容</p>
	<div id="root"><img src="images/avatar.jpg" class="avatar"></div>
	<script src="./bundle.js"></script>

</body></html>
```


![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMaxJ8WUzYAwRaN*RzlS75lLPP5N334Pik0OvnfdcyKoAxPuH0JjL1NTfy2.U0sCwfQkHGmdzek0W.YXcqmlo6NAQ!/b&bo=3AJqAgAAAAARB4Y!&rf=viewer_4&t=5)


可是呢我们发现`transform`前面并没有厂商前缀，我们一般写这种`css3`的新的特性的时候一般要加`webkit`或者`moz`或者`ms`啊对`IE`浏览器的一些支持都会加这个厂商前缀，但是现在我们这样写`css`就没法写这个厂商前缀了或者说我们在css里面去写这个厂商前缀：

```
-webkit-transform: translate(100px, 100px);
// -moz-transform: translate(100px, 100px);
```

就像上面这样我们必须手动去写，这样会很麻烦，但是我们还有其它的`loader`可以很方便的帮助我们实现这种自动填充厂商前缀的功能，好我带大家来使用一下：

这个`loader`呢叫做`postcss-loader`，我们呢要使用这个`loader`我们先看一下这个`loader`对应的文档[->postcss-loader](https://www.webpackjs.com/loaders/postcss-loader/)，看一下它的使用方式：

第一步呢你要去安装`postcss-loader`，`postcss-loader`要求我们在目录下创建一个`postcss.config.js`这样的文件，在这里面我们可以做一些配置，所以呢我们来写一下这个文件，在`lesson`目录下我们创建一个文件叫做`postcss.config.js`文件里面我们写一些配置：


```
C:\Users\nickname\Desktop\lesson_1>cnpm install postcss-loader -D
```

postcss.config.js

我们把`webpack`官网上的`postcss-loader`文档中关于`postcss.config.js`介绍部分拷贝到我们的项目内的`postcss.config.js`文件中，把里面的内容都清除掉，我们只要用一个`autoprefixer`，我们一会给大家说这个插件做什么使用的。

安装`autoprefixer`插件：

```
C:\Users\nickname\Desktop\lesson_1>cnpm install autoprefixer -D
```

好，接着呢我们在`postcss.config.js`里面去使用这个`autoprefixer`，所以在`plugins`里面添加`autoprefixer`的配置，好这样的话我就配置好了`postcss-loader`要使用的一个插件，然后我们一会看`autoprefixer`这个插件能够帮助我们干什么。

postcss.config.js

```
module.exports = {
    plugins: [require('autoprefixer')]
}
```

好，这里我们还需要在配置一个浏览器兼容版本型号匹配的配置文件，如果不增加这个配置文件的话`postcss-loader`和`autoprefixer`就无法生效，它的名字是固定的`.browserslistrc`，我们在项目的根目录下新建一个`.browserslistrc`的配置文件：

.browserslistrc

```
# Browsers that we support

last 2 version
> 1%
not ie < 11
ios 7
maintained node versions
not dead
```

现在我们的项目文件结构如下：

lesson

```
src
 |--avatar.jpg
 |--index.js
 |--index.scss
.browserslistrc
index.html
package.json
postcss.config.js
webpack.config.js
```

webpack.config.js

```
{
	test: /\.scss$/,
	use: ['style-loader','css-loader','sass-loader','postcss-loader']
}
```

在`webpack.config.js`里面我们配置了当我们发现`scss`文件的时候，我们会依次使用`postcss-loader`->`sass-loader`->`css-loader`->`style-loader`，然后`postcss-loader`它有一个配置文件当它被引用或者说打包的时候要使用`postcss`这个`loader`的时候它会去使用一个`autoprefixer`的插件。

好，做好了`webpack`的配置之后，我们看`index.scss`文件里也有了`transform`这个东西，`index.js`里面也引入了`index.scss`这个文件，那我们重新进行依次打包：


```
C:\Users\nickname\Desktop\lesson_1>npm run bundle
```

打包成功了，然后我们到浏览器上看一下页面，大家看现在执行的结果依然是正常的，它有一个偏移然后我们打开大家可以看到`transform`上面自动就多了一个`-webkit-transform`这样的一个厂商前缀：

这个东西是谁帮你添加的呢？就是`postcss-loader`里面对应的这个`autoprefixer`这个插件帮助我们添加的厂商前缀。

```
body .avatar {
    width: 150px;
    height: 150px;
    -webkit-transform: translate(100px, 100px);
    transform: translate(100px, 100px);
    display: -webkit-flex;
    display: flex;
}
```


![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa0OOLL67DiB.Sr8BjajIuIGfb.TMWlDYKVUpFf75GtnLV4pragN9Gmuf7q1OhWDG9PZcT9VKhrM9QI3UgdU9RoA!/b&bo=CQOFAgAAAAARB70!&rf=viewer_4&t=5)

### 总结：

好，讲到这，我们又给大家讲解了打包样式文件的时候，如何调用`postcss-loader`这个`loader`帮我们去处理一些其它的，比如说：增加厂商前缀这样的需求。

好这样的话我们基本上就把样式相关的静态文件的打包给大家讲解完毕了。
