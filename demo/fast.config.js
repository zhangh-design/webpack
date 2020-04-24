'use strict';

/**
 * webpack 打包自定义配置文件
 */

module.exports = {
  title: 'Hello Webpack', // 单页模式 html 的标题
  isAppHash: false, // 是否清除整个应用级别缓存 默认 false（如果为 true 将在项目文件内容发生改变的情况下构建后将所有文件的缓存失效，导致用户的本地缓存将失效必须重新下载所有文件）
  isMpa: false, // 是否多页面模式，默认 false 表示单页模式
  isProdConsoleLog: true, // prod 模式下是否输出 console 日志
  ieDynamicImport: false, // 针对 ie 浏览器是否需要支持 动态import 导入模块的功能（对 chrome Firefox Edge 无影响），如果在 .babelrc 中 browsers 不需要支持 ie 环境那么这里配置 false 即不用考虑任何 ie 浏览器，如果你的业务代码里没有动态import那么也设置 false 即可
  isBundleAnalyzer: false, // 是否使用 webpack-bundle-analyzer 进行打包分析
  isProdCssInline: false, // prod 模式下最终的 css 是否要内联到 style 标签内，默认 false 使用 link 引入
  isDevFriendlyErrors: true, // dev 模式下 webpack-dev-server 的打包输出的信息是否由 friendly-errors-webpack-plugin 提供（没有打包信息），false 的话可以输出构建时的打包信息
  // 配置通过 html-webpack-externals-plugin 加载远程 CDN 资源上的js文件，打包构建时 webpack 会通过分析 html-webpack-externals-plugin 中的模块将这些模块不打包到最终的 bundle 里面减小体积
  cdnJsArray: [
    {
      module: 'jquery',
      entry: 'https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js',
      global: 'jQuery', // import jquery from 'jquery'
      alias: 'jq' // 别名 import $ from 'jq'
    },
    {
      module: 'axios',
      entry: 'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
      global: 'axios'
    }
  ],
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
