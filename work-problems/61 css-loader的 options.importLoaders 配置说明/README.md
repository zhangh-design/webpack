61 css-loader的 options.importLoaders 配置说明

`option.importLoaders` 配置是为 css、scss、less 文件中的 @import 语法引入追加 loader 处理而配置的。

---

我们先来看一下 .css 后缀文件中 options.importLoaders 的配置

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', // 把 css 样式内容内联到 style 标签内
          // 'css-loader', // 处理 .css 文件
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1 // 通过 @import 引入的 css 文件在构建时在调用 postcss-loader 进行处理
            }
          },
          'postcss-loader'// 构建时调用 autoprefixer 自动添加浏览器厂商前缀 （webkit、moz、ms）
        ]
      }
    ]
  }
}
```

```
src
 |-index.js
 |-a.css
 |-b.css
```

index.js

```
// css文件
import './a.css'

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('app');
root.append(img);
```

a.css

```
@import "./b.css"; /* @import 引入外部的一个css文件 */
.avatar {
    width: 150px;
    height: 150px;
    column-count: 3;
    transform: translate(100px, 100px);
    display: flex;
    border-radius: 25px;
    text-shadow: 5px 5px 5px #ff0000;
}

```

b.css

```
.app{
    background-color: red;
    display: flex;
    width: 100px;
    height: 100px;
}

```

a.css 文件内部含有 `display: flex`这些 css3 语法的样式代码，在不同浏览器中是有兼容性问题的，所以我们通过 `postcss-loader`来自动的添加浏览器厂商前缀。

但是我们看到 a.css 的样式代码里还有 @import 了 b.css ，那这个 b.css 是要在 webpack 处理到 a.css 才能知道，哦我这里还引入了另外一个 b.css 文件，但是这时 Webpack 就不会对 b.css 执行`postcss-loader`，因为只有 a.css 我才是通过 `es6 Module`的语法引入的，所以正常情况下 Webpack 是不会去处理 @import 这种 css 语法引入的文件的。

那么解决办法就是：我们要在 `css-loader`的`options`配置对象里增加一个`importLoaders`的配置，那这里配置成1是因为在`css-loader`下面只有一个`loader`那就是`postcss-loader`，如果下面有两个你的`importLoaders`就配置成 2 就行了，意思是我碰到 @import 进来的 css 文件我在用 `postcss-loader` 进行一遍处理。

---

结论：

- a.scss 文件中 @import 如果引入的只有 scss 文件那么`css-loader`的`options.importLoaders`不配置也能再次执行`sass-loader`和`postcss-loader`。
- a.scss 文件中 @import 如果引入有 .css后缀的 文件，那么`css-loader`的`options.importLoaders`就需要配置，不然引入的 css 文件中 css3 样式代码将不能添加厂商前缀。


我们先来看一下 .scss 后缀文件中 options.importLoaders 的配置

```
module.exports = {
  module: {
    rules: [
    {
        test: /\.scss$/,
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              // sass-loader 已经处理了 @import 的这种语法（@import的文件必须是 scss 文件）会再次调用 sass-loader 和 postcss-loader 处理@import 导入的 scss 文件
              // 但是如果 scss 文件中 @import 导入的是 css 文件而不是 scss 文件那么还是要想要这个配置，所以这里还是要有这个 importLoaders: 2 的配置
              importLoaders: 2
            }
          },
          'postcss-loader', // postcss-loader 要放在 sass-loader 之前不然 @import 引入的 sass 文件厂商前缀将无法自动添加
          'sass-loader'
        ]
      }
    ]
  }
}
```

##### 1. 第一种 在 a.scss 文件里同时引入 b.scss 和 c.css 会怎么处理？

index.js

```
// css文件
import './a.scss'

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('app');
root.append(img);
```

a.scss

```
@import "./b.scss";
@import "./c.css";
body {
  .avatar {
    width: 150px;
    height: 150px;
    column-count: 3;
    transform: translate(100px, 100px);
    display: flex;
    border-radius: 25px;
    text-shadow: 5px 5px 5px #ff0000;
  }
}

```

b.scss

```
body{
  .app{
    background-color: red;
    display: flex;
    width: 100px;
    height: 100px;
    display: flex;
  }
}
```

c.css

```
.app1{
  display: flex;
}
```

我们看下`npm run dev`在浏览器上的运行结果：

```
<head>
  <meta charset="UTF-8">
  <style>.app1 {
  width: 100px;
  height: 100px;
  display: -webkit-flex;
  display: flex; }
</style><style>.app {
  background-color: red;
  display: -webkit-flex;
  display: flex;
  width: 100px;
  height: 100px;
  /* transform: translate(100px, 100px);
    display: flex;
    border-radius:25px;
    text-shadow: 5px 5px 5px #FF0000; */ }

body .avatar {
  width: 150px;
  height: 150px;
  -webkit-column-count: 3;
     -moz-column-count: 3;
          column-count: 3;
  -webkit-transform: translate(100px, 100px);
          transform: translate(100px, 100px);
  display: -webkit-flex;
  display: flex;
  border-radius: 25px;
  text-shadow: 5px 5px 5px #ff0000; }
</style></head>
```

如果 scss 文件里引入了 .css 后缀的文件那么必须配置 `options.importLoaders`

在 a.scss 文件里通过 @import 引入的 b.scss 和 c.css 都进行了浏览器厂商前缀的自动添加。

##### 2. 第二种 在 a.scss 文件里 引入 b.scss 会怎么处理？

webpack.base.js

```
module.exports = {
  module: {
    rules: [
    {
        test: /\.scss$/,
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
             // 注意下这里我并没有配置 importLoaders: 2
            }
          },
          'postcss-loader', // postcss-loader 要放在 sass-loader 之前不然 @import 引入的 sass 文件厂商前缀将无法自动添加
          'sass-loader'
        ]
      }
    ]
  }
}
```

a.scss

```
@import "./b.scss";
body {
  .avatar {
    width: 150px;
    height: 150px;
    column-count: 3;
    transform: translate(100px, 100px);
    display: flex;
    border-radius: 25px;
    text-shadow: 5px 5px 5px #ff0000;
  }
}

```

这样我们进行`npm run dev`的打包在浏览器上看下`index.html`

```
<head>
  <meta charset="UTF-8">
  <style>.app {
  background-color: red;
  display: -webkit-flex;
  display: flex;
  width: 100px;
  height: 100px;
  /* transform: translate(100px, 100px);
    display: flex;
    border-radius:25px;
    text-shadow: 5px 5px 5px #FF0000; */ }

/*@import "./c.css";*/
body .avatar {
  width: 150px;
  height: 150px;
  -webkit-column-count: 3;
     -moz-column-count: 3;
          column-count: 3;
  -webkit-transform: translate(100px, 100px);
          transform: translate(100px, 100px);
  display: -webkit-flex;
  display: flex;
  border-radius: 25px;
  text-shadow: 5px 5px 5px #ff0000; }
</style></head>
```

从浏览器的控制台中我们可以看出我们没有配置`importLoaders: 2`，但是 @import b.scss 还是自动添加了厂商前缀，所以如果你 @import 引入的是一个 scss 文件，那么是不配置 `importLoaders` 也可以，`sass-loader`内部会帮你在处理一次。

##### 3. 第三种 在 a.scss 文件里 引入 b.css 会怎么处理？


```

module.exports = {
  module: {
    rules: [
    {
        test: /\.scss$/,
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              // sass-loader 已经处理了 @import 的这种语法（@import的文件必须是 scss 文件）会再次调用 sass-loader 和 postcss-loader 处理@import 导入的 scss 文件
              // 但是如果 scss 文件中 @import 导入的是 css 文件而不是 scss 文件那么还是要想要这个配置，所以这里还是要有这个 importLoaders: 2 的配置
              importLoaders: 2
            }
          },
          'postcss-loader', // postcss-loader 要放在 sass-loader 之前不然 @import 引入的 sass 文件厂商前缀将无法自动添加
          'sass-loader'
        ]
      }
    ]
  }
}

```

a.scss

```
@import "./c.css";
body {
  .avatar {
    width: 150px;
    height: 150px;
    column-count: 3;
    transform: translate(100px, 100px);
    display: flex;
    border-radius: 25px;
    text-shadow: 5px 5px 5px #ff0000;
  }
}

```

这样我们进行`npm run dev`的打包在浏览器上看下`index.html`

```
<head>
  <meta charset="UTF-8">
  <style>.app1 {
  width: 100px;
  height: 100px;
  display: -webkit-flex;
  display: flex; }
</style><style>/* @import "./b.scss"; */
body .avatar {
  width: 150px;
  height: 150px;
  -webkit-column-count: 3;
     -moz-column-count: 3;
          column-count: 3;
  -webkit-transform: translate(100px, 100px);
          transform: translate(100px, 100px);
  display: -webkit-flex;
  display: flex;
  border-radius: 25px;
  text-shadow: 5px 5px 5px #ff0000; }
</style></head>
```

scss文件如果引入有 .css后缀的文件，那么要配置`options.importLoaders`不然 @import 引入的 css 文件不能自动添加浏览器厂商前缀也就不能再次执行一遍`loader`（sass-loader->postcss-loader），所以我们需要添加`options.importLoaders`在 Webpack 在 scss 文件内部如果碰到 @import 语法时再次去调用一遍 .scss 文件处理的 loader。

