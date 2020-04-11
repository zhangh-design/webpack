terser-webpack-plugin插件打包基础库使用

---

**注意**

webpack 是在 v4.26.0 将默认的压缩插件从 uglifyjs-webpack-plugin 改成 teaser-webpack-plugin 的，如果你的版本已经高于 4.26.0 那么不需要在手动替换。

在 v4.26.0 这个版本里面或者我之后测试又安装了 v4.25.0 这个webpack版本，发现压缩用的确实是 `uglifyjs-webpack-plugin`但是在 v4.25.0 这个版本里打包压缩`es6`的代码是不会报错的，原因就在于`uglifyjs-webpack-plugin`使用了`uglify-es`这个模块来支持`es6`代码的压缩。

我后来找了下在 v3.6.0 的webpack版本中`uglifyjs-webpack-plugin`确实没有使用`uglify-es`只使用了`uglify-js`，这样确实直接压缩没有经过 `babel` 转移的es6代码会报错。

所以这块只能说如果你用的 webpack 版本已经是 4+ 以上了那么就不需要担心这个问题了。

---

js压缩优化 用`terser-webpack-plugin`替换掉`uglifyjs-webpack-plugin`解决`uglifyjs`不支持es6语法问题。


用`terser-webpack-plugin`替换掉`uglifyjs-webpack-plugin`：

```
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
		'loader-api': './src/index.js',
		'loader-api.min': './src/index.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		// 打包基础库配置
		library: 'LoaderApiLibrary',	//指定库的全局变量
		libraryExport: 'default',		//默认即使用LoaderApiLibrary为插件的全局变量名
		libraryTarget: 'umd'			//支持库引入的方式 AMD、CJS、EM module、CDN
	},
	// mode: 'development',
	mode: 'none',	// mode 设置为none
  optimization: {
		minimize: true,
		minimizer: [
			// terser-webpack-plugin 插件的使用
			new TerserPlugin({
				include: /\.min\.js$/
			})
		]
	}
}
```


