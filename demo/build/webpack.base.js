'use strict'
const config = require('../config/index.js')
const utils = require('../build/utils.js')
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 默认将 entry 的入口起点指向根目录
  context: path.resolve(__dirname, '../'),
  // 配置了 context 所以路径写成 ./src 当前目录下即可
  entry: {
    app: './src/index.js'
    // 如果是 webpack < 4 的版本，可以在 entry 里配置 vendor 来分离第三方类库，需要结合 CommonsChunkPlugin 一起配置使用
    // vendor: ['lodash', 'moment', 'vue']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 自动解析确定的扩展
    extensions: ['.js', '.json', '.vue', '.jsx', '.css', '.less', 'scss'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      // 设置 vue 的别名为精确匹配，文件中就可以这样使用 import Vue from 'vue'（from 后面的 'vue' 就代表这里的配置）
      vue$: path.resolve(__dirname, '../node_modules/vue/dist/vue.runtime.min.js'),
      '@': resolve('./src')
    },
    // 告诉 webpack 解析第三方模块时应该搜索的目录
    modules: [path.resolve(__dirname, '../node_modules')],
    // 对应第三方包 package.json 中的 main 属性字段，意思是通过 main 属性指定的文件来导入模块
    mainFields: ['main']
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('img/[path][name]-[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('media/[path][name]-[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('fonts/[path][name]-[hash:7].[ext]')
        }
      }
    ]
  }
}
