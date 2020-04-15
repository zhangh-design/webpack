/* eslint-disable no-unused-vars */
const path = require('path');
const config = require('../config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.js')

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
    watchOptions: {
      poll: config.dev.poll
    },
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
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = devWebpackConfig
