12-1 Webpack watch和和 watchOptions 监听文件修改并刷新浏览

[->watch 和 watchOptions](https://webpack.docschina.org/configuration/watch/)

[->Webpack构建优化—模块热替换和自动刷新](https://www.jianshu.com/p/d35b6b33dee4)

#### 文件监听

文件监听是在发现源码文件发生变化时，自动重新构建出新的输出文件。
Webpack官方提供了两大模块，一个是核心的webpack，一个是webpack-dev-server扩展模块。

而文件监听功能是webpack模块提供的。

---

Webpack支持文件监听相关的配置项如下：

使用 webpack 自身的监听模块不会像 webpack-dev-server 那样启动一个web服务器，只是监听文件修改后自动重新进行编译。

```
module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  // watch: true, 开启文件监听
  watchOptions: {
    // 排除 node_modules 目录的监听
    ignored: /node_modules/,
    // 文件修改保存后，等待 300 毫秒 再去执行动作，防止文件更新太快导致重新编译频率太高
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 不轮询（默认 false）
    poll: false
    // poll: 1000  默认每隔1000毫秒询问一次
  }
}
```

要让Webpack开启监听模式，有两种方式：

- 在配置文件webpack.config.js中设置watch: true。
- 在执行启动Webpack命令时，带上--watch参数，完整命令是webpack --watch。

我测试后发现如果把`poll: 5000`设置为每个5秒询问一次，那么我们修改保存文件后会等待至少5秒以上（如果`aggregateTimeout`设置了毫秒也会加上这个时间）再去执行重新编译。

我设置成 `poll: false` （不轮询）在修改保存后会立即执行编译（建议设置成 false，Vue Cli的脚手架也是设置成 false）。

我设置成 `poll: true` （轮询）在修改保存后会立即执行编译，设置成`true`主要是 如果监听没生效（当使用NFS[网络文件系统]或Vagrant[虚拟化]），试试这个选项吧。

---

webpack-dev-server支持文件监听相关的配置项如下：

（会启动一个web服务器）


```
module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    open: true,
    port: 8080,
    watchOptions: {
      // 监听到变化发生后会等500ms再去执行编译，防止文件更新太快导致重新编译频率太高
      aggregateTimeout: 500,
      // 不监听的文件或文件夹
      ignored: /node_modules/,
      // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
      // 不轮询
      poll: false
      // poll: 3000 检测到文件发生改变，3秒后在重新编译（传入false表示立即重新编译）
    }
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // }
  }
}
```

`poll`默认设置成false就可以了。

设置成`poll`为某个毫秒数会在监测到文件发生改变后再在指定的毫秒数+`aggregateTimeout`设置的毫秒数后进行轮询并重新编译。

如果当使用 Network File System (NFS) 时或者Vagrant[虚拟化]时 也有很多问题。在这些情况下，请使用轮询也就是`poll:true`。

不在NFS或者Vagrant的情况下设置成false即可。

