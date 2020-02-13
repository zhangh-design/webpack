const path = require('path');
// 查阅文档发现v15版的 vue-loader 配置需要加个 VueLoaderPlugin
// 并且不设置 VueLoaderPlugin 的话打包会报错提示需要设置 VueLoaderPlugin 对象
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'development',
  // entry: './src/index.js',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: 'bundle.js',
    // path 不写其实也可以，默认就会打包到 dist 目录
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.jpg$/,
        use: {
          loader: 'file-loader'
        }
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader'
        }
      }
    ]
  }
}
