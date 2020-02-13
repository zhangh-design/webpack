const path = require('path');

module.exports = {
	mode: 'development',
	// entry: './src/index.js',
	entry: {
		main: './src/index.js'
	},
	output: {
		filename: 'bundle.js',
		// path 不写其实也可以，默认就会打包到 dist 目录
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.jpg$/,
				use: {
					loader: 'file-loader'
				}
			}
		]
	}
}