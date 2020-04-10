terser-webpack-plugin插件打包基础库使用

**注意**

webpack 是在 v4.26.0 将默认的压缩插件从 uglifyjs-webpack-plugin 改成 teaser-webpack-plugin 的，如果你的版本已经高于 4.26.0 那么不需要在手动替换。

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


