13 html-webpack-externals-plugin 加载远程CDN资源上的js文件动态注入 index.html

在项目开发中我们需要把一些第三方依赖库（axios jquery）分离出最终的 bundle 文件，从而减小打包文件的体积，分离出去的第三方依赖库我们在通过 `html-webpack-externals-plugin` 设置 cdn 地址来载入。

`html-webpack-externals-plugin`中配置的模块会自动在 webpack 打包构建时被分离出去，效果其实和设置 webpack.externals 是一样的，比如下面的配置 webpack 在打包时就会把 `jquery`和`axios`分离出去。

然后我们还可以结合`webpack.externals`设置一个别名。

`webpack.externals` 配置也会把指定的第三方依赖库分离出去，但是还是需要通过 html-webpack-externals-plugin 在外部scripts标签的形式进行文件的加载，才能在代码中使用`import axios from 'axios'` 否则 axios 就是 undefined。


webpack配置

```
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  externals: {
    jq: 'jQuery' // 设置别名
  },
  plugins: [
      new HtmlWebpackPlugin({
          title: "hello",
          filename: path.resolve(__dirname, '../dist/index.html'),
          template: path.resolve(__dirname, '../public/index.html'),
          favicon: path.resolve(__dirname, '../public/favicon.ico'),
          hash: false, // 清除缓存
          inject: true // 默认 true，将脚本注入到body元素的底部
      }),
      // HtmlWebpackExternalsPlugin 一定要放在 HtmlWebpackPlugin 的下面，否则 远程加载的 第三方模块无法加入到 index.html 中
      new HtmlWebpackExternalsPlugin({
        externals: [
            {
              module: 'jquery',
              entry: 'https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js',
              global: 'jQuery'
            },
            {
              module: 'axios',
              entry: 'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
              global: 'axios'
            }
        ]
    })
  ]

}

```

index.js

```
import axios from 'axios'
import $ from 'jquery'
import $1 from 'jq' // 这是起的别名 jq

console.info(axios, $('#app'), $1('#app'));

```
