const { urlToRequest } = require('loader-utils');
const { validate } = require('schema-utils');

const schema = {
    type: 'object',
    properties: {
        test: {
            type: 'string',
        },
    },
};

module.exports = function (source) {
    const options = this.getOptions();

    validate(schema, options, {
        name: 'Example Loader',
        baseDataPath: 'options',
    });

    console.log('The request path', urlToRequest(this.resourcePath));

    // 对资源应用一些转换……

    return `export default ${JSON.stringify(source)}`;
}