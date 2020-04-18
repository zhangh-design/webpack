'use strict';

// eslint-disable-next-line no-unused-vars
const path = require('path');

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/', // 外网发布打包chunk配置的cdn或者远程服务器地址，本地一般情况无需修改
    // Webpack-dev-server （https://webpack.docschina.org/configuration/dev-server/）
    // 热更新需要 hot、hotOnly和 webpack.HotModuleReplacementPlugin 一起使用才有效
    clientLogLevel: 'warning', // 控制台(console)显示消息的级别（none、error、warning、info）
    proxy: {}, // 服务器代理设置
    /* proxy: {
      '/react/api': {
        target: 'http://www.xxx.com',
        secure: false, // 如果我们需要转发的网站是支持 https 的，那么需要增加secure=false，来防止转发失败
		changeOrigin: true, // 跨域和突破网站对爬虫的禁止，一般建议配置
        pathRewrite: { // 路径重写
          'header.json': 'demo.json' // 访问 header.json 实际会去请求 demo.json
        }
      }
    }, */
    host: '127.0.0.1', // 服务器（默认值），可以通过 dev.env.js 设置 HOST 参数来改写
    port: 8080, // 端口号（默认值），可以通过 dev.env.js 设置 PORT 参数来改写
    hot: true, // 通知 webpack-dev-server 开启 Hot Module Replacement 这样的一个功能 （需要配置 webpack.HotModuleReplacementPlugin 一起使用）
    hotOnly: true, // 即便是 Hot Module Replacement 的功能没有生效或者编译失败，也不让浏览器自动的重新刷新（需要配置 webpack.HotModuleReplacementPlugin 一起使用）
    open: false, // 自动打开浏览器
    compress: true, // 一切服务都启用 gzip 压缩
    overlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    quiet: true, // （错误或警告由 friendly-errors-webpack-plugin 插件提供）启用 devServer.quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台，这也意味着来自 webpack 的错误或警告在控制台不可见。
    watchOptions: {
      // 监听到变化发生后会等500ms再去执行编译，防止文件更新太快导致重新编译频率太高
      aggregateTimeout: 500,
      // 不监听的文件或文件夹
      ignored: /node_modules/,
      // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
      // 不轮询（如果在使用NFS[网络文件系统]或Vagrant[虚拟化]环境下，监视文件可能不起作用，可以修改为 true 轮询）
      poll: false
    },
    headers: {}, // 在所有响应中添加首部内容
    /**
     * friendly-errors-webpack-plugin
     */
    notifyOnErrors: true, // friendly-errors-webpack-plugin 插件中的参数
    /**
     * Source Maps
     */
    devtool: 'cheap-module-eval-source-map',
    /**
     * html-webpack-plugin
     */
    title: 'Hello Webpack App',
    index: path.resolve(__dirname, '../dist/index.html'), // 构建后最终输出的文件地址和名称
    template: path.resolve(__dirname, '../public/index.html'), // 模板文件html
    favicon: path.resolve(__dirname, '../public/favicon.ico'), // 将给定的图标图标路径添加到输出HTML
    // 允许注入meta-tags （head中meta参数）
    meta: {
      viewport: 'width=device-width, initial-scale=1.0',
      renderer: 'webkit',
      'X-UA-Compatible': 'IE=edge, chrome=1',
      Keywords: '',
      Description: ''
    }
  },
  build: {
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static', // 静态文件目录
    // 外网发布打包chunk配置的cdn或者远程服务器地址
    // 我们最终打包出的 chunk 可能会放到一台 cdn 服务器上，所以我们在 index.html（index.html和chunks文件不放在一起） 访问这些 chunk 时需要带上统一的远程地址（比如：http://cdn.com.cn/）
    // assetsPublicPath: 'http://cdn.com.cn/'
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    productionSourceMap: true,
    devtool: 'cheap-module-source-map',
    /**
     * html-webpack-plugin
     */
    title: 'Hello Webpack App',
    index: path.resolve(__dirname, '../dist/index.html'), // 构建后最终输出的文件地址和名称
    template: path.resolve(__dirname, '../public/index.html'), // 模板文件html
    favicon: path.resolve(__dirname, '../public/favicon.ico'), // 将给定的图标图标路径添加到输出HTML
    // 允许注入meta-tags （head中meta参数）
    meta: {
      viewport: 'width=device-width, initial-scale=1.0',
      renderer: 'webkit',
      'X-UA-Compatible': 'IE=edge, chrome=1',
      Keywords: '',
      Description: ''
    }
  }
};
