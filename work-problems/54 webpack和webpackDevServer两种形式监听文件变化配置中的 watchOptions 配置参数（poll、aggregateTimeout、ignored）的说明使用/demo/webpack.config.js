// 引入 html-webpack-plugin 插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // watch: true, 通过 npm run watch 启动文件监听
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 3000, // 文件发生改变后会等3000ms再去执行动作，防止文件更新太快导致重新编译频率太高（这里是测试设置的太高了）
    poll: false
  },
  /* devServer: {
    contentBase: './dist',
    open: true,
    port: 8080,
    watchOptions: {
      ignored: /node_modules/,
      aggregateTimeout: 300,
      poll: false
      // poll: 3000 // 检测到文件发生改变，3秒后在重新编译（传入false表示立即重新编译）
    }
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // }
  }, */
  module: {
    rules: []
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')] // 清除的文件/文件夹
    })
  ]
};
