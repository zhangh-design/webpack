'use strict'
const config = require('../config/index.js')
const fastConfig = require('../fast.config.js')
const utils = require('../build/utils.js')
const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const createVueLoaderConfig = require('./vue-loader.conf.js')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const ieDynamicImportModule = function () {
  return fastConfig.ieDynamicImport ? utils.getIEDynamicImportModule() : {}
}

const isDev = process.env.NODE_ENV === 'development' // 开发环境

module.exports = {
  // 默认将 entry 的入口起点指向根目录
  context: path.resolve(__dirname, '../'),
  // 配置了 context 所以路径写成 ./src 当前目录下即可
  entry: {
    ...ieDynamicImportModule(),
    app: './src/main.js'
    // 如果是 webpack < 4 的版本，可以在 entry 里配置 vendor 来分离第三方类库，需要结合 CommonsChunkPlugin 一起配置使用
    // vendor: ['lodash', 'moment', 'vue']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    libraryTarget: 'umd', // 支持 script标签、AMD、commonJs 引入
    libraryExport: 'default',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
    hashDigestLength: 8 // 生成 bundle 文件 hash 取8位（对 url-loader和file-loader 的 hash 无效）
  },
  resolve: {
    // 自动解析确定的扩展（逻辑性文件，资源文件还是建议显示引入）配置太多对性能有损耗
    // 要确保同一个目录下面没有重名的文件，如果存在的话，还是要写全路径
    extensions: ['.js', '.json', '.vue', '.jsx'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      // 设置 vue 的别名为精确匹配，文件中就可以这样使用 import Vue from 'vue'（from 后面的 'vue' 就代表这里的配置）
      vue$:
        process.env.NODE_ENV === 'production'
          ? resolve('./node_modules/vue/dist/vue.runtime.min.js')
          : resolve('./node_modules/vue/dist/vue.runtime.js'),
      '@': resolve('./src'),
      '@server': resolve('./src/server'),
      '@lib': resolve('./src/lib'),
      '@assets': resolve('./src/assets')
    },
    // 告诉 webpack 解析第三方模块时应该搜索的目录，默认 node_modules
    // modules: [path.resolve(__dirname, '../node_modules')], ie 11 环境中因为这样配置找不到 iterator.js 和 Promise.js 的babel支持文件
    modules: [resolve('src'), 'node_modules'],
    // 解析目录时要使用的文件名（这个配置项不常用，因为也是对性能有损耗）
    // mainFiles: ['index', 'test'],
    // 对应第三方包 package.json 中的 main 属性字段，意思是通过 main 属性指定的文件来导入模块
    mainFields: ['main', 'module']
  },
  // 抽离库不打包到构建文件中减小构建包体积，但要通过 script 标签在外部引入
  // externals: fastConfig.externals,
  module: {
    // noParse: '/jquery|lodash/', // 构建时不去解析三方库
    // noParse: /node_modules\/(element-ui\.js)/,
    rules: [
      {
        test: /\.jsx?$/, // x? 表示同时使用 babel-loader 解析 js 和 jsx 文件
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test')],
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: createVueLoaderConfig(isDev)
      },
      {
        test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
        // 压缩图片
        loader: 'image-webpack-loader',
        // 通过enforce: 'pre'我们提高了 img-webpack-loader 的优先级，保证在url-loader、file-loader和svg-url-loader之前就完成了图片的优化。
        enforce: 'pre'
      },
      {
        test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024, // 8kb
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('img/[path][name]-[hash:8].[ext]'),
          publicPath:
            process.env.NODE_ENV === 'production'
              ? config.build.urlLoaderPublicPath
              : config.dev.urlLoaderPublicPath // http://www.baidu.com/
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('media/[path][name]-[hash:8].[ext]'),
          publicPath:
            process.env.NODE_ENV === 'production'
              ? config.build.urlLoaderPublicPath
              : config.dev.urlLoaderPublicPath // http://www.baidu.com/
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('fonts/[path][name]-[hash:8].[ext]'),
          publicPath:
            process.env.NODE_ENV === 'production'
              ? config.build.urlLoaderPublicPath
              : config.dev.urlLoaderPublicPath // http://www.baidu.com/
        }
      },
      {
        test: /\.(csv|tsv)$/,
        use: ['csv-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      }
    ]
  },
  plugins: [
    // 忽略解析三方包里插件（非中文语言包排除掉）
    // new webpack.IgnorePlugin(/\.\/locale/, /moment/)
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    // 查阅文档发现 v15 版的 vue-loader 配置需要加个 VueLoaderPlugin
    // 并且不设置 VueLoaderPlugin 的话打包会报错提示需要设置 VueLoaderPlugin 对象
    // https://vue-loader.vuejs.org/zh/guide/#%E6%89%8B%E5%8A%A8%E8%AE%BE%E7%BD%AE
    new VueLoaderPlugin(),
    // 全局提供帮助类库和工具函数（暴露全局变量）
    new webpack.ProvidePlugin(fastConfig.providePlugin)
  ]
}
