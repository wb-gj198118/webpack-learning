module.exports = function (content) {
    callback = this.async();
    const schema = {
        type: 'object', //options是一个对象
        properties: {
            //author是一个字符串
            author: {
                type: 'string'
            },
            //email是一个字符串
            email: {
                type: 'string'
            },
            isSync: {
                type: 'boolean',
            }
        }
    }
    const options = this.getOptions(schema) || {}
    const { author = 'null', email = 'null', isSync } = options
    const newContent = `
        /**
         * @Author:"${author}"
         * @Email:"${email}"
         * */
        ${content}
    `
    if (!isSync) {
        // 模拟网络延迟
        setTimeout(() => {
            callback(null, JSON.stringify(newContent), null, {})
            console.log('net done');
        }, 1000)
    } else {
        return newContent;
    }
}