const path = require('path');
const config = require('../config')
const fastConfig = require('../fast.config.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const baseWebpackConfig = require('./webpack.base.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

// 在 scripts 指令指定
// cross-env NODE_ENV=deveopment PORT=9099 webpack-dev-server --progress --config ./build/webpack.dev.js
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: process.env.NODE_ENV || 'development',
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
    headers: { 'Access-Control-Allow-Origin': '*' }, // 跨域，比如本地的时候 127.0.0.1 和 localhost 不设置 * 也会认为是不同域导致热更新的 hot-update.json 加载失败
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
  module: {
    rules: [
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
              modules: false
              /* modules: {
                localIdentName: config.dev.localIdentName
              } */ // 模块化，指的是这个 css 只在这个模块里有效 （import style from './a.scss'; 取某个class属性 style.avatar）
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
        test: /\.(sa|sc)ss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: fastConfig.isDevCssOneStyle ? 'singletonStyleTag' : 'styleTag'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => 默认，没有 loader;2 => postcss-loader, sass-loader
              modules: false
              /* modules: {
                localIdentName: config.dev.localIdentName
              } */
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
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => 默认，没有 loader;2 => postcss-loader, less-loader
              modules: false
              /* modules: {
                localIdentName: config.dev.localIdentName
              } */
            }
          },
          'postcss-loader', // 新版 postcss-loader 要放在 less-loader 之前
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    // 导入自定义环境变量
    new webpack.DefinePlugin({
      'process.env': {
        ...require('../config/dev.env.js'),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    // 启用热更新，配合 hot和hotOnly 使用
    new webpack.HotModuleReplacementPlugin(),
    // 以 template 摸板生成指定的html文件
    new HtmlWebpackPlugin({
      title: config.dev.title,
      filename: config.dev.index,
      template: config.dev.template,
      favicon: config.dev.favicon,
      hash: fastConfig.isAppHash, // 清除缓存
      inject: true // 默认 true，将脚本注入到body元素的底部
    }),
    /* new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'jquery',
          entry: 'https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js',
          global: 'jQuery'
        },
        {
          module: 'axios',
          entry: 'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
          global: 'axios'
        }
      ]
    }), */
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
if (fastConfig.isDevFriendlyErrors) {
  devWebpackConfig.plugins.push(
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${devWebpackConfig.devServer.port}`]
      }
    })
  )
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
    devWebpackConfig.plugins.splice(devWebpackConfig.plugins.length - 1, 0, new HtmlWebpackExternalsPlugin({
      externals: cdnModulelist
    }));
    // 抽离库不打包到构建文件中减小构建包体积，但要通过 script 标签在外部引入，建议需要和 fast.config.js 中的 cdnJsArray 一起使用
    devWebpackConfig.externals = externals
  }
}
module.exports = devWebpackConfig
