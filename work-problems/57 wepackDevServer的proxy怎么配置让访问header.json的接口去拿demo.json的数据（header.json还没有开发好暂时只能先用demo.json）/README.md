57 wepackDevServer的proxy怎么配置让访问header.json的接口去拿demo.json的数据（header.json还没有开发好暂时只能先用demo.json）

#### 场景：

有的时候我们在和后端联调接口的时候，可能会出现一种情况后端在接口管理系统中录入的接口还没有开发完成，说先让我们用一个其它接口先写着等他写好了前端在改过来 ，这样可能导致如果我们后面忘记修改代码了然后服务上线了然后。。。

#### 解决办法：

我们可以使用`devServer`的`proxy`来帮我们代理实现这样一种情况。

我们的服务会是这样的：

`http://localhost:8080/react/api/header.json`通过`proxy`代理转换成`http://www.dell-lee.com/react/api/header.json`但是我们又配置了`pathRewrite`所以请求最终会发送到`demo.json`。

经过这样的配置后我们在业务代码里就不需要去写历史地址了，写正式接口地址然后通过`proxy`的`pathRewrite`帮我们转发到`demo.json`这个接口上去。

```
mode: 'development', // 开发环境
devServer: {
    contentBase: "./dist",
    open: true,
    port: 8080,
    hot: true,
    hotOnly: true,
    proxy: {
      // '/react/api': 'http://www.dell-lee.com'
      '/react/api': {
        target: 'http://www.dell-lee.com',
        pathRewrite: {
          'header.json': 'demo.json'
        }
      }
    }
}
```
