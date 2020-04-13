23-1 配置 externals：['lodash'] 不打包 lodash 库到main.js里面，那么 splitChunks 还会不会在构建过程中遇到 lodash 时从业务代码中抽离出来单独打包成一个文件

答案是：不会在将`lodash`的代码进行 splitChunks 代码分割。

webpack.config.js

```
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
/* eslint-disable no-unused-vars */
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 默认将 entry 的入口起点指向 src 目录
  context: path.resolve(__dirname, './src'),
  mode: 'production',
  // 配置了 context 所以路径写成 ./ 当前目录下即可
  entry: {
    main: './index.js'
    // 如果是 webpack < 4 的版本，可以在 entry 里配置 vendor 来分离第三方类库，需要结合 CommonsChunkPlugin 一起配置使用
    // vendor: ['lodash', 'moment', 'vue']
  },
  output: {
    filename: '[name]-[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  // 抽离 lodash 库，不打包到构建文件中减小构建包体积
  externals: {lodash: '_'},
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
          test: (module) => {
            return /lodash/.test(module.context);
          },
          priority: -10,
          filename: 'split-lodash.js'
        },
        'split-vue': {
          test: (module) => {
            return /vue|vuex|vue-router/.test(module.context);
          },
          priority: 0,
          filename: '[name].js'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -20,
          filename: 'vendors.js'
        },
        default: false
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')] // 清除的文件/文件夹
    })
  ]
}

```

这里如果我设置了`externals: ['lodash']`的配置，那么webpack在进行 splitChunks 时在遇到`import _ from 'lodash'`的代码时也不会在把`lodash`分离出来到`util-vendors`这个缓存组里面。

**下面是设置前和后的两个构建对比：**

没设置`externals: ['lodash']`构建后会输出`util-vendors~main.js`这个文件


```
E:\vue-github\project\webpack\demo>npm run bundle

> demo@1.0.0 bundle E:\vue-github\project\webpack\demo
> webpack

clean-webpack-plugin: removed dist
Hash: 23389ebe614952dc1aab
Version: webpack 4.25.0
Time: 4367ms
Built at: 2020-04-13 15:31:18
               Asset      Size  Chunks             Chunk Names
    main-a99d744f.js  2.07 KiB       0  [emitted]  main
======== 分割到了 util-vendors 缓存组 =========
util-vendors~main.js  69.3 KiB       1  [emitted]  util-vendors~main
Entrypoint main = util-vendors~main.js main-a99d744f.js
[1] ./index.js 310 bytes {0} [built]
```

设置后`externals: ['lodash']`：

```
E:\vue-github\project\webpack\demo>npm run bundle

> demo@1.0.0 bundle E:\vue-github\project\webpack\demo
> webpack

clean-webpack-plugin: removed dist
Hash: 04ee0ab7149934ffe4b8
Version: webpack 4.25.0
Time: 125ms
Built at: 2020-04-13 15:41:24
           Asset      Size  Chunks             Chunk Names
main-18b620e0.js  1.11 KiB       0  [emitted]  main
Entrypoint main = main-18b620e0.js
[0] external "lodash" 42 bytes {0} [built]
[1] ./index.js 310 bytes {0} [built]
```

注意这里的打包体积确实是过滤掉了`lodash`这个库。

