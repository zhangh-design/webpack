10 文件指纹策略：chunkhash、contenthash和hash

> 前言：这一节的话我们来一起学习一下 文件指纹的一个内容。 

### 文件指纹介绍

首先的话&#8194;<font color=#DC143C size=2>文件指纹它是一个什么含义呢</font>&#8194;，其实如果大家访问网站的时候如果比较留意细心去看的话会发现各大的网站它的打包出来的文件一般都会有一个后缀，那这个后缀其实就是我们通常所说的文件指纹。

什么是文件指纹？

打包后输出的文件名的后缀。

```
<script crossorigin="anonymous" src="//11.url.cn/now/lib/4/lib.js?_bid=152"></script>
<script crossorigin="anonymous" src="//11.url.cn/now/lib/4/react-with-addons.min.js?_bid=152"></script>
<script crossorigin="anonymous" src="//11.url.cn/now//index_51727db.js?_bid=152"></script>
```

这里面其实我们看上面的链接，其实可以从这里面的链接可以看到这里面的文件js资源的话呢它是叫`index_51727db.js`这个`index_`后面的7位字符其实就是我们的文件指纹。

那么这个文件指纹它有什么好处呢，这个通常文件指纹它是用来做一些<font color=#DC143C size=2>版本的管理</font>，比如说：我们每次一个项目要发布的时候有些文件修改了这个时候其实你只要把这个修改的文件发布上去没有修改的这种文件其实它并不是需要修改它的文件指纹的，所以文件指纹的话呢通常可以用来做一个版本管理。

那另外的话呢我们设置了这个文件指纹之后呢，就是对于没有修改的这些文件它其实还是可以持续的用浏览器本地的一些缓存，这样的话可以加速我们页面的一个访问速度。

那么接下来其实我们来看一下这个常见的文件指纹有哪几种：

1. Hash：和整个项目的构建有关，只需要项目文件有修改，整个项目构建的`hash`值就会更改。
2. Chunkhash：和&#8194;webpack&#8194;打包的&#8194;chunk&#8194;有关，不同的&#8194;entry&#8194;会生成不同的&#8194;chunkhash&#8194;值（<font color=#DC143C size=2>注意</font>：webpack的Chunkhash的话是没办法在热更新一起使用的，就是没办法和这个`HotModuleReplacementPlugin`这个插件一起使用的，热更新时并没有`dist`打包文件产生）。
3. Contenthash：根据文件内容来定义&#8194;hash&#8194;，文件内容不变，则&#8194;contenthash&#8194;不变。

**那这个`Hash`的话呢**，其实它是和整个项目的一个构建相关，在`webpack`里面的话呢是有`compile`和`compilation`就是打包阶段是有`compile`和`compilation`，`compile`的话呢是`webpack`启动的那一次它会创建一个`compile`对象，但是这个`compilation`的话呢是每次只要有文件发生了变化那它这个时候呢`compilation`这个对象是会变化的，这个时候呢每次只要有文件变化那这个时候它的一个`hash`其实是受到这个`compilation`的一个影响，`compilation`发生变化那我们这个`hash`值也会发生变化，每一次只要你有一个文件，比如说：两个页面你修改了a页面的js那么这个打包之后b页面的js其实也会发生变化，这个其实是没有必要的因为a页面变化其实并没有必要去影响b页面的变化，这里面其实就是有一个`Chunkhash`的一个概念。

**Chunkhash呢他是一个什么含义呢？**`Chunkhash`它是和`webpack`打包的这个`Chunk`相关，这个`webpack`打包的`Chunk`，`Chunk`其实通常就是指的是我们的模块，那不同的`entry`其实它会生成不同的`Chunk`然后对于不同的`entry`的这种入口其实我们都只需要它们的`Chunk`保持独立就可以了，这样的话呢我们使用的这个`Chunkhash`每个页面它们有一个文件发生了变化并不会影响其它的页面，因此的话呢其实我们一般对于这种js文件的指纹我们一般也是产用`Chunkhash`。

**`Contenthash`这个其实可以这么理解**：某一个页面它既有js资源也有css资源如果我们的css资源它也使用这个`Chunkhash`的话呢，这个时候会有一个问题，就是我们修改了js文件但是css并没有变那这个由于我们的css它也使用了这个`Chunkhash`就会导致这个css内容没有变化但是发布上去的这个文件也发生了变化，因此的话对于这种css其实通常我们是采用这个根据内容进行文件指纹的一个生成，一般像这种css文件的话我们通常是产用这个`Contenthash`。


### `hash`要怎么去用

好接下来我们来看下在`webpack`里面这几种`hash`要怎么去用。

首先的话呢我们来看一下js文件指纹的一个设置，看下面的`webpack.config.js`配置文件的设置，然后这个其实可以看到对于js的话呢我们其实只需要设置输出的这个`output`就可以了，设置输出的`output`的`filename`然后对于js我们使用这个`Chunkhash`。


#### js的文件指纹设置：

设置`output`的`filename`，使用`[Chunkhash]`

```
module.exports = {
  entry: {
    app: "./src/app.js",
    search: "./src/search.js"
  },
  output: {
    filename: "[name][chunkhash:8].js",
    path: path.resolve(__dirname, "dist")
  }
}
```

#### CSS 的文件指纹设置：

然后对于这个`css文件`的话呢我们其实是使用这个`Contenthash`，css这个文件一般的话其实正常情况下呢我们是如果是使用了这个`style-loader`和`css-loader`的话，那么这个css会由这个`style-loader`将这个css插入到页面头部的`style`标签里面并且放到`head`头部，这个时候其实并没有一个独立的css文件，因此的话呢通常我们会产用一个`MiniCssExtractPlugin`通过这个插件把这个`style-loader`里面这种css把它提取出来提取成一个独立的文件，因此的话呢对于css的这个文件指纹其实我们也是设置在这个`MiniCssExtractPlugin`里面，给它设置一个`filename`并且使用这个`Contenthash`。


设置`MiniCssExtractPlugin`的`filename`，使用`[contenthash]`：

```
module.exports = {
  entry: {
    app: "./src/app.js",
    search: "./src/search.js"
  },
  output: {
    filename: "[name][chunkhash:8].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new MiniCssExtractPlugin({
        filename: `[name][contenthash:8].css`
    })
  ]
}
```

#### 图片的文件指纹设置

那这个图片或者是其它这些字体的文件指纹的一些设置，那这个时候呢其实我们是产用了设置在这个`file-loader`里面或者是`url-loader`里面然后给它传递一个参数，就是传递一个`options`参数这里面其实我们是使用了这个`hash`，这里面的这个`hash`和前面我们js里面提到的这个`hash`其实是不太一样的，对于这种图片和字体的这种`hahsh`呢和前面代码里面就是`js`和`css`使用的这个`hash`含义是不一样的，这里面的`hash`其实也是指这种文件内容的一个`hash`，然后也是这种文件内容的`hash`也是采用`md5`生成的。

通常的话呢我们一般将这个打包之后的图片一般会放到一个独立的`image`文件夹里面，然后这里面的话呢我们是采用的这个`[hash]`占位符，`[hash]`占位符后面如果我们加一个冒号8`[hash:8]`的话就代表我们取这个`hash`这个串的前8位，`md5`的这个`hash`呢是默认是有32位的其实我们就取前8位，然后这里面其实还有一些其它的占位符，比如下面表格列出的：


设置`file-loader`的`name`，使用`[hash]`。


占位符名称 | 含义
---|---
[ext] | 资源后缀名
[name] | 文件名称
[path] | 文件的相对路径
[folder] | 文件所在的文件夹
[contenthash] | 文件的内容 hash，默认是 md5 生成
[hash] | 文件内容的 hash，默认是 md5 生成
[emoji] | 一个随机的指代文件内容的 emoji

webpakc.config.js

```
const path = require('path');

module.exports = {
  mode: 'development',
  // entry: './src/index.js',
  entry: {
    main: './src/index.js',
    sub: './src/index.js'
  },
  output: {
    publicPath: 'http://cdn.com.cn/',
    filename: '[name].js',
    // path 不写其实也可以，默认就会打包到 dist 目录
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:8].[ext]',
            outputPath: 'images/',
            // 字节
            limit: 10240
          }
        }
      },
      {
        test: /\.(woff|eot|ttf|otf|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[hash:8].[ext]',
          // outputPath: 'fonts/'
        }
      }
    ]
  }
};

```

#### 示例

然后接下来的话我们一起来看一下直接的例子来演示一下这个`js`、`css`和`图片`和`字体`等等这些文件指纹要怎么样去设置：

##### js文件指纹

首先的话呢我们增加这个js的文件指纹。

js的文件指纹是直接修改这个`output`的`filename`，给它加一个`chunkhash`我们设置一个8位的一个文件指纹的长度，这个其实就是js文件指纹的设置。

```
output: {
    filename: "[name]-[chunkhash:8].js",
    path: path.resolve(__dirname, "dist")
}
```

##### 字体和图片的文件指纹

然后接下来的话我们增加一个字体和图片的一个文件指纹。

我们使用的是`[name]`这个占位符然后增加一个图片的8位长度的`[hash:8]`，这样的话其实图片的文件指纹就加好了。

因为字体和图片的打包方法都是一样的使用`file-loader`或者`url-loader`。

```
{
    test: /\.(woff|eot|ttf|otf|svg)$/,
    loader: 'file-loader',
    options: {
      name: 'fonts/[name]-[hash:8].[ext]'
    }
},
{
    test: /\.(png|gif|jpg|jpeg)$/,
    loader: 'file-loader',
    options: {
      name: 'images/[name]-[hash:8].[ext]'
    }
}
```

#### css 的文件指纹

接下来的话我们来设置`css`的文件指纹。

由于这个css目前的话其实它是并没有把它提取成一个独立的一个css文件，所以接下来的话所以目前我们是没有办法看到这个css文件的效果，所以接下来我们首先是需要把这个css提取成一个独立的文件，也就是使用这个`MiniCssExtractPlugin`使用这个插件完成了之后呢接下来我们在这个插件给这个插件设置一个`css`的文件指纹。

```
F:\github-vue\workspaces\lesson>cnpm i mini-css-extract-plugin -D
```

好安装好了这个插件之后呢，接下来我们在这个配置里面把这个插件加进去：

首先的话呢我们把这个插件添加到`plugins`的这个数组里面去，然后给它传递一个`filename`，给这个`filename`设置一个文件指纹：`[name]-[contenthash:8].css`，<font color=#DC143C size=2>文件指纹我们采用的是这个`contenthash`后缀的话就是`.css`不用`[ext]`因为打包后的样式文件后缀必须是`.css`</font>。

接下来的话我们还需要把这个`mini-css-extract-plugin`插件的`loader`也加进去，那这里面值得注意的一点是这个插件的话呢是把`css`提取成一个独立的一个文件，这个插件它的`loader`是没办法和`style-loader`一起使用的，因为它们之间的功能时互斥的：

- `style-loader`是把这个样式插入到`head`里面去。
- 而`mini-css-extract-plugin`这个插件是把样式提取出来。

所以它们之间是有一些冲突，所以说的话呢：如果你想把`css`提取出一个独立的css文件那这个时候我们其实首先是要把这个`style-loader`删除掉，那删掉了之后呢在是使用这个插件的`loader`就可以了。

webpack.config.js

```
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
    module: {
        rules: [
          {
            test: /\.scss$/,
            use: [
               MiniCssExtractPlugin.loader,
              // 'style-loader', 不能使用 style-loader
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2
                  // modules: true
                }
              },
              'sass-loader',
              'postcss-loader'
            ]
          }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'css/[name]-[contenthash:8].css'
        })
    ]
}
```

重新打包：

```
F:\github-vue\workspaces\lesson>npm run bundle

> webpack-demo@1.0.0 bundle F:\github-vue\workspaces\lesson
> webpack


F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: removed dist
Hash: 6b49c7d6fa99fc1d212f
Version: webpack 4.41.6
Time: 1287ms
Built at: 2020-02-19 10:56:49
                      Asset       Size  Chunks                         Chunk Nam
es
========= 这里面可以看到 css的文件指纹呢也已经出来了 ===========
      css/main-93e01216.css   2.62 KiB    main  [emitted] [immutable]  main
       css/sub-93e01216.css   2.62 KiB     sub  [emitted] [immutable]  sub
======== 字体和图片的文件指纹 ==========
fonts/iconfont.15896c71.eot   2.14 KiB          [emitted]
fonts/iconfont.9c99b42a.svg   1.65 KiB          [emitted]
fonts/iconfont.a1f61df5.ttf   1.98 KiB          [emitted]
   images/icon-5ab8c546.jpg   12.6 KiB          [emitted]
                 index.html  450 bytes          [emitted]
======== js文件的文件指纹 =========
           main-012f2678.js   5.43 KiB    main  [emitted] [immutable]  main
            sub-715d0856.js   5.43 KiB     sub  [emitted] [immutable]  sub
```


使用文件指纹打包后的`lesson`目录：

lesson

```
dist
 |--css
     |--main-93e01216.css
     |--sub-93e01216.css
 |--fonts
     |--iconfont.9c99b42a.svg
     |--iconfont.15896c71.eot
     |--iconfont.a1f61df5.ttf
 |--images
     |--icon-5ab8c546.jpg
 |--index.html
 |--main-012f2678.js
 |--sub-715d0856.js
src
 |--font
     |--iconfont.eot
     |--iconfont.svg
     |--iconfont.ttf
     |--iconfont.woff
 |--icon.jpg
 |--index.js
 |--index.scss
.browserslistrc
index.html
package.json
postcss.config.js
webpack.config.js
```
