uglifyjs-webpack-plugin 和 terser-webpack-plugin 都是压缩代码，区别是什么

webpack 是在 v4.26.0 将默认的压缩插件从 uglifyjs-webpack-plugin 改成 teaser-webpack-plugin 的，如果你的版本已经高于 4.26.0 那么不需要在手动替换。

我在执行：

```
cnpm i webpack webpack-cli -D
```

安装 webpack 之后（我这里安装的最高版本是 `"webpack": "^4.42.1"`）默认已经把`terser-webpack-plugin`安装到`node_modules`中，不需要在手动安装（webpack打包时也就不会出现压缩`es6`代码出现报错）。

我在执行：

```
cnpm i webpack@^3.10.0 -D
```

安装 webpack 之后在`node_modules`目录中发现`^3.10.0`这个版本默认安装的`uglifyjs-webpack-plugin`的版本是`0.4.6`并没有自带安装上`uglify-es`这个模块（`uglify-js`是有的），然后我在`src`目录里的`index.js`是这么写的：

index.js

```
const add = (a, b) => {
	const c = ' hello';
	return a+b+c;
}
export default add;

```

打包执行`npm run build`会报错：

```
C:\Users\nickname\Desktop\vue-low>npm run build

> vue-low@1.0.0 build C:\Users\nickname\Desktop\vue-low
> webpack


C:\Users\nickname\Desktop\vue-low>"node"  "C:\Users\nickname\Desktop\vue-low\node_modules\.bin\\..\_webpack@3.12.0@webpack\bin\webpack.js"
Hash: 172df76cb39cbff3b841
Version: webpack 3.12.0
Time: 77ms
    Asset     Size  Chunks             Chunk Names
bundle.js  2.73 kB       0  [emitted]  main
   [0] ./index.js 87 bytes {0} [built]

ERROR in bundle.js from UglifyJs
Invalid assignment [bundle.js:72,19]
```

然后我把`uglifyjs-webpack-plugin`的版本升级了下：

```
cnpm install uglifyjs-webpack-plugin@^1.1.1 -D
```

这个版本安装时会自带上`uglify-es`和`uglify-js`这两个模块，那`uglify-es`就是专门用于压缩`es6`代码的，这样在打包压缩带有`es6`代码的模块时就不会报错了。



在 v4.26.0 这个版本里面或者我之后测试又安装了 v4.25.0 这个webpack版本，发现压缩用的确实是 `uglifyjs-webpack-plugin`但是在 v4.25.0 这个版本里打包压缩`es6`的代码是不会报错的，原因就在于`uglifyjs-webpack-plugin`使用了`uglify-es`这个模块来支持`es6`代码的压缩。

所以这块只能说如果你用的 webpack 版本已经是 4+ 以上了那么就不需要担心这个问题了。

==还有就是如果代码在之前已经使用`babel`进行了`es6`转`es5`的操作了那么就算没有`uglify-es`这个模块打包也是不会报错的，因为我们的代码在压缩前已经被转义成了`es5`的语法了。==




