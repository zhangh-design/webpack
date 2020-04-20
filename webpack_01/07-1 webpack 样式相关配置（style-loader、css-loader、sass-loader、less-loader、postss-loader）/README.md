63 webpack 样式相关的配置（style-loader、css-loader、sass-loader、less-loader、postss-loader）


```
npm i css-loader node-sass postcss-import autoprefixer postcss-loader sass-loader style-loader css-loader less-loader less -D
```

- css-loader （处理 css 文件或内容）
- node-sass sass-loader （处理 scss 文件将 scss 语法编译成 css）
- style-loader （把处理好的 css 样式内联到 <style> 标签）
- postcss-loader postcss-import autoprefixer（css 预处理器，autoprefixer 给 css3 的样式属性添加厂商前缀（webkit、moz、ms），postcss-import 处理 @import 引入的 scss、less、css 样式文件再次调用执行预处理器 Loader  的编译处理引入的样式比如：sass-loader->postcss-loader）
- less-loader less （处理 less 文件将 Less 语法编译成 css）

---

#### 基本配置：

webpack.base.js

loader 的配置

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
              importLoaders: 1 // 0 => 默认，没有 loader; 1 => postcss-loader;
            }
          },
          'postcss-loader'
        ]
    },
    {
        test: /\.scss$/,
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2 // 0 => 默认，没有 loader; 2 => postcss-loader, sass-loader;
            }
          },
          'postcss-loader', // 新版 postcss-loader 要放在 less-loader 之前
          'sass-loader'
        ]
    },
    {
        test: /\.less$/,
        use: [
          'style-loader',
          // 'css-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2 // 同 sass
            }
          },
          'postcss-loader', // 新版 postcss-loader 要放在 less-loader 之前
          'less-loader'
        ]
    }
    ]
  }
}
```

postcss.config.js （postcss-loader配置文件）

```
module.exports = {
  plugins: [
    // @import 引入的 scss、less、css 样式文件再次调用执行预处理器 Loader 编译引入的文件
    // css-loader 的 importLoaders 配置参数也是用于配置 css-loader 作用于 @import 的资源之前有多少个 loader，但 importLoaders 需要指定 @import 的资源之前的 loader 个数
    // 和 css-loader 的 importLoaders 任选一个即可
    require('postcss-import'),
    // 根据 .browserslistrc 自动添加浏览器厂商前缀（webkit、moz、ms）
    require('autoprefixer')
  ]
}

```

.browserslistrc（autoprefixer 浏览器兼容性配置）

```
# Browsers that we support 
 
last 2 version
> 1%
not ie < 11
ios 7
maintained node versions
not dead
```

#### 注意点：

loader 的位置：

**'sass-loader' -> 'postcss-loader'**

`postcss-loader`要放在`sass-loader`之前（less 配置也是这样），如果放置在后面有点区别，新版官网上也是放置在前面，表示先进行 `sass-loader` 预处理将 sass 语法转换成 css 语法，在用 `postcss-loader` css 后处理器进行处理。

这里我想了下`postcss-loader`放在`sass-loader`之前逻辑上是说的过去的，因为`sass`的语法是有变量、运算、函数、作用域、继承、嵌套写法等，如果在`sass-loader`处理之前`postcss-loader`并不能很好的发现哪些属性才是要加厂商前缀的这样也就是`postcss-loader`还要去分析`sass`的语法结构，所以先用`sass-loader`将`sass`语法给转义了然后接着在用`postcss-loader`直接处理已经转义成 css 语法的内容也就简单的多。


**'css-loader'的配置参数options.importLoaders**

在 css-loader 的文档中，有个比较引起疑惑的参数项：importLoaders，这个参数用于配置 css-loader 作用于 @import的资源之前有多少个 loader。

==注意：==

这个 importLoaders 其实和 postcss.config.js 的 plugins 引入 require('postcss-import') 效果和功能是一样的，所以这两个配置我们配置其中一个就可以了，如果两个都配置也不会报错，但我觉得起效的还是 require('postcss-import') 因为 postcss-loader 是在 css-loader 之前得到执行的。

`require('postcss-import')` 不用在每个预处理loader 中单独去配置，`options.importLoaders`需要在每个 预处理 loader 中单独配置，并且要指定预处理loader的个数 。

使用：

这里以 sass 文件处理为示例

```
{
    test: /\.scss$/,
    use: [
      'style-loader',
      // 'css-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2 // 0 => 默认，没有 loader;2 => postcss-loader, sass-loader
        }
      },
      'postcss-loader', // 新版 postcss-loader 要放在 sass-loader 之前
      'sass-loader'
    ]
}
```

首先我们先看下 loader 的处理顺序：sass-loader->postcss-loader->css-loader->style-loader。

options.importLoaders 的意思就是我在 style.css 中通过`@import 'body.css';`引入`body.css`，那引入的这个`body.css`需要配置`options.importLoaders`并且指定个数，再次去调用预处理器分析引入的样式。

这里通过 `display: flex;` 为例，如果正确执行那么 style.css 和 body.css 中的 `display: flex;` 都会加上厂商前缀。

```
/* style.css */
@import 'body.css';
body {
    /*background: yellow;*/
    font-size: 20px;
}
div {
    display: flex;
}
/* body.css */
.body-import {
    /* body import */
    display: flex;
}

```



- 未使用importLoaders：被styles.css引入的 body.css内的display: flex;未添加了前缀，说明 postcss 没有作用到@import引入的文件中；
    
- 使用了importLoaders=2：被styles.css引入的 body.css内的display: flex;也被添加了前缀，说明 postcss 作用到了被@import引入的文件中。

**postcss.config.js**

postcss-loader 的配置文件

```
module.exports = {
  plugins: [
    // @import 引入的 scss、less、css 样式文件再次调用执行预处理器 Loader 分析 引入的文件
    // 和 css-loader 的 importLoaders 任选一个即可
    require('postcss-import'),
    // 根据 .browserslistrc 自动添加浏览器厂商前缀（webkit、moz、ms）
    require('autoprefixer')
  ]
}

```


---

效果截图：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/j5BRZUlgKbUG5yYXn162*Xy7Ru6R48DmsFt*D2390FbqQiYOTbNo56430UoP8c3*0fDQD2QSqKpBxoCYhHsD3Q!!/b&bo=ZgH9AQAAAAARB6s!&rf=viewer_4&t=5)


