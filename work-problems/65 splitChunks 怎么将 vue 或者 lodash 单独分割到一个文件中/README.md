65 splitChunks 怎么将 vue 或者 lodash 单独分割到一个文件中

我们在项目开发中肯定是会用到 webpack 的模块分割 splitChunks 这个插件的。


```
// 将 vue、vuex和vue-router单独分割成一个文件
'vue-base': {
  name: 'vue-base',
  test: /[\\/]node_modules[\\/]_vue@2.6.11@vue|_vuex@3.2.0@vuex|_vue-router@3.1.6@vue-router[\\/]/,
  priority: 0,
  filename: utils.assetsPath('js/vendor/vue-base.[chunkhash].js')
}
```

这里我把 vue、vuex和vue-router单独分割成一个文件，Chunk Names 叫做 `vue-base`，filename设置了输出路径和文件名称.

设置了 filename 默认会覆盖 output.chunkFilename 的设置。
