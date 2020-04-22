'use strict';

/**
 * webpack 打包自定义配置文件
 */

module.exports = {
  title: 'Hello Webpack', // 单页模式 html 的标题
  isMpa: false, // 是否多页面模式，默认 false 表示单页模式
  isProdConsoleLog: true, // prod 模式下是否输出 console 日志
  ieDynamicImport: true, // 针对 ie 浏览器是否需要支持 动态import 导入模块的功能（对 chrome Firefox Edge 无影响），如果在 .babelrc 中 browsers 不需要支持 ie 环境那么这里配置 false 即不用考虑任何 ie 浏览器，如果你的业务代码里没有动态import那么也设置 false 即可
  isBundleAnalyzer: false, // 是否使用 webpack-bundle-analyzer 进行打包分析
  // 配置通过 html-webpack-externals-plugin 加载远程 CDN 资源上的js文件，生产环境下 webpack.externals 会以这个配置来过滤不打包这几个模块
  cdnJs: {
    axios: 'https://cdn.bootcss.com/axios/0.18.0/axios.min.js'
  },
  // 增加 splitChunks 代码分割规则
  splitChunksCacheGroups: {}
}
