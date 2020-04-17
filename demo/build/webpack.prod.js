'use strict';
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LodashWebpackPlugin = require('lodash-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const utils = require('../build/utils.js')
const config = require('../config/index.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const env = require('../config/prod.env.js')
const baseWebpackConfig = require('./webpack.base.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')

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
          name: 'split-lodash', // 打包后 chunk 的名称
          test: module => {
            return /lodash/.test(module.context)
          },
          priority: 0,
          filename: utils.assetsPath('vendor/split-lodash.js')
        },
        'split-vue': {
          name: 'split-vue',
          test: module => {
            return /vue|vuex|vue-router/.test(module.context)
          },
          priority: -10,
          filename: utils.assetsPath('vendor/split-vue.js')
        },
        vendors: {
          name: 'split-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -20,
          filename: utils.assetsPath('vendor/vendors.js')
        },
        default: false
      }
    }
  },
  plugins: [
    // 导入自定义环境变量
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // 优化 lodash 减小构建包体积
    new LodashWebpackPlugin(),
    // 清除构建包
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')] // 清除的文件/文件夹
    }),
    // 以 template 摸板生成指定的html文件
    new HtmlWebpackPlugin({
      title: config.build.title,
      filename: config.build.index,
      template: config.build.template,
      favicon: config.build.favicon,
      meta: config.build.meta,
      // 添加指定的chunk，多页应用时需要动态指定，单页不用配置（不配置就会引入所有页面的资源）
      // 在配置多个页面时，每个页面注入的thunk应该是不相同的，需要通过该配置为不同页面注入不同的thunk
      // 比如：登录页面`chunks: ['login']`，主页面`chunks: ['main']`
      // chunks: ['app'],
      inject: true, // 默认 true，将脚本注入到body元素的底部
      // 美化 html 文件，去除空格、注释等（ production 时使用）
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      // 4.2.0 版本已经移除 'dependency'
      // 允许指定的thunk在插入到html文档前进行排序，旧版本（例如^3.2.0）会配置为 'dependency'
      // 多页面中一般会提取公共部分的chunk，这个时候一个html页面会引入多个chunk，而这些chunk之间是有依赖关系的，即必须按照顺序用script标签引入，chunksSortMode是用来指定这种顺序的排序规则，dependency是指按照依赖关系排序。
      // 旧版配置为 'dependency' 可能会出现 `Cyclic dependency   错误：循环依赖` 的问题，可以升级插件到最新
      // `Cyclic dependency`网上的解决办法设置为`none`但这样页面加载顺序就不能保证了，可能会出现样式被覆盖的现象
      chunksSortMode: 'auto'
    }),
    // 拷贝静态资源到当前的工作目录（output.path）
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*'] // 忽略拷贝指定的文件 （忽略所有 jpg 文件：*.jpg）
      }
    ])
  ]
});

module.exports = webpackConfig;
