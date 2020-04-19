17-1 Tree Shaking package.json 中设置 sideEffects 的作用和影响是什么

[->深入研究webpack之Tree Shaking相关属性sideEffects用处](https://www.cnblogs.com/wzcsqaws/p/11571945.html)

[->Webpack 中的 sideEffects 到底该怎么用？](https://segmentfault.com/a/1190000015689240)

[->你的Tree-Shaking并没什么卵用](https://segmentfault.com/a/1190000012794598)

- 不设置 `sideEffects` 不会优化掉有副作用的代码
- "sideEffects": false  指定所有的文件都没有副作用，副作用的代码也会被优化掉
- "sideEffects": ["./src/a.js"] 跳过这个模块不去对副作用的代码做摇摆优化

我自己理解了下配置项 sideEffects （副作用）在项目中的意思：

#### 1. 不设置 sideEffects

如果我不再 package.json 中配置 sideEffects 这个属性（也不是配置成`"sideEffects": false`），那么 Webpack 在生产环境构建打包时使用 tree Shaking 摇摆代码时会去每个引用了的文件里面去分析并且 webpack 不知道要不要优化掉有副作用的代码（副作用的代码可能会有作用其它人会使用如果优化掉可能产生不可预料的结果），所以这个副作用的代码（并不是整个模块文件）还是会被打包到最终的 Chunk 文件里。

index.js

```
import './a.js'

setTimeout(() => {
  console.log(Array.prototype.hello); // ()=>"hello"
}, 2000);
```

a.js

```
// add 会被优化掉，因为 add 方法本身就没有副作用
export const add = (a, b) => {
  console.log(a + b);
};
// minus 会被优化掉，因为 minus 方法本身就没有副作用
const minus = (a, b) => {
  location.href = url;
  console.log(a - b);
};

// 不会被优化掉，会打包到最终的 Chunk 里，修改了 Array 的原型这样就产生了副作用
Array.prototype.hello = () => 'hello';

```

#### 2. 设置 "sideEffects": false

index.js 和 a.js 都不变，sideEffects: false，指定所有的文件都没有副作用
结果是 terser 完全不去管你这个文件里面写的啥，都会给你优化掉，最终的构建 Chunk 里面不会有这个代码。

意思就是我所有的文件都是没有副作用的你放心给我优化吧。

package.json

```
"sideEffects": false
```

index.js

```
import './a.js'

setTimeout(() => {
  console.log(Array.prototype.hello); // undefined
}, 2000);
```

add 和 minus 方法没有被引入所以会被 tree Shaking 优化掉，`Array.prototype.hello = () => 'hello';` 这个代码因为我告诉了 webpack 我所有的模块或者说文件都是没有副作用的，所以这个也会被优化掉。

#### 3. 设置 "sideEffects": ["./src/a.js"]

index.js 和 a.js 都不变，sideEffects:["./src/a.js"]，指定 a.js 是有副作用
，结果 terser 读了 a.js，知道了你做了什么处理，于是并不会去把`Array.prototype.hello = () => 'hello';`这个副作用代码给优化掉。

index.js

```
import './a.js'

setTimeout(() => {
  console.log(Array.prototype.hello); // ()=>"hello"
}, 2000);
```

最终的 chunk 里面不会有 add和minus方法，但是会有`Array.prototype.hello = () => 'hello';`

#### 4. index.js 变成如下代码

package.json

```
"sideEffects": ["./src/a.js"]
```

```
import { add } from "./a.js";

setTimeout(() => {
  console.log(Array.prototype.hello); // ()=>"hello"
}, 2000);

```

这里引入了 add 方法但是没有使用所以在最终的打包输出的 chunk 文件里不会有 add 和 minus 这两个方法，但是会有`Array.prototype.hello = () => 'hello';`。

和第3中方式其实是一样的。

#### 5. index.js 变成如下代码

package.json

```
"sideEffects": false
```

```
import { add } from "./a.js";

setTimeout(() => {
  console.log(Array.prototype.hello); // undefined
}, 2000);

```

add 方法虽然引入了但是没有使用所以会被 tree Shaking 优化掉，minus 方法没有被引入所以也会被 tree Shaking 优化掉。

和第2种是一样的，告诉 Webpack 我所有的模块或者说文件都是没有副作用的，你放心给我优化掉吧。

#### 6. index.js 变成如下代码

package.json

```
"sideEffects": false
```

```
import { add } from "./a.js";

add(1, 2) // 3

setTimeout(() => {
  console.log(Array.prototype.hello); // ()=>"hello"
}, 2000);

```

结果无论 sideEffects 怎么设置，`Array.prototype.hello = () => 'hello';` 都不会被优化掉。


---

通过几次测试下来发现`sideEffects`属性只是针对你从文件导入了方法却没有使用（或者你压根没有导入方法）的情况生效，从这么看来sideEffects属性其实能做的优化不大，而且只是针对打包速度方面的优化（包已经打好了，访问速度跟它没有关系了），而且很坑，一个前端项目如果不只你一个人参与，你偷偷加个sideEffects属性，然后代码没压缩在dev跑的好好的，放到生产环境突然就失效了，假设人家不知道sideEffects，那抓破脑袋也不知道是咋回事（如果你就是想坑你同事，那你就可以happy了~）


