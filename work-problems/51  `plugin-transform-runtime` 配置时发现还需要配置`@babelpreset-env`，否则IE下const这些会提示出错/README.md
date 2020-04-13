
```
{
"presets": ["@babel/preset-env"],
/类库或者组件库配置项/
"plugins": [
  [
    "@babel/plugin-transform-runtime",
    {
      "absoluteRuntime": false,
      "corejs": 3,
      "helpers": true,
      "regenerator": true,
      "useESModules": false,
      "version": "^7.8.4"
    }
  ]
]
}

我的index.js
const b = '123’
console.info(b);

const c = ['a', 'b', 'c']
c.map((item, index) => {
console.info(item, index);
})
```

因为IE11下我测试了下 类似`const b = '123';console.info(b);`这样是可以直接运行的，但是使用map这种函数就不行了，所以这时就需要 babel来进行转义了。

我的理解是 `preset-env`是转换一些语法类似：const、箭头函数，`plugin-transform-runtime`结合corejs是转换更高级的内置函数这些的（防止污染全局环境），
所以基础的ES6语法还是需要交给`preset-env`来做这件事情的。
