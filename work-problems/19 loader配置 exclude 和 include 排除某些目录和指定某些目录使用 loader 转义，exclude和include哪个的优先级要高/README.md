19 loader配置 exclude 和 include 排除某些目录和指定某些目录使用 loader 转义，exclude和include哪个的优先级要高

如果exclude 和include同时存在，则exclude权限比较高

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: Path.resolve(__dirname, '../src'),
        loader: "babel-loader"
      }
    ]
  }
}
```

exclude: /node_modules/ 它也会执行这个 babel-loader，但是这次 loader 的执行有没有任何的意义呢？

其实是没有任何的意义的，因为一般我们去引入第三方的模块的这种js文件的时候，这个js文件已经被打包编译过了，你没有必要在这在对它进行一个 babel 的 es6 转 es5 的转义了，所以呢如果你这么去写：

```
{
    test: /\.js$/,
    // exclude: /node_modules/,
    use: [{loader: 'babel-loader'}]
    // loader: "babel-loader"
}
```

让它额外的进行一次转义的话就会降低打包的速度，所以在这我们可以加一个 exclude: /node_modules/ 就可以很好的提高 js 模块的打包速度。

当然大家注意啊，这里不仅可以写exclude这样的一个语法，你还可以写一个include这样的一个语法，那include后面呢我们可以使用Path.resolve这个函数：

```
{
    test: /\.js$/,
    // exclude: /node_modules/,
    include: Path.resolve(__dirname, '../src'),
    use: [{loader: 'babel-loader'}]
    // loader: "babel-loader"
}
```

那它的意思是什么呢？ 当我遇到一个js文件或者js模块的时候只有它在哪个文件夹下呢，只有它在我们的src源代码文件夹下我去引入这样的文件的时候才会去使用babel-loader做一下语法的转换，那如果你去引入其它目录下比如说啊这个node_modules 目录下的一些文件的话那就不会去走这个babel-loader。

