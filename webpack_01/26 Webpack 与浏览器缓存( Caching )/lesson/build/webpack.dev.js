const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

const devConfig = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // development cheap-module-eval-source-map
  // production cheap-module-source-map
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8080,
    hot: true
    // hotOnly: true
    /* proxy: {
      '/api': 'http://localhost:3000'
    } */
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].chunk.js"
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // 开发环境我们还是使用 `style-loader`，线上环境我们使用`MiniCssExtractPlugin.loader`
          "style-loader",
          // "css-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
              modules: true
            }
          },
          "sass-loader",
          "postcss-loader"
        ]
      },{
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  // 在 development 的 mode 下打开 Tree Shaking 优化
  // development 环境下不需要使用 Tree Shaking 所有我们注释掉，这里只是为了演示效果
  // production 的mode下 Tree Shaking 会自动打开
  optimization: {
    // usedExports: true
  }
};

module.exports = merge(commonConfig, devConfig)
