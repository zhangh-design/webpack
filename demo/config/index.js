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
    host: '127.0.0.1', // 服务器（默认值），可以通过 dev.env.js 设置 HOST 参数来改写
    port: 8080, // 端口号（默认值），可以通过 dev.env.js 设置 PORT 参数来改写
    hot: true, // 通知 webpack-dev-server 开启 Hot Module Replacement 这样的一个功能 （需要配置 webpack.HotModuleReplacementPlugin 一起使用）
    hotOnly: true, // 即便是 Hot Module Replacement 的功能没有生效，我也不让浏览器自动的重新刷新（需要配置 webpack.HotModuleReplacementPlugin 一起使用）
    open: false, // 自动打开浏览器
    compress: true, // 一切服务都启用 gzip 压缩
    overlay: true, // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖层
    quiet: true, // （错误或警告由 friendly-errors-webpack-plugin 插件提供）启用 devServer.quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台，这也意味着来自 webpack 的错误或警告在控制台不可见。
    poll: false, // webpack 使用文件系统(file system)获取文件改动的通知，当使用NFS或Vagrant场景下，是不起作用的
    /**
     * friendly-errors-webpack-plugin
     */
    notifyOnErrors: true, // friendly-errors-webpack-plugin 插件中的参数
    /**
     * Source Maps
     */
    devtool: 'cheap-module-eval-source-map'
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    // 外网发布打包chunk配置的cdn或者远程服务器地址
    // 我们最终打包出的 chunk 可能会放到一台 cdn 服务器上，所以我们在 index.html（index.html和chunks文件不放在一起） 访问这些 chunk 时需要带上统一的远程地址（比如：http://cdn.com.cn/）
    // assetsPublicPath: 'http://cdn.com.cn/'
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    productionSourceMap: true,
    devtool: 'cheap-module-source-map'
  }
};
