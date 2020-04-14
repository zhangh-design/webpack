
// 默认找到 webpack.config.js 进行打包

// npx webpack 执行的 wbepack 是我项目内安装的 webpack 版本，不是全局安装的版本

// npx webpack --config webpack.config.js

// 从 webpack.config_1.js 这个配置文件中读取配置进行打包
npx webpack --config webpack.config_1.js

我在 package.json 中 移除 `main` 入口 配置，并且设置安装包是 private(私有的)，这可以防止意外发布你的代码。

