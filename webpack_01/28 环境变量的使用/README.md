28 环境变量的使用

这章来讲解一下webpack在打包代码的过程中怎么去使用一些环境变量。

打开之前lesson目录下的代码，在这里呢我们简单的来看一下：

这里我分为了三个配置文件分别是：

- webpack.common.js 公共配置
- webpack.dev.js 开发环境配置
- webpack.prod.js 生产环境配置

然后呢我有一个 package.json 这样的一个包文件，里面我定义了四个命令：

```
  "scripts": {
    "dev-build-profile": "webpack --profile --json > stats.json --config ./build/webpack.dev.js",
    "dev-build": "webpack --config ./build/webpack.dev.js",
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
  }
```

分别是：开发模式的命令、打包开发环境下的代码的命令以及线上代码生成的一个命令。

现在我要借助两个配置文件来帮助我们去完成对应的打包，分别是：`dev`环境的这个配置文件和线上环境的配置文件，现在我可以通过另外一种形式来对代码进行变更。

首先我打开 webpack.dev.js 这个文件大家来看啊，现在它引入了`webpack-merge`我给它删掉，引入了`webpack.common.js`我也把它删掉，最终呢大家可以看到它导出的是一个通过`merge`融合之后的配置文件，我把它做一个变更我导出的就是`dev`环境的配置文件：

webpack.dev.js

（详细的配置请看 lesson 中 build 目录下的 webpack.dev.js）

```
const webpack = require('webpack');
// const merge = require('webpack-merge');
// const commonConfig = require('./webpack.common.js');

const devConfig = {
}
module.exports = devConfig
// module.exports = merge(commonConfig, devConfig)
```

接着我们继续啊，我们在去改这个线上环境的配置文件 webpack.prod.js，这里面它也引入了`webpack-merge`我也把它干掉，那 webpack.common.js 我也去掉，下面呢导出的就是 prodConfig ：

webpack.prod.js

（详细的配置请看 lesson 中 build 目录下的 webpack.prod.js）

```
// const merge = require("webpack-merge");
// const commonConfig = require("./webpack.common.js");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const prodConfig = {

}
module.exports = prodConfig;
// module.exports = merge(commonConfig, prodConfig);
```

这种写法呢，我导出的内容就不是融合过后的配置文件而是自己独立的配置文件。

接着我打开 webpack.common.js ，在这里面我去引入`webpack-merge`然后呢我在引入`webpack.dev.js`再去引入`webpack.prod.js`这个文件：

webpack.common.js

（详细的配置请看 lesson 中 build 目录下的 webpack.common.js）

```
const merge = require("webpack-merge");
const devConfig = require("./webpack.dev.js");
const prodConfig = require("./webpack.prod.js");

module.exports = {

}
```

好，大家可以看到啊，现在`module.exports`导出的就是这样的一个js对象，那这块我可以对它做一个修改，这里面我这样去写：

```
const merge = require("webpack-merge");
const devConfig = require("./webpack.dev.js");
const prodConfig = require("./webpack.prod.js");

const commonConfig = {

}

```

写到这里大家肯定会觉得有问题啊，现在我没有往外导出任何的配置项，那这块我要怎么去写呢？

```
const merge = require("webpack-merge");
const devConfig = require("./webpack.dev.js");
const prodConfig = require("./webpack.prod.js");

const commonConfig = {

}
module.exports = (env) => {
  if(env && env.production){
    // 生产环境
    return merge(commonConfig, prodConfig)
  }else{
    // 开发环境
    return merge(commonConfig, devConfig)
  }
}
```

`module.exports` 以前我们只能导出一个对象，但现在我们可以换一个写法让它去导出一个函数，在这里面我们可以去接收到一个全局变量`env`，好这个全局变量从哪来一会我们再说，我们先这么写着，我们做一个判断如果全局变量`env`存在而且`env.production`存在，什么意思呢？如果你外部传递给我了一个全局变量
而且呢传递了一个`production`这样的属性那就说明你现在是一个线上环境否则呢就是我的开发环境，如果是线上环境我就`return merge(commonConfig, prodConfig)`这样的一个融合，如果你是线上环境我就把现在的这个`commonConfig`和线上的`prodConfig`做融合之后返回出去。

否则我就把`commonConfig`和我的这个`devConfig`做融合导出出去，这种写法呢把一个`module.exports`从一个对象改成了一个函数，那到底是导出这个线上环境的配置还是开发环境的配置取决于外部传递给我的一个全局变量也就是`env`以及`env`里面的`production`这样的一个属性。

那么我们在打包的时候啊就要往这个配置文件里去传递`env`这样的一个全局变量，我们打开 package.json：

```
  "scripts": {
    "dev-build-profile": "webpack --profile --json > stats.json --config ./build/webpack.dev.js",
    "dev-build": "webpack --config ./build/webpack.dev.js",
    "dev": "webpack-dev-server --config ./build/webpack.dev.js",
    "build": "webpack --config ./build/webpack.prod.js"
  }
```

之前我们说 `dev-build` 的时候我们用的是`webpack.dev.js`，现在我们用谁啊
我们用`webpack.common.js`：

```
"dev-build": "webpack --config ./build/webpack.common.js"
```

只不过呢在用之前这块我什么也不传递不给你传这个全局变量，也就是说我打包开发环境的代码那么我不给你传全局变量在这里面：

```
module.exports = (env)=>{
  if(env && env.production){
    // 生产环境
    return merge(commonConfig, prodConfig)
  }else{
    // 开发环境
    return merge(commonConfig, devConfig)
  }
}
```

你这个`env`就不存在，如果它不存在就会走下面这个`else`的逻辑就会给你用开发环境的配置做打包，所以这块没问题。

接着在往下去看，如果你直接运行开发环境那么这个时候呢我去用的这个配置文件也不是这个`webpack.dev.js`了也是这个`webpack.common.js`这块你也不用传这个全局变量`env`。

但是如果你打包生成线上的代码这个时候呢你用的还是`webpack.common.js`这个配置文件但是在这里你要向里面传递一个全局变量了，怎么传递我们写一个`--env.production`直接这么写的意思就是：我通过全局变量向 webpack 的配置文件里
面传递一个属性`production`它的值呢默认就是`true`所以这么写就可以了。


```
  "scripts": {
    "dev-build-profile": "webpack --profile --json > stats.json --config ./build/webpack.common.js",
    "dev-build": "webpack --config ./build/webpack.common.js",
    "dev": "webpack-dev-server --config ./build/webpack.common.js",
    "build": "webpack --env.production --config ./build/webpack.common.js"
  }
```

写完了之后我们保存看一看能不能实现我们想要的效果`npm run build`：

```
C:\Users\nickname\Desktop\lesson>npm run build

> lesson@1.0.0 build C:\Users\nickname\Desktop\lesson
> webpack --env.production --config ./build/webpack.common.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --env.production --config ./build/webpack.common.js
clean-webpack-plugin: removed dist
Hash: d84e0443a91bba57b170
Version: webpack 4.42.0
Time: 1435ms
Built at: 2020-04-08 22:20:18
Asset       Size  Chunks                         Chunk Names
index.html  314 bytes          [emitted]
main.0595bae47506b3dbe036.js   7.93 KiB       0  [emitted] [immutable]  main
vendors~main.cb6aec30dc0a4c425683.chunk.js   67.6 KiB       1  [emitted] [immutable]  vendors~main
Entrypoint main = vendors~main.cb6aec30dc0a4c425683.chunk.js main.0595bae47506b3dbe036.js
```

好大家可以看到它会打包生成这样的一堆文件，那实际上呢这就是线上我们想要的文件。

如果我重新在打包一下`npm run dev-build`（我们打包生成开发环境的代码）：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.common.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.common.js
clean-webpack-plugin: removed dist
Hash: fbfd65a9589432922a3d
Version: webpack 4.42.0
Time: 1490ms
Built at: 2020-04-08 22:25:08
                Asset       Size        Chunks             Chunk Names
           index.html  272 bytes                [emitted]
              main.js   36.4 KiB          main  [emitted]  main
vendors~main.chunk.js    267 KiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.chunk.js main.js
```

你会发现现在打包生成了三个文件，那它呢就是一个开发环境里我们要用到的代码，和之前我们分开通过不同的配置文件进行打包产生的这个最终的代码结果没有任何的差异，只不过这样去编写代码的时候呢我们就不是通过不同的配置文件来去生成不同的打包结果，而是都通过一个配置文件也就是`webpack.common.js`这一个文件呢进行代码的生成，只不过我们通过一个变量啊去控制最终到底怎么去打包，如果你传了`production`那么你就去按照这个线上环境打包生成对应的代码，如果你传递`env`那就按照开发环境去打包代码，所以这样的话我们把代码做了一个变更之后呢我们就通过这个全局变量的形式来完成不同环境对应代码的打包了。

当然全局变量你不仅可以这么去传：

```
"build": "webpack --env.production --config ./build/webpack.common.js"
```

你还可以去直接`--env production`：

```
"build": "webpack --env production --config ./build/webpack.common.js"
```

如果你这么去传`production`的话，那么在这里你接收的就不是这个`env`了，你接收的直接就是这个`production`，所以这块你可以这么去写：

```
module.exports = (production)=>{
  if(production){
    // 生产环境
    return merge(commonConfig, prodConfig)
  }else{
    // 开发环境
    return merge(commonConfig, devConfig)
  }
}
```

当然呢在这里你还可以通过其它的写法，比如说你让`production=abc`：

```
"build": "webpack --env.production=abc --config ./build/webpack.common.js"
```

那`webpack.common.js`里面呢你就可以这么去写了：

```
module.exports = (env)=>{
  if(env && env.production === 'abc'){
    // 生产环境
    return merge(commonConfig, prodConfig)
  }else{
    // 开发环境
    return merge(commonConfig, devConfig)
  }
}
```

所以外部传递的这个全局变量`env`啊它的值你可以自由的去切换，可以根据不同的值来做不同的处理，那都可以通过这个环境变量来实现。

所以这节课呢就给大家讲解一个知识点，就是如何在 webpack 打包的过程中去使用这样的一个全局变量，那在很多的脚手架工具里面你会发现啊
有的时候它确实会通过环境变量里面的这个`production`的值来去决定后面到底要用哪些配置文件进行打包，那如果见到这种形式的环境区分，大家也要能够区分的清楚，但是在后面呢我们还是不会采用这种形式还是会采用之前的那种形式分别用
`webpack.prod.js`和`webpack.dev.js`来区分它对应的环境，那这节课呢只是为了帮助大家去理解 webpack 中的全局变量这个概念，那大家有个印象就可以了。
