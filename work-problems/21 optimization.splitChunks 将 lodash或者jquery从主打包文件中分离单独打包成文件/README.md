21 optimization.splitChunks 将 lodash或者jquery从主打包文件中分离单独打包成文件

webpack.common.js

```
module.exports = {
    mode: 'production',
    // 注意：不要设置 externals 不然 splitChunks 不会分割 lodash
    // externals: ['lodash', 'jquery'],
    // 省略其它一些配置
    optimization: {
        splitChunks: {
          chunks: 'all', // initial（同步） async（异步） all（同步和异步），推荐 all
          minSize: 30000,
          minChunks: 1, // 模块引入的次数
          maxAsyncRequests: 5, // 异步的按需加载模块最大的并行请求数，通过import()或者require.ensure()方式引入的模块，分离出来的包是异步加载的（一般不用改）
          maxInitialRequests: 3, // 初始加载网页的最大并行数（一般不用改）
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            'split-lodash': {
               // test: /[\\/]node_modules[\\/](lodash)[\\/]/, 这样并不能把 lodash 分割出来
              /*test: (module) => {
                return /lodash|moment|axios/.test(module.context);
              },*/
              test: (module) => {
                return /lodash/.test(module.context);
              },
              priority: -10,
              filename: 'split-lodash.js'
            },
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -20,
              filename: 'vendors.js'
            }
          }
        }
  }
}
```

cacheGroups 里需要配置默认的`vendors`缓存组，不然`splitChunks`会默认把 `split-lodash` 当成是`vendors`缓存组，从而导致分割出的文件名称不会是`filename`指定的 `split-lodash.js` 这个名字。



