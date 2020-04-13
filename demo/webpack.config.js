const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LodashWebpackPlugin = require('lodash-webpack-plugin')
const path = require('path');

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}
console.info(path.join(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'))
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
  resolve: {
    // 自动解析确定的扩展
    extensions: ['.wasm', '.mjs', '.js', '.json', '.vue', '.jsx', '.css', '.less', 'scss'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单
    alias: {
      // 设置 vue 的别名为精确匹配，文件中就可以这样使用 import Vue from 'vue'（from 后面的 'vue' 就代表这里的配置）
      vue$: path.join(__dirname, './node_modules/vue/dist/vue.runtime.esm.js'),
      '@': resolve('./src')
    }
  },
  // 抽离库不打包到构建文件中减小构建包体积，但要通过 script 标签在外部引入
  externals: {
    // lodash: '_',
    jquery: 'jQuery',
    echarts: 'echarts'
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
          test: (module) => {
            return /lodash/.test(module.context)
          },
          priority: 0,
          filename: 'split-lodash.js'
        },
        'split-vue': {
          test: (module) => {
            return /vue|vuex|vue-router/.test(module.context)
          },
          priority: -10,
          filename: 'split-vue.js'
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -20,
          filename: 'vendors.js'
        },
        default: false
      }
    }
  },
  plugins: [
    // 优化 lodash 减小构建包体积
    new LodashWebpackPlugin(),
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')] // 清除的文件/文件夹
    })
  ]
}
