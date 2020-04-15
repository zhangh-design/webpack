24 output.publicPath 配置公共访问路径（js引用的路径也可以是cdn地址）

### output.publicPath 加载外部资源文件

（开发环境中不用配置，因为都在资源本地）

有的时候呢，还有这样一个场景我们说打包完的文件啊`index.html`我会把这个文件给后端做为一个后端的入口文件，但是我会把这些`js文件`上传到一个`CDN`这样的一个域名下面，那么我们打包生成的这个`index.html`前面呢或者说我就不希望它显示`main.js`或者`sub.js`了，


```
<!--不希望是main.js和sub.js-->
<script type="text/javascript" src="main.js"></script>
<script type="text/javascript" src="sub.js"></script>
```

我希望呢它前面在多一个对应的`CDN`地址的这样一个域名，比如说：

```
<script type="text/javascript" src="http://cdn.com/main.js"></script>
<script type="text/javascript" src="http://cdn.com/sub.js"></script>
```

，我希望呢打包完成之后它注入到我`index.html`上的这个打包的js文件啊前面多带一个`CDN`的域名，那现在我们手动的去改这个`index.html`肯定不靠谱。

我们可以在`output`里面配置一个内容，打开`webpack.config.js`：


```
output: {
    publicPath: 'http://cdn.com.cn/', （这只是一个测试地址）
    filename: "[name].js",
    // path 不写其实也可以，默认就会打包到 dist 目录
    path: path.resolve(__dirname, "dist")
}
```

output里面增加一个`publicPath`这里面呢我就可以增加一个`CDN`的地址了，我们在这写完之后重新运行一次打包。


```
C:\Users\nickname\Desktop\lesson>npm run bundle
```

index.html

```
<script type="text/javascript" src="http://cdn.com.cn/main.js"></script>
<script type="text/javascript" src="http://cdn.com.cn/sub.js"></script>
```

然后我们再看，这个时候打开`dist`目录打开`index.html`大家可以看到所以引入的js文件前面都会加一个`CDN`这样的地址，所以呢如果我们的项目后台用`index.html`而静态资源放到`CDN`上的情况下呢，这个时候我们就会用到`output`里面对应的`publicPath`这样的一个配置项。

