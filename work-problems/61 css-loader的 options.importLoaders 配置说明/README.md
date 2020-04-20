61 css-loader的 options.importLoaders 配置说明

`option.importLoaders` 配置是为 css文件中的 @import 语法引入追加 loader 处理而配置的。

---

我们先来看一下 .css 后缀文件中 options.importLoaders 的配置

#### 配置：

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

postcss.config.js

```
module.exports = {
  plugins: [
    // @import 引入的 scss、less、css 样式文件再次调用执行预处理器 Loader 编译引入的文件
    // css-loader 的 importLoaders 配置参数也是用于配置 css-loader 作用于 @import 的资源之前有多少个 loader，但 importLoaders 需要指定 @import 的资源之前的 loader 个数
    // require('postcss-import'), // 这里我配置了 importLoaders 所以这里注释了
    // 根据 .browserslistrc 自动添加浏览器厂商前缀（webkit、moz、ms）
    require('autoprefixer')
  ]
}

```

.browserslistrc

```
# Browsers that we support

last 2 version
> 1%
not ie < 11
ios 7
maintained node versions
not dead
```

#### 示例：

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

a.css 文件内部含有 `display: flex`这些 css3 语法的样式代码，在不同浏览器中是有兼容性问题的，所以我们通过 `postcss-loader`结合`autoprefixer`来自动的添加浏览器厂商前缀。

但是我们看到 a.css 的样式代码里还有 @import 了 b.css ，那这个 b.css 是要在 webpack 处理到 a.css 才能知道，哦我这里还引入了另外一个 b.css 文件，但是这时 Webpack 就不会对 b.css 执行`postcss-loader`，因为只有 a.css 我才是通过 `es6 Module`的语法引入的，所以正常情况下 Webpack 是不会去处理 @import 这种 css 语法引入的文件的。

那么解决办法就是：我们要在 `css-loader`的`options`配置对象里增加一个`importLoaders`的配置，那这里配置成1是因为在`css-loader`下面只有一个`loader`那就是`postcss-loader`，如果下面有两个你的`importLoaders`就配置成 2 就行了，意思是我碰到 @import 进来的 css 文件我在用 `postcss-loader` 进行一遍处理。

