55 splitChunks设置分割出js文件的chunk名称，对于多页面构建在 HtmlWebpackPlugin 时写入 chunks 配置属性

webpack.prod.js

```
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all', // initial（同步） async（异步） all（同步和异步），推荐 all
      minSize: 30000,
      minChunks: 1, // 模块引入的次数
      maxAsyncRequests: 5, // 异步的按需加载模块最大的并行请求数，通过import()或者require.ensure()方式引入的模块，分离出来的包是异步加载的（一般不用改）
      maxInitialRequests: 3, // 初始加载网页的最大并行数（一般不用改）
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        'split-lodash': {
          test: module => {
            return /lodash/.test(module.context)
          },
          priority: 0,
          filename: utils.assetsPath('vendor/split-lodash.js')
        },
        'split-vue': {
          test: module => {
            return /vue|vuex|vue-router/.test(module.context)
          },
          priority: -10,
          filename: utils.assetsPath('vendor/split-vue.js')
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -20,
          filename: utils.assetsPath('vendor/vendors.js')
        },
        default: false
      }
    }

}
```

`npm run build`打包之后的输出：


```
E:\vue-github\project\webpack\demo>npm run build

> demo@1.0.0 build E:\vue-github\project\webpack\demo
> webpack --config ./build/webpack.prod.js

clean-webpack-plugin: removed dist
Hash: 72a5467314bd6d15e91d
Version: webpack 4.42.1
Time: 1519ms
Built at: 2020-04-16 10:55:23
                            Asset       Size   Chunks                         Chunk Names
                      favicon.ico   4.19 KiB           [emitted]
                       index.html  809 bytes           [emitted]
           static/js/a.d736e50.js   2.65 KiB     1, 3  [emitted] [immutable]  a
       static/js/a.d736e50.js.map  127 bytes     1, 3  [emitted] [dev]        a
         static/js/app.d978faf.js   2.79 KiB  2, 1, 3  [emitted] [immutable]  app
     static/js/app.d978faf.js.map  131 bytes  2, 1, 3  [emitted] [dev]        app
           static/js/b.f097427.js   2.65 KiB     3, 1  [emitted] [immutable]  b
       static/js/b.f097427.js.map  127 bytes     3, 1  [emitted] [dev]        b
        static/js/shop.ab5c743.js   1.34 KiB        4  [emitted] [immutable]  shop
    static/js/shop.ab5c743.js.map  133 bytes        4  [emitted] [dev]        shop
    static/vendor/split-lodash.js   70.7 KiB        0  [emitted]              split-lodash~a~app~b
static/vendor/split-lodash.js.map  153 bytes        0  [emitted] [dev]        split-lodash~a~app~b
```

可以看到最后两个 chunk 是 `splitChunks` 分割出来的文件，但是我们发现这两个文件的 chunk 名称有点奇怪，这样的问题是我们做多页面构建时是需要把这些公共分离出的 chunk 放到 `HtmlWebpackPlugin` 的 `chunks` 配置里的，如果是这样的名称我们肯定是很难接收的而且这个名称也是`splitChunks`根据使用到的文件会进行改变的。

解决办法：


```
cacheGroups: {
    'split-lodash': {
      name: 'split-lodash', // 打包后 chunk 的名称
      test: module => {
        return /lodash/.test(module.context)
      },
      priority: 0,
      filename: utils.assetsPath('vendor/split-lodash.js')
    }
}
```

我们给一个`name`配置指定打包出的 chunk 的名称是 `split-lodash`。

`npm run build`：

```
    static/vendor/split-lodash.js   70.7 KiB        0  [emitted]              split-lodash
static/vendor/split-lodash.js.map  153 bytes        0  [emitted] [dev]        split-lodash
```


