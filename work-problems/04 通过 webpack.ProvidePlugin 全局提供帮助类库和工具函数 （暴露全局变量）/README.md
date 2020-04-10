通过 webpack.ProvidePlugin 全局提供帮助类库和工具函数（暴露全局变量）


**场景：**

`lodash`这个库是前端开发中使用频率极高的一个js类库，我们在使用时可能会在`main.js`中使用 全部引入 的方式：

```
// 全部引入
import _ from 'lodash'

export default {
    // 逻辑处理...
}
```

或者 按需引入某几个函数：

```
import _isEqual from 'lodash/isEqual'
import _has from 'lodash/has'
import _get from 'lodash/get'
import _set from 'lodash/set'
import _omit from 'lodash/omit'

export default {
    // 逻辑处理...
}
```

在这里我们可以通过 webpack 提供的`webpack.ProvidePlugin`来简化类库或者类库函数的导入：


```
const webpack = require("webpack");

module.exports = {
    plugins: [
      new webpack.ProvidePlugin({
         $: 'jquery',
         _: 'lodash',
         // _join 等于 lodash里面的join方法
        _join: ['lodash', 'join']
      })
  ]
}
```

在 webpack 的配置文件中增加这个`plugin`之后我们就可以在代码中直接使用已经定义在`plugin`这里的配置类库或者帮助函数了，这样也大大简化了我们在模块代码里的导入操作了（也就是不需要在使用某个帮助函数前要手动的`import`）。
