23 webpack.externals 构建打包时忽略某个js库文件（不打包），减小构建包的体积

webpack < 4 的版本可以配置 entry.vendor 和 webpack.optimize.CommonsChunkPlugin 来进行第三方库和业务库的打包分离。

#### 场景：

一些第三方库比如`lodash`我们在进行生产环境打包构建时是不需要将这个第三方包一起打包到最终的输出文件中的，这样的第三方依赖库完全可以把它抽离出来。

那抽离出来后有两种方式注入到项目中去使用：

- 通过CDN的方式引入 [13 html-webpack-externals-plugin 加载远程CDN资源上的js文件动态注入 index.html]
- 通过splitChunks代码分割出单独的一个文件 [21 optimization.splitChunks 将 lodash或者jquery从主打包文件中分离单独打包成文件]

externals: ["lodash"] 库代码中不将 lodash 打包到最终的输出文件中，减小包的体积和防止用户的代码中也会引入 lodash 导致重复引入。

webpack.config.js

```
module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: ["lodash"]
}
```


没有设置 externals: ["lodash"] 这个配置时将`lodash`打包到了项目中，打包的体积有`534 KiB`这么大。

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
