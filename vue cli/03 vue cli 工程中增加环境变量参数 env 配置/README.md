## vue cli 工程中增加环境变量参数 env 配置

场景：

在 `Vue Cli` 创建的工程中新增加环境变量配置文件（`.env`、`.env.development`、`.env.production`）

关于文件名：必须以如下方式命名，不要乱起名，也无需专门手动控制加载哪个文件。

.env 配置文件放在工程的根目录和`package.json`同一个目录。

- `.env` 全局默认配置文件，不论什么环境都会加载合并。
- `.env.development` 开发环境下的配置文件。
- `.env.production` 生产环境下的配置文件。

.env

```
VUE_APP_DB_HOST = localhost
VUE_APP_DB_USER = root
VUE_APP_DB_PASS = s1mpl3
```

.env.development

```
VUE_APP_API_ROOT = http://192.168.1.93:8082/oa/
```

.env.production

```
VUE_APP_API_ROOT = back/oa/
```

**注意：**

属性名必须以`VUE_APP_`开头，比如`VUE_APP_XXX`，这是Vue Cli脚手架的规定，否则无法加载到`process.env`变量中。

`npm run serve` 会加载`.env`和`.env.development`。

`npm run build`会加载`.env`和`.env.production`。


Vue Cli 默认在`process.env`中已经提供了`NODE_ENV: "development"`和`BASE_URL: "/"`。
