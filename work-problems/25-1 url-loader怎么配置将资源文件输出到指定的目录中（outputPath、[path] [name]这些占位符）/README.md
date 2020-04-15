25-1 url-loader怎么配置将资源文件输出到指定的目录中（outputPath、[path] [name]这些占位符）

项目的目录结构：

```
build
 |-utils.js
 |-webpack.base.js
 |-webpack.dev.js
 |-webpack.prod.js
config
 |-dev.env.js
 |-index.js
 |-prod.env.js
dist
node_modules
public
 |-favicon.ico
 |-index.html
src
 |-view
   |-login
      |-Analysis
        |-bg.png
 |-index.js
static
 |-resources
.editorconfig
.gitignore
package.json
```


第一种方式通过配置一个`outputPath`：

```
module: {
    // 默认将 entry 的入口起点指向根目录
    context: path.resolve(__dirname, '../'),
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name]-[hash:7].[ext]',
            outputPath: 'images/',
            // 字节
            limit: 10240
          }
        }
      }
    ]
}
```

打包出的资源文件最终都会当道 `images` 这个文件夹中。

```
dist
 |-images
   |-bg-bf6b995.png
```

第二种方式在`name`属性中：

```
const path = require('path')
module.exports = {
    module: {
        // 默认将 entry 的入口起点指向根目录
        context: path.resolve(__dirname, '../'),
        rules: [
          {
            test: /\.(jpg|png|gif)$/,
            use: {
              loader: 'url-loader',
              options: {
                name: path.posix.join('static', 'img/[path][name]-[hash:7].[ext]'),
                // 可能和 webpack.context 设置有冲突，在 loader 内部设置 context
                context: path.resolve(__dirname, '../src'),
                limit: 10240
              }
            }
          }
        ]
    }
}
```

这里的`path`是资源相对于 context 的路径，也就是最后打包输出的目录结构会是你图片真实的目录结构。

如果没有设置`context`属性，那么回去webpack.context 属性作为资源的相对路径。

```
dist
 |-static
   |—img
     |-view
       |-login
         |-bg-bf6b995.png
```

这样好处就是打包后的目录结构和打包前是一样的，方便查找文件，缺点是层级会较多。

