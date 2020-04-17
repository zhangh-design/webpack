58 webpackDevServer.contentBase 访问本地已经有的目录资源怎么配置，开发环境下和 HtmlWebpackPlugin 和 CopyWebpackPlugin 配置怎么使用，两个区别在哪里？

先来看一下 webpack 官网对 contentBase 这个属性的解释：

[->webpackDevServer.contentBase](https://webpack.docschina.org/configuration/dev-server/#devserver-contentbase)

告诉服务器从哪个目录中提供内容。只有在你想要手动提供静态文件时才需要。

项目结构：

```
build
 |-webpack.base.js
 |-webpack.dev.js
 |-webpack.prod.js
dev-assets // 我手动创建的目录，和 public 没有关系
 |-index.html // 摸板文件
 |-img        // 静态资源
   |-1.jpg
node_models
public // html-webpack-puglic 的摸板html文件
 |-favicon.ico
 |-index.html
src
 |-index.js
static // copy-webpack-plugin 拷贝的资源目录
 |-img
   |-BindHotel
     |-addhotel.png
.editorconfig
.gitignore
package.json
```

---

（不使用 html-webpack-plugin 和 copy-webpack-plugin，通过 devServer.contentBase 手动指定目录）

我们先来看一下给 contentBase 配置一个已经有的目录用于提供静态文件（推荐使用一个绝对路径）

dev-assets 目录 index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>测试 devServer.contentBase 配置</title>
</head>
<body>
  <div>测试 devServer.contentBase 配置</div>
  <img src="./img/1.jpg"/>
</body>
</html>

```

webpack 配置

```
module.exports = {
    mode: 'development',
    devServer: {
      // 地址是 项目 根目录的`dev-assets`文件夹
      contentBase: path.resolve(__dirname, '../dev-assets'),
      host: '127.0.0.1',
      port: 8080,
      clientLogLevel: 'warning',
      hot: true,
      hotOnly: true,
      historyApiFallback: {
          rewrites: [
            // 404 页面 跳转到 index.html
            { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
          ]
      }
    },
    plugins: [
        // 以 template 摸板生成指定的html文件
        // 我在 dev-assets 目录手动提供了 html 摸板文件
        /***
        new HtmlWebpackPlugin({
          title: "标题",
          index: path.resolve(__dirname, '../dist/index.html'), // 构建后最终输出的文件地址和名称
          template: path.resolve(__dirname, '../public/index.html'), // 模板文件html
          favicon: path.resolve(__dirname, '../public/favicon.ico'), // 将给定的图标图标路径添加到输出HTML
          meta: {
               viewport: 'width=device-width, initial-scale=1.0',
               renderer: 'webkit'
          },
          inject: true // 默认 true，将脚本注入到body元素的底部
        }),
        // 拷贝静态资源到指定目录
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../static'),
            to: 'static',
            ignore: ['.*'] // 忽略拷贝指定的文件 （忽略所有 jpg 文件：*.jpg）
          }
        ])
        ***/
    ]
}
```

这里我提供了 contentBase 一个本地的文件夹路径，这样的话 `npm run dev` 的时候我们启动的 `webpack-dev-server` 服务就会去从 `dev-assets` 这个文件夹读取静态资源，并访问这个目录下的index.html。

我们访问地址`http://127.0.0.1:8080/index.html`。

注意：

- 如果配置在`dev-assets`目录内提供了html摸板文件，那么就不要在使用`html-webpack-plugin`去生成html文件了，不然这样在启动`webpackDevServer`的服务后读取的会是`html-webpack-plugin`生成的这个html文件（因为启动的是`webpackDevServer`的服务这个html文件会生成在内存中）。


建议：

contentBase 配置的目录只提供静态文件资源比如：img、fonts、media，对于html摸板文件使用`html-webpack-plugin`这个插件来提供。


---

（使用 html-webpack-plugin 和 copy-webpack-plugin和devServer.contentBase: false）

- html-webpack-plugin 动态生成html摸板文件
- copy-webpack-plugin 拷贝静态资源到指定目录
- devServer.contentBase: false 默认当前工作目录也就是 output.path 指定的目录

public/index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <tile><%= htmlWebpackPlugin.options.title %></tile>
</head>
<body>
  <noscript>
    <strong>We're sorry but vue-test doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
  </noscript>
  <div id="app"></div>
  <!-- 这里的地址是通过 copy-webpack-plugin 提供的，默认取当前工作目录 -->
  <img src="./static/img/BindHotel/addhotel.png"/>
</body>
</html>
```


webpack配置

```
module.exports = {
    mode: 'development',
    devServer: {
      // 地址是 项目 根目录的`dev-assets`文件夹
      // contentBase: path.resolve(__dirname, '../dev-assets'),
      contentBase: false, // 因为配置了 CopyWebpackPlugin 会把静态资源提供到指定目录中（output.path），devServer服务就是提供到内存中，所以不用手动指定静态资源目录，设置成 false 也就可以了
      host: '127.0.0.1',
      port: 8080,
      clientLogLevel: 'warning',
      hot: true,
      hotOnly: true,
      historyApiFallback: {
          rewrites: [
            // 404 页面 跳转到 index.html
            { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
          ]
      }
    },
    plugins: [
        // 以 template 摸板生成指定的html文件
        new HtmlWebpackPlugin({
          title: "标题",
          index: path.resolve(__dirname, '../dist/index.html'), // 构建后最终输出的文件地址和名称
          template: path.resolve(__dirname, '../public/index.html'), // 模板文件html
          favicon: path.resolve(__dirname, '../public/favicon.ico'), // 将给定的图标图标路径添加到输出HTML
          meta: {
               viewport: 'width=device-width, initial-scale=1.0',
               renderer: 'webkit'
          },
          inject: true // 默认 true，将脚本注入到body元素的底部
        }),
        // 拷贝静态资源到指定目录
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../static'),
            to: 'static',
            ignore: ['.*'] // 忽略拷贝指定的文件 （忽略所有 jpg 文件：*.jpg）
          }
        ])
    ]
}
```

因为配置了 `CopyWebpackPlugin` 所以我们在配置`devServer.contentBase`就可以设置成false了，让它去当前的工作目录（output.path）中去读取资源文件。

默认 false 的情况下，将使用当前工作目录作为提供内容的目录，将其设置为 false 以禁用 contentBase。





