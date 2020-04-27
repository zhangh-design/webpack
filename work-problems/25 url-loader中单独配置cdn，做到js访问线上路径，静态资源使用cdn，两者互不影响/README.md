25 url-loader中单独配置cdn，做到js访问线上路径，静态资源使用cdn，两者互不影响


```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024, // 10k
          context: path.resolve(__dirname, '../src'),
          name: utils.assetsPath('img/[path][name]-[hash:8].[ext]'),
          publicPath: 'http://www.baidu.com/' // 本地访问就配置成 /
        }
      }
    ]
  }
}
```

我在 url-loader 里面加了一个 publicPath 的参数，这样我打包出来的图片资源文件（不包括 小于 limit 而被转换成 base64 内联到页面的资源）地址上就会自动带上 publicPath 的地址，这样我们就很方便的能去访问远程的图片资源了，更加不用手动的去修改图片地址。

.vue或者html文件中的 img

![image](http://i2.tiimg.com/717460/23d1e37c6f4a9c2f.jpg)

css 中的 background-image

![image](http://i1.fuimg.com/717460/f04575fd1b9b3922.jpg)