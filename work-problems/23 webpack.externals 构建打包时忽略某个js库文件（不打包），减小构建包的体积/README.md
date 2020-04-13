23 webpack.externals 构建打包时忽略某个js库文件（不打包），减小构建包的体积

webpack官网上对`externals`的解释：

防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。

- webpack.externals 是直接过滤掉不打包某个第三方库，需要额外引入。
- splitChunks 是分割出`node_modules`中使用到的第三方库，不需要额外引入。

#### 建议：
如果只是用到了某个第三方类库的一些功能点，那么如果这个第三方库可以通过按需的形式引入则不建议使用 externals 将类库在打包时滤掉，而是使用`splitChunks`来进行代码分割。

按需的形式引入：

```
import _isPlainObject from 'lodash/isPlainObject'
import _isNil from 'lodash/isNil'
import _has from 'lodash/has'
import _replace from 'lodash/replace'
import _isString from 'lodash/isString'

// 省略业务代码
```


#### 场景：

一些第三方库比如`lodash`、`jquery`我们在进行生产环境打包构建时是不需要将这个第三方包一起打包到最终的输出文件中的，这样的第三方依赖库完全可以把它抽离出来。


那抽离出来后怎么注入到项目中去使用：

- 通过CDN的方式引入 [13 html-webpack-externals-plugin 加载远程CDN资源上的js文件动态注入 index.html]

externals: ["lodash"] 库代码中不将 lodash 打包到最终的输出文件中，减小包的体积和防止用户的代码中也会引入 lodash 导致重复引入。

webpack.config.js

```
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: {lodash: '_'}
}
```


没有设置 externals: {lodash: '_'} 这个配置时将`lodash`打包到了项目中，打包的体积有`534 KiB`这么大。

```
E:\vue-local\project\lesson>npm run build

> lesson@1.0.0 build E:\vue-local\project\lesson
> webpack --config ./build/webpack.prod.js

clean-webpack-plugin: removed dist
Hash: f8d3ee0dc5625455df6c
Version: webpack 4.42.1
Time: 688ms
Built at: 2020-04-13 10:50:11
                       Asset     Size  Chunks                                Chunk Names
main.71110ffe54b904491337.js  534 KiB       0  [emitted] [immutable]  [big]  main
Entrypoint main [big] = main.71110ffe54b904491337.js
[1] ./src/index.js 1.39 KiB {0} [built]
[2] (webpack)/buildin/global.js 472 bytes {0} [built]
[3] (webpack)/buildin/module.js 497 bytes {0} [built]
    + 1 hidden module

WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).
This can impact web performance.
Assets:
  main.71110ffe54b904491337.js (534 KiB)
```

设置了 externals: ["lodash"] 后在进行打包：

设置后在进行打包只有`5.38 KiB`，效果还是很明显的。

```
E:\vue-local\project\lesson>npm run build

> lesson@1.0.0 build E:\vue-local\project\lesson
> webpack --config ./build/webpack.prod.js

clean-webpack-plugin: removed dist
Hash: 29192ef775412bfb5c99
Version: webpack 4.42.1
Time: 138ms
Built at: 2020-04-13 10:55:57
                       Asset      Size  Chunks                         Chunk Names
main.cb3e224cb8b6b14cd942.js  5.38 KiB       0  [emitted] [immutable]  main
Entrypoint main = main.cb3e224cb8b6b14cd942.js
[0] external "lodash" 42 bytes {0} [built]
[1] ./src/index.js 1.39 KiB {0} [built]
```
