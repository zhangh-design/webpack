64 webpack 配置文件中 process.env.NODE_ENV 环境变量的设置

#### 场景：

我在 webpack.base.js 配置文件里要区分开发和生产环境的两种模式对应去做一些却别，但是我输出

```
console.log(process.env.NODE_ENV); // undefined
```

`NODE_ENV` 时却很奇怪为什么是 `undefined` 呢，这样我不是没法去区别 开发和生产环境了吗？

#### 解决办法：

有两种方式来判断当前的环境变量：

1. 使用环境变量，例如 cross-env + NODE_ENV;
2. 使用 Webpack 配置文件的function 方式。

##### cross-env 方式

```
npm i -D cross-env
```

然后修改npm scripts内容：

```
"dev": "cross-env NODE_ENV=deveopment PORT=9099 webpack-dev-server --progress --config ./build/webpack.dev.js",
"build": "cross-env NODE_ENV=production webpack --config ./build/webpack.prod.js",
```

在 scripts 的指令里可以指定`process.env`的变量，比如我在开发环境指定了 `NODE_ENV`和`PORT`两个变量。

最后在webpack.base.js中使用环境变量：

```
// webpack.base.js
const isProduction = process.env.NODE_ENV === 'production';
//....
module.exports = {
    // ...
    devtool: isProduction ? null : 'source-map'
};
```

##### function配置

Webpack 的配置可以是对象，也可以是函数，如果是 function 则接受一个 mode 参数，即开发环境打包还是生产环境打包。利用这一点我们可以做下面的配置。

首先是修改npm scripts添加--mode选项：

```
// package.json
{
    "scripts": {
        "build": "webpack --mode production --config webpack.config.js"
    }
}
```

然后我们可以将配置文件改成 function 类型的配置：

```
// 以webpack.config.js为例
module.exports = mode => {
    if (mode === 'production') {
        // 生产环境
    } else {
        // 开发环境
    }
};
```

