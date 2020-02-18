## webpack 按需加载momentjs 语言包

momentjs是一个很好用的日期处理插件。但是webpack打包时我们会发现这个插件体积比较大(如下图)：

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa0EWIqUHg3Y3CkqaGZyfDRO9DW7ctyD9vZPMoQ73IOUeWAp8VC9gDkzSD13Pmr0ML1zyPWokrdh.ujwtBLNkMEU!/b&bo=xwKBAgAAAAARB3Y!&rf=viewer_4&t=5)


如图可以看出`locale`是大的主要原因。

#### 使用webpack ContextReplacementPlugin 来解决

webpack 提供的`ContextReplacementPlugin`插件允许我们覆盖打包时的查找规则。


```
plugins: [
  new webpack.ContextReplacementPlugin(
    /moment[/\\]locale$/,
    /zh-cn/,
  ),
]
```

配置只打包zh-cn语言包后文件体积明显减少。

![image](http://m.qpic.cn/psc?/V12UXEll2JjLTU/S1G4*2hi*D5aPIJug2nMa7BYDqhe3laMPpoeCJAday7MJeLhWIKgZ*KtIP0gA0bLn1pPHlXSGi1f0CeZWvDRZqUCWcfw5qmHQu29QEBS298!/b&bo=cQFlAQAAAAARByQ!&rf=viewer_4&t=5)
