var root = document.getElementById('root');
// 这里注意我们不是模块化的，所以 css-loader 里配置的 modules: true 要去掉
import './index.scss'

// 使用iconfont字体 class类中的 iconfont 是估计的名称 后面的 icon-changjingguanli 是图标在index.scss文件中的名称
root.innerHTML='<div class="iconfont icon-changjingguanli">abc</div>';
