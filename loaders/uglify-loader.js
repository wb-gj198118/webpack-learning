const uglifyJS = require('uglify-js');
module.exports = function (content) {
    const result = uglifyJS.minify(content)
    const { error, code } = result
    if (error) {
        this.callback(error)
    } else {
        this.callback(null, code)
    }
}