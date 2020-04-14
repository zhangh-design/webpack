babel-loader 转义es6后压缩代码是否还一定要用 terser-webpack-plugin 用 uglifyjs-webpack-plugin 可不可以

这个是可以的。

首先 uglifyjs-webpack-plugin 在 webpack v4.26.0 到 webpack v4 的各个版本之间还是默认的压缩插件，它里面已经默认安装了`uglify-js`和`uglify-es`这两个模块。

在 webpack 3 的版本时 uglifyjs-webpack-plugin 如果版本过低导致没有自带上`uglify-es`这个压缩`es6`代码的模块，我们可以把 uglifyjs-webpack-plugin 升级到 ^1.1.1 的版本就会带上`uglify-es`。

```
cnpm install uglifyjs-webpack-plugin@^1.1.1 -D
```

那如果是已经用 babel-loader 转成`es5`的语法了也就是说现在我们的代码里已经没有`es6`的语法代码了，自然在压缩时不会报错了。
