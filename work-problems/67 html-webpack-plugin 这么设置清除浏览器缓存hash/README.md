67 html-webpack-plugin 这么设置清除浏览器缓存hash

有的时候我们想让用户本地的缓存都失效，重新下载一遍网站上对应的所有资源，那该怎么做呢？

我们可以给 html-webpack-plugin 设置一个 `hash` 参数，先看下 官方对它的解释：

名称 | 类型 | 默认 | 描述
---|---|---|---
hash | boolean | false | 如果是，true则将唯一的webpack编译哈希值附加到所有包含的脚本和CSS文件中。这对于清除缓存很有用

webpack配置

```
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: "Hello",
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../public/index.html'),
      favicon: path.resolve(__dirname, '../public/favicon.ico'),
      hash: true, // 清除缓存
      inject: true // 默认 true，将脚本注入到body元素的底部
    })
  ]
}
```

我们看下设置 hash: true 之后 index.html 运行的截图

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa6k3y0MHUaOflbm2oZ8D8rDur9rKrlUnGzgGkUK6bm5c1pJk5yGcLXkRn00EeKYvOsdQmK*NEK0dcaOiNfBHMVg!/b&bo=BwI0AQAAAAARFxA!&rf=viewer_4&t=5)

设置 hash: true 之后每一个打包出的 chunk 后面都跟上了一个随机数，那这个随机数就是由 html-webpack-plugin 加上去的，而且在我们每次修改代码也就是文件内容发生改变之后再构建的话这个随机数就会发生变化，这样用户上一次再本地缓存的文件资源也就都会失效了。

