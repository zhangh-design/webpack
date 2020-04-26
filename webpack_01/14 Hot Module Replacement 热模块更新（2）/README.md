14 Hot Module Replacement 热模块更新（2）

[GUIDES 指南 -> 模块热替换(hot module replacement)](https://www.webpackjs.com/guides/hot-module-replacement/)

[API -> 模块热替换(hot module replacement)](https://www.webpackjs.com/api/hot-module-replacement/)

[CONCEPTS 概念 -> 模块热替换(hot module replacement)](https://www.webpackjs.com/concepts/hot-module-replacement/)


### 在`js`文件里面`HMR`又一个什么样的好处。

那么我在举另外一个`HMR`的例子帮助大家理解

在`src`目录下新增加一个`counter.js`的文件：

counter.js

```
function counter(){
    var div = document.createElement('div');
    div.setAttribute('id','counter');
    div.innerHTML = 1;
    div.onclick = function(){
        // 按10进制+1
        div.innerHTML = parseInt(div.innerHTML, 10)+1;
    }
    document.body.appendChild(div);
}
export default counter;

```

我修改下`index.js`的代码。

index.js

```
/* import './style.css'

var btn = document.createElement('button')
btn.innerHTML = '新增'
document.body.appendChild(btn)
btn.onclick = function(){
    var div = document.createElement('div');
    div.innerHTML = 'item'
    document.body.appendChild(div)
}
 */

import counter from './counter.js'

// 执行一次 counter()
counter();

```

然后`webpack.config.js`里面我恢复成不使用`HMR`的状态（也就是注释掉`hot: true`和`hotOnly: true`和`new webpack.HotModuleReplacementPlugin()`）

重新打包，生效修改的`webpack.config.js`配置：

```
C:\Users\nickname\Desktop\lesson_3>npm run start
```

现在页面就展示出了`1`这个文字，我点击变成每次都加`+1`的操作：

![image](http://i2.tiimg.com/717460/52f7a26636c47dff.jpg)


好，没问题接着呢我再去写一个`js`文件，这个`js`文件呢就是`number.js`吧。

number.js

```
function number(){
    var div = document.createElement('div');
    div.setAttribute('id','number');
    div.innerHTML = 1000;
    document.body.appendChild(div);
}
export default number;

```

index.js

```
/* import './style.css'

var btn = document.createElement('button')
btn.innerHTML = '新增'
document.body.appendChild(btn)
btn.onclick = function(){
    var div = document.createElement('div');
    div.innerHTML = 'item'
    document.body.appendChild(div)
}
 */

import counter from './counter.js'
import number from './number.js'

// 执行一次 counter()
counter();
// 执行一次 number()
number()

```


我们再来看啊，现在页面上有 1 和 1000 ，当我点击上面的 1 的时候会每次都增加`+1`的操作。

![image](http://i2.tiimg.com/717460/285a83ae35df5db1.jpg)

假如我上面的数字变成了`17`，我把`number.js`里面的`1000`改成`2000`，保存然后`webpack-dev-server`会自动帮我们打包（注意这时候我们是把`HMR`的功能给关闭掉了的），你会发现页面刷新了，上面的`17`呢变成`1`了，下面的数字变成了`2000`。

![image](http://i2.tiimg.com/717460/a24d540274d380e0.jpg)

修改成2000之后的效果：

![image](http://i2.tiimg.com/717460/4f46b6068cb1617b.jpg)

因为如果我们把`HMR`的功能给关闭了的话，那么每次修改都会导致浏览器的刷新每次都会重新请求js文件和css文件。

这个展示的效果，也是就说明一个什么样的效果，实际上现在我有两个效果分别是：`counter.js`和`number.js`，我现在引入这两个模块，我改变了`number.js`里的代码，但是如果你不用`HMR`这种技术，整个页面就会重新的刷新，那你在页面上操作的这些数据就没有被保存下来，只要`number.js`变了它就会从比如：现在你点击增加到15啊变成之前的1了，这样的就很坑了，有的时候我希望你`2000`这块的数据要变，你不要影响到我上面这个已经变更过的`17`这个数据，你的模块只对这一块负责就好了，你改了`number.js`模块的代码，那你把下面这块`1000`的内容更新掉就行，别去管上面`17`这块的内容。

这个时候借助`HMR`我们就可以实现我们的目标。

打开我们的`webpack.config.js`，依然我们把`hot: true`和`hotOnly: true`这两个配置参数打开，同时去使用`new webpack.HotModuleReplacementPlugin()`这个插件。

使用了`HMR`这种技术之后呢，我们重启一下我们的`webpack-dev-server`，让最新的配置文件生效：

```
C:\Users\nickname\Desktop\lesson_3>npm run start
```

现在`HMR`已经生效了，然后我在浏览器页面上把它点成随便一个数字：

![image](http://i2.tiimg.com/717460/a24d540274d380e0.jpg)

好，这个时候我来改我的`number.js`里的代码，`counter.js`里的代码我根本就不变，把这个`1000`改成`3000`在保存（这个时候`webpack-dev-server`会自动帮我们打包）。

大家来看当你开启了`HMR`之后啊，你这个`number.js`里的代码改成了`2000`但是页面是不刷新了，但是这个`1000`有没有变成`3000`啊？

![image](http://i2.tiimg.com/717460/a24d540274d380e0.jpg)

是不是我们看到效果并没有改变啊，如果你要让它变成`3000`你额外要写一点代码。

你可以这么去写：

index.js

```
import counter from './counter.js'
import number from './number.js'

// 执行一次 counter()
counter();
// 执行一次 number()
number()

if(module.hot){
    // 如果 number.js这个文件发生了变化，那么我就会执行后面的函数
    module.hot.accept('./number',() => {
        // 让 number() 重新执行一次
        number()
    })
}
```

保存，然后我们到页面上来看现在的效果，刷新页面，现在是`1`和`1000`，

![image](http://i2.tiimg.com/717460/285a83ae35df5db1.jpg)


我呢把`1`点成随便的一个数字比如：`22`，下面我去改变`numnber.js`中的值改成`2000`，保存，我们在页面上看下效果（注意：这时候不要刷新浏览器）：

![image](http://i2.tiimg.com/717460/bdb21aeb7b067758.jpg)


页面上的`1000`是之前的效果，又多出一个`2000`，为什么又多出一个`2000`了，是因为只要你`number.js`发生了变化，我又重新执行一次`number()`，重新执行`number()`的时候它会重新生成一个`div`，内容是`2000`并挂载到页面上。

那很显然我现在要你做的事情并不是让你重新挂载一个`2000`上来，我希望当`number.js`模块发生变化的时候，这么办呢？

我把之前的那个`number()`渲染出来的内容要给它清楚掉，然后在重新生成`number()`这样的内容，那我们就要这样去写了：

index.js

```
import counter from './counter.js'
import number from './number.js'

// 执行一次 counter()
counter();
// 执行一次 number()
number()

if(module.hot){
    // 如果 number.js这个文件发生了变化，那么我就会执行后面的函数
    module.hot.accept('./number',() => {
        // 清除一次
        document.body.removeChild(document.getElementById('number'));
        // 让 number() 重新执行一次
        number()
    })
}
```

这样修改后可以吗，我们来试验下，回到我们的页面上，刷新，现在呢把这个数调成随便的一个数`21`，然后我把`2000`改成`3000`，点开`number.js`把`2000`改成`3000`保存。

回到页面上大家可以看到，`21`这个数字没有受到任何的影响，下面的`2000`已经变成`3000`。


这样的话呢，我们就在`js`里面也实现了一个`Hot Module Replacement`的这样的一个功能。

##### hotOnly的作用

所以呢，大家可以看到当你在一个代码里面去引入其它的模块的时候，如果你希望这个模块的代码发生了变化我只去更新这个模块这部分的代码呢，那就要用到`Hot Module Replacement`这样的一个技术了，要想使用`Hot Module Replacement`这种技术呢，你要在`webpack.config.js`这，个配置里去使用`hot: true`这个配置项当然了`hotOnly: true`可配可不配，一般来说我都会配上，如果你不配`hotOnly: true`这个参数，如果`Hot Module Replacement`出了问题那么`webpack-dev-server`会自动的帮你重新刷新一下页面，那我不希望它重新帮我刷新页面那你把它设置为`hotOnly: true`就可以了，所以我的意思就是`Hot Module Replacement`失效的时候那你就让它失效不要做其它额外的处理，所以`hotOnly`的作用就在于这点。

接着`new webpack.HotModuleReplacementPlugin()`千万不要忘记配置，只有你配置好了之后`HMR`才能生效。


好在来看，在使用这个`HMR`的时候我们在`index.js`种引入了`number`这个模块的js文件，你要监控`number.js`这个模块的变化的话，你就要使用`module.hot.accept`这个方法，一旦`number.js`这个模块发生了变化配置的回调函数就会执行。

##### css文件的引入为什么不用写 `module.hot.accept()`这段监听

有的同学呢就会和之前我们的这个`css`文件的引入去做一个类比，大家记得嘛之前我们写的这个代码：

```
import './style.css'

var btn = document.createElement('button')
btn.innerHTML = '新增'
document.body.appendChild(btn)
btn.onclick = function(){
    var div = document.createElement('div');
    div.innerHTML = 'item'
    document.body.appendChild(div)
}
```

我们在最上面引入了一个`css`文件，那么大家来看同样是在`index.js`里我引入一个样式文件，样式文件呢我修改了样式直接`HMR`的效果就出来了，开始在`index.js`里我引入一个`js`文件我想实现一个`HMR`的效果还要自己手写这么一长串的代码，这是为什么呀？

其实引入`css`文件理论上你也应该写`module.hot.accept`这段监听代码，但是为什么你不用写了呢？是因为这样的一段代码实际上在`css-loader`里面已经帮你编写完毕了，所以`css-loader`底层帮你实现了这段监听的代码`module.hot.accept()`你就没有必要在写一遍了。

##### 我们写`Vue`代码的时候为什么也不用写`module.hot.accept()`这个监听

大家呢，如果使用过`Vue`你会发现`Vue`里面其实呢你写代码的时候它也有`HMR`的这种效果，但是你写`Vue`代码的时候从来也没写过这样的一段代码，那原因是什么，`vue-loader`也内置了这样一个`HMR`的一个代码的编写，所以不用你手写了，它里面自带这种功能。

---

但是如果我们在我们的项目中引入一些比较偏的文件类型，比如说一些数据文件，这个时候呢这些文件的`loader`里面并没有内置这种`HMR`的效果，所以呢遇到这种文件我们还需要手动的去写这样的一个`module.hot.accept()`这样的一个代码
，所以呢大家要知道`HMR`本质上要想实现`HMR`你都得这样的一段代码：

```
if(module.hot){
    // 如果 number.js这个文件发生了变化，那么我就会执行后面的函数
    module.hot.accept('./number',() => {
        // document.body.removeChild(document.getElementById('number'));
        // 让 number() 重新执行一次
        // number()
    })
}
```

但是有的时候我们不需要写在一些框架里面或者在`css`里面也可以自动的实现这种效果，原因就在于它的`loader`已经写好了`HMR`的功能。

当然了我相信大家在配置`webpack`的过程中，你的业务之中肯定有地方需要做这种`HMR`的代码的编写，你要记住这个`accept`方法就可以了。


### 作业

这节课的结尾呢，我要给大家在留点作业，我们一起打开[webpack](https://www.webpackjs.com/)的官网，然后大家先来看GUIDES[（指南）](https://www.webpackjs.com/guides/)这块的内容，GUIDES（指南）这里有个`hot-module-replacement`[模块热替换](https://www.webpackjs.com/guides/hot-module-replacement/)
的讲解，建议大家呢把这段代码给仔细的阅读一遍，这里不仅讲了如何在`webpack-dev-server`里面配置`hot-module-replacement`还讲了如果你自己想要创建一个`webpack-dev-server`这样的服务器那你应该如何的自己去在`Node`里面配置这种`hot-module-replacement`的效果。

那读完了`hot-module-replacement`这块的内容之后呢，打开可以在翻开[`API`](https://www.webpackjs.com/api/)这一块，在`API`里面呢大家可以点开[模块热替换(hot module replacement)](https://www.webpackjs.com/api/hot-module-replacement/)这块的配置，这里面呢它会告诉我们其实`hot-module-replacement`
它提供的方法不仅仅有`accept()`这一个，那我们呢给大家讲的是最常用的`module.hot.accept()`方法，实际上呢还有一些方法，比如说：`decline`、`dispose`、`apply`方法，这些内容呢大家在以后深入的使用`webpack`的时候可能都会有使用的场景，那么到时候过来查一下就可以了。

那如果`API`呢你也简单的过了一下之后，你可以在点开`CONCEPTS`（[概念](https://www.webpackjs.com/concepts)）这个文档的[模块热替换(hot module replacement)](https://www.webpackjs.com/concepts/hot-module-replacement/)的讲解，它讲解的是`HMR`底层`webpack`的实现原理，如果你感兴趣的话也可以来看一下。

好，这样的话我就把`hot-module-replacement`大家应该掌握的几个知识点以及如何去查阅相关文档的方法给大家讲解完了。
