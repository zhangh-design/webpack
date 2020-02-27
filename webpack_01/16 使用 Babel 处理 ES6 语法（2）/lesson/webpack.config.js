// 引入 html-webpack-plugin 插件
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  // development cheap-module-eval-source-map
  // production cheap-module-source-map
  entry: {
    main: ['./src/index.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8080
    /* proxy: {
      '/api': 'http://localhost:3000'
    } */
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
        // options: {
        // 业务代码使用的配置
        /* presets: [['@babel/preset-env', {
            useBuiltIns: 'usage',
            corejs: 3,
            targets: {
              chrome: '67'
            }
          }]] */
        // 类库或者组件库代码使用的配置
        /* plugins: [['@babel/plugin-transform-runtime', {
            absoluteRuntime: false,
            corejs: 3,
            helpers: true,
            regenerator: true,
            useESModules: false,
            version: '^7.8.4'
          }]] */
        // }
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:8].[ext]',
            outputPath: 'images/',
            // 字节
            limit: 10240
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
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
        test: /\.(woff|eot|ttf|otf|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]',
          outputPath: 'fonts/'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')] // 清除的文件/文件夹
    })
  ]
};
