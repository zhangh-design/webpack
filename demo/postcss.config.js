module.exports = {
  plugins: [
    // @import 引入的 scss、less、css 样式文件再次调用执行预处理器 Loader 编译引入的文件
    // css-loader 的 importLoaders 配置参数也是用于配置 css-loader 作用于 @import 的资源之前有多少个 loader，但 importLoaders 需要指定 @import 的资源之前的 loader 个数
    // require('postcss-import'), // 我配置了 css-loader 的 importLoaders 所以这里就注释了
    // 根据 .browserslistrc 自动添加浏览器厂商前缀（webkit、moz、ms）
    require('autoprefixer')
  ]
}
