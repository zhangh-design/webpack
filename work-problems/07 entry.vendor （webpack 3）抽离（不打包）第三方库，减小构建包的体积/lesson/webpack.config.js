const path = require('path');
const webpack = require('webpack');

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  // 默认将 entry 的入口起点指向 src 目录
  context: path.resolve(__dirname, './src'),
  // 配置了 context 所以路径写成 ./ 当前目录下即可
  entry: {
	main: './index.js',
	vendor: ['lodash','jquery'],
	vendor1: ['vue']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
	  names: ["vendor", "vendor1"],
      minChunks: Infinity
    })
  ]
}
