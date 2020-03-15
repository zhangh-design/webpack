const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // development cheap-module-eval-source-map
  // production cheap-module-source-map
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8080,
    hot: true
    // hotOnly: true
    /* proxy: {
      '/api': 'http://localhost:3000'
    } */
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  // 在 development 的mode下打开 Tree Shaking 优化
  // development 环境下不需要使用 Tree Shaking 所有我们注释掉，这里只是为了演示效果
  // production 的mode下 Tree Shaking 会自动打开
  optimization: {
    usedExports: true
  }
};

module.exports = merge(commonConfig, devConfig)
