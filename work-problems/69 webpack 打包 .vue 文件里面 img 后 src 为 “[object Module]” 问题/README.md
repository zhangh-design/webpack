69 webpack 打包 .vue 文件里面 img 后 src 为 “[object Module]” 问题

#### 场景：

发现在 login.vue 中写的 img 在 webpack 打包后变成了一个 "[object Module]" 的对象，该怎么解决这个问题呢？

![image](http://i1.fuimg.com/717460/63692c23abb67bee.jpg)

#### 解决办法：


```
{
    test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      esModule: false,
      limit: 8 * 1024, // 8kb
      context: path.resolve(__dirname, '../src'),
      name: utils.assetsPath('img/[path][name]-[hash:8].[ext]'),
      publicPath:
        process.env.NODE_ENV === 'production'
          ? config.build.urlLoaderPublicPath
          : config.dev.urlLoaderPublicPath // http://www.baidu.com/
    }
}
```

把 `url-loader` 里面的 `esModule` 设置为 false，如果是 `file-loader` 也是一样。

