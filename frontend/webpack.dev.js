"use strict";
const config = require ('./src/config');
const path   = require('path');
const merge  = require('webpack-merge');

const common = require('./webpack.common.js');


module.exports = merge(common, {
    devtool: 'eval',
    devServer: {
        host: '0.0.0.0',
        contentBase: path.resolve(__dirname, 'dist'),
        compress: true,
        port: config.port
    }
});
