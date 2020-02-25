


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


