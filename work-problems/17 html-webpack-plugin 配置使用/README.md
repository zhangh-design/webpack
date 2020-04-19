17 html-webpack-plugin 配置使用

[->html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

`html-webpack-plugin`帮助我们输出一个html文件到`dist`目录（webpackDevServer是输出到内存中）。

这里的配置是单页模式，多页情况下请参考[16 多页面打包通用解决方案]

package.json

```
  "scripts": {
    "dev": "webpack-dev-server --progress --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
  },
```

--progress 配置可以把开发模式是`webpackDevServer`的构建进度显示出来。

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*aKEjsZdxGt0ajbaNBMxA2oMv2BdA6woOkNz7c6qQnA0E5sAPOu*tfzmPXh.r*iLTw!!/b&bo=YgLBAAAAAAADB4M!&rf=viewer_4&t=5)

---

webpack.dev.js

开发模式下这些配置也就可以了，开发模式下也不需要去压缩html文件。

```
const path = require('path');

module.exports = {
  mode: 'development',
  plugins: [
    // 以 template 摸板生成指定的html文件
    new HtmlWebpackPlugin({
      title: "标题",
      filename: path.resolve(__dirname, '../dist/index.html'), // 输出文件路径和名字
      template: path.resolve(__dirname, '../public/index.html'), // 模板文件html
      favicon: path.resolve(__dirname, '../public/favicon.ico'), // 将给定的图标图标路径添加到输出HTML
      // 允许注入meta-tags （head中meta参数）
      meta: {
          viewport: 'width=device-width, initial-scale=1.0',
          renderer: 'webkit',
          'X-UA-Compatible': 'IE=edge, chrome=1',
          Keywords: '',
          Description: ''
      },
      inject: true // 默认 true，将脚本注入到body元素的底部
    })
  ]
}
```

`title`对应html页面上要这么去写：

```
<head>
  <meta charset="UTF-8">
  <tile><%= htmlWebpackPlugin.options.title %></tile>
</head>
```

`<%= htmlWebpackPlugin.options.title %>` 不然`title`设置的值无法写进去。


---

webpack.prod.js

生产模式下的配置：

```
const path = require('path');

module.exports = {
  mode: 'production',
  plugins: [
    // 以 template 摸板生成指定的html文件
    new HtmlWebpackPlugin({
      title: "标题",
      filename: path.resolve(__dirname, '../dist/index.html'), // 输出文件路径和名字
      template: path.resolve(__dirname, '../public/index.html'), // 模板文件html
      favicon: path.resolve(__dirname, '../public/favicon.ico'), // 将给定的图标图标路径添加到输出HTML
      // 允许注入meta-tags （head中meta参数）
      meta: {
          viewport: 'width=device-width, initial-scale=1.0',
          renderer: 'webkit',
          'X-UA-Compatible': 'IE=edge, chrome=1',
          Keywords: '',
          Description: ''
      },
      // 添加指定的chunk，多页应用时需要动态指定，单页不用配置（不配置就会引入所有页面的资源）
      // 在配置多个页面时，每个页面注入的thunk应该是不相同的，需要通过该配置为不同页面注入不同的thunk
      // 比如：登录页面`chunks: ['login']`，主页面`chunks: ['main']`
      // chunks: ['app'],
      inject: true, // 默认 true，将脚本注入到body元素的底部
      // 美化 html 文件，去除空格、注释等（ production 时使用）
      minify: {
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 去除空格
        removeAttributeQuotes: true // 移除属性的引号
      },
      // 4.2.0 版本已经移除 'dependency'
      // 允许指定的thunk在插入到html文档前进行排序，旧版本（例如^3.2.0）会配置为 'dependency'
      // 多页面中一般会提取公共部分的chunk，这个时候一个html页面会引入多个chunk，而这些chunk之间是有依赖关系的，即必须按照顺序用script标签引入，chunksSortMode是用来指定这种顺序的排序规则，dependency是指按照依赖关系排序。
      // 旧版配置为 'dependency' 可能会出现 `Cyclic dependency   错误：循环依赖` 的问题，可以升级插件到最新
      // `Cyclic dependency`网上的解决办法设置为`none`但这样页面加载顺序就不能保证了，可能会出现样式被覆盖的现象
      chunksSortMode: 'auto'
    })
  ]
}
```

单页应用的话这样配置就可以。

多页应用需要配置多个`new HtmlWebpackPlugin({})`，没个`HtmlWebpackPlugin`对应的`filename`和`template`都是不同的，`chunks`中也要配置每个页面构建后的 chunk 名称和使用`splitChunks`分割出来的 chunk 文件。

chunksSortMode 属性注意下在 4.2.0 版本已经移除 'dependency'。






