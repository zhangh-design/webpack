//引入 html-webpack-plugin 插件
var HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
  // entry: './src/index.js',
  entry: {
    main: "./src/index.js",
    sub: "./src/index.js"
  },
  output: {
    publicPath: 'http://cdn.com.cn/',
    filename: "[name].js",
    // path 不写其实也可以，默认就会打包到 dist 目录
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name].[ext]",
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
              importLoaders: 2
              // modules: true
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
          name: "fonts/[name].[hash:7].[ext]"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
    }),
    new CleanWebpackPlugin({
      verbose: true, //在命令窗口中打印`clean-webpack-plugin`日志
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "dist")] //清除的文件/文件夹
    })
  ]
};
