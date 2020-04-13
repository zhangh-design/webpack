clean-webpack-plugin 清除上一个构建包

[->clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin)

我们每次在进行生产环境打包时都会生成一个`dist`目录用于存放执行`npm run build`打包产生的打包文件。

但是如果已经存在`dist`目录我们要在执行打包命令前手动的删除`dist`目录，可能我们每次不见得都会记得去删除，所以需要一个自动操作就是每次在构建之前自动的帮我们删除上一个版本的打包`dist`目录。


解决方法：

1. clean-webpack-plugin（建议使用）

会在`npm run build`构建之前自动执行插件，删除`dist`目录。

```
npm i clean-webpack-plugin -D
```

webpack.common.js

```
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require('path');

module.exports = {
    // 省略一些配置
    plugins: [
        new CleanWebpackPlugin({
          verbose: true, // 在命令窗口中打印`clean-webpack-plugin`日志
          cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "../dist")] // 清除的文件/文件夹
        })
  ]
}
```
