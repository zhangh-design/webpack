## 关于 Vue 的process.env.设置全局变量不生效问题

[关于 Vue 的process.env.设置全局变量不生效问题](https://blog.csdn.net/zyt807/article/details/103634494)

场景：

在 Vue Cli 创建的工程中新增加环境变量`process.env`时发现不起作用，如下：
```
process.env.TITLE = 'vue-demo'
```

解决办法：

只有申明前缀为VUE_APP_的配置才能生效
```
process.env.VUE_APP_TITLE = 'vue-demo'
```

测试：

```
console.log(process.env)

// {NODE_ENV: "development", VUE_APP_TITLE: "demo", BASE_URL: "/"}
```
