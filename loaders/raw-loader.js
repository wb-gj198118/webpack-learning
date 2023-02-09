// 自己写的raw-loader
const { getOptions } = require('loader-utils');
// 获取webpack配置的options，写loader的固定套路第一步

module.exports = function (content, map, meta) {
    const opts = getOptions(this) || {};
    const code = JSON.stringify(content);
    const isESM = typeof opts.esModule !== 'undefined' ? options.esModule : true;
    // 直接返回原文件内容
    return `${isESM ? 'export default' : 'module.exports ='} ${code}`;
};