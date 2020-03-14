// 引入 html-webpack-plugin 插件
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  // entry: {
  //   main: ["./src/index.js"]
  //   /* lodash: './src/lodash.js',
  //   main: './src/index.js' */
  // },
  entry: [
    "core-js/modules/es.promise",
    "core-js/modules/es.array.iterator",
    "./src/index.js"
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]-[hash:8].[ext]",
            outputPath: "images/",
            // 字节
            limit: 10240
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
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
      },
      {
        test: /\.(woff|eot|ttf|otf|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[hash:8].[ext]",
          outputPath: "fonts/"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new CleanWebpackPlugin({
      verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "../dist")] // 清除的文件/文件夹
    })
  ],
  optimization: {
    // 同步代码的配置（异步引入的代码不需要配置 Webpack 会自动进行代码分割）
    /* splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: false,
        default: false
      }
    } */
    splitChunks: {
      chunks: "all", // initial（同步） async（异步） all（同步和异步）
      minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块
      // maxSize: 0, 可以不配置（建议不配置）
      minChunks: 1, // 模块引入的次数
      maxAsyncRequests: 5, // 一般不用改
      maxInitialRequests: 3, // 一般不用改
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        vendors: false,
        /* vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          // filename: "vendors.js" // 同步引入
        }, */
        default: false
        /* default: {
          priority: 20,
          reuseExistingChunk: true,
          // filename: 'common.js'
        } */
      }
    }
  }
};
