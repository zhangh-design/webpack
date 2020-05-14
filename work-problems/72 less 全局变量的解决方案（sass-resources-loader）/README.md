72 less 全局变量的解决方案（sass-resources-loader）

今天发现一个好用的东西`sass-resources-loader`
`sass-resources-loader`不仅支持SASS，还支持LESS，POSTCSS等
由于Vue单文件组建内，less变量不能共享
每个文件都要@import一遍，费时费力还不讨好
接下来使用sass-resources-loader设置less全局变量。

安装：

```
npm i less less-loader sass-resources-loader -D
```

配置：

这里我以 less-loader 的配置为例进行配置讲解

```
const lessVariableFilePath = '../src/assets/css/less/variables.less'
module: {
  rules: [
    {
        test: /\.less$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          'postcss-loader', // 新版 postcss-loader 要放在 less-loader 之前
          'less-loader',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                path.resolve(__dirname, lessVariableFilePath)
              ]
            }
          }
        ]
    }
  ]
}
```

variables.less（全局变量）

```
/*** 定义公共变量 ***/
@textColor: #333;
@color: #333;

```

north.less（外部通过 @import 引入样式）

```
.cccc{
  color: @color;
}

```

index.vue

```
<template>
  <div :class="$style.northHeader">
    <div>图片1111</div>
    <div class="bbbbb">
      menu
    </div>
    <div>登出xtong</div>
    <p class="cccc">
      胜多负少第三方第三方
    </p>
  </div>
</template>

<script>
export default {
  name: 'FramePageNorth',
  mounted () {
    console.info('$style ', this.$style)
  }
}
</script>

<style lang="less" scoped>
@import "./css/north.less";
.bbbbb{
  color: @color;
}
</style>

<style lang="less" module>
// @import "@assets/css/less/variables.less"; 不需要在每个 .vue 文件中在手动引入
@assets: '~@assets/img/frame/';
.north-header {
  display: flex;
  flex-direction: row;
}
.north-header div:first-child {
  color: @color;
  background-image: url('@{assets}avatar.jpg');
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
}
.north-header div:last-child {
  color: @color;
}
</style>

```
