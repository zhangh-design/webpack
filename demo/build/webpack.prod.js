'use strict'
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LodashWebpackPlugin = require('lodash-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fastConfig = require('../fast.config.js')
const utils = require('../build/utils.js')
const config = require('../config/index.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const env = require('../config/prod.env.js')
const baseWebpackConfig = require('./webpack.base.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default
const TerserPlugin = require('terser-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  // 不设置 mode 默认 production
  mode: process.env.NODE_ENV || 'production',
  // mode: 'development',
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    filename: utils.assetsPath('js/[name].[chunkhash].js'), // 入口文件打包生成js文件走 filename 配置项
    chunkFilename: utils.assetsPath('js/vendor/[name].[chunkhash].js'), // splitChunks 分割出模块，动态import 引入的模块
    path: config.build.assetsRoot
  },
  optimization: {
    // 兼容旧版 webpack 在源代码不变的情况下打包构建后对应 chunk 文件的 contenthash 值也会发生变化
    // 从 chunk 文件中抽离出 webpack 源代码或者说呢运行时它要用到的代码放到了名字叫做 `runtime` 的一个 chunk 里面，可以在通过 html-webpack-inline-source-plugin 内联 Runtime 代码到 HTML 页面中
    // 注意：在 Webpack 4.29.6 版本已经修改了模板输出的 Template，即使 entry 修改，实际 Runtime 部分的内容也不会有变化，所以上面分离 Runtime 的方案适应于低版本的 Webpack。
    // runtimeChunk: {
    //     name: 'runtime'
    // },
    // 压缩
    minimize: true,
    // 压缩 css
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: fastConfig.isProdConsoleLog || false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    usedExports: true, // production 模式默认开启 Tree Shaking 摇树优化（可以通过在 package.json 中设置 sideEffects 属性来调整摇树优化过滤规则）
    splitChunks: {
      chunks: 'all', // initial（有共用的情况即发生拆分）async（异步 动态引入的模块不受影响，它是无论如何都会被拆分出去的）all（同步和异步），推荐 all
      minSize: 30000, // 模块最小尺寸，30K，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了
      maxSize: 0, // 模块最大尺寸，0为不限制
      minChunks: 1, // 默认1，被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
      maxAsyncRequests: 5, // 异步的按需加载模块最大的并行请求数，通过import()或者require.ensure()方式引入的模块，分离出来的包是异步加载的（一般不用改）
      maxInitialRequests: 3, // 初始加载网页的最大并行数（一般不用改）
      automaticNameDelimiter: '~', // 打包文件名分隔符
      name: true, // 拆分出来文件的名字，默认为 true，表示自动生成文件名，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个
      // 同步导入进入的分割规则，异步动态import使用 魔法注释
      cacheGroups: {
        /* lodash: {
          name: 'lodash',
          test: /[\\/]node_modules[\\/]_lodash@4.17.15@lodash[\\/]/,
          priority: 0
        }, */
        // 将 vue、vuex和vue-router单独分割成一个文件
        'vue-base': {
          name: 'vue-base',
          test: /[\\/]node_modules[\\/]_vue@2.6.11@vue|_vuex@3.2.0@vuex|_vue-router@3.1.6@vue-router[\\/]/,
          priority: 0,
          filename: utils.assetsPath('js/vendor/vue-base.[chunkhash].js')
        },
        /* 'core-js-base': {
          name: 'core-js-base',
          test: /[\\/]node_modules[\\/]_core-js@2.6.11@core-js|_core-js@3.6.5@core-js[\\/]/,
          priority: -10,
          filename: utils.assetsPath('js/vendor/core-js-base.[chunkhash].js')
        }, */
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true // 忽略默认的参数（比如：minSize）只要是 .css 文件就做代码的拆分
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true // 是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
        },
        ...fastConfig.splitChunksCacheGroups
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            // webpack 4 的版本 生产环境 不在需要使用 'vue-style-loader'
            // [webpack 3 版本的配置请看下面链接](https://vue-loader.vuejs.org/zh/guide/extract-css.html#webpack-4)
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true
            }
          },
          {
            loader: 'css-loader'
            /* options: {
              importLoaders: 1,
              modules: {
                localIdentName: config.build.localIdentName
              }
            } */
          },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    // 导入自定义环境变量
    new webpack.DefinePlugin({
      'process.env': env,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }),
    // 优化 lodash 减小构建包体积
    new LodashWebpackPlugin(),
    // 清除构建包
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')] // 清除的文件/文件夹
    }),
    // 从 bundle 中提取文本（CSS）到单独的文件
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('[name].[contenthash:8].css'),
      chunkFilename: utils.assetsPath('/styles/[name].[contenthash:8].chunk.css')
    }),
    // 以 template 摸板生成指定的html文件
    new HtmlWebpackPlugin({
      title: config.build.title,
      filename: config.build.index,
      template: config.build.template,
      favicon: config.build.favicon,
      // 添加指定的chunk，多页应用时需要动态指定，单页不用配置（不配置就会引入所有页面的资源）
      // 在配置多个页面时，每个页面注入的thunk应该是不相同的，需要通过该配置为不同页面注入不同的thunk
      // 比如：登录页面`chunks: ['login']`，主页面`chunks: ['main']`
      // chunks: ['app'],
      inject: true, // 默认 true，将脚本注入到body元素的底部
      // 美化 html 文件，去除空格、注释等（ production 时使用）
      minify: {
        removeComments: true, // 去除HTML注释
        collapseWhitespace: true, // 去掉空格
        removeAttributeQuotes: true
      },
      // 4.2.0 版本已经移除 'dependency'
      // 允许指定的thunk在插入到html文档前进行排序，旧版本（例如^3.2.0）会配置为 'dependency'
      // 多页面中一般会提取公共部分的chunk，这个时候一个html页面会引入多个chunk，而这些chunk之间是有依赖关系的，即必须按照顺序用script标签引入，chunksSortMode是用来指定这种顺序的排序规则，dependency是指按照依赖关系排序。
      // 旧版配置为 'dependency' 可能会出现 `Cyclic dependency   错误：循环依赖` 的问题，可以升级插件到最新
      // `Cyclic dependency`网上的解决办法设置为`none`但这样页面加载顺序就不能保证了，可能会出现样式被覆盖的现象
      chunksSortMode: 'auto',
      hash: fastConfig.isAppHash // 清除缓存
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
})
// 查看 webpack 打包情况
if (fastConfig.isBundleAnalyzer) {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin()
  )
}
// ie 环境下 动态import 分割的 babel 模块统一到名叫 core-js-base 文件
if (fastConfig.ieDynamicImport) {
  webpackConfig.optimization.splitChunks.cacheGroups['core-js-base'] = {
    name: 'core-js-base',
    test: /[\\/]node_modules[\\/]_core-js@2.6.11@core-js|_core-js@3.6.5@core-js[\\/]/,
    priority: -10,
    filename: utils.assetsPath('js/vendor/core-js-base.[chunkhash].js')
  }
}
// 组装 html-webpack-externals-plugin
if (fastConfig.cdnJsArray.length > 0) {
  const cdnModulelist = []
  const externals = {}
  for (const elem of fastConfig.cdnJsArray.values()) {
    cdnModulelist.push(elem)
    if (Reflect.has(elem, 'alias')) {
      externals[elem.alias] = elem.global
      Reflect.deleteProperty(elem, 'alias')
    }
  }
  if (cdnModulelist.length > 0) {
    webpackConfig.plugins.splice(webpackConfig.plugins.length - 1, 0, new HtmlWebpackExternalsPlugin({
      externals: cdnModulelist
    }))
    // 抽离库不打包到构建文件中减小构建包体积，但要通过 script 标签在外部引入，建议需要和 fast.config.js 中的 cdnJsArray 一起使用
    webpackConfig.externals = externals
  }
}
// css 是否要内联到 <style></style> 标签内
if (fastConfig.isProdCssInline) {
  webpackConfig.plugins.push(new HTMLInlineCSSWebpackPlugin())
}
module.exports = webpackConfig
