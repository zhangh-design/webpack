33 webpack 性能优化 resolve参数合理配置(2)

这节课我们再来讲一个优化 webpack 打包速度的方法，通过合理的优化 resolve 配置项我们可以让 webpack 打包速度更快，之前呢我们没有给大家着重强调过 resolve 这个配置参数，正好在这节课里面我给大家来讲一下 resolve 这个配置参数应该如何配置。

#### babel-loader 同时解析 js 和 jsx 文件

解析 jsx 文件的配置：

webpack.common.js

在这里面我们可以在这个`test: /\.js$/`这里的 `js` 后面加一个`jsx?`，这种写法大家在一些文档上或者在一些 webpack 的配置文件里经常可以看到，它的意思就是如果遇到 js 这种文件那么会走`babel-loader`，如果遇到 jsx
这个文件也会走`babel-loader`，那这个 ? 问号表示的是这个`x`可有可无，如果你没有那就意味着你是一个 js 文件会走 `babel-loader`，如果你有这个 `x` 一样的我呢也可以兼容你的这个正则表达式。

所以呢无论是 js 还是 jsx 的文件都会走 `babel-loader`。


```
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
}
```

#### resolve 配置项

这个时候啊我们还没讲到 resolve 这个配置项，所以接下来我们来讲 resolve 。


```
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx'],
  }
}
```

- extensions 当我去引入一个其它目录下的模块的时候我会先到这个目录下去找这个文件对应的以 `js` 为结尾的这种文件找不到然后在去找以`jsx`为结尾的这种文件。

那为什么说我们要合理的配置 `resolve`呢？

有的同学看到了 `extensions` 可以这么配，那它呢就想把好多东西都配在这里，比如说：

```
extensions: ['.css', '.jpg', '.js', '.jsx']
```

你是不是想所有的后缀我都可以配在这呢，这样的话我去引入这些文件的时候那就方便了，比如说我去引入一个图片：

```
import picture from './child/picture'

```

它就会到`child`的目录下去帮我们找以`picture`为文件名的这样一些文件，那它的后缀可能是`.css`它会先去找 css 发现呢你这个`child`目录下没有`picture.css`文件，那它在会去找什么呢？再会去找`picture.jpg`发现它也没有，再去找`picture.js`也没有再去找`.jsx`也没有，然后呢它就会发现其实你的这个`picture`文件不管是任何后缀的文件实际上在`child`目录下都没有这个时候它就会报出错误。

那了解了这个流程之后啊，我们去想当我们去引入一个名字叫做`picture`的文件的时候，如果你在

```
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
  }
}
```

`resolve.extensions`这个配置项里配置了很多内容，就意味着呢有可能你要去调用很多次文件的查找，大家想每一次文件的查找它去查找`css`的时候要去调用一次 node.js 底层的这种文件的操作，那如果呢在去查找`jpg`又要调用一次这样文件查找的操作，所以呢你配置了很多`resolve.extensions`那么在查找文件实际上是有性能损耗的。

所以呢我们说一般来说只有去引入一些`js`或者`jsx`这种逻辑性文件的时候我们才会把它配置到这种`resolve.extensions`这样的一个配置项里。

像这种`css`文件或者`jpg`图片文件的话我不建议大家把它配置在`resolve.extensions`里面，建议大家呢还是以显示的这种形式去引入你想要的资源：

```
import picture from './child/picture.png'

```

#### resolve.mainFiles

`resolve`里面除了能够配置`extensions`这样的东西，我们还可以配置一些其它的东西，我在给大家举个例子

我们打开 webpack.common.js 找到 `resolve`在这里我们可以配一个字段叫做`mainFiles`。


```
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    mainFiles: ["index","child"]
  }
}
```

它的意思是什么呢？

它的意思是当你引入一个目录下的什么什么样的内容的时候，我不知道你具体要引入哪一个文件，那么我会先去找`index`，如果`index`开头的文件不存在，我再去找以`child`开头的这样的文件，那么这样的话我们确实有以`child`开头的文件，所以呢我们：


```
src
 |-view
   |-child
     |-child.vue
```

```
import Child from './child/'

```

但是呢大家想如果你配置了`mainFiles`它又会带来性能上的问题，因为当我写一个路径的时候它又要去查找路径下有没有`index.jsx`有没有`index.js`，在去找有没有`child.jsx`有没有`child.js`这样的文件。

所以呢你额外的配置了`resolve`这里的内容确实会对打包有所影响的，所以这块呢大家按照自己的需要来配，但是千万不要配置的特别多。

####

那`resolve`里面其实还有一些东西，我们也比较常用，比如说我在举一个例子

我们呢写一个`alias`（别名）：

那么我现在起一个别名叫做`delllee`意思是我现在起了一个名字叫做`delllee`

`delllee`实际上指向哪里呢，实际上我们可以这么写

```
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.vue'],
    mainFiles: ["index","child"],
    alias: {
      delllee: path.resolve(__dirname, '../src/child')
    }
  }
}
```

它的意思是什么？当我看到了`delllee`这样的一个路径的时候或者说这样的一个字符串的时候，它实际上是这个路径`path.resolve(__dirname, '../src/child')`的一个别名，它指向哪里啊，它指向的是`src`目录下的`child`这个目录，所以呢当你去写：


```
import Child from 'delllee'

```

的时候，实际上你写的是什么啊你写的是`import Child from '../src/child'`这个路径，所以呢大家想当我`delllee`这是一个别名之后，那它就可以找到`child`目录，那它能不能在帮我们自动在帮我们去引入这个目录下的`index.jsx`啊很显然就可以帮助我们去引入这个`index.jsx`了。

在真正做 Webpack 的配置的时候其实`alias`用的还是非常的多的。

我给大家举个场景上的例子啊：

```
src
 |-a
   |-b
     |-c
       |-child
         |-index.jsx
 index.js
package.json
.babelrc
```

那如果我想去引入这个`index.jsx`该怎么去引入啊。

传统的写法：

index.js

```
import Child from './a/b/c/child/index.jsx'

```

这样写就很麻烦，目录层级非常的多。

我们就可以在`alias`里写一个配置：

```
const path = require("path");

module.exports = {
  resolve: {
    alias: {
      child: path.resolve(__dirname, '../src/a/b/c/child')
    }
  }
}
```

OK，好当我们做好这个别名的配置之后，我们在想引入`index.js`就没有必要写这么一长串了：

```
import Child from './a/b/c/child/index.jsx'

```

我们直接写一个`child`就可以了

```
import Child from 'child/index.jsx'

```

那么这节课呢我就给大家简单的介绍了下`resolve`这块的配置，同时也给大家讲解了你要合理的使用`resolve`，不要配置过多的这种`extensions`扩展名，也不要扩展过多的`mainFiles`。

其实呢它还有很多的这个字段大家可以自己再去查阅一下，在使用的过程当中大家一定要注意合理的使用，看`extensions`好用就配很多的东西在里面因为这样的话
会降低 webpack 的打包速度的。


