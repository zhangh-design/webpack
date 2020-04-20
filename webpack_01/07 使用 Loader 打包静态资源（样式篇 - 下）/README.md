07 使用 Loader 打包静态资源（样式篇 - 下）

> 前言：同学们大家好，这个节课我再来给大家补充讲解一点关于样式打包的内容。

我们首先打开之前的代码，找到`webpack.config.js`这个文件，首先呢我来给大家讲一讲`css-loader`里面常用的一些配置项。

### `css-loader`里一些常用的配置项

#### importLoaders

首先我如果说我要给`css-loader`增加配置项，那我们这里就不要写一个字符串了

webpack.config.js

```
{
    test: /\.scss$/,
    use: [
      "style-loader",
      // "css-loader", 这里不要写一个配置项了
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2
        }
      }
      "sass-loader",
      "postcss-loader" // 新版 postcss-loader 要放在 sass-loader 之前
    ]
}
```

取而代之我们写一个对象，对象里面有一个`loader`我们写上`css-loader`，然后我们去写`options`写一个对象，`options`里面呢我们去配置一个属性叫做`importLoaders:2`我们可以配置一个`2`，好在很多这个脚手架工具里啊大家都可以看到`importLoaders`这样的一个配置参数。

##### importLoaders 是什么意思呢

我来给大家讲一下，假设啊我们写了一个`index.scss`这样的文件，在这里面呢我们又去引入了一个额外的scss文件，比如在这里我在`src`目录下在写一个`avatar.scss`文件，这里面呢我在去写一些类似的样式：

avatar.scss

```
body{
    .abc{
        background-color: red;
    }
}
```

我随便写了一段`scss`的语法，然后我们在`index.scss`里面去引入这个当前目录下的`avatar.scss`：

index.scss

```
@import './avatar.scss';
body {
	.avatar {
		width: 150px;
		height: 150px;
		/*用于测试自动添加厂商前缀 postcss-loader和autoprefixer*/
		/*它的意思是我要把我的 avatar 标签偏移100px*/
		transform: translate(100px, 100px);
		display: flex;
	}
}
```

好那么我们来看`index.js`在这里它引入了`index.scss`这个文件，在js里面我们直接引入了`index.scss`这个文件那么`webpack`打包的时候对于js里面引入的`scss`文件它会怎么打包呢？它会依次调用`postcss-loader`->`sass-loader`->`css-loader`->`style-loader`，但是它打包`index.scss`这个文件的时候这里面又通过`@import './avatar.scss';`额外引入了一个scss文件，好当出现这种情况的时候也就是在`@import`语法里面在去引入其它的scss文件的时候，那么这个时候呢
有可能啊你的这块的引入在打包的时候就不会去走下面的`postcss-loader`和`sass-loader`了而是直接就去走`css-loader`了，那么如果我希望在`index.scss`里面引入的这个`avatar.scss`文件依然也去走这个`postcss-loader`和`sass-loader`，那怎么办呢？那在`css-loader`里面你写了一个`importLoaders: 2`意思就是你通过`@import`引入的这样的scss文件在引入之前呢也要去走两个`loader`也就是`postcss-loader`和`sass-loader`，这样的话这种语法就会保证无论
你是在js文件里面直接去`import`引入一个scss这样的文件还是在scss文件里面再去引入其它的scss文件都会依次重新从下到上执行所有的`loader`，这样就不会又任何的问题了。




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

---

### postcss-import

除了设置 css-loader 的importLoaders，如果使用 PostCSS 则可以使用它的插件：postcss-import 同样可以处理@import引入的 CSS 代码。

我们在`index.scss`文件中如果在引入通过`@import`的语法引入一个其它的`avatar.scss`文件，那么引入的`avatar.scss`文件中如果又`css3`语法的代码，那么`autoprefixer`这个自动添加厂商前缀的插件讲不会生效，也就是在`avatar.scss`打包时不会自动添加厂商前缀，那这个问题怎么该怎么解决呢？

我们可以引入另外一个`postcss-loader`的插件叫做`postcss-import`。

我们先安装这个插件：

```
C:\Users\nickname\Desktop\lesson_1>cnpm install postcss-import -D
```

好，然后在`postcss.config.js`文件中配置`postcss-import`：

postcss.config.js

```
module.exports = {
  plugins: [
    require('postcss-import'),
  	require('autoprefixer')
  ]
}
```

这样我们在重新打包：

```
C:\Users\nickname\Desktop\lesson_1>npm run bundle
```

好，我们在查看下页面：


```
<style>@charset "UTF-8";
body .abc {
  background-color: red;
  display: -webkit-flex;
  display: flex; }

body .avatar {
  width: 150px;
  height: 150px;
  /*用于测试自动添加厂商前缀 postcss-loader和autoprefixer*/
  /*它的意思是我要把我的 avatar 标签偏移100px*/
  -webkit-transform: translate(100px, 100px);
  transform: translate(100px, 100px);
  display: -webkit-flex;
  display: flex; }
</style>
```

这样我在`index.scss`文件中引入的`avatar.scss`中的`display: flex;`在打包后就自动添加了厂商前缀。

---

#### css打包的模块化 modules

好，接下来呢我们在给大家讲一下`css`打包的模块化，好这个模块化呢和之前说的模块化不太一样，我呢通过例子来给大家讲解。


好，然后我们来看我们的代码，`index.js`里面去引入了一个图片，然后呢引入了一个scss文件的样式，然后呢我们创建了一张图片把这张图呢挂载到了页面上，这张图片的img节点上有个`avatar`的`class`类名可以让它的宽和高都变成150，现在时这样的一个效果。

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

下面呢我再来创建一个js文件，这个js文件名字叫做`createAvatar.js`:

createAvatar.js

```
// file-loader
import avatar from './avatar.jpg'

function createAvatar(){
    var img = new Image(); // 插件一个 image标签
    img.src = avatar; // 让它的src属性赋值为avatar
    img.classList.add('avatar');

    var root = document.getElementById('root');
    root.append(img);
}

export default createAvatar
```

好，接着我们在`index.js`里面去引入这个`createAvatar.js`这个文件：

index.js

```
// file-loader
import avatar from './avatar.jpg'
// css文件
// 这样引入会作用于 index.js 种的 img 标签和 createAvatar.js 种的 img 标签
import './index.scss'
// js
import createAvatar from './createAvatar.js'

createAvatar(); // 执行一次

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('root');
root.append(img);

```

这个时候大家想页面上应该展示出几张图片啊，是不是`createAvatar()`这个函数生成了一张图片，然后下面的代码又生成了一张图片啊，重新打包我们来看一下：


```
C:\Users\nickname\Desktop\lesson_2>npm run bundle
```

接着我们在浏览器上打开`dist`目录下的`index.html`来看一下，大家可以看到页面上有两张图片，并且这两个图片的样式都是一样的。

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa2FaUT8*WuUG0vAc3MtoV3DvQ2EeVhy1gAYeEsLdhMQFuFNbcw0SdR1rQOrKtDC8iNx6RkSTP8vG3L1Y5IMLV5o!/b&bo=VQW2AgAAAAARB9Q!&rf=viewer_4&t=5)


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

好，回到代码里面我想说明一个什么样的问题呢，大家可以看到如果你通过这种形式直接引入`css`文件的话或者`scss`文件的话，你引入的这个`css`文件会作用于
我当前这个文件里面的这个`img`标签，还会作用于另外一个`createAvatar.js`这个文件里的`img`标签。

也就是什么呢，你在`index.js`中引入了scss这样的一个样式修饰文件，实际上它会影响到另外一个文件创建出的这个图片的样式，所以现在我们直接在`index.js`中用`import`去引入`index.scss`文件相当于你的样式是全局的。

那这么去写代码呢，其实很多时候会产生问题，你一不小心改这个文件的样式的时候把另外一个文件里的样式也给改了，很容易出现样式冲突的问题。

那为了解决这个问题，我们就引入了一个概念：css `modules`的概念，也就是模块化的css。

这个模块化的css是什么意思呢？指的是这个css只在这个模块里有效那想实现这样的功能我们该怎么办？

首先我们打开`webpack.config.js`在`css-loader`的配置项里面我们在加一个配置叫做`modules: true`意思就是我开启css的模块化打包。


```
{
    test: /\.scss$/,
    use: [
      "style-loader",
      // "css-loader",
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
          modules: true
        }
      },
      "sass-loader",
      "postcss-loader"
    ]
}
```

好这块我改成`true`之后我的代码也要做变更，之前我在`index.js`中直接引入`import './index.css'`相当于全局引入，现在我改成这么写：

index.js

```
// file-loader
import avatar from './avatar.jpg'
// css文件
// import './index.scss'
import style from './index.scss'  // 这里修改了写法
// js
import createAvatar from './createAvatar.js'

createAvatar();

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
// img.classList.add('avatar');
img.classList.add(style.avatar);  // 这里修改了写法

var root = document.getElementById('root');
root.append(img);

```

重新打包：

```
C:\Users\nickname\Desktop\lesson_2>npm run bundle
```

然后在浏览器上打开`dist`目录中的`index.html`，大家仔细来看啊有一个图片是不是它的样式已经变了呀，大家可以看到：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMay96U*XhNowLkjS*SS2E.f98coVGKNtLYcnxOkw6V3rRXHipmdS0lTZD7JMexHcCmukjLCUmrsXAl*XQffg*y6w!/b&bo=VgWPAgAAAAARB.4!&rf=viewer_4&t=5)

```
body ._17cnVz87yzSOO5TpFdnLsk {
    width: 150px;
    height: 150px;
    -webkit-transform: translate(100px, 100px);
    transform: translate(100px, 100px);
    display: -webkit-flex;
    display: flex;
}
```

这个图片宽高150，然后呢有偏移，但是上面那张大的图片它是没有任何样式修饰的，好，这就是上面意思呢？我的这个样式在`index.js`引入之后我去对我这个页面或者说这个文件里的`img`标签增加这个样式的时候不是增加`.avatar`这个东西
而是增加`style.avatar`，这样的话就可以保证只有这个`index.js`文件里的`img`标签才会有对应的我们说的`scss`文件里的这个样式修饰，而`createAvatar.js`
不会受到丝毫的影响。

那如果说这个时候你想让`createAvatar.js`这个文件里的`img`标签也有对应的样式你该怎么做？你需要在`createAvatar.js`这个文件里也去引入`style`这个样式
然后`classList.add(style.avatar)`这样才可以。

createAvatar.js

```
// file-loader
import avatar from './avatar.jpg'
import style from './index.scss'

function createAvatar(){
    var img = new Image(); // 插件一个 image标签
    img.src = avatar; // 让它的src属性赋值为avatar
    // img.classList.add('avatar');
    img.classList.add(style.avatar);

    var root = document.getElementById('root');
    root.append(img);
}

export default createAvatar

```

然后我们重新打包：

```
C:\Users\nickname\Desktop\lesson_2>npm run bundle
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMawpYNjOwr0zaiPBk8Dn6Lz40sGpft0J*pbSuMP8AWNwueAs0Jqr1maF5TT9QFELsfmlnrJd8CchCfk8ZsGU.dTQ!/b&bo=CgQBAgAAAAARBz0!&rf=viewer_4&t=5)

到页面上我们在看看`index.html`，大家可以看到这个时候两个js文件里的`img`标签又同时有了样式，这就是`css modules`的概念，那当我们配置了`css-loader`的`modules: true`的这个属性之后，那么我们在代码里面就可以写这种语法了：

```
import style from './index.scss'

img.classList.add(style.avatar);
```

这种语法带来的好处就是，我这个文件或者说我这个模块里的样式和其它文件模块里的样式不会有任何的耦合和冲突，这样的话我们写样式的时候就非常的独立可以避免很多问题，这也是我个人去写一些项目的时候经常用到的一个`webpack`打包
的特性。


---

### webpack 打包字体文件

好我们再来讲解最后一块额外的知识点，就是如何使用`webpack`打包字体文件。

我们清理下`src`目录：

lesson_3

```
dist
src
 |--font
    |--iconfont.eot
    |--iconfont.svg
    |--iconfont.ttf
    |--iconfont.woff
 |--index.js
 |--index.scss
.browserslistrc
index.html
package.json
postcss.config.js
webpack.config.js
```

那么呢我现在想实现的功能是，我首先在`index.js`里写一段代码：

index.js

```
var root = document.getElementById('root');

root.innerHTML='<div class="test">abc</div>';

```

我们打包：

```
C:\Users\nickname\Desktop\lesson_3>npm run bundle
```

打包完成之后呢，我们在浏览器上打开`dist`目录下的`index.html`看看效果，这里呢，页面上就显示一个`abc`的字符串，那我希望这个`abc`它能够显示出一种字体，这个字体呢是一个第三方的字体，我们可以怎么做呢？

我们可以借助[`icon-font`](https://www.iconfont.cn/)来给大家做显示。

index.js

```
var root = document.getElementById('root');
// 这里注意我们不是模块化的，所以 css-loader 里配置的 modules: true 要去掉
import './index.scss'

// 使用iconfont字体 class类中的 iconfont 是估计的名称 后面的 icon-changjingguanli 是图标在index.scss文件中的名称
root.innerHTML='<div class="iconfont icon-changjingguanli">abc</div>';

```

我们代码现在非常简单，引入了一个`index.scss`文件，然后呢创建了一个`div`标签，然后呢，`index.scss`文件里我们定义了样式（这个样式就是一个字体库），然后呢我们把提供的样式在应用到我们的`innerHTML`渲染的这个DOM节点上，好像是没有任何的问题，`webpack`我们现在只引入了`index.scss`这个文件，在`webpack.config.js`里面我们也配置了如何打包scss文件的一个流程，那好像是可以正确打包对不对，但是我们打包一下试一下：


```
C:\Users\nickname\Desktop\lesson_3>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_3
> webpack


C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 17b7c98da573e01cbd56
Version: webpack 4.41.6
Time: 2322ms
Built at: 2020-02-15 21:26:29
    Asset    Size  Chunks             Chunk Names
bundle.js  25 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js?!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js!./src/index.scss] ./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss 3.69 KiB {main} [built]
[./src/font/iconfont.eot?t=1543245201565] 281 bytes {main} [built] [failed] [1 error]
[./src/font/iconfont.svg?t=1543245201565] 387 bytes {main} [built] [failed] [1 error]
[./src/font/iconfont.ttf?t=1543245201565] 284 bytes {main} [built] [failed] [1 error]
[./src/index.js] 374 bytes {main} [built]
[./src/index.scss] 735 bytes {main} [built]
    + 3 hidden modules

ERROR in ./src/font/iconfont.ttf?t=1543245201565 1:0
Module parse failed: Unexpected character ' ' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
(Source code omitted for this binary file)
 @ ./src/index.scss (./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss) 5:36-82
 @ ./src/index.scss
 @ ./src/index.js

ERROR in ./src/font/iconfont.eot?t=1543245201565 1:0
Module parse failed: Unexpected character '�' (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
(Source code omitted for this binary file)
 @ ./src/index.scss (./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss) 4:36-82
 @ ./src/index.scss
 @ ./src/index.js

ERROR in ./src/font/iconfont.svg?t=1543245201565 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
> <?xml version="1.0" standalone="no"?>
| <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
| <!--
 @ ./src/index.scss (./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss) 6:36-82
 @ ./src/index.scss
 @ ./src/index.js
```

你会发现它报错了，它报上面错呢？它说字体文件我该怎么打包，这是怎么回事呢？我们来看。

首先`webpack`会去打包`index.scss`这个文件，大家看你在`index.scss`这个文件里面又去引入了`.eot`这样结尾的字体文件，那么这个字体文件在打包的过程中`webpack`并不知道该怎么去打包，所以针对这种字体文件我们也要在`webpack`的配置文件里面告诉它怎么打包，实际上我们怎么配就可以了呢：

我们这样来写，在增加一个`webpack`打包的规则：

只不过这个时候我要处理的文件后缀是什么呀，后缀是`eot`、`ttf`和`svg`，那我们用什么打包就可以了呢，我们用`file-loader`打包就可以了，实际上当我们打包这种文件的时候，其实我们只需要借助`file-loader`把这些文件从`src`目录下移到`dist`目录下就可以了。

webpack.config.js

```
{
    test: /\.(woff|eot|ttf|otf|svg)$/,
    loader: 'file-loader',
    options: {
      name: 'fonts/[name].[hash:7].[ext]'
    }
}
```

重新打包：

```
C:\Users\nickname\Desktop\lesson_3>npm run bundle

> webpack-demo@1.0.0 bundle C:\Users\nickname\Desktop\lesson_3
> webpack


C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
Hash: 3d7dfbf9fc201b54a0a7
Version: webpack 4.41.6
Time: 1472ms
Built at: 2020-02-15 21:41:46
                     Asset      Size  Chunks             Chunk Names
                 bundle.js  24.7 KiB    main  [emitted]  main
fonts/iconfont.15896c7.eot  2.14 KiB          [emitted]
fonts/iconfont.a1f61df.ttf  1.98 KiB          [emitted]
fonts/iconfont.cc88877.svg  1.62 KiB          [emitted]
Entrypoint main = bundle.js
[./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js?!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src/index.js!./src/index.scss] ./node_modules/_css-loader@3.4.2@css-loader/dist/cjs.js??ref--5-1!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src!./src/index.scss 3.69 KiB {main} [built]
[./src/font/iconfont.eot?t=1543245201565] 70 bytes {main} [built]
[./src/font/iconfont.svg?t=1543245201565] 70 bytes {main} [built]
[./src/font/iconfont.ttf?t=1543245201565] 70 bytes {main} [built]
[./src/index.js] 374 bytes {main} [built]
[./src/index.scss] 735 bytes {main} [built]
    + 3 hidden modules
```

这个时候呢打包已经成功了，我们回到页面上来看一下啊，我们打开`dist`目录下的`index.html`文件，大家可以看到我们在页面上写的这个字体对应的字体内容是不是就展示出来了呀。

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMayQSe4n3KnH98Oqk3F1zAsF8KHnZuAtovGx0LOhFAhMTzuCHJu8A8jPnS7zqGTy4dnmNIiqn3v7ZEqrPruQc4Z4!/b&bo=SQJ4AAAAAAARBwM!&rf=viewer_4&t=5)


---

#### 结语：

其实这块我主要要给大家讲的内容就是如何通过`webpack`打包字体文件让我们在我们的项目当中能够应用我们引入的第三方字体，好，大家回去一定要反复练习这两节课里面的内容，尝试去打包`css`文件，`scss`文件和字体文件，还要去尝试我们说`webpack`里面的`modules`css模块化打包包括去理解`importLoaders`这样的概念。

好最后讲解完这块样式的打包之后呢，我还是要给大家留一个任务，大家打开`webpack`的官网，进入到`GUIDES`（[指南](https://www.webpackjs.com/guides/)），那讲解完这节课的内容呢，大家已经自己可以去看`asset-management`（[管理资源](https://www.webpackjs.com/guides/asset-management/)）这部分的内容了我们点开你会发现这里它也去详细的讲解了css文件、图片文件、字体文件的打包形式，那课程里我也给大家讲了，这里面呢它还额外的介绍了一些`data`数据文件的打包方法比如说：csv这种excel的文件如何把这种文件的内容打包到js文件里面那你可以在`Loading Data`（[加载数据](https://www.webpackjs.com/guides/asset-management/#%E5%8A%A0%E8%BD%BD%E6%95%B0%E6%8D%AE)）这块看到它的解决方案，包括这里面它还讲解了一些`webpack`打包带来的好处和一些使用的技巧，那我建议大家呢把这块的内容全部阅读一遍，我相信有了之前两节课的基础之后呢阅读这块的内容将会变的非常简单。

接下来大家还要看两个内容：

打开我们的`LOADERS`，在这里我希望大家呢仔细的去把`sass-loader`和`css-loader`还有`style-loader`还有`postcss-loader`上课我们讲的这些关于样式打包的这些`loader`呢其实在这里都有，它里面呢又有非常多的配置项，我建议大家把`loader`这块的内容也都自己过一遍，这样的话呢基本上你关于样式打包这块的这些`loader`们呢也都能了解清楚了。、
