const CompressionPlugin = require('compression-webpack-plugin');

let webPath = '/';

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? webPath : '/',
    outputDir: 'pasteme',
    productionSourceMap: false,
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [new CompressionPlugin({
                    test: /\.js$|\.html$|\.css$|\.png$|\.ico/,
                    threshold: 4096,
                    deleteOriginalAssets: true,
                })],
            }
        }
    },
};
