'use strict'

// eslint-disable-next-line no-unused-vars
const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // Webpack-dev-server
    proxyTable: {},
    host: '127.0.0.1',
    port: 8080,
    hot: true,
    open: false,
    errorOverlay: true,
    notifyOnErrors: true,
    /**
     * Source Maps
     */
    devtool: 'cheap-module-eval-source-map'
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    productionSourceMap: true,
    devtool: 'cheap-module-source-map'
  }
}
