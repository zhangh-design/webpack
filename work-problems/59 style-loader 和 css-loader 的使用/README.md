59 style-loader 和 css-loader 的使用

- css-loader 是 webpack 打包时处理 .css 后缀文件的 loader 转换器
- style-loader 是 webpack 通过 css-loader 把 .css 文件处理完成后在将 .css 文件内的内容以`style`标签的形式内联到`head`头部标签内。

css-loader 还会把 css 文件中的 `@import` 引入语法在打包构建时也处理掉，也就是把引入的css全部打包到这个css文件中，那最后输出是不会有`@import`这个内容的。

```
npm install style-loader css-loader -D
```

webpack 配置

开发和生产都是需要的

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader', // 把 css 样式内容内联到 style 标签内
          'css-loader' // 处理 .css 文件
        ]
      }
    ]
  }
}
```

loader 的处理是从下往上的，所以先`css-loader`处理css文件在`style-loader`内联样式

示例：

index.css

```
.avatar{
  width: 150px;
  height: 150px;
}

```

index.js

```
// url-loader
import avatar from './2.png'
// css文件
import './index.css'

var img = new Image(); // 插件一个 image标签
img.src = avatar; // 让它的src属性赋值为avatar
img.classList.add('avatar');

var root = document.getElementById('app');
root.append(img);

```

最终打包后的`index.html`

```
<html lang="en"><head>
  <meta charset="UTF-8">
  <style>.avatar{
  width: 150px;
  height: 150px;
}
</style></head><body><tile>Hello Webpack App</tile>
<meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="renderer" content="webkit"><meta name="X-UA-Compatible" content="IE=edge, chrome=1"><meta name="Keywords" content=""><meta name="Description" content=""><link rel="shortcut icon" href="/favicon.ico">

  <noscript>
    <strong>We're sorry but vue-test doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
  </noscript>
  <div id="app"><img src="/static/img/2-d9dd794.png" class="avatar"></div>
  <!-- <img src="./static/img/BindHotel/addhotel.png"/> -->
<script type="text/javascript" src="/app.js"></script>

</body></html>
```
