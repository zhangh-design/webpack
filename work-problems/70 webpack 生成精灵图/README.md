70 webpack 生成精灵图

我们在项目开发中无法避免的肯定要使用到一些比较小的图片但是颜色丰富所以无法使用字体图标来代替：

小图标

![image](http://i1.fuimg.com/717460/8bd35f0f89cf99c9.png)

![image](http://i1.fuimg.com/717460/93b979f54fead92d.png)

![image](http://i1.fuimg.com/717460/b35d81ab8a591504.png)

![image](http://i1.fuimg.com/717460/893580c01ea085f3.png)

![image](http://i1.fuimg.com/717460/dddf034bdba096bd.png)

![image](http://i1.fuimg.com/717460/621140f8f95172a2.png)

![image](http://i1.fuimg.com/717460/f44dd7c2abefb690.png)

![image](http://i1.fuimg.com/717460/a6461edecebed1fa.png)

雪碧图

![image](http://i1.fuimg.com/717460/0195bac9774d663e.png)

如果我们不将这些图标合成一张雪碧图的话，那么 index.html 页面上就会有很多的请求去加载这些小图标，当然也许你会说你可以使用 url-loader 把这些小图标都变成 base64 的形式内联到你的 js 中，但是这样真的好吗？

安装的依赖包

```
npm i postcss-loader postcss-sprites -D
```

postcss.config.js

注意：require('cssnano') // 去除空格、注释、智能压缩代码（postcssSprites 会把 css 代码中已经注释的背景图也进行合成，所以要提前把 css

```
const postcssSprites = require('postcss-sprites')

module.exports = {
  plugins: [
    // require('postcss-import'),
    // require('autoprefixer'),
    require('cssnano') // 去除空格、注释、智能压缩代码（postcssSprites 会把 css 代码中已经注释的背景图也进行合成，所以要提前把 css 去除注释）
    // CSS Sprite 雪碧图
    postcssSprites({
      spritePath: './sprites', // 雪碧图合并后存放地址，在通过 image-webpack-loader 压缩图片 和 url-loader 把处理压缩后的图片放到 dist 目录
      filterBy: function (image) {
        // 过滤一些不需要合并的图片，返回值是一个 promise，默认有一个 exist 的 filter
        if (image.url.indexOf('/assets/sprites-img/') === -1) {
          return Promise.reject(new Error())
        }
        return Promise.resolve()
      },
      // 分组
      groupBy: [
        function (image) {
        // background: url(../../assets/sprites-img/login/10.png) no-repeat;
          const regex = /sprites-img\/login/
          const flag = regex.test(image.url)
          return flag
            ? Promise.resolve('login')
            : Promise.reject(new Error(''))
        },
        function (image) {
        // background: url(../../assets/sprites-img/frame/10.png) no-repeat;
          const regex = /sprites-img\/frame/
          const flag = regex.test(image.url)
          return flag
            ? Promise.resolve('frame')
            : Promise.reject(new Error(''))
        }
      ]
    })
  ]
}

```

注意：

#### 1.

我们在项目中最好将需要合并成雪碧图的图片资源放到一个单独文件夹里面，便于我们设置`groupBy`分组。

```
src
 |-assets
   |-img
   |-sprites-img // 要合成雪碧图的图片
     |-login // 对应 分组
     |-frame
     |-a.png
     |-b.png
```

#### 2.

合并后的雪碧图（在`spritePath: './sprites'`这个目录下会新生成合并后的雪碧图）会有点大，所以我们还需要用 `image-webpack-loader` 来对合并后的雪碧图图片进行压缩处理


```
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  module: {
    {
        test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
        // 压缩图片
        loader: 'image-webpack-loader',
        exclude: [resolve('src/assets/sprites-img'),]
        // 通过enforce: 'pre'我们提高了 img-webpack-loader 的优先级，保证在url-loader、file-loader和svg-url-loader之前就完成了图片的优化。
        enforce: 'pre'
      }
  }
}
```

注意：这里我们需要先把 存放合成雪碧图图片的目录（原始图片目录）排除出`image-webpack-loader`，不要让`image-webpack-loader`去处理原始图片，因为这些图片已经很小了没有必要在压缩。

`image-webpack-loader` 处理的是合并后的雪碧图，也就是你在`postcss.config.js`里面配置的`spritePath: './sprites'`经过合并的雪碧图会生成在这个目录，`image-webpack-loader`会在构建打包时自动在压缩处理这个目录的图片。


#### 3.

接下来是 url-loader 的注意点：

- 合并成雪碧图的原始图片目录需要排除 exclude
- 还需要把 `spritePath: './sprites'` 生成的雪碧图目录页排除，因为生成的雪碧图可能小于 `url-loader` 的 `limit` 值，这样还是会被处理成 base64 ，我们也就失去了雪碧图的意义。

##### 解决办法：

这里我们需要配置两个 url-loader 要排除合并生成雪碧图的目录，防止雪碧图小于 url-loader 的 limit 值然后又被转换成 base64 的形式

在配置一个 file-loader 用于加载雪碧图的图片，如果不在多配置一个 file-loader 来加载雪碧图，这样被 url-loader 排除出去的雪碧图会没有 loader 来处理而在构建打包时报错的。

```
{
        test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          esModule: false, // 默认true（设置为 true img中的 src 会是对象 <img src="[object Module]"/>）
          limit: 8 * 1024, // 8kb
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('img/[path][name]-[hash:8].[ext]'),
          publicPath:
            process.env.NODE_ENV === 'production'
              ? config.build.urlLoaderPublicPath
              : config.dev.urlLoaderPublicPath // http://www.baidu.com/
        },
        // 排除合并后的雪碧图目录，防止雪碧图小于 limit 值而被转换成 base64 的形式
        exclude: [resolve('sprites')]
      },
      {
        test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          esModule: false, // 默认true（设置为 true img中的 src 会是对象 <img src="[object Module]"/>）
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('img/[path][name]-[hash:8].[ext]'),
          publicPath:
            process.env.NODE_ENV === 'production'
              ? config.build.urlLoaderPublicPath
              : config.dev.urlLoaderPublicPath // http://www.baidu.com/
        },
        // 合并后的雪碧图使用 file-loader 来处理，防止雪碧图小于 url-loader 的 limit 值然后又被转换成 base64 的形式
        include: [resolve('sprites')]
      }
```

#### 4.

css 的写法:

index.css

代码中我们还是引入单张图片就行了

```
.a{
  background: url(../../assets/sprites-img/1.png) no-repeat;
}
.b{
  background: url(../../assets/sprites-img/2.png) no-repeat;
}
```


