## 71 我在单页面模式下 import 多次导入的 module，splitChunks 会不会把这个模块单独分割出来？

#### 场景：

我在单页面模式下 import 多次导入的 module，会不会被单独分割出来？

```
src
 |-view
   |-a.js
 |-APP.vue
 |-main.js
```

main.js

```
import a from './views/a.js'

console.log('aaaaaa ', a)
```

APP.vue

```
import a from './views/a.js'

console.log('aaaaaa ', a)
```

这里我 import 导入了两次`a.js`，那么你会不会觉得 `splitChunks` 应该把 a.js 单独分割出来呢？

#### entry 配置：

```
entry: {
    app: './src/main.js' // 单页面模式并且是一个chunk一个bundle
}
```

#### splitChunks 配置：

```
splitChunks: {
  chunks: 'all',
  minSize: 30000,
  maxSize: 0,
  minChunks: 1,
  maxAsyncRequests: 5,
  maxInitialRequests: 3, // 这里的 3 和 cacheGroups 里面的缓存组数量是匹配的
  automaticNameDelimiter: '~',
  name: true,
  cacheGroups: {
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10
    },
    default: {
      minChunks: 2,
      // minChunks: 1,
      // 我们的 a.js 可能很小不够 30000 字节的大小，所以我改成了 default 这个缓存组的 minSize 设置时 0 字节
      // 真实项目中不应该配置成 0 字节，这里是为了测试修改的
      minSize: 0,
      priority: -20,
      reuseExistingChunk: true
    }
  }
}
```

答案是：不会分割进去

为什么呢？

因为：这样我们看 default 缓存组里面我们设置了 `minChunks: 2` 这个是什么意思呢？

```
// 这里需要你理解 chunk 是什么，这里的 2 并不是你 import 的次数超过 2（import 的是 module）
 // chunk 包含着 module，可能是一对多也可能是一对一，一般一个 chunk对应一个bundle
// 所以如果我们是单页面（一个chunk一个bundke），那么其实 default 如果设置的是 2 这个缓存组也就不会进行代码的分割
minChunks: 2, // 设置成 2 如果是单页面（一个chunk一个bundke）模式那么其实是不会进到 default 这个组的

```

如果我们改用 ：

```
default: {
  // minChunks: 2,
  minChunks: 1,
  minSize: 0,
  priority: -20,
  reuseExistingChunk: true
}
```

minChunks: 1 表示只在一个 chunk 里使用，刚好我们 entry 配置就是一个 chunk ，这样构建时就可以把 a.js 单独分割成一个 含有 default 字符的文件。

但是我们说在单页面模式下不建议将 default 这样去设置，因为你本身就只有一个 chunk ，你再去分割 module 其实是没有意义的，你分割出来的这个文件也就只有你一个chunk在使用而已，又没有达到几个 chunk 公用代码的效果，所以这里配置 minChunks: 2 也是有它的道理的。

