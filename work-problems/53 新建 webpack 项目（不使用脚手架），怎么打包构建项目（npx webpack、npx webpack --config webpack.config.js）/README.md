53 新建 webpack 项目（不使用脚手架），怎么打包构建项目（npx webpack、npx webpack --config webpack.config.js）

我执行`npm init -y`插件了一个项目，安装：

（安装最新版本）

```
npm webpack webpack-cli -D
```


项目结构：

```
dist
node_modules
src
 |-index.js
index.html
package.json
.gitignore
.editorconfig
webpack.config.js
```

package.json

```
"name": "demo",
  "version": "1.0.0",
  "description": "",
  "private": true,
  "scripts": {
    "bundle": "webpack"
  },
  "devDependencies": {
    "webpack": "^4.25.0",
    "webpack-cli": "^3.3.11",
  }
```

webpack.config.js

```
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '../dist'),
  }
}
```

好我们已经自己插件了一个 webpack 的项目并且自己又新建了配置文件`webpack.config.js`（这样webpack 不会去都它提供的默认配置了）。

然后现在的问题是我们怎么去打包构建这个项目呢？

（打开命令窗口进入到我们的项目目录）

第一种方式：

```
E:\vue-github\project\webpack\demo> webpack
```

报错，直接执行 webpack 这个指令会去找全局安装的 webpack 版本，但是我没有全局安装（并且不建议全局安装webpack的版本），如果全局没有安装的话它也不会找我们项目内的版本。

第二种方式：

会去找 webpack.config.js 这个默认配置名称的文件

```
E:\vue-github\project\webpack\demo> npx webpack
```

指定某个配置文件：

```
E:\vue-github\project\webpack\demo> npx webpack --config webpack.config.js
```

可以不会报错，前面加上 npx 的话会在我们本地的 node_modules 目录内去找 webpack 的版本。

第三种方式：

添加 scripts 命令：

package.json

```
"scripts": {
    "bundle": "webpack"
}
```

这里的 webpack 会去找项目内安装的webpack版本。

```
E:\vue-github\project\webpack\demo> npm run bundle
```

不会报错，原理和 第二种方式一样。
