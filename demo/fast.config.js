'use strict';

/**
 * webpack 打包自定义配置文件
 */

module.exports = {
  title: 'Hello Webpack', // 单页模式 html 的标题
  isAppHash: false, // 是否清除整个应用级别缓存 默认 false（如果为 true 将在项目文件内容发生改变的情况下构建后将所有文件的缓存失效，导致用户的本地缓存将失效必须重新下载所有文件）
  isMpa: false, // 是否多页面模式，默认 false 表示单页模式
  isProdConsoleLog: true, // prod 模式下是否输出 console 日志
  ieDynamicImport: true, // 针对 ie 浏览器是否需要支持 动态import 导入模块的功能（对 chrome Firefox Edge 无影响），如果在 .babelrc 中 browsers 不需要支持 ie 环境那么这里配置 false 即不用考虑任何 ie 浏览器，如果你的业务代码里没有动态import那么也设置 false 即可
  isBundleAnalyzer: false, // 是否使用 webpack-bundle-analyzer 进行打包分析
  externals: {
    jquery: 'jQuery',
    echarts: 'echarts',
    axios: 'axios'
  }, // 抽离库不打包到构建文件中减小构建包体积，但要通过 script 标签在外部引入，需要和下面的 cdnJs 配合一起使用
  // 配置通过 html-webpack-externals-plugin 加载远程 CDN 资源上的js文件，生产环境下 webpack.externals 会以这个配置来过滤不打包这几个模块
  cdnJs: {
    axios: 'https://cdn.bootcss.com/axios/0.18.0/axios.min.js'
  },
  // 增加 splitChunks 代码分割规则
  splitChunksCacheGroups: {},
  // 全局提供帮助类库和工具函数（暴露全局变量）
  providePlugin: {
    $: 'jquery',
    _assign: ['lodash', 'assign'],
    _join: ['lodash', 'join'],
    _pick: ['lodash', 'pick'],
    _isPlainObject: ['lodash', 'isPlainObject'],
    _isNil: ['lodash', 'isNil'],
    _has: ['lodash', 'has'],
    _replace: ['lodash', 'replace'],
    _isString: ['lodash', 'isString'],
    _get: ['lodash', 'get'],
    _eq: ['lodash', 'eq'],
    _set: ['lodash', 'set'],
    _keys: ['lodash', 'keys'],
    _isObject: ['lodash', 'isObject'],
    _cloneDeep: ['lodash', 'cloneDeep'],
    _includes: ['lodash', 'includes'],
    _concat: ['lodash', 'concat'],
    _isEmpty: ['lodash', 'isEmpty'],
    _isUndefined: ['lodash', 'isUndefined'],
    _isFunction: ['lodash', 'isFunction'],
    _toUpper: ['lodash', 'toUpper'],
    _isArray: ['lodash', 'isArray'],
    _find: ['lodash', 'find'],
    _every: ['lodash', 'every'],
    _map: ['lodash', 'map'],
    _forEach: ['lodash', 'forEach']
  }
}
