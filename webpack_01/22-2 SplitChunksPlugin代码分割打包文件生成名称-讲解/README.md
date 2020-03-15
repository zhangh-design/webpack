22-2 SplitChunksPlugin代码分割打包文件生成名称-讲解

##### 同步导入`lodash`库，并且`cacheGroups`的`vendors`组和`default`组都设置成`false`。

同步导入：

webpack.common.js

```
splitChunks: {
  chunks: "all", // initial（同步） async（异步） all（同步和异步）
  minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块
  // maxSize: 0, 可以不配置（建议不配置）
  minChunks: 1, // 模块引入的次数
  maxAsyncRequests: 5, // 一般不用改
  maxInitialRequests: 3, // 一般不用改
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    vendors: false,
    default: false
  }
}
```

注意这里`cacheGroups`都设置成了`false`

index.js

同步导入`lodash`库

```
import _ from "lodash";

console.info(_.join(['hello','world'],'-'))

```

那我们打包：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 8df6bd042404e32b7ccd
Version: webpack 4.42.0
Time: 12189ms
Built at: 2020-03-14 22:35:59
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
   main.js   1.65 MiB    main  [emitted]  main
Entrypoint main = main.js
```

看下打包出的`dist`目录：

lesson

```
dist
 |-index.html
 |-main.js
```

总结：

同步导入`lodash`库，并且`cacheGroups`的`vendors`组和`default`组都设置成`false`，打包生成的`main.js`的文件大小是`1.65MB`它是把`lodash`和我们的业务逻辑代码都打包到一个文件里面去了。

这样其实就是没有做代码分割。

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*bo9T.MPYu5jTmQKrOueimoFZM0L3KPCnV73NT27juXb3406fU6wTgBnr0TYQ21QOg!!/b&bo=iABLAAAAAAARB*M!&rf=viewer_4&t=5)

---

##### 同步导入`lodash`库，并且`cacheGroups`的`vendors`组不设置成`false`和`default`组设置成`false`。

同步导入：

webpack.common.js

设置`vendors`组，但是`filename`没有设置如果设置了`filename`的值那么打包出的文件就是叫做`vendors.js`这里就不再做演示了。

```
splitChunks: {
  chunks: "all", // initial（同步） async（异步） all（同步和异步）
  minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块
  // maxSize: 0, 可以不配置（建议不配置）
  minChunks: 1, // 模块引入的次数
  maxAsyncRequests: 5, // 一般不用改
  maxInitialRequests: 3, // 一般不用改
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      // filename: "vendors.js" // 同步引入
    },
    default: false
  }
}
```

注意这里`cacheGroups`的设置：`vendors`组设置成了满足`node_modules`要求和优先级设置为`-10`。

（lodash这个库安装在`node_modules`文件夹里面所以满足条件，然后这里的`cacheGroups`内只有一个组有效也就是`vendors`组，所以`priority`优先级就是最大的就会优先使用`vendors`的设置）

index.js

同步导入`lodash`库

```
import _ from "lodash";

console.info(_.join(['hello','world'],'-'))

```

那我们打包：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: df1270634652079796ab
Version: webpack 4.42.0
Time: 1865ms
Built at: 2020-03-14 22:45:56
          Asset       Size        Chunks             Chunk Names
     index.html  266 bytes                [emitted]
        main.js   33.5 KiB          main  [emitted]  main
vendors~main.js   1.62 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.js main.js
```

看下打包出的`dist`目录：

lesson

```
dist
 |-index.html
 |-main.js
 |-vendors~main.js // 说明是从 main.js 这个chunk中打包分离出来的，vendors是因为`lodash`这个库满足`cacheGroups.vendors`这个组的分割代码要求，所以前面的名字是`vendors`。
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*cMXqULzljr81rtd6R0R0efnx3x6xAZfP3vJJHdyQ4qMW1JXtDSf*yTSo4mqxV7mvg!!/b&bo=mQBcAAAAAAARB*U!&rf=viewer_4&t=5)

设置`filename: "vendors.js"`的打包输出`dist`目录：

lesson

```
dist
 |-index.html
 |-main.js
 |-vendors.js
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*VAJhSTsnqPj7fofKrRmMCK.gYwCH0LfEQSOZ1tg8YVGlHf4QG0m1KIPKiZTIPpspA!!/b&bo=lwBaAAAAAAARB*0!&rf=viewer_4&t=5)

总结：

首先我们要确认的第一件事就是`cacheGroups`的设置是针对同步代码导入的，异步代码是不起效的（异步代码导入时如果配置了`vendors`组的`filename`那么会在打包时报错），

vendors~main.js 文件的起名： 说明是从 main.js 这个chunk中打包分离出来的，vendors是因为`lodash`这个库满足`cacheGroups.vendors`这个组的分割代码要求


---

##### 同步导入`lodash`库，并且`cacheGroups`的`vendors`组不设置成`false`和`default`组也不设置成`false`。

```
splitChunks: {
  chunks: "all", // initial（同步） async（异步） all（同步和异步）
  minSize: 0, // 0 是为了测试 index.js 同步引入 test.js模块，（默认值是 30000字节就是30KB）
  // maxSize: 0, 可以不配置（建议不配置）
  minChunks: 1, // 模块引入的次数
  maxAsyncRequests: 5, // 一般不用改
  maxInitialRequests: 3, // 一般不用改
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      // filename: "vendors.js" // 同步引入
    },
    // default: false
    default: {
      priority: -20,
      reuseExistingChunk: true,
      // filename: 'common.js'
    }
  }
}
```

`vendors`组用于设置分割在`node_modules`文件夹里面的依赖模块，`default`组用于分割非`node_modules`中的依赖模块（也就是我们的业务代码`src`目录是满足`default`的要求的）

如果这里`default`组设置为`false`的话那么`test.js`就会被打包到`main.js`这个`chunk`文件里面去不会进行代码的分割。

这里为了演示把`minSize`这个值修改成了`0`，不然的话最小值如果是`30000`字节那么`test.js`可能就只有`1kb`都不到，这样`test.js`的代码分割在`minSize`这个设置这里就已经不满足了也就不会在往下走其它的配置了，代码分割也就不会执行。

lesson

```
src
 |-test.js
 |-index.js
```

test.js

```
export default {
    name: 'hello world'
  }
  
```

index.js

```
import _ from "lodash";
import test from './test.js'


console.info(_.join(['hello','world'],'-'))
console.info(test.name);

```

我们打包：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 1ccfad768bb413a7051e
Version: webpack 4.42.0
Time: 1976ms
Built at: 2020-03-15 09:19:55
          Asset       Size        Chunks             Chunk Names
default~main.js    3.8 KiB  default~main  [emitted]  default~main
     index.html  328 bytes                [emitted]
        main.js   31.2 KiB          main  [emitted]  main
vendors~main.js   1.62 MiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.js default~main.js main.js
```

dist

```
dist
 |-default~main.js
 |-index.html
 |-main.js
 |-vendors~main.js
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*U6oF3OzfMcwDv0H7HEW81Jz6FAHbp.8rlXRoF9KsDvpQJDYAYNCp0tgBpGdyw.3oQ!!/b&bo=swCDAAAAAAARBwA!&rf=viewer_4&t=5)

`vendors~main.js`

`lodash`依赖模块的代码分割打包文件，`vendors`表示`lodash`库满足`vendors`这个组的代码分割要求，`~`波浪线是`automaticNameDelimiter`配置，`main.js`表示的是是从`main.js`这个`chunk`文件中进行的代码分割。

`default~main.js`

`test.js`依赖模块的代码分割打包文件，`default`表示`test.js`依赖模块满足`default`这个组的代码分割要求（为了演示把`minSize`修改成了`0`字节），`~`波浪线是`automaticNameDelimiter`配置，`main.js`表示的是是从`main.js`这个`chunk`文件中进行的代码分割。

把`filename`设置项打开后的打包：

```
cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      filename: "vendors.js" // 同步引入
    },
    // default: false
    default: {
      priority: -20,
      reuseExistingChunk: true,
      filename: 'common.js'
    }
}
```

代码分割的文件名称会是`cacheGroups`缓存组里面设置的`filename`中配置的名称。

dist

```
dist
 |-common.js
 |-index.html
 |-main.js
 |-vendors.js
```

---

下面的异步`import`导入请注意：

异步代码`import`进行代码分割时需[->ie环境下的动态 import 导入需要的兼容性配置](https://github.com/zhangh-design/webpack/tree/master/webpack_01/22-1%20ie%20%E7%8E%AF%E5%A2%83%E4%B8%8B%E7%9A%84%E5%8A%A8%E6%80%81%20import%20%E5%AF%BC%E5%85%A5%E9%9C%80%E8%A6%81%E7%9A%84%E5%85%BC%E5%AE%B9%E6%80%A7%E9%85%8D%E7%BD%AE)

```
entry: [
    "core-js/modules/es.promise",
    "core-js/modules/es.array.iterator",
    "./src/index.js"
  ],
```

并且在`.babelrc`中增加`"targets": {"ie": "11"}`。



##### 异步导入代码，并且`cacheGroups`的`vendors`组设置成`false`和`default`组也设置成`false`。

```
splitChunks: {
  chunks: "all", // initial（同步） async（异步） all（同步和异步）
  minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块 （默认值是30000字节也就是30kb）
  // maxSize: 0, 可以不配置（建议不配置）
  minChunks: 1, // 模块引入的次数
  maxAsyncRequests: 5, // 一般不用改
  maxInitialRequests: 3, // 一般不用改
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    vendors: false,
    /* vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      filename: "vendors.js" // 同步引入
    }, */
    default: false
    /* default: {
      priority: -20,
      reuseExistingChunk: true,
      filename: 'common.js'
    } */
  }
}
```

index.js

```
// 异步import
function getComponent() {
  return import("lodash").then(
    ({ default: _ }) => {
      console.log('success')
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      return element;
    }
  ).catch((error)=>{
    console.log('error')
  });
  /* return new Promise((resolve)=>{
    var element = document.createElement("div");
    element.innerHTML = _.join(["hello", "world"], "-");
    resolve(element)
  }); */
}

getComponent().then(element=>{
    document.body.appendChild(element)
})
```

打包：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 92a1cc99b619822893c5
Version: webpack 4.42.0
Time: 1938ms
Built at: 2020-03-15 09:38:25
     Asset       Size  Chunks             Chunk Names
      0.js   1.35 MiB       0  [emitted]
index.html  204 bytes          [emitted]
   main.js    313 KiB    main  [emitted]  main
Entrypoint main = main.js
```

dist

```
dist
 |-0.js
 |-index.html
 |-main.js
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*RThXVVs4D23SYldNKXW93uA.vWTNJlQGTZsjt6OCxNeqDCBRi9KrnY2onvSriI8Tg!!/b&bo=dgBiAAAAAAARByQ!&rf=viewer_4&t=5)

`0.js`

`0.js`是异步`import`导入的`lodash`依赖模块的代码分割打包文件，里面的内容是`lodash`库，没有我们的业务代码`index.js`的代码，它的大小`1.35 MiB`就是单纯的`lodash`库。

`main.js`

`main.js`是`import("lodash")`中的回调函数`then`方法内的业务代码，但是我们注意到这个文件的大小是`313 KiB`，我们的业务代码明明只有几行代码而已：

```
console.log("success");
var element = document.createElement("div");
element.innerHTML = _.join(["hello", "world"], "-");
return element;
```

那为什么打包出的文件会这么大呢有`313KiB`那是因为我们为了兼容`ie`浏览器（ie 10，11）而在`.babelrc`中增加了如下配置：

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
          "edge": "17",
          "ie": "11", // 注意这里，我们对ie进行了babel转换es6的兼容性设置，这里是配了 ie 11
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        }
      }
    ]
  ],
  // @babel/plugin-syntax-dynamic-import 是魔法注释我们下面会讲到
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}
```

在`targets`中增加了`"ie": "11"`的设置后我们在打包时`babel`会把`ES6`中的`promise`、`map`、`set`、`forEach`之类的高级函数用`ES5`的代码在生成一个可以支持`ie`低版本浏览器的函数实现（那这个代码量是比较大的），那这里这些`ie`函数实现就被打包到了`main.js`中，所以`main.js`才会有`313KiB`这么大。

---

##### 异步导入代码，并且`cacheGroups`的`vendors`组不设置成`false`和`default`组设置成`false`（filename的配置需要注释掉）。

```
splitChunks: {
  chunks: "all", // initial（同步） async（异步） all（同步和异步）
  minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块 （默认值是30000字节也就是30kb）
  // maxSize: 0, 可以不配置（建议不配置）
  minChunks: 1, // 模块引入的次数
  maxAsyncRequests: 5, // 一般不用改
  maxInitialRequests: 3, // 一般不用改
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      // filename: "vendors.js" // 同步引入
    },
    // default: false
    default: {
      priority: -20,
      reuseExistingChunk: true,
      // filename: 'common.js'
    }
  }
}
```

index.js

```
// 同步
/* import _ from "lodash";
import test from './test.js'


console.info(_.join(['hello','world'],'-'))
console.info(test.name);
 */

// 异步
function getComponent() {
  return import("lodash")
    .then(({ default: _ }) => {
      console.log("success");
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      return element;
    })
    .catch(error => {
      console.log("error");
    });
  /* return new Promise((resolve)=>{
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      resolve(element)
    }); */
}

getComponent().then(element => {
  document.body.appendChild(element);
});

```

打包：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 6de04d413fdfc214c1ed
Version: webpack 4.42.0
Time: 2428ms
Built at: 2020-03-15 09:58:21
          Asset       Size        Chunks             Chunk Names
           0.js   1.35 MiB             0  [emitted]
     index.html  266 bytes                [emitted]
        main.js   38.7 KiB          main  [emitted]  main
vendors~main.js    276 KiB  vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.js main.js
```

dist

```
dist
|-0.js
|-index.html
|-main.js
|-vendors~main.js
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*eP5p0.fhop8v2lekJ13XYJlXozq0i.KDmMCqKuVaGYOzs5UJX98phHk8.MjlBq8Zw!!/b&bo=pABuAAAAAAARB*o!&rf=viewer_4&t=5)

`0.js`

`0.js`是异步`import`导入的`lodash`依赖模块的代码分割打包文件，里面的内容是`lodash`库，没有我们的业务代码`index.js`的代码，它的大小`1.35 MiB`就是单纯的`lodash`库。

`main.js`

`main.js`现在的大小是`38.7 KiB`里面现在就是只包含了我们的真实业务代码，没有`babel`为了`promise`之类的`es5`实现代码了。

`vendors~main.js`

`vendors~main.js`这个文件满足`cacheGroups`缓存组中的`vendors`组，里面存放的就是`babel`为了`promise`之类的`es5`实现代码了，通过设置`vendors`我们成功把`babel`转义的`es6`函数实现代码分割了。

如果我们把`cacheGroups`中的`vendors`组和`default`组里面的`priority`修改下，看看打包输出会是怎么样的。

```
cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      // filename: "vendors.js" // 同步引入
    },
    // default: false
    default: {
      priority: 20, //20的优先级比-10大，所以优先进行 default 组的设置
      reuseExistingChunk: true,
      // filename: 'common.js'
    }
}
```

打包：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: a2218c1c1116a2cba9f0
Version: webpack 4.42.0
Time: 1962ms
Built at: 2020-03-15 10:08:40
          Asset       Size        Chunks             Chunk Names
           0.js   1.35 MiB             0  [emitted]
default~main.js    280 KiB  default~main  [emitted]  default~main
     index.html  266 bytes                [emitted]
        main.js     34 KiB          main  [emitted]  main
Entrypoint main = default~main.js main.js
```

dist

```
dist
 |-0.js
 |-default~main.js
 |-index.html
 |-main.js
```

`0.js`还是动态`import`导入的`lodash`库的代码。

`default~main.js`

由于我们把`priority`的值从`-20`修改成了`20`，这样`default`组的优先级就比`vendors`组的优先级高了，所以`babel`在`ie`中的`es6`高级函数实现就会被分割到`default`这个组里了，所以名字就是`defaut`开头的了。

`main.js`还是我们的业务代码。

---

##### 异步带入代码，增加`/* webpackChunkName:"lodash" */` 魔法注释并且cacheGroups的vendors组设置成false和default组设置成false（filename的配置需要注释掉）。

===========

安装：

```
cnpm i @babel/plugin-syntax-dynamic-import --save-dev
```

配置：

.babelrc

（增加`plugins`）

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
          "edge": "17",
          "ie": "11",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        }
      }
    ]
  ],
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
}

```

==========

```
splitChunks: {
  chunks: "all", // initial（同步） async（异步） all（同步和异步）
  minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块 （默认值是30000字节也就是30kb）
  // maxSize: 0, 可以不配置（建议不配置）
  minChunks: 1, // 模块引入的次数
  maxAsyncRequests: 5, // 一般不用改
  maxInitialRequests: 3, // 一般不用改
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    vendors: false,
    /*vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      // filename: "vendors.js" // 同步引入
    },*/
    default: false
    /*default: {
      priority: -20,
      reuseExistingChunk: true,
      // filename: 'common.js'
    }*/
  }
}
```

index.js

```
// 同步
/* import _ from "lodash";
import test from './test.js'


console.info(_.join(['hello','world'],'-'))
console.info(test.name);
 */

// 异步
function getComponent() {
  // return import("lodash").then()
  return import(/* webpackChunkName:"lodash" */ "lodash")
    .then(({ default: _ }) => {
      console.log("success");
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      return element;
    })
    .catch(error => {
      console.log("error");
    });
  /* return new Promise((resolve)=>{
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      resolve(element)
    }); */
}

getComponent().then(element => {
  document.body.appendChild(element);
});

```

打包：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: e71433ba03a92701f16b
Version: webpack 4.42.0
Time: 1939ms
Built at: 2020-03-15 10:16:25
     Asset       Size  Chunks             Chunk Names
index.html  204 bytes          [emitted]
 lodash.js   1.35 MiB  lodash  [emitted]  lodash
   main.js    313 KiB    main  [emitted]  main
Entrypoint main = main.js
```

dist

```
dist
 |-index.html
 |-lodash.js
 |-main.js
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*RmnBAA3JRsd5ggypt75NWrB4ikhADGek2RmhveGWGJHgLO1l*UrCu38IY2LtY738w!!/mnull&bo=hABdAAAAAAARB.k!&rf=photolist&t=5)

`lodash.js`

`lodash.js`就是我们上一个中没有使用`魔法注释`打包出的`0.js`，而这里其实就是用`魔法注释`给这个`0.js`重新起了个名字叫做`lodash.js`而已，里面存放的内容还是`lodash.js`这个依赖库。

`main.js`

`main.js`　这里我们注意下它的大小是`313 KiB`，那么很明显是`babel`中的`es6`高级函数实现的代码也在里面，因为这里我们把`cacheGroups`缓存组中的`default`组和`vendors`组都设置成了false，也就是同步引入的代码都不进行代码分割。


##### 异步带入代码，增加`/* webpackChunkName:"lodash" */` 魔法注释并且cacheGroups的vendors组不设置成false和default组不设置成false（filename的配置需要注释掉）。

```
splitChunks: {
  chunks: "all", // initial（同步） async（异步） all（同步和异步）
  minSize: 30000, // 0 是为了测试 index.js 同步引入 test.js模块 （默认值是30000字节也就是30kb）
  // maxSize: 0, 可以不配置（建议不配置）
  minChunks: 1, // 模块引入的次数
  maxAsyncRequests: 5, // 一般不用改
  maxInitialRequests: 3, // 一般不用改
  automaticNameDelimiter: "~",
  name: true,
  cacheGroups: {
    // vendors: false,
    vendors: {
      test: /[\\/]node_modules[\\/]/,
      priority: -10,
      // filename: "vendors.js" // 同步引入
    },
    default: false
    /* default: {
      priority: -20,
      reuseExistingChunk: true,
      // filename: 'common.js'
    } */
  }
}
```

index.js

```
// 同步
/* import _ from "lodash";
import test from './test.js'


console.info(_.join(['hello','world'],'-'))
console.info(test.name);
 */

// 异步
function getComponent() {
  // return import("lodash").then()
  return import(/* webpackChunkName:"lodash" */ "lodash")
    .then(({ default: _ }) => {
      console.log("success");
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      return element;
    })
    .catch(error => {
      console.log("error");
    });
  /* return new Promise((resolve)=>{
      var element = document.createElement("div");
      element.innerHTML = _.join(["hello", "world"], "-");
      resolve(element)
    }); */
}

getComponent().then(element => {
  document.body.appendChild(element);
});

```


打包：

```
C:\Users\nickname\Desktop\lesson>npm run dev-build

> lesson@1.0.0 dev-build C:\Users\nickname\Desktop\lesson
> webpack --config ./build/webpack.dev.js


C:\Users\nickname\Desktop\lesson>"node"  "C:\Users\nickname\Desktop\lesson\node_modules\.bin\\..\_webpack@4.42.0@webpack\bin\webpack.js" --config ./build/webpack.dev.js
clean-webpack-plugin: removed dist
Hash: 1d45fa6c2c01f43009d7
Version: webpack 4.42.0
Time: 1960ms
Built at: 2020-03-15 10:30:43
            Asset       Size          Chunks             Chunk Names
       index.html  266 bytes                  [emitted]
          main.js   38.9 KiB            main  [emitted]  main
vendors~lodash.js   1.35 MiB  vendors~lodash  [emitted]  vendors~lodash
  vendors~main.js    276 KiB    vendors~main  [emitted]  vendors~main
Entrypoint main = vendors~main.js main.js
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*STrjU9YRiYyrzjaX4wqik0IRJhJ4C59FkiIIAzoUsW2APFq8FCBPVSYx2iujA9XSQ!!/mnull&bo=pwB4AAAAAAARB.8!&rf=photolist&t=5)

dist

```
dist
 |-index.html
 |-main.js
 |-vendors~lodash.js
 |-vendors~main.js
```

`cacheGroups`中的`vendors`组和`default`组都不设置成`false`。

`main.js`

这里的大小是`38.9 KiB`，只存放了我们的业务代码，`babel`中`es6`高级函数在`ie`浏览器下的兼容性实现已经被分割到了`vendors~main.js`文件里面去了。

`vendors~lodash.js`

动态导入的`lodash`库的代码。

`vendors~main.js`

`babel`中`es6`高级函数在`ie`浏览器下的兼容性实现已经被分割到了`vendors~main.js`文件里面去了（因为我们的动态`import`返回的就是一个`promise`对象，而低版本的`ie`浏览器里是不支持`es6`的`promise`函数的，所以`babel`需要自己去实现一个`promise`函数用以在低版本`ie`浏览器里运行）。

如果我们把`cacheGroups`的`vendors`组设置成`false`那么打包后的目录是这样的：

dist

```
dist
 |-default~main.js
 |-index.html
 |-main.js
 |-lodash.js
```

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*cb*NYFEVkzFYMYvLphKsLSaVzcBRFdTWU205pOkzrXDGjqZR6QwwqcCn56fPUhyWw!!/b&bo=uwByAAAAAAARB*k!&rf=viewer_4&t=5)

