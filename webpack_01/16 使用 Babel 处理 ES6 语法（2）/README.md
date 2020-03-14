16 使用 Babel 处理 ES6 语法（2）

#### "targets": {"chrome": "67"} 指定运行环境

当然呢`@babel/preset-env`也可以配置一些其它额外的参数，比如说我们去找一下：

打开[Babel](https://www.babeljs.cn/docs/)的官网找到[Usage Guide（指南）](https://www.babeljs.cn/docs/usage)，我们往下翻一下，这里它还可以写`targets`这样的配置属性：

```
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      presets: [['@babel/preset-env', {
        useBuiltIns: 'usage',
        // 这个 corejs 一定要配置，Babel在7.4.0以后想要安装corejs这个核心库
        corejs: {
          version: 3
        },
        "targets": {
          "chrome": "67"
        },
      }]]
    }
}
```

注意：如果你需要在`ie 11`下运行还需要增加`ie`的`targets`配置：

```
"targets": {
  "edge": "17",
  "ie": "11",   // ie和edge不一样需要单独配置
  "firefox": "60",
  "chrome": "67",
  "safari": "11.1"
}
```

它的意思是呢，我的这个项目啊其实打包会运行在大于`67`这个版本的Chrome浏览器下，那么`babel`你在打包的过程中呢你使用这个`preset-env`结合这个`@babel/polyfill`要去把`ES6`的语法变成`ES5`的语法这个过程中呢你来看是否有必要做这些`ES6`到`ES5`的转换，是否有必要往我的这个代码里去注入一些`Promise`啊`map`啊这样的函数，如果你发现`Chrome`浏览器67以上的版本它里面对`ES6`支持的就很好了，那你呢其实完全没有必要再去帮我们做`ES6`转`ES5`的这样的操作，也没有必要在去注入`Promise`和`map`这样的方法了。
 
我们这样配置过后再来打包：

```
C:\Users\nickname\Desktop\lesson_3>npx webpack

C:\Users\nickname\Desktop\lesson_3>"node"  "C:\Users\nickname\Desktop\lesson_3\node_modules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: removed dist
Hash: b27e42917ba56cacec49
Version: webpack 4.41.6
Time: 2162ms
Built at: 2020-02-25 21:50:24
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
========= 注意：这里在设置了 chrome的版本之后打包的体积==============
   main.js   5.41 KiB    main  [emitted]  main
Entrypoint main = main.js
```

打包完成了，你会发现`main.js`变成了5.4KB，然后你可以打开`dist`目录下的`main.js`这个文件在翻到最下面，大家可以看到：

```
/***/ (function(module, exports) {

eval("const arr = [new Promise(() => {\n  console.info('done-1');\n}), new Promise(() => {\n  console.info('done-2');\n})];\narr.map((item, index) => {\n  console.info(index);\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvaW5kZXguanMuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanM/YjYzNSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgJ0BiYWJlbC9wb2x5ZmlsbCc7IC8vIOS5n+WPr+S7peWcqCBlbnRyeSDmiZPljIXlh7rphY3nva7vvIjljZXni6zkvb/nlKggaW1wb3J0IOW8leWFpSBCYWJlbOWumOaWueS4jeaOqOiNkO+8iVxyXG5cclxuLyogaW1wb3J0ICdjb3JlLWpzL3N0YWJsZSc7XHJcbmltcG9ydCAncmVnZW5lcmF0b3ItcnVudGltZS9ydW50aW1lJzsgKi9cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xyXG5jb25zdCBhcnIgPSBbXHJcbiAgbmV3IFByb21pc2UoKCkgPT4ge1xyXG4gICAgY29uc29sZS5pbmZvKCdkb25lLTEnKTtcclxuICB9KSxcclxuICBuZXcgUHJvbWlzZSgoKSA9PiB7XHJcbiAgICBjb25zb2xlLmluZm8oJ2RvbmUtMicpO1xyXG4gIH0pXHJcbl07XHJcblxyXG5hcnIubWFwKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gIGNvbnNvbGUuaW5mbyhpbmRleCk7XHJcbn0pO1xyXG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFHQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/index.js\n");

/***/ }),
```

大家可以看到是`const`，还是`map`，这是为什么呀？

因为在打包的过程中我们发现`Chrome 67`版本以上的浏览器里面完全都支持`ES6`
了，那么这个`babel`以及这个`preset-env`它在打包的过程中就直接的忽略掉`ES6`转`ES5`因为没有必要，你打包生成的代码反正在`Chrome` 67以上的版本运行，那它本身就支持`ES6`了我在帮你转`ES5`没有任何的意义，所以它根本就不再做转换了。

那通过现在我们的配置，实际上在我们代码里面去写任何`ES6`的代码都不在会有任何的问题了，而且我们在配置里面使用了`useBuiltIns`这个配置参数，这就使得我们在打包的过程中啊会根据我业务代码的需求来注入`@babel/polyfill`里面对应的内容，那我们的代码体积可以明显的减少。

如果你在编写一些业务代码的话需要用到`babel`，你参考这节课我给你的配置方案就可以了，但是这个方案也不是所有场景都适用的：

#### babel 组件库或者类库的配置 `@babel/plugin-transform-runtime`

比如说你在开发一个类库的时候或者说呢开发一个第三方模块的时候或者呢开发一个组件库的时候呢，那你用`@babel/polyfill`这种方案呢实际上是有问题的，因为啊它在注入这种`Promise`或者`map`方法时候啊它会通过全局变量的形式来注入会污染到全局环境，所以呢如果你在打包一个`UI`组件库后者类库这样的情况下的时候你要换一种打包的方式或者换一种配置的方式。

我们来看怎么去配置：

首先我们把写在`index.js`顶部的 `import` 语句注释掉。

index.js

```
// import '@babel/polyfill'; // 也可以在 entry 打包出配置（单独使用 import 引入 Babel官方不推荐）

const arr = [
  new Promise(() => {
    console.info('done-1');
  }),
  new Promise(() => {
    console.info('done-2');
  })
];

arr.map((item, index) => {
  console.info(index);
});
```

然后我们打开[babel](https://www.babeljs.cn/docs/)的官方网站，在左侧找到[transform-runtime](https://www.babeljs.cn/docs/babel-plugin-transform-runtime)这样的一个模块。

然后呢我们来安装这个`@babel/plugin-transform-runtime`这个东西：

```
F:\github-vue\workspaces\lesson>cnpm install --save-dev @babel/plugin-transform-
runtime
```

好，安装完了之后呢我们还要安装一个`@babel/runtime`的模块：

```
F:\github-vue\workspaces\lesson>cnpm install --save @babel/runtime
```

安装完之后，接着你要做的事情呢就是在`babel`对应的这个`loader`的参数里面啊增加这样的一个`plugins`的配置参数：

在`babel-loader`的`options`里面我们不做`presets`的配置了，取而代之我们加一个`plugins`这个呢就是刚才我们安装的这个`@babel/plugin-transform-
runtime`：

webpack.config.js

```
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      /* presets: [['@babel/preset-env', {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          chrome: '67'
        }
      }]] */
      plugins: ['@babel/plugin-transform-runtime']
    }
}
```

继续我们再来看，这个`plugin`呢其实你也要接收几个参数对这个参数做配置，那我们呢这么来做配置：

webpack.config.js

这里我可以配置4个属性

```
{
    test: /\.js$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      /* presets: [['@babel/preset-env', {
        useBuiltIns: 'usage',
        corejs: 3,
        targets: {
          chrome: '67'
        }
      }]] */
      plugins: [['@babel/plugin-transform-runtime', {
        corejs: 3,
        helpers: true,
        regenerator: true,
        useESModules: false
      }]]
    }
}
```

corejs我在项目中安装的是`corejs@3`所以这里填3，`helpers`、`regenerator`和`useESModules`你可以不动。

然后我们在重新打包我们的项目：

```
F:\github-vue\workspaces\lesson>npx webpack

F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: pausing due to webpack errors
Hash: af633570f6c7e354bcf4
Version: webpack 4.41.6
Time: 2074ms
Built at: 2020-02-26 12:59:26
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js   6.34 KiB    main  [emitted]  main
Entrypoint main = main.js
[0] multi ./src/index.js 28 bytes {main} [built]
[./src/index.js] 589 bytes {main} [built]

=========== 注意：这里会报一个错 ==============

ERROR in ./src/index.js
Module not found: Error: Can't resolve '@babel/runtime-corejs3/core-js-stable/in
stance/map' in 'F:\github-vue\workspaces\lesson\src'
 @ ./src/index.js 1:0-86 14:0-20
 @ multi ./src/index.js
 
ERROR in ./src/index.js
Module not found: Error: Can't resolve '@babel/runtime-corejs3/core-js-stable/pr
omise' in 'F:\github-vue\workspaces\lesson\src'
 @ ./src/index.js 2:0-69 8:17-25 10:8-16
 @ multi ./src/index.js 
 
```

报错的信息是说：我们现在啊缺少了一个`map`和`promise`的包文件，这是什么原因啊，我们往官方文档上来看：

如果你要使用这个配置，把这个`corejs`的配置从`false`改成了`3`（我在`webpack.config.js`中把`corejs`修改成了`3`）那么你需要额外的安装一个包，我们在[文档](https://www.babeljs.cn/docs/babel-plugin-transform-runtime#corejs)中往下去找：

这个包呢叫做`@babel/runtime-corejs3`（这里主要和corejs: 3一样所以选择`runtime-corejs3`这个版本而不是`runtime-corejs2`），所以呢我们再来安装下这个包就可以了：

```
F:\github-vue\workspaces\lesson>cnpm install --save @babel/runtime-corejs3
```

好重新运行`webpack`打包：

```
F:\github-vue\workspaces\lesson>npx webpack

F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: removed dist
Hash: a777b4916f997a017425
Version: webpack 4.41.6
Time: 2230ms
Built at: 2020-02-27 12:29:18
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js    334 KiB    main  [emitted]  main
Entrypoint main = main.js
[0] multi ./src/index.js 28 bytes {main} [built]
```

OK这样的话打包就没有任何问题了。

那么回到我们的代码我再来强调一遍：

- 如果你写的只是业务代码的话那你呢配置的时候只需要配置这个`@babel/preset-env`同时引入`@babel/polyfill`就可以了。

- 如果你写的是一个库项目代码的时候，这个时候你要去使用`@babel/plugin-transform-runtime`这个插件。


#### `@babel/plugin-transform-runtime`的好处

`@babel/plugin-transform-runtime`这个插件的好处是什么？

它呢可以有效的避免`@babel/preset-env`的一个问题或者说呢`@babel/polyfill`的一个问题，`@babel/polyfill`会污染全部环境，但是`@babel/plugin-transform-runtime`它呢会以闭包的形式去注入或者说间接的帮助组件去引入对应的内容，它不存在全局污染的这样一个概念所以当你写类库的时候不去污染全局环境是一个更好的方案，那这个时候呢用`@babel/plugin-transform-runtime`这种方案是更加合理的。

#### .babelrc

OK，最后我们在讲一个知识点:

我们可以看到啊`Babel`对应的配置项会非常的多，如果我们认真的去配置`babel`相关的内容的时候你会可能`babel-loader`的`options`里面的这些配置内容会非常的长，那如何解决这个问题呢？

我们可以在`lesson`这个目录下啊（也就是根目录）创建一个`.babelrc`这样的文件，然后把`options`里面的代码啊放到`.babelrc`里面去就可以了。

.babelrc

（这里不能写注释，所以就没有配置 `@babel/preset-env` ）

```
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 3,
        "helpers": true,
        "regenerator": true,
        "useESModules": false,
        "version": "^7.8.4"
      }
    ]
  ]
}
```

那`babel-loader`的`options`里面的内容我们可以把它剪切出来放到根目录下的`.babelrc`文件里这样的话执行起来不会有任何的问题。

我们重新打包试一下：

```
F:\github-vue\workspaces\lesson>npx webpack

F:\github-vue\workspaces\lesson>"node"  "F:\github-vue\workspaces\lesson\node_mo
dules\.bin\\..\_webpack@4.41.6@webpack\bin\webpack.js"
clean-webpack-plugin: removed dist
Hash: a777b4916f997a017425
Version: webpack 4.41.6
Time: 2308ms
Built at: 2020-02-27 12:50:31
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js    334 KiB    main  [emitted]  main
Entrypoint main = main.js
```

和之前没有把配置项拿出来是一样的都是`334KB`。

### 总结

这节课要给大家讲到的所有知识点都讲到了，首先我们说:

- 在以前我们写代码的时候没办法去写`ES6`的代码，因为`ES6`的代码打包完成之后还是`ES6`的代码不兼容低版本浏览器，所以呢我们希望借助`babel`帮助我们在打包的过程当中把`ES6`的代码有能力转换成`ES5`的代码，那要想去实现这一步我们要怎么做呢？

我们打开了`babel`的官方网站点击了[setup](https://www.babeljs.cn/setup)，然后点击页面上的`Webapck`选项，它会告诉我们怎么一步一步的去配置这个`babel`然后让我们的代码呢能够支持`ES6`转换`ES5`这样的一个功能。

当然你光转换还不够，有些`Promise`或者`map`这样的东西还需要在低版本浏览器里被注入进来，那么怎么样才能把这些方法或者变量注入进来呢，我们还要引入这个`@babel/polyfill` 好引入`@babel/polyfill`呢会让我们的包变得很大，那我们需要按需去引入`@babel/polyfill`里面的内容。

那怎么按需引入呢？

我们在`webpack.config.js`里面或者呢在`.babelrc`里面可以配置一个之前我们写的叫做`useBuiltIns: 'usage'`这样的一个参数让它等于`usage`这样的话只有
我们业务代码里用到的这些`Promise`、`map`这样的东西才会被注入到我们的代码里面，那没用到的一些语法特性不会注入，这样就会让我们的包变得很小了。

当然这种配置方案呢实际上或者说官网提供的这种配置方案，实际上它是在解决什么，它是在帮助我们啊解决业务代码里面使用`babel`这样的一个场景，那有的时候我们在生成一个第三方模块或者`ui`组件的时候我们生产的是一个库，那库打包的时候我们不希望`babel`啊去污染全局环境这个时候我们就要换种打包的方案了。

- 打包类库或者`ui`组件的时候所以我们怎么做的呢，我们打开了`babel`的官方网站，点击[docs](https://www.babeljs.cn/docs/)在左侧找这个[transform-runtime](https://www.babeljs.cn/docs/babel-plugin-transform-runtime)这样的一种使用方式来换一种方式去使用`babel`，那一步步操作下来我们可以看到我们的配置内容就发生了改变：

首先`index.js`里面不需要引入`import '@babel/polyfill';`了，取而代之在`.babelrc`配置文件里面我们直接用一个`plugins`采用`@babel/plugin-transform-runtime`这种形式做配置，那`corejs`这块你一定要把它从`false`改成一个`3`这样的话呢当这个页面上不存在一些`Promise`、`map`方法的时候它才会去把这个代码打包到我们的`main.js`里面，如果你不配置`corejs`的话它是不会帮你打包进来的。


当然你这里配置成了`corejs:3`之后呢，你还要额外安装一个`npm`的包，那打开
[transform-runtime](https://www.babeljs.cn/docs/babel-plugin-transform-runtime#corejs)往下翻，你去安装哪个包就可以了呢，你去安装:

```
npm install --save @babel/runtime-corejs3
```

这样的一个包就可以了。

好整个内容就是这么多，大家可以看到关于`babel`的内容如果讲起来官网左侧列表中所有的内容实在是太多了，那主要是把两种配置方案给它记住。
