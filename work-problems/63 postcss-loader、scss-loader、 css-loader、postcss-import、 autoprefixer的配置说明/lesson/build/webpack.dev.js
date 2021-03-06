const path = require('path');
const config = require('../config')
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: config.dev.devtool,
  devServer: {
    // contentBase: path.resolve(__dirname, '../dev-assets'),
    contentBase: false, // 因为配置了 CopyWebpackPlugin 会把静态资源提供到指定目录中（output.path），devServer服务就是提供到内存中，所以不用手动指定静态资源目录，设置成 false 也就可以了
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
      title: config.dev.title,
      filename: config.dev.index,
      template: config.dev.template,
      favicon: config.dev.favicon,
      meta: config.dev.meta,
      inject: true // 默认 true，将脚本注入到body元素的底部
    }),
    // new webpack.NoEmitOnErrorsPlugin() // （optimization.noEmitOnErrors: true）在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段，这样可以确保输出资源不会包含错误。
    // new webpack.NamedModulesPlugin() // webpack 4 之后在开发模式下默认开启 optimization.namedModules: true
    // 拷贝静态资源到当前的工作目录（output.path），contentBase设置为 false 会使用当前工作目录
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*'] // 忽略拷贝指定的文件 （忽略所有 jpg 文件：*.jpg）
      }
    ])
  ],
  optimization: {
    noEmitOnErrors: true // webpack 4
  }
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
