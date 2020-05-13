
问题：

我在进行 splitChunks 配置 cacheGroups 时遇到一个奇怪的问题，。

看下我得配置：

```
splitChunks: {
    chunks: 'all', // initial（有共用的情况即发生拆分）async（异步 动态引入的模块不受影响，它是无论如何都会被拆分出去的）all（同步和异步），推荐 all
    minSize: 30000, // 模块最小尺寸，30K，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了
    maxSize: 0, // 模块最大尺寸，0为不限制
    minChunks: 1, // 默认1，被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
    maxAsyncRequests: 5, // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了（一般不用改）
    maxInitialRequests: 3, // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了（如果 cacheGroups 设置的缓存组个数超过了 maxInitialRequests 这个参数的值那么将无法分割出超过的文件，而会把需要分割的缓存组文件放到其它的组里去）
    automaticNameDelimiter: '~', // 打包文件名分隔符
    name: true, // 拆分出来文件的名字，默认为 true，表示自动生成文件名，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个
    // 同步导入进入的分割规则，异步动态import使用 魔法注释
    cacheGroups: {
      /* vendors: {
        test: /[\\/]node_modules[\\/]/, // 正则规则，如果符合就提取 chunk
        priority: -10 // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
      }, */
      vendors: false,
      vueBase: {
        name: 'vueBase',
        // test: /_vue@2.6.11@vue|_vuex@3.3.0@vuex|_vue-router@3.1.6@vue-router/ig, // /vue/ig 这样写会匹配到 vuex vue-router 这些其它包含 vue 字符的库
        test: /[\\/]node_modules[\\/](_vue@2.6.11@vue)[\\/]|[\\/]node_modules[\\/](_vuex@3.3.0@vuex)[\\/]|[\\/]node_modules[\\/](_vue-router@3.1.6@vue-router)[\\/]/ig,
        enforce: true,
        priority: 10
        // filename: utils.assetsPath('js/vendor/vueBase.[chunkhash].js')
      },
      fastElemntUi: {
        name: 'fastElementUi',
        test: /[\\/]node_modules[\\/](_fast-element-ui@0.1.32@fast-element-ui)[\\/]/ig, // _fast-element-ui@0.1.32@fast-element-ui
        priority: 5,
        enforce: true
      },
      axiosApiQuery: {
        name: 'axiosApiQuery',
        test: /axios-api-query/ig,
        priority: 10,
        enforce: true
        // priority: 10
      },
      otherDependencies: {
        name: 'otherDependencies',
        test: /vdjs|querystring|nprogress|moment|lodash-es|element-ui|vuex-persistedstate/ig,
        enforce: true
        // priority: 10
      },
      default: {
        // 这里需要你理解 chunk 是什么，这里的 2 并不是你 import 的次数超过 2，import 的是 module
        // chunk 包含着 module，可能是一对多也可能是一对一，一般一个 chunk对应一个bundle
        // 所以如果我们是单页面（一个chunk一个bundke），那么其实 default 如果设置的是 2 这个缓存组也就不会进行代码的分割
        // minChunks: 2,
        minSize: 0,
        priority: -20,
        reuseExistingChunk: true // 是否使用已有的 chunk，如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的。
      }
    }
}
```

我在  cacheGroups 里面配置了好几个缓存组为得是把一些第三方得依赖库单独分割出来成一个文件，但是





