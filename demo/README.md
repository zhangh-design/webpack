
// 默认找到 webpack.config.js 进行打包
// 执行的 wbepack 是我项目内安装的 webpack 版本，不是全局安装的版本
npx webpack

// 从 webpack.config_1.js 这个配置文件中读取配置进行打包
npx webpack --config webpack.config_1.js
