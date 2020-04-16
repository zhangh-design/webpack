const path = require('path');
const config = require('../config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: config.dev.devtool,
  devServer: {
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    clientLogLevel: config.dev.clientLogLevel,
    hot: config.dev.hot,
    hotOnly: config.dev.hotOnly,
    compress: config.dev.compress,
    open: config.dev.open,
    overlay: config.dev.overlay ? { warnings: false, errors: true } : false,
    quiet: config.dev.quiet,
    proxy: config.dev.proxy,
    publicPath: config.dev.assetsPublicPath,
    watchOptions: config.dev.watchOptions,
    historyApiFallback: {
      rewrites: [
        // 404 页面 跳转到 index.html
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') }
      ]
    }
  },
  plugins: [
    // 导入自定义环境变量
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    // 启用热更新，配合 hot和hotOnly 使用
    new webpack.HotModuleReplacementPlugin(),
    // 以 template 摸板生成指定的html文件
    new HtmlWebpackPlugin({
      title: config.common.title,
      filename: config.common.index,
      template: config.common.template,
      favicon: config.common.favicon,
      meta: config.common.meta,
      inject: true // 默认 true，将脚本注入到body元素的底部
    })
  ]
})
// 编译通知，需要把 devServer 中的 quite设置为 true 把编译通知权转交给 friendly-errors-webpack-plugin
devWebpackConfig.plugins.push(
  new FriendlyErrorsPlugin({
    compilationSuccessInfo: {
      messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${devWebpackConfig.devServer.port}`]
    }
  })
)
module.exports = devWebpackConfig
