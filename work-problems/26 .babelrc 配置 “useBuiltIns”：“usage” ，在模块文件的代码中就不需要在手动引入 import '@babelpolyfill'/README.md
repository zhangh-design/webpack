26 .babelrc 配置 "useBuiltIns": "usage" ，在模块文件的代码中就不需要在手动引入 import '@babel/polyfill'

`"useBuiltIns": "usage"`它的意思是什么呢，它的意思是当我做这个@babel/polyfill填充的时候去往这个页面上啊去加一些低版本浏览器可能不存在的特性的时候，我不是把所有的特性都加进来，我是根据你的业务代码来决定到底要加什么的.

你这里业务代码里用到了Promise那我就去加Promise的代码。

你用到了这个map那我就去加map这个方法，如果你在index.js里没用到map那我压根就不把map打包到main.js里。

useBuiltIns: 'usage'就是这个意思。

如果我们不配置`useBuiltIns: 'usage'`那么我们会把整个`@babel/polyfill`
中的转义代码都导入我们的打包文件中导致打包文件变的很大。

[[->详情请看 webpack_01/15 使用 Babel 处理 ES6 语法（1）](https://github.com/zhangh-design/webpack/tree/master/webpack_01/15%20%E4%BD%BF%E7%94%A8%20Babel%20%E5%A4%84%E7%90%86%20ES6%20%E8%AF%AD%E6%B3%95%EF%BC%881%EF%BC%89#babelpolyfill)]

---

我在`.babelrc`的配置文件中是这样配置的：

.babelrc

```
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        // 这个 corejs 一定要配置，Babel在7.4.0以后想要安装corejs这个核心库
        "corejs": {
          "version": 3
        },
        "targets": {
          "chrome": "67"
          // "ie": 11 // 打包时 ie 兼容性配置
        }
      }
    ]
  ]
}

```

然后我在我的业务代码`src`目录下的`index.js`是这样写的：

index.js

```
import '@babel/polyfill';

// 业务代码
```

然后我运行`npm run start`启动`webpack-dev-server`服务器：

```

C:\Users\nickname\Desktop\lesson>npm run start

> webpack-demo@1.0.0 start C:\Users\nickname\Desktop\lesson
> webpack-dev-server


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack-dev-server@3.10.3@webpack-dev-server\bin\webpack-dev-server.js"
i ｢wds｣: Project is running at http://localhost:8080/
i ｢wds｣: webpack output is served from /
i ｢wds｣: Content not from webpack is served from ./dist

============ 注意：这里有这么个提示 =============

  When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
  Please remove the direct import of `core-js` or use `useBuiltIns: 'entry'` instead.
clean-webpack-plugin: removed dist
i ｢wdm｣: Hash: 0645f247e282fbd45299
Version: webpack 4.42.1
Time: 3208ms
Built at: 2020-04-12 22:44:35
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js    919 KiB    main  [emitted]  main
Entrypoint main = main.js
```

这句提示：

`  When setting `useBuiltIns: 'usage'`, polyfills are automatically imported when needed.
  Please remove the direct import of `core-js` or use `useBuiltIns: 'entry'` instead.`

也就是说我们已经配置了`"useBuiltIns": "usage"`这个配置了，那么就不需要在代码中在手动引入`import '@babel/polyfill'`。

所以我这里把`import '@babel/polyfill'`手动引入`polyfill`这个垫片的代码注释掉，然后在运行`npm run start`重新启动服务器就没有在报出这个提示语句了。
