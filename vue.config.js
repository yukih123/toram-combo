const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    configureWebpack: {
        plugins: process.env.NODE_ENV != 'production'
            ? [new BundleAnalyzerPlugin()]
            : []
    }
};
