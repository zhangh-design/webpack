## 04 什么是 loader

> 前言：同学们大家好接下来我们就要进入到`webpack`的实践章节了，在这章中呢我们要学习`webpack`的各种配置参数。

所以首先我们要做两件事：

第一件事情我们来看一下之前的内容大家是否掌握清楚了，大家呢可以问一下自己：

- `webpack`是什么？
- 模块是什么？
- `webpack`配置文件的作用是什么？

如果大家对这三个问题的答案非常清楚那么OK你前面的课程掌握的不错，如果大家一时反应不过来那么就说明你的基础呢其实不是那么牢固我建议大家呢回头在看一下之前一个钟头的课程。


第二件事情我要给大家讲下后面的课程我们应该如何学习，随着课程深入大家会发现`webpack`的配置项真的是非常非常多，我们可以看一下啊，打开[`webpack`的官方网站](https://www.webpackjs.com/)，点击进入`DOCUMENTATION`（文档）[   DOCUMENTATION](https://www.webpackjs.com/concepts/)，点击`CONFIGURATION`（配置） [CONFIGURATION](https://www.webpackjs.com/configuration/) 这块的内容，然后我们展开左侧的列表树，好大家来看啊，这些配置项如果都要我们记住是不是非常的多啊，好这只是`webpack`的基础配置项，`webpack`里面会有
非常多的自定义`loader`和自定义插件在官网上我们可以看一下有`loaders`[loaders](https://www.webpackjs.com/loaders/)和`plugins`[plugins](https://www.webpackjs.com/plugins/)这两个模块，我们点击进入`loaders`大家可以看`webpack`官方推荐的`loader`就有很多，每一个`loader`又有自己非常多的配置项，我们在点击进入`plugins`，`webpack`官方推荐的插件又有很多每一个插件的配置项我们可以展开又有非常多，那其实每一个插件和每一个`loader`它的配置项一般也都是几十个和上百个这么多，这只是官方的`loader`和`plugins`，我们还有个人开发的或者说呢一些机构开发的并非官方推荐的这些`loader`和`plugins`，加在一起我估计`webpack`相关的这些配置项有几万个一点也不夸张，那如果你想把这些东西都记住学会至少我自己觉得这是根本不可能的，那么怎么办我们就要有一些套路，这个套路就是呢大家通过课程的学习把核心的`webpack`的知识点学会然后呢在你的业务场景中我们遇到什么问题查阅相关的文档再去看就可以了，所以大家不要一概的求全想要把这些这个`API`全部记住这是不可能的我们用到什么去查什么。

#### module

好，接着我们课程的继续学习，我们已经明确的知道`webpack`是一个模块打包工具
，我也给大家讲过模块不仅仅是`js`文件还可以是图片或者是`css`文件等等其它任何的内容，我们打开上一章的代码来看一下：

进入到`src`目录下，我们找到`index.js`大家可以看到现在我们打包的文件全部都是`js`文件，那假设我想打包一个图片文件呢？我们随便到网站上去找一个图片把这个图片放到`src`目录下。

lesson

```
src
 |--avatar.jpg  （新增加的图片）
 |--content.js
 |--header.js
 |--index.js
 |--sidebar.js
```

这个时候我们说`webpack`你不是可以打包这个任何形式的模块嘛，那你能不能打包这个`.jpg`这样形式的模块啊，我们试一下在`index.js`中`require`这个图片文件
，然后我们重新打包。

index.js

```
var Header = require('./header.js');
var Sidebar = require('./sidebar.js');
var Content = require('./content.js');
var avatar = require('./avatar.jpg');

new Header();
new Sidebar();
new Content();
```

我们运行`npm run bundle`打包：

```
C:\Users\nickname\Desktop\lesson>npm run bundle

> lesson@1.0.0 bundle C:\Users\nickname\Desktop\lesson
> webpack


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: 1a7a12f27ea6d448e3dc
Version: webpack 4.41.5
Time: 109ms
Built at: 2020-02-13 10:03:59
    Asset      Size  Chunks             Chunk Names
bundle.js  5.98 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/avatar.jpg] 281 bytes {main} [built] [failed] [1 error]
[./src/content.js] 193 bytes {main} [built]
[./src/header.js] 187 bytes {main} [built]
[./src/index.js] 197 bytes {main} [built]
[./src/sidebar.js] 193 bytes {main} [built]

ERROR in ./src/avatar.jpg 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
(Source code omitted for this binary file)
 @ ./src/index.js 4:13-36
```

诶，这个时候大家可以看到打包运行就报错了，它说什么呢，它说`avatar.jpg`这个文件的打包出了问题，为什么会出现这个问题，原因是啊`webpack`默认是知道如何打包处理`js`模块的但是它不知道`.jpg`这种文件该怎么打包了，那我们说`webpack`不知道我们就要告诉`webpack`怎么办，在哪儿告诉它呢？大家想一下肯定是在配置文件里告诉它，所以呢我们打开配置文件：

继续编写我们的配置文件，当`webpack`在做模块打包的时候它不知道该怎么办的时候，我呢告诉它模块怎么办所以这里我需要写一个`module`，它的意思呢大家也能理解，当你去打包一个模块的时候我不知道怎么办的时候我就到你这个`module`
这个配置里面去找该怎么办，这里面我们可以去配置一个`rules`这样的一个属性
它呢很显然是一个规则，在这个规则里面它是一个数组我们呢就可以写一些东西了
，这个`rules`里面可以有很多个规则我们先来写一个，好它的写法呢基本上是固定的，首先我们来写一个`test`，好假设我们打包的这个文件或者打包的这个模块啊它是以`.jpg`结尾的这样的一个文件那我怎么打包呢？我要使用一个`loader`来帮助我们做打包，我们这样写: 

这里呢我们用一个什么样的`loader`帮我们打包`.jpg`这样的文件或者模块呢？我们用一个`file-loader`来帮助我们做这个`.jpg`文件的打包。

好，现在你要用到这个`loader`你在项目内并没有安装这个`loader`，所以呢大家需要先安装一下`file-loader`这个工具：

[->file-loader链接地址](https://www.webpackjs.com/loaders/file-loader/)

```
C:\Users\nickname\Desktop\lesson>cnpm install file-loader -D
```

module配置：
```
module: {
	rules: [
		{
			test: /\.jpg$/,
			use: {
				loader: 'file-loader'
			}
		}
	]
}
```

好这个时候我们的`file-loader`已经安装好了，同样我们的`module`里面的配置也安装好了，那我们呢先去运行一下看看打包是否可以正常的执行了（当然有的同学对这块肯定是不理解的没关系一会在来说）：

大家看现在打包是不是没有任何的问题啦。

```
C:\Users\nickname\Desktop\lesson>npm run bundle

> lesson@1.0.0 bundle C:\Users\nickname\Desktop\lesson
> webpack


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.41.5@webpack\bin\webpack.js"
Hash: ad5aaf438bb7a7d3972d
Version: webpack 4.41.5
Time: 209ms
Built at: 2020-02-13 10:38:12
                               Asset      Size  Chunks             Chunk Names
bd7a45571e4b5ccb8e7c33b7ce27070a.jpg  19.3 KiB          [emitted]
                           bundle.js  5.92 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/avatar.jpg] 80 bytes {main} [built]
[./src/content.js] 193 bytes {main} [built]
[./src/header.js] 187 bytes {main} [built]
[./src/index.js] 197 bytes {main} [built]
[./src/sidebar.js] 193 bytes {main} [built]
```

那回过头来我们看打包出的内容是什么样子的，到项目目录下我们找到我们的`dist`目录大家可以看到它会打包出两个文件，`bundle.js`是之前就打包出的一个`js`文件而这个一串乱码的文件我们点开其实就是我们的这张图片，所以`webpack`会把这张图片也打包到`dist`目录里面去。

dist

```
dist
 |--bd7a45571e4b5ccb8e7c33b7ce27070a.jpg
 |--bundle.js
 |--index.html
```

index.js

```
var Header = require('./header.js');
var Sidebar = require('./sidebar.js');
var Content = require('./content.js');
var avatar = require('./avatar.jpg');

console.log(avatar.default); // bd7a45571e4b5ccb8e7c33b7ce27070a.jpg

new Header();
new Sidebar();
new Content();
```

那我们接着再来看，我们说在`index.js`这里我们定义了一个变量`avatar`，然后呢去`require`引入了这个模块把它赋值给这个变量，那么这个变量是什么呢？我们可以`console.log(avatar)`在浏览器打印一下看看是不是就是我们刚才打包生成的这个图片的文件名啊，了解了这点之后我们回过头来正向的分析一下打包的流程是什么样子的，进入到我们的代码首先我们有一个`index.js`这样的文件然后呢
你要对这个文件进行打包，所以呢你在这个命令行里运行了`npm run bundle`这个命令，当你运行`npm run bundle`这个命令的时候实际上你在执行的是`package.json`里面的这个`npm scripts`运行`bundle`这个命令实际上就是在运行`webpack`，这个时候`webpack`
会去找它的配置根据这个配置帮你做打包。

好然后我们再来看`index.js`，当`webpack`做打包的时候如果它遇到`js`文件那么ok它本身默认就知道怎么去处理这个`js`文件，但是当它遇到这个`avatar.jpg`的时候`webpack`就不知道怎么办了，这个时候我们在配置文件里告诉它怎么办了，我们告诉它如果你碰到了`jpg`结尾的这样文件这个时候啊你就去求助`file-loader`这个`loader`去打包，`file-loader`知道该怎么去打包`.jpg`这样的文件，那我们是怎么知道`file-loader`可以帮助我们打包`.jpg`这样的文件呢，实际上我们是在完整的阅读了`webpack`的官方文档之后得出的这样的知识，大家可以点开 [loaders/file-loader](https://www.webpackjs.com/loaders/file-loader/)
它会告诉我们当你去打包这种图片形式的这种东西`file-loader`这个`loader`就可以帮助你完成打包的过程。


好，回到我们的代码里面我们在来想一下`file-loader`这个东西实际上它的底层帮我们做了几件事情：

第一件事情是当它发现你在你的代码里面去引入了一个图片的这样一个模块的时候
它首先会把这个模块帮助你打包移动到哪里去？移动到打包生成的`dist`目录下，所以大家来看`avatar.jpg`会被移动到`dist`这个目录下当然它会给它改一个名字
（这个名字呢其实也可以自定义我们后面会说），当它把这个图片挪到`dist`目录下之后呢它会得到图片的名称或者说图片相对于`dist`目录的名称，然后它会把这个名称做为一个返回值返回给我们引入模块的这个变量之中，这就是`file-loader`底层处理图片类型文件打包的流程，当然呢，它不仅仅可以处理`.jpg`这样的图片它呢理论上还可以处理任何静态的资源，比如说呢：`.png`、`.svg`、`.excel`随便的一个文件它都可以帮你处理，为什么呢？因为大家刚才听了它的原理之后就会知道实际上假如我写了一个`.txt`这样的一个文件，然后呢我在`webpack`里面去配置：


```
module: {
	rules: [
		{
			test: /\.(jpg|txt)$/,
			use: {
				loader: 'file-loader'
			}
		}
	]
}
```

一旦你遇到`.txt`那你呢就用`file-loader`去帮你打包，那它会怎么打包呢？它遇到`.txt`文件，第一步把`.txt`文件挪到`dist`目录下，第二步把这个文件的地址在返回给你的变量，所以理论上来说如果你在打包的过程中想让某一个后缀的文件移动到`dist`目录下，同时获得到这个文件的地址那么你都可以用`file-loader`来处理。

#### 总结：

好，讲到这其实`file-loader`不是我们的重点，我们的重点是什么？通过这个例子我要给大家讲`loader`到底是什么，大家呢可以先思考一下`loader`是什么？其实`loader`就是一个打包的方案，它知道对于某一个特定的文件`webpack`应该如何的进行打包，那本身`webpack`是不知道对于一些文件应该怎么处理的，但是`loader`知道，所以呢`webpack`你去求助与`loader`就可以了。


接下来呢我们在改写一下代码，这个时候我给大家主要讲的是`loader`的内容，所以呢`js`这块的内容我都给它去掉了，然后我把`src`目录下`header.js`删除掉，`content.js`也删除掉，`sidebar.js`一样也删除掉，我们的代码只有一个`index.js`它里面引入了一个`avatar.jpg`（那这种引入的语法叫做`CommonJs`的语法，我们完全可以用ESModule的语法来写），看下面代码：

lesson

```
src
 |-- index.js
 |-- avatar.jpg
index.html
package.json
webpack.config.js
```

index.js

```
// avatar就是图片的地址
import avatar from './avatar.jpg'

// 然后呢，我们可以这样接着去写
var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar

var root = document.getElementById('root');
root.append(img);
```

上面的`index.js`里我们就有了一个`Image`元素，我们把`avatar`这个地址变量赋值给`src`属性然后在`append`到页面的节点上。

好了，写好上面的代码后我们重新打包运行：

```
C:\Users\nickname\Desktop\lesson>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson
> webpack


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 723339bceed9c5899cd2
Version: webpack 4.41.6
Time: 212ms
Built at: 2020-02-13 14:39:53
                               Asset      Size  Chunks             Chunk Names
bd7a45571e4b5ccb8e7c33b7ce27070a.jpg  19.3 KiB          [emitted]
                           bundle.js  4.67 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/avatar.jpg] 80 bytes {main} [built]
[./src/index.js] 206 bytes {main} [built]
```

好，打包成功然后呢我们到我们的页面上在刷新一下，大家可以看打包生成的`dist`目录下的`index.html`上是不是就显示出我的这种图片。

#### 总结：

好实际上这节课我们主要给大家就是介绍一个概念，就是`loader`和`loader`的作用是上面，`webpack`不能识别非`js`结尾的这样的后缀的模块，那就需要通过`loader`让`webpack`识别出来，怎么配置`loader`呢，在`webpack.config.js`里面
首先我们写了一个`module`也就是遇到模块符合哪个规则呢，符合结尾是这个`.jpg`这样规则的这样的文件，我们就求助`file-loader`这个`loader`帮助我们完成打包，`file-loader`是具备这样处理某一个模块的能力的，所以用了`file-loader`之后`webpack`就可以正常的打包`.jpg`这样的文件了，那假设大家之前如果写过`Vue`的同学应该写过这样的代码：

index.js
```
import Header from './header.vue'
```

我相信大家如果学习过`Vue`肯定都写过这样的代码，也就是我们从`Vue`的这个代码里面去引入一个名字叫做`header.vue`的组件，大家一看到这个代码你觉得它能正确执行吗？它肯定正确执行不了，为什么呀？`webpack`它不认识`header.vue`这个文件，它不认识以`.vue`结尾的文件，所以打包肯定失败，如果想让`webpack`处理这个时候我们应该知道怎么办了，这个时候在`module`的`rules`里面我们在
增加一个`loader`：

如果发现结尾是`.vue`这样的文件，我们就用什么啊，大家如果到[vue-loader](https://vue-loader.vuejs.org/zh/)的官网上看到我们就是使用的`vue-loader`来帮助`webpack`进行处理`.vue`文件的，所以呢这个时候你可以在你的命令行里去安装`vue-loader`：

##### 注意：
这里需要注意下`xue-loader`查阅文档发现v15版的vue-loader配置需要加个VueLoaderPlugin对象，具体请看`lesson_1`示例中的配置。

```
C:\Users\nickname\Desktop\lesson>npm install vue-loader -D
```

然后在`webpack`里配置`vue-loader`：

```
module: {
	rules: [
		{
			test: /\.jpg$/,
			use: {
				loader: 'file-loader'
			}
		},
		{
			test: /\.vue$/,
			use: {
				loader: 'vue-loader'
			}
		}
	]
}
```

这样的话当你在`index.js`去引入一个`.vue`的组件的时候`webpack`也能够正确的帮你引入，所以大家只要看到你引入的模块结尾不是`.js`这个时候第一点你要想到使用`loader`了，那理解到这个程度我相信大家对这个`loader`的概念的理解就比较清晰了。

好这节课反复的强调`loader`这个概念希望大家能够掌握，那后面的课程呢我们会通过静态资源打包反复给大家强调`loader`这个概念。

