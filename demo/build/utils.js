'use strict'
const path = require('path')
const config = require('../config/index.js')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

// 多页面打包
exports.setMpa = function () {

}

// 动态import导入模块针对 ie 浏览器不支持的 babel 兼容配置
exports.getIEDynamicImportModule = function () {
  return {
    iterator: 'core-js/modules/es.array.iterator',
    Promise: 'core-js/modules/es.promise'
  }
}
