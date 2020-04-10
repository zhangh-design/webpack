uglifyjs-webpack-plugin 和 terser-webpack-plugin 都是压缩代码，区别是什么

**注意**

webpack 是在 v4.26.0 将默认的压缩插件从 uglifyjs-webpack-plugin 改成 teaser-webpack-plugin 的。

原因是：uglifyjs-webpack-plugin 使用的 uglify-es 已经不再被维护，取而代之的是一个名为 terser 的分支。所以 webpack 官方放弃了使用 uglifyjs-webpack-plugin，建议使用 terser-webpack-plugin。

[->详见](https://github.com/terser/terser)



