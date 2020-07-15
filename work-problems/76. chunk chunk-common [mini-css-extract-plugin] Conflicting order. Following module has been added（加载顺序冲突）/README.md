
76. chunk chunk-common [mini-css-extract-plugin] Conflicting order. Following module has been added（加载顺序冲突）

项目在打包构建时出现`加载顺序冲突`的问题：


```
chunk chunk-common [mini-css-extract-plugin]
Conflicting order. Following module has been added:
 * css ./node_modules/_css-loader@3.6.0@css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/_vue-loader@15.9.3@vue-loader/lib/loaders/stylePostLoader.js!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--6-oneOf-1-2!./node_modules/_cache-loader@4.1.0@cache-loader/dist/cjs.js??ref--0-0!./node_modules/_vue-loader@15.9.3@vue-loader/lib??vue-loader-options!./src/components/global/finance-need.vue?vue&type=style&index=0&id=79c7435d&scoped=true&lang=css&
despite it was not able to fulfill desired ordering with these modules:
 * css ./node_modules/_css-loader@3.6.0@css-loader/dist/cjs.js??ref--8-oneOf-3-1!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--8-oneOf-3-2!./node_modules/_sass-loader@8.0.2@sass-loader/dist/cjs.js??ref--8-oneOf-3-3!./src/assets/css/insure.scss
   - couldn't fulfill desired order of chunk group(s) guarantee, insure, tenancy, trusts, futures
   - while fulfilling desired order of chunk group(s) bank, invest
 * css ./node_modules/_css-loader@3.6.0@css-loader/dist/cjs.js??ref--6-oneOf-3-1!./node_modules/_postcss-loader@3.0.0@postcss-loader/src??ref--6-oneOf-3-2!./src/assets/font/iconfont.css
   - couldn't fulfill desired order of chunk group(s) guarantee, insure, portal, tenancy, trusts, futures
   - while fulfilling desired order of chunk group(s) bank, invest
```

chunk chunk-common [mini-css-extract-plugin]
Conflicting order. Following module has been added:

Enable to remove warnings about conflicting order
启用以删除有关冲突顺序的警告


webpack打包时，通常会将css和js文件打包到一起，此时我们会使用mini-css-extract-plugin插件分离并打包css到单独文件。

#### Conflicting order

常遇到如下警告，Conflicting order. Following module has been added:...。

此警告意思为在不同的js中引用相同的css时，先后顺序不一致。也就是说，在1.js中先后引入a.css和b.css，而在2.js中引入的却是b.css和a.css，此时会有这个warning。

#### 处理方法

1. 直接修改顺序可以避免这个警告，但是后期所有的文件顺序都得按照这个来，有些繁琐。
2. 增加ignoreOrder: true配置，如：


```
new MiniCssExtractPlugin({
    // ......
    ignoreOrder: true
})
```

Vue CLI 中的配置：

```
css: {
    extract: {
      ignoreOrder: true // 启用以删除有关冲突顺序的警告 Conflicting order. Following module has been added
    }
}
```

