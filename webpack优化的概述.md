# 1. webpack 一些优化的点

## 1. thread-loader: 多进程打包

  可以大大提高构建的速度，使用方法是将 ​​thread-loader​​ 放在比较费时间的 loader 之前，比如 ​​babel-loader​​
  
  文档: [thread-loader](https://www.webpackjs.com/loaders/thread-loader/)
  
## 2. cache-loader： 缓存资源

  提高二次构建的速度，使用方法是将 ​​cache-loader​​ 放在比较费时间的 loader 之前，比如 ​​babel-loader​​
  
  文档:[cache-loader](https://webpack.docschina.org/loaders/cache-loader/)
  
## 3. 合理配置loader和plugin中的exclude & include

​​ 文件过滤 exclude​​：不需要处理的文件， include​​：需要处理的文件

## 4. 区分环境

​​ 开发环境(development) ​​：去除代码压缩、gzip、体积分析等优化的配置，大大提高构建速度
  
​​ 生产环境(production) ​​：需要代码压缩、gzip、体积分析等优化的配置，大大降低最终项目打包体积
  
  文档: [mode配置](https://webpack.docschina.org/configuration/mode/)
  
## 5. 对代码、文件、网络请求进行体积压缩等

### 1. 文件压缩
可以使用CompressionPlugin对文件进行压缩
       
这里简单介绍下它其中的一些配置项: 
       
1. threshold：x以上的文件才进行压缩

2. minRatio：最小压缩比，小于则不压缩

3. test：正则匹配的文件才压缩
          
4. alogorithm：压缩算法
          
5. deleteOriginalAssets: 是否删除源文件
          
demo:

```
// client 端：
new CompressionPlugin({ // 此插件可能不能使用太高的版本，否则可能会出现报错：TypeError: Cannot read property 'tapPromise' of undefined
    // filename: "[path][base].gz", // 这种方式是默认的，多个文件压缩就有多个.gz文件，建议使用下方的写法
    filename: '[path].gz[query]', //  使得多个.gz文件合并成一个文件，这种方式压缩后的文件少，建议使用
    algorithm: 'gzip', // 官方默认压缩算法也是gzip
    test: /\.js$|\.css$|\.html$|\.ttf$|\.eot$|\.woff$/, // 使用正则给匹配到的文件做压缩，这里是给html、css、js以及字体（.ttf和.woff和.eot）做压缩
    threshold: 10240, //以字节为单位压缩超过此大小的文件，使用默认值10240吧
    minRatio: 0.8, // 最小压缩比率，官方默认0.8
    // 是否删除原有静态资源文件，即只保留压缩后的.gz文件，建议这个置为false，还保留源文件。
    // 假如出现访问.gz文件访问不到的时候，还可以访问源文件双重保障
    deleteOriginalAssets: false
})
```

```
// nginx server 端：
# 主要是下方的gizp配置哦，直接复制粘贴就可以使用啦，亲测有效哦
gzip on; # 开启gzip压缩
gzip_min_length 4k; # 小于4k的文件不会被压缩，大于4k的文件才会去压缩
gzip_buffers 16 8k; # 处理请求压缩的缓冲区数量和大小，比如8k为单位申请16倍内存空间；使用默认即可，不用修改
gzip_http_version 1.1; # 早期版本http不支持，指定默认兼容，不用修改
gzip_comp_level 2; # gzip 压缩级别，1-9，理论上数字越大压缩的越好，也越占用CPU时间。实际上超过2的再压缩，只能压缩一点点了，但是cpu确是有点浪费。因为2就够用了
# 压缩的文件类型 MIME类型，具体可往上查资料 # css # xml # 识别php # 图片
gzip_types text/plain application/x-javascript application/javascript text/javascript text/css application/xml application/x-httpd-php image/jpeg image/gif image/png application/vnd.ms-fontobject font/x-woff font/ttf;
# text # 早期js # js # js的另一种写法 # .eot字体 # woff字体 # ttf字体
gzip_vary on; # 是否在http header中添加Vary: Accept-Encoding，一般情况下建议开启  
```         
它的具体玩法可以看webpack官网介绍：[CompressionPlugin](https://webpack.docschina.org/plugins/compression-webpack-plugin/)

### 2. http请求压缩
   
HTTP压缩是一种内置在 服务器 和 客户端 之间的，以改进传输速度和带宽利用率的方式;
      
HTTP压缩的流程：
      
> 第一步:HTTP数据在服务器发送前就已经被压缩了;(可以在webpack中完成)

> 第二步:兼容的浏览器在向服务器发送请求时，会告知服务器自己支持哪些压缩格式;
        
> 第三步:服务器在浏览器支持的压缩格式下，直接返回对应的压缩后的文件，并且在响应头中告知浏览器;
        
压缩格式: 

> compress – UNIX的“compress”程序的方法(历史性原因，不推荐大多数应用使用，应该使用gzip或
      deflate);

> deflate – 基于deflate算法(定义于RFC 1951)的压缩，使用zlib数据格式封装;

> gzip – GNU zip格式(定义于RFC 1952)，是目前使用比较广泛的压缩算法;

> br – 一种新的开源压缩算法，专为HTTP内容的编码而设计;

### 3. css压缩

> CSS压缩通常是去除无用的空格等，因为很难去修改选择器、属性的名称、值等;

> CSS的压缩我们可以使用另外一个插件:css-minimizer-webpack-plugin;

> css-minimizer-webpack-plugin是使用cssnano工具来优化、压缩CSS(也可以单独使用);

它可以在optimization.minimizer中配置

demo:

```
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const isProduction = true
const TerserPlugin = require("terser-webpack-plugin")
const CssMiniMizerPlugin = require("css-minimizer-webpack-plugin")
module.exports = {
    mode: "production",
    optimization: {
        chunkIds: "deterministic",
        minimize:true,
        minimizer:[
            new TerserPlugin({
                extractComments:true,
                parallel:true,
                terserOptions:{
                    compress:true,
                    mangle:true,
                    toplevel:false,
                    keep_classnames:false
                }
            }),
            new CssMiniMizerPlugin({
                parallel:true
            })
        ]
    }
}
```

具体配置可参考官方文档：

[css-minimizer-webpack-plugin](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/)

cssnano文档

[cssnano](https://cssnano.co/)

### 4. HTML文件中代码的压缩

可以使用HtmlWebpackPlugin插件来生成HTML的模板，它可以配置:

1. inject:设置打包的资源插入的位置, 值包含: true、 false 、body、head

3. cache: 设置为true，只有当文件改变时，才会生成新的文件(默认值也是true)

3. minify: 默认会使用一个插件 html-minifier-terser

demo:
```
plugins: [
    new HtmlWebpackPlugin({
        title: "LeBronChao Webpack",
        template: "./src/index.html",
        inject:"body",
        cache:true,
        minify: isProduction ? {
            removeComments: true, // 是否删除注释
            removeRedundantAttributes:true, // 是否删除多余（默认）属性
            removeEmptyAttributes:true,  // 是否删除空属性
            collapseWhitespace:false,  // 折叠空格
            removeStyleLinkTypeAttributes:true, // 比如link中的type="text/css"
            minifyCSS:true, // 是否压缩style标签内的css
            minifyJS:{  // 压缩JS选项，可参考Terser配置
                mangle:{
                    toplevel: true
                }
            }
        }: false
    }),
]
```

具体配置可看官网介绍：[HtmlWebpackPlugin](https://github.com/jantimon/html-webpack-plugin#options)

### InlineChunkHtmlPlugin

它可以将一些chunk出来的模块，内联到html中:

​​ 比如runtime的代码，代码量不大，但是是必须加载的; ​​

​​ 那么可以直接内联到html中; ​​

这个插件是在react-dev-utils中实现的，所以我们可以安装一下:

```
npm i react-dev-utils 
```

可在production的plugins中进行配置（内联runtime文件）:

webpack.prod.js

> ​​ 参数一为HtmlWebpackPlugin ​​
> ​​ 参数二为正则匹配表达式 ​​

demo: 
```
const InlieChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin")

plugins:[
    new InlieChunkHtmlPlugin(HtmlWebpackPlugin,[/runtime.+\.js/])
]
```

### 利用Terser机制对代码进行压缩

它是一个JavaScript的解释(Parser)、Mangler(绞肉机)/Compressor(压缩机)的工具集
早期使用 uglify-js来压缩、丑化JavaScript代码，但是目前已经不再维护，并且不支持ES6+的 语法;
Terser是从 uglify-es fork 过来的，并且保留它原来的大部分API以及适配 uglify-es和uglify-js@3等; 也就是说，Terser可以帮助压缩、丑化代码，让我们的bundle变得更小

详情可查看以下文档：

  [compress-options](https://github.com/terser/terser#compress-options)
  
  [mangle-options](https://github.com/terser/terser#mangle-options)

Webpack 配置：

1. 首先，需要打开minimize，让其对代码进行压缩(默认production模式下已经打开了) 

2. 其次，可以在minimizer创建一个TerserPlugin:

> ​​  extractComments:默认值为true，表示会将注释抽取到一个单独的文件中;   ​​

>> ​​  在开发中，不希望保留这个注释时，可以设置为false; ​​

> ​​  parallel:使用多进程并发运行提高构建的速度，默认值是true，并发运行的默认数量: os.cpus().length - 1; ​​

>>  也可以设置自己的个数，但是使用默认值即可;

> ​​ terserOptions: 设置terser相关的配置 ​​

>>> 1. compress: 设置压缩相关的选项;

>>> 2. mangle: 设置丑化相关的选项，可以直接设置为true;

>>> 3. toplevel: 底层变量是否进行转换;

>>> 4. keep_classnames: 保留类的名称;

Webpack中的具体配置可参考文档：

[terser-webpack-plugin](https://webpack.docschina.org/plugins/terser-webpack-plugin/)
  
## 6. 小图转 base64 
  对于一些小图片，可以转 base64，这样可以减少用户的 http 网络请求次数，提高用户的体验。
  ​​webpack5​​ 中 ​​url-loader​​ 已被废弃，改用 ​​asset-module​​

## 8. 合理配置 hash 新的资源可以避免命中缓存

# 2 webpack Plugin 和 Loader 的区别

  Loader： 用于对模块源码的转换，loader 描述了 webpack 如何处理非 javascript 模块，并且在 buld 中引入这些依赖。loader 可以将文件从不同的语言（如 TypeScript）转换为 JavaScript，或者将内联图像转换为 data URL。比如说：CSS-Loader，Style-Loader 等。

  Plugin 目的在于解决 loader 无法实现的其他事,它直接作用于 webpack，扩展了它的功能。在 webpack 运行的生命周期中会广播出许多事件，plugin 可以监听这些事件，在合适的时机通过 webpack 提供的 API 改变输出结果。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。插件接口功能极其强大，可以用来处理各种各样的任务。
