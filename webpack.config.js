const webpack = require('webpack');
const MyPlugin = require('./plugins/MyPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const { resolve } = require('path')
module.exports = {
    mode: 'none',
    entry: './src/main.js',
    output: {
        path: resolve(__dirname, './dist'),
        filename: 'js/[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: './loaders/hello-loader',
                options: {
                    author: 'gaojian',
                    email: '123@a.com',
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: './loaders/uglify-loader',
            },
            {
                test: /\.js$/,
                loader: './loaders/babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.js$/,
                loader: './loaders/eslint-loader',
                exclude: /node_modules/,
                options: {
                    fix: true
                }
            },
            {
                test: /\.js$/,
                loader: './loaders/dep-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: './loaders/example-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                loader: './loaders/async-catch-loader',
                exclude: /node_modules/,
            },
        ]
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new MyPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}