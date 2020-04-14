'use strict';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin');
const path = require('path');
const utils = require('../build/utils.js');
const config = require('../config/index.js');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.js');

const webpackConfig = merge(baseWebpackConfig, {
  // 不设置 mode 默认 production
  mode: 'production',
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    filename: utils.assetsPath('js/[name].[chunkhash:7].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash:7].js'),
    path: config.build.assetsRoot
  },
  // 抽离库不打包到构建文件中减小构建包体积，但要通过 script 标签在外部引入
  externals: {
    // lodash: '_',
    jquery: 'jQuery',
    echarts: 'echarts',
    axios: 'axios'
  },
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
            return /lodash/.test(module.context);
          },
          priority: 0,
          filename: utils.assetsPath('vendor/split-lodash.js')
        },
        'split-vue': {
          test: module => {
            return /vue|vuex|vue-router/.test(module.context);
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
  },
  plugins: [
    // 优化 lodash 减小构建包体积
    new LodashWebpackPlugin(),
    // 清除构建包
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')] // 清除的文件/文件夹
    })
  ]
});

module.exports = webpackConfig;
