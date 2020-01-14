## DefinePlugin 允许创建一个在编译时可以配置的全局常量

[DefinePlugin](https://www.webpackjs.com/plugins/define-plugin/)

场景：

在 Vue Cli 创建的工程中新增加环境变量配置文件（dev.env.js、prod.env.js、ssr.env.js），在使用`webpack`进行打包时自动载入配置文件的配置参数：

在工程的根目录下新建名为`env`的文件夹并在里面创建`index.js`、`dev.env.js`、`prod.env.js`三个文件。 

index.js

```
/**
 * 项目定义和加载环境变量
 */
const prodEnv = require('./prod.env.js')
const devEnv = require('./dev.env.js')

let envObj = {}
if (process.env.NODE_ENV === 'development') {
  // 开发
  envObj = Object.assign({}, devEnv)
} else if (process.env.NODE_ENV === 'production') {
  // 生成
  envObj = Object.assign({}, prodEnv)
}
module.exports = envObj

```

dev.env.js

```
// 开发环境
module.exports = {
  VUE_APP_ROOT: '"http://xxx:8082/oa/"'
}

```

prod.env.js

```
// 生成环境
module.exports = {
  VUE_APP_ROOT: '"back/oa/"'
}

```

#### webpack加载配置：
vue.config.js

**注意：** 我在尝试配置`process.env`名称时发现无法将设置的环境变量参数设置到工程默认的`process.env`变量中（即使将新设置的环境变量名称前面添加`VUE_APP_`也无法添加入`process.env`中），所以我这里另外新起了一个名称是`process2.env`， 这样工程中如果在使用新设置的环境变量就要使用`process2.env`在点某个具体的属性名称就可以了。
```
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // 'process.env': require('./env/index.env.js'), // 不起效果
        'process2.env': require('./env/index.js') // 可以设置
      })
    ]
  }
}
```

测试：

运行 `npm run serve` （开发环境）
```
console.info(process2.env);
// {VUE_APP_ROOT: "http://192.168.1.93:8082/oa/"}
```




