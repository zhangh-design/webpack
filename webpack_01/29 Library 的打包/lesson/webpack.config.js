const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  externals: ["lodash"],
  /* externals: {
    lodash: {
        commonjs: 'lodash',
        root: "_" // 指向全局变量
    }
  }, */
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "library.js",
    library: 'library',  // 指定库的全局变量
    libraryTarget: "umd", // 支持库引入的方式 AMD、CJS、EM module、CDN
    libraryExport: 'default' // 导出的默认对象，（不需要在业务代码里在 .default 来取出 library 里的操作函数了）
    // libraryTarget: "this", // 只支持 script 标签，通过 this.library 或者 library 来获取导出对象
    // libraryTarget: "window",  // 和 this 一样
    // libraryTarget: "global" // node.js 环境下
  }
};
