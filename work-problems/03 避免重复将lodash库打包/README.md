避免重复将lodash库打包

##### 场景：
有的时候我们在写一些类库或者组件的时候会引入`lodash`或者`jquery`这样的库，但是我们在项目中使用这个类库或者组件的时候也会导入`lodash`或者`jquery`，那么这样的话就会导致重复导入的问题。

##### 解决：

在`Webpack`的配置文件中增加一个`externals`的配置:

index.js

```
// 全量引入了lodash和jquery
import _ from 'lodash';
import $ from 'jquery';

const dom = $('<div>')
dom.html(_.join(['hello','world'], ' '));
$('body').append(dom);
```

没配置前的打包体积：

```
     Asset       Size  Chunks             Chunk Names
index.html  261 bytes          [emitted]
   main.js    8.6 KiB       0  [emitted]  main
vendors.js    871 KiB       1  [emitted]  vendors~main
```

配置优化后的打包体积：

```
     Asset       Size  Chunks             Chunk Names
index.html  261 bytes          [emitted]
   main.js   8.76 KiB       0  [emitted]  main
vendors.js   68.7 KiB       1  [emitted]  vendors~main
```

可以看到增加了配置参数`externals`之后打包体积从`871KB`减小到了`68.7KB`。
