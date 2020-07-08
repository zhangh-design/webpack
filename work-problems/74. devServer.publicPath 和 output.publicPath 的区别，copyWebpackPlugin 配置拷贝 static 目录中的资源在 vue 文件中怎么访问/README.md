74. devServer.publicPath 和 output.publicPath 的区别，copyWebpackPlugin 配置拷贝 static 目录中的资源在 vue 文件中怎么访问

devServer.publicPath 的意思是：

```
设置内存中的打包文件的虚拟路径映射，区别于 output.publicPath
```

output.publicPath 的意思是：

```
chunk 打包配置的路径映射，配置之后网站在访问 chunk 时会自动带上这个地址
```

两者的区别是：


devServer.publicPath 首先是配置在 devServer 开发环境中的，
如果我们配置的是 devServer.publicPath: '/b'，那么对于打包的chunk是没有关系的，但是在项目中我们访问，例如： static 目录中的不使用 webpack 打包的静态资源目录（通过 copyWebpackPlugin 自动拷贝到打包 dist 目录内，如果是devServer环境则是在内存中），那么就需要这样写：

```
<img src="/b/dev-static/2.png"/>
```

前面带上配置的'/b'。

##### 但是需要注意的是：

因为 devServer.publicPath 配置的是打包文件的虚拟路径映射，所以默认打包的chunk也会被放在'/b'这个虚拟目录内，所以我们还需要在把 output.publicPath 也配置成 '/b'，这样chunk的访问就会变成是：

```
http://localhost:8080/b/static/js/chunk-common.js
```


copyWebpackPlugin 怎么理解：

```
自动拷贝文件或者文件夹 到指定的目录，在 webpack 构建时配置自动拷贝 static 目录到 dist目录，这样在项目内的 <img src='/b/static/1.png' /> 才能正常显示。
```


copyWebpackPlugin 和 devServer ：

```
devServer 启动的本地服务如果需要访问不经过 webpack 处理的静态资源目录 static 内的文件（比如: 图片），需要使用自动拷贝插件 copyWebpackPlugin。

两个插件本身之间没有强制关联，并不是一定要都配置才能使用。
```


项目中的一些资源放在 static 目录内（不使用 webpack 打包的目录）在项目中的 vue 模板中怎么访问，并且和 devServer.publicPath 是什么关系：

```
直接使用 devServer.publicPath 配置的虚拟目录和文件本身的路径即可访问，不需要用 .. 表示路径：
<div class="home">
    <!--top轮播图 -->
    11111111111111<img src="/b/static/1.png"/>
    <img src="/b/dev-static/2.png"/>
  </div>
```



一些配置：


```
publicPath: '/b',
devServer: {
    publicPath: '/b'
},
chainWebpack: config => {
    config
      .plugin('copy')
      .init((CopyWebpackPlugin) => new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),
        to: processConfig.dev.assetsSubDirectory
      }, {
        from: path.resolve(__dirname, '../dev-static'),
        to: 'dev-static'
      }])).end();
}
```


```
<div class="home">
    <!--top轮播图 -->
    11111111111111<img src="/b/static/1.png"/>
    <img src="/b/dev-static/2.png"/>
  </div>
```


```
src
 |-源码目录 （webpack处理的目录）
static
 |-静态资源（不需要使用webpack处理）
 |-1.png
dev-static
 |-（不需要使用webpack处理）
 |-2.png
```







