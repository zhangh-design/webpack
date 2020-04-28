25-2 url-loader.options.esModule 设置为 true 和 false 的区别

设置为 false ，我们要在 .vue 模板文件中怎么去引入一张图片：


```
{
    test: /\.(png|jpe?g|gif|svg|blob)(\?.*)?$/,
    loader: 'url-loader',
    options: {
      esModule: false, // 默认true（设置为 true img中的 src 会是对象 <img src="[object Module]"/>）
      limit: 8 * 1024, // 8kb
      context: path.resolve(__dirname, '../src'),
      name: utils.assetsPath('img/[path][name]-[hash:8].[ext]'),
      publicPath: '/' // http://www.baidu.com/
    }
}
```

```
<template>
  <div>
    <img src="../../assets/img/login/name.png">
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>
```

设置为 true ，我们要在 .vue 模板文件中怎么去引入一张图片：

如果直接在 html 代码中引入图片地址会是一个 [object Module]

```
<img src="../../assets/img/login/name.png">
```

![image](http://i1.fuimg.com/717460/63692c23abb67bee.jpg)

所以要以 import 的形式引入。

```
<template>
  <div>
    <img :src='menu1'>
  </div>
</template>

<script>
import menu1 from "../../assets/img/login/name.png"

export default {
  data () {
    return {
      menu1: menu1
    }
  }
}
</script>
```

设置为 true 表示需要以 esModule 的形式导入资源。

