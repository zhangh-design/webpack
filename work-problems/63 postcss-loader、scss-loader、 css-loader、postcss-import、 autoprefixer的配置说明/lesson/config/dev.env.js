'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PORT: '"8082"',
  API_ROOT: '"http://192.168.1.100:8082/user/"'
})
