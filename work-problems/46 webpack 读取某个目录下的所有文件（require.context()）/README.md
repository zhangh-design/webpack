46 webpack 读取某个目录下的所有文件（require.context()）

[->Webpack require.context() 前端工程化之动态导入文件](http://www.imooc.com/article/289932)

随着项目越来越大，业务需要越来越多，我们项目的目录层级也是非常的多。如果还是通过import分别引入文件，那是非常的不科学的。

我项目中 ajax 请求的api（这里 api 都分了模块）

```
service
 api
  |-buy
    |-apply.js
    |-charge.js
  |-expense
    |-apply.js
    |-finance.js
  |-project
    |-contract.js
    |-project.js
index.js
```

这里的整个 api 目录里全都是存放接口模型描述的，然后在`index.js`中统一进行导出（每个接口都会使用 文件夹名称来进行命名空间的区分防止出现重名）

那我在`index.js`中是使用`require.context`来读取整个api中的文件构建成一个对象后在进行导出：

```
import camelCase from 'lodash/camelCase'
const requireModule = require.context('./api', true, /\.js$/)
const modules = {}
requireModule.keys().forEach(fileName => {
    if (fileName === './index.js') return
    let moduleName = ''
    if(fileName.split("/").length>2){
        moduleName = fileName.replace(/(\.\/|\.js)/g, '')
    }else{
        moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''))
    }
    modules[moduleName] = {
        ...requireModule(fileName),
    }['default']
})
export default modules
```

如果我不使用`require.context`而是对每个文件都使用`import`：

index.js

```
import buy from './buy/apply.js';
import expense from './expense/charge.js';
... // 此处省略N多文件

```

这样`import`的文件会非常的多而且也不利于项目的扩展。
