'use strict'
// 根据不同的环境生成不同的配置
module.exports = (isDev) => {
  return {
    preserveWhitepace: true, // 去除 .vue 文件 template 模板内多余的空格
    // 将 .vue 文件中的 css 也通过 mini-css-extract-plugin 提取出来
    // 默认 false 表示 将 .vue 文件中的 css 放在 js 文件中比如动态导入的 js 模块在导入时在通过 js 将 css 代码添加到页面上
    extractCSS: !isDev, // 开发环境不提取，生产环境提取
    // 模块化，指的是这个 css 只在这个模块里有效 <style lang='less' module></style>
    cssModules: {
      // 最终我们把 css 对应的 className 去编译成这样一个根据 文件路径-文件名-以及它整个文件的内容的 hash 生成的一个独立无二的名字
      // 也就是你在 vue 文件里面写的一个 class 名字然后你通过 cssModules 这种方式去调用之后，它只有在这个文件才有效
      localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[name]-[hash:base64:5]',
      // class 的命名方式是 小驼峰
      /**
       * <di :style="$style.mainHeader"></di>
       * <style lang='less' module>
       *   .main-header{}
       * </style>
       */
      camelCase: true
    }
    // hotReload: false // 关闭 .vue 组件的 vue-loader 热重载，对 vue-style-loader 处理 css 热重载无关（vue-style-loader的热重载不会关闭）
    // 自定义 .vue 模块的 loader 用于处理 template、script、style 或者自定义的内容，比如：script默认是使用 babel-loader 来处理的
    // 意思就是说：你指定了这些 loader 之后你解析这个 vue 文件的时候它不同的模块就会使用对应的 loader 去解析它
    /* loaders: {
      docs: 'docsloader',
      js: 'coffe-loader', // 比如在 .vue 模块中写 coffe.js
      html: '', // 都可以指定自定义的 loader 来处理
      style: ''
    } */
    // 前置 loader
    // preLoader: {}
    // 后置 loader
    // postLoader: {}
  }
}
