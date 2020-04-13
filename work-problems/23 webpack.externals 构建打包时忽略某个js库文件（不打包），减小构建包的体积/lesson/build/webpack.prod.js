// const merge = require("webpack-merge");
// const commonConfig = require("./webpack.common.js");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

const prodConfig = {
  mode: 'production',
  // externals: ["lodash","jquery"],
  // devtool: "cheap-module-source-map",
  // development cheap-module-eval-source-map
  // production cheap-module-source-map
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].chunk.js'
  },
  // 将 lodash 抽离不打包到构建文件中
  externals: ['lodash'],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader",
          // "css-loader",
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              modules: true
            }
          },
          'sass-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    // 对我们引入的CSS文件进行代码分割，暂时对`HMR support`模块热更新不支持，所以建议是用在生成环境下
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].chunk.css'
    }),
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')] // 清除的文件/文件夹
    })
  ],
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  }
};
module.exports = prodConfig;
// module.exports = merge(commonConfig, prodConfig);
