class MyPlugin {
    constructor(options) {
        //
    }
    // compiler.hooks.compilation：启动编译创建出 compilation 对象后触发
    // compiler.hooks.make：正式开始编译时触发
    // compiler.hooks.emit：输出资源到output目录前执行
    // compiler.hooks.afterEmit：输出资源到output目录后执行
    // compiler.hooks.done：编译完成后触发
    apply(compiler) {
        compiler.hooks.entryOption.tap('MyPlugin', (context, entry) => {
            console.log('同步任务...', context, entry);
        });
        compiler.hooks.compilation.tap(
            'MyPlugin',
            (...args) => {
                console.log(' plugin compilation !!! ', args.length);
                // callback();
            }
        );
        // 指定一个挂载到 webpack 自身的事件钩子。
        compiler.hooks.emit.tapAsync(
            'MyPlugin',
            (compilation, callback) => {
                console.log(' plugin emit !!! ');
                console.log('异步任务完成...');
                callback();
            }
        );
    }
}

module.exports = MyPlugin