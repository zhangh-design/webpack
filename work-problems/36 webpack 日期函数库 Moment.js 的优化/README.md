36 webpack 日期函数库 Moment.js 的优化

Moment.js 一个非常强大的日期时间处理插件，正因为很强大所以体积也着实的不小啊（我之前用了一些其它比较小的日期插件但是在`linux`环境下有问题，所以还是这个插件靠谱）

当你在代码中写了var moment = require('moment') 然后再用webpack打包, 打出来的包会比你想象中的大很多，因为打包结果包含了各地的local（各个国家的语言包）文件.


```
Version: webpack 4.42.1
Time: 3840ms
Built at: 2020-04-16 18:09:47
      Asset       Size  Chunks             Chunk Names
     app.js   2.48 MiB     app  [emitted]  app
favicon.ico   4.19 KiB          [emitted]
 index.html  653 bytes          [emitted]
```

我在没有优化的配置下打包的体积是 `2.48MB`（开发环境），接下来我们看看优化。

解决方案是下面的两个webpack插件，任选其一，优化后打包体积基本一样，但两个插件还是有一点区别的:

- IgnorePlugin
- ContextReplacementPlugin


---

#### 1. IgnorePlugin

**配置：**

webpack.config.js

```
const webpack = require('webpack');

module.exports = {
  plugins: [
    // 忽略解析三方包里插件（非中文语言包排除掉）
    new webpack.IgnorePlugin(/\.\/locale/, /moment/)
  ]
}
```

**打包输出：**

```
Version: webpack 4.42.1
Time: 4542ms
Built at: 2020-04-16 18:12:12
      Asset       Size  Chunks             Chunk Names
     app.js   1.29 MiB     app  [emitted]  app
favicon.ico   4.19 KiB          [emitted]
 index.html  653 bytes          [emitted]
```

体积减小到了`1.29MB`比之前的`2.48MB`还是小了不少的。

**使用：**

index.js

```
import moment from 'moment'
import 'moment/locale/zh-cn'
// 设置语言
moment.locale('zh-cn');
const r = moment().endOf('day').fromNow();
console.log(r); // 6 小时内

```

注意：

我们需要单独在`index.js`中在引入`import 'moment/locale/zh-cn'`中文语言包，不然显示的就是英文，也就是这个区别`ContextReplacementPlugin`优化后不用在业务代码中在引入中文包（所以我觉得还是这个好一点）。

#### 2. ContextReplacementPlugin

**配置：**

webpack.config.js

```
const webpack = require('webpack');

module.exports = {
  plugins: [
    // 忽略解析三方包里插件（非中文语言包排除掉）
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /zh-cn/
    )
  ]
}
```

**打包输出：**

```
Version: webpack 4.42.1
Time: 2055ms
Built at: 2020-04-16 18:20:09
      Asset       Size  Chunks             Chunk Names
     app.js    1.3 MiB     app  [emitted]  app
favicon.ico   4.19 KiB          [emitted]
 index.html  653 bytes          [emitted]

```

这个打包体积稍微大一点因为保留了`zh-cn`语言包。

**使用：**

index.js

```
import moment from 'moment'
// import 'moment/locale/zh-cn' 不需要在引入

// 设置语言
moment.locale('zh-cn');
const r = moment().endOf('day').fromNow();
console.log(r); // 6 小时内

```

不需要在代码里额外导入 `zh-cn` 中文语言包。
