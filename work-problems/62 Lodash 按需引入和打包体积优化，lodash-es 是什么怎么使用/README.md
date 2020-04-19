62 Lodash 按需引入和打包体积优化，lodash-es 是什么怎么使用

#### lodash按需加载
lodash提供了很多可用的方法供我们使用，绝对是一个很好用且用起来得心应手的工具库。但是同时，lodash的体积也不小，我们项目中使用的大概522K，可能只是使用了几个方法，但是却把整个lodash库引入了。为了吃几条鱼，就承包了整个鱼塘，代价有点大呀！

对于这个问题，有几种方案可供选择。

#### 一.引入单个函数

　lodash整个安装完之后，引用方式： lodash/function 格式，单独引入某个函数，如

let _trim= require('lodash/trim') 或者 import trim from 'lodash/trim'

　或者 lodash 中的每个函数在 NPM 都有一个单独的发布模块，单独安装并引用部分模块，然后按以下方式引用

let _trim= require('lodash.trim') 或者 import trim from 'lodash.trim'

trim(' 123123 ')

示例：

```
import _assign from 'lodash/assign'
import _pick from 'lodash/pick'
import _isPlainObject from 'lodash/isPlainObject'
import _isNil from 'lodash/isNil'
import _has from 'lodash/has'
import _replace from 'lodash/replace'
import _isString from 'lodash/isString'
import _get from 'lodash/get'
import _eq from 'lodash/eq'
import _set from 'lodash/set'
import _keys from 'lodash/keys'
import _isObject from 'lodash/isObject'
import _cloneDeep from 'lodash/cloneDeep'
import _includes from 'lodash/includes'
import _concat from 'lodash/concat'
import _isEmpty from 'lodash/isEmpty'
import _now from 'lodash/now'
import _isUndefined from 'lodash/isUndefined'
import _isFunction from 'lodash/isFunction'
import _toUpper from 'lodash/toUpper'
import _isArray from 'lodash/isArray'
```

这样的导入是不是有点晕啊，使用到一个帮助函数就得导入一次。

#### 二.借助 lodash-webpack-plugin，babel-plugin-lodash插件优化

　　使用上述两种方式，在使用较多个lodash中方法的情况下，不太美观，且并不方便。那么我们可以借助于lodash-webpack-plugin，去除未引入的模块，需要和babel-plugin-lodash插件配合使用。类似于webpack的tree-shaking。

　　1）安装插件：npm i -S lodash-webpack-plugin babel-plugin-lodash

　　2）webpack.conf.js中

　　var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

　　plugins: [ new LodashModuleReplacementPlugin()]

3）.babelrc中配置 "plugins": ["transform-runtime","transform-vue-jsx","lodash"]

　　或者在webpack.conf.js的rules配置

{
  test: /\.(js|jsx)$/,
  loader: 'babel-loader',
  exclude: /node_modules/,
  include: [resolve('src'), resolve('test')]
  options: {plugins: ['lodash']}
}


#### 三.lodash-es结合tree-shaking

lodash-es 是着具备 ES6 模块化的版本，只需要直接引入就可以。

import {isEmpty,forIn, cloneDeep} from 'lodash-es'

这样写对比 第一种 是不是简单明了很多啊。
