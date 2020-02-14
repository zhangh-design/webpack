const path = require('path');
// 查阅文档发现v15版的vue-loader配置需要加个VueLoaderPlugin
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
  plugins: [new VueLoaderPlugin()],
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        /* use: {
				loader: 'file-loader',
				options: {
					// placeholder 占位符
					// name: '[name]_[hash].[ext]'
					name: '[name].[ext]',
					outputPath: 'images/'
				}
			} */
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            // 字节
            limit: 10240
          }
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
};
