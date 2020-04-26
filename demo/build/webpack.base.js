'use strict';
const config = require('../config/index.js');
const fastConfig = require('../fast.config.js')
const utils = require('../build/utils.js');
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const vueLoaderConfig = require('./vue-loader.conf.js');

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

const ieDynamicImportModule = function () {
  return fastConfig.ieDynamicImport ? utils.getIEDynamicImportModule() : {}
}

module.exports = {
  // 默认将 entry 的入口起点指向根目录
  context: path.resolve(__dirname, '../'),
  // 配置了 context 所以路径写成 ./src 当前目录下即可
  entry: {
    ...ieDynamicImportModule(),
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
    // 自动解析确定的扩展（逻辑性文件，资源文件还是建议显示引入）配置太多对性能有损耗
    // 要确保同一个目录下面没有重名的文件，如果存在的话，还是要写全路径
    extensions: ['.js', '.json', '.vue', '.jsx'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      // 设置 vue 的别名为精确匹配，文件中就可以这样使用 import Vue from 'vue'（from 后面的 'vue' 就代表这里的配置）
      vue$: path.resolve(
        __dirname,
        '../node_modules/vue/dist/vue.runtime.min.js'
      ),
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
        options: vueLoaderConfig
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader', // 把 css 样式内容内联到 style 标签内
            options: {
              // 是否合并 style 标签，处理为单个style标签
              injectType: fastConfig.isDevCssOneStyle ? 'singletonStyleTag' : 'styleTag'
            }
          },
          // 'css-loader', // 处理 .css 文件
          {
            loader: 'css-loader',
            options: {
              // importLoaders，这个参数用于配置 css-loader 作用于 @import 的资源之前有多少个 loader
              // 也可以通过增加 postcss-loader 的插件 postcss-import 来达到同样效果
              importLoaders: 1, // 0 => 默认，没有 loader;1 => postcss-loader;
              modules: {
                localIdentName:
                  process.env.NODE_ENV === 'production'
                    ? config.build.localIdentName
                    : config.dev.localIdentName
              } // 模块化，指的是这个 css 只在这个模块里有效 （import style from './a.scss'; 取某个class属性 style.avatar）
            }
          },
          'postcss-loader' // 构建时调用 autoprefixer 自动添加浏览器厂商前缀 （webkit、moz、ms）
        ]
        // 例如 element-ui 样式库会有主题 css文件存在于 node_modules 中，所以 css 文件的 loader 不应该加入 include 和 exclude
        // import 'element-ui/lib/theme-chalk/index.css' 这个主题样式是在 node_modules 中的
        // include: [resolve('src'), resolve('test')]
        // exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: fastConfig.isDevCssOneStyle ? 'singletonStyleTag' : 'styleTag'
            }
          },
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => 默认，没有 loader;2 => postcss-loader, sass-loader
              modules: {
                localIdentName:
                  process.env.NODE_ENV === 'production'
                    ? config.build.localIdentName
                    : config.dev.localIdentName
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
          {
            loader: 'style-loader',
            options: {
              injectType: fastConfig.isDevCssOneStyle ? 'singletonStyleTag' : 'styleTag'
            }
          },
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => 默认，没有 loader;2 => postcss-loader, less-loader
              modules: {
                localIdentName:
                  process.env.NODE_ENV === 'production'
                    ? config.build.localIdentName
                    : config.dev.localIdentName
              }
            }
          },
          'postcss-loader', // 新版 postcss-loader 要放在 less-loader 之前
          'less-loader'
        ]
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
          limit: 10 * 1024, // 10k
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('img/[path][name]-[hash:8].[ext]'),
          publicPath: process.env.NODE_ENV === 'production'
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
          publicPath: process.env.NODE_ENV === 'production'
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
          publicPath: process.env.NODE_ENV === 'production'
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
    new VueLoaderPlugin(),
    // 全局提供帮助类库和工具函数（暴露全局变量）
    new webpack.ProvidePlugin(fastConfig.providePlugin)
  ]
};
