const babel = require('@babel/core')
const schema = {
    'type': 'object',
    'properties': {
        'presets': {
            'type': 'array'
        }
    }
}
module.exports = function (content) {
    const options = this.getOptions(schema);
    const callback = this.async();
    babel.transform(content, options, function (err, result) {
        if (err) {
            callback(err)
        } else {
            callback(null, result.code)
        }
    })
}