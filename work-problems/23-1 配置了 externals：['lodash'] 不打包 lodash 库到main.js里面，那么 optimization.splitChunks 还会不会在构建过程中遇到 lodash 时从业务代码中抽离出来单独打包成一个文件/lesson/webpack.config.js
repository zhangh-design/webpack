const { CleanWebpackPlugin } = require('clean-webpack-plugin')
/* eslint-disable no-unused-vars */
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 默认将 entry 的入口起点指向 src 目录
  context: path.resolve(__dirname, './src'),
  mode: 'production',
  // 配置了 context 所以路径写成 ./ 当前目录下即可
  entry: {
    main: './index.js'
    // 如果是 webpack < 4 的版本，可以在 entry 里配置 vendor 来分离第三方类库，需要结合 CommonsChunkPlugin 一起配置使用
    // vendor: ['lodash', 'moment', 'vue']
  },
  output: {
    filename: '[name]-[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist')
  },
  // 抽离 lodash 库，不打包到构建文件中减小构建包体积
  externals: ['lodash'],
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
        'util-vendors': {
          test: (module) => {
            return /lodash|moment|axios/.test(module.context);
          },
          priority: -10,
          filename: '[name].js'
        },
        'vue-vendors': {
          test: (module) => {
            return /vue|vuex|vue-router/.test(module.context);
          },
          priority: -10,
          filename: '[name].js'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -20,
          filename: 'vendors.js'
        },
        default: {
          priority: 10,
          reuseExistingChunk: true,
          filename: 'common.js'
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')] // 清除的文件/文件夹
    })
  ]
}
