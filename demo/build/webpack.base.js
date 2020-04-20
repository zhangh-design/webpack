'use strict';
const config = require('../config/index.js');
const utils = require('../build/utils.js');
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const vueLoaderConfig = require('./vue-loader.conf.js');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
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
    libraryTarget: 'umd', // 支持 script标签、AMD、commonJs 引入
    libraryExport: 'default',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
    hashDigestLength: 8 // 生成 bundle 文件 hash 取8位（对 url-loader和file-loader 的 hash 无效）
  },
  resolve: {
    // 自动解析确定的扩展
    extensions: ['.js', '.json', '.vue', '.jsx', '.css', '.less', '.scss'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      // 设置 vue 的别名为精确匹配，文件中就可以这样使用 import Vue from 'vue'（from 后面的 'vue' 就代表这里的配置）
      vue$: path.resolve(
        __dirname,
        '../node_modules/vue/dist/vue.runtime.min.js'
      ),
      '@': resolve('./src'),
      '@server': resolve('./src/server'),
      '@lib': resolve('./src/lib')
    },
    // 告诉 webpack 解析第三方模块时应该搜索的目录
    modules: [path.resolve(__dirname, '../node_modules')],
    // 对应第三方包 package.json 中的 main 属性字段，意思是通过 main 属性指定的文件来导入模块
    mainFields: ['main', 'module']
  },
  module: {
    noParse: '/jquery|lodash/', // 构建时不去解析三方库
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.css$/,
        use: [
          'style-loader', // 把 css 样式内容内联到 style 标签内
          // 'css-loader', // 处理 .css 文件
          {
            loader: 'css-loader',
            options: {
              // importLoaders，这个参数用于配置 css-loader 作用于 @import 的资源之前有多少个 loader
              // 也可以通过增加 postcss-loader 的插件 postcss-import 来达到同样效果
              importLoaders: 1, // 0 => 默认，没有 loader;1 => postcss-loader;
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              } // 模块化，指的是这个 css 只在这个模块里有效 （import style from './a.scss'; 取某个class属性 style.avatar）
            }
          },
          'postcss-loader'// 构建时调用 autoprefixer 自动添加浏览器厂商前缀 （webkit、moz、ms）
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => 默认，没有 loader;2 => postcss-loader, sass-loader
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          },
          'postcss-loader', // 新版 postcss-loader 要放在 sass-loader 之前
          'sass-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => 默认，没有 loader;2 => postcss-loader, less-loader
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              }
            }
          },
          'postcss-loader', // 新版 postcss-loader 要放在 less-loader 之前
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // 字节
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('img/[path][name]-[hash:8].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('media/[path][name]-[hash:8].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('fonts/[path][name]-[hash:8].[ext]')
        }
      }
    ]
  },
  plugins: [
    // 忽略解析三方包里插件（非中文语言包排除掉）
    // new webpack.IgnorePlugin(/\.\/locale/, /moment/)
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    // 查阅文档发现 v15 版的 vue-loader 配置需要加个 VueLoaderPlugin
    // 并且不设置 VueLoaderPlugin 的话打包会报错提示需要设置 VueLoaderPlugin 对象
    new VueLoaderPlugin()
  ]
};
