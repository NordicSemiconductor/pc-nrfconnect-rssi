const webpack = require('webpack');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
    devtool: isProd ? 'hidden-source-map' : 'inline-eval-cheap-source-map',
    entry: './index.js',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'bundle.js',
        libraryTarget: 'umd',
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            loaders: [
                'babel-loader?cacheDirectory',
                'eslint-loader',
            ],
            exclude: /node_modules/,
        }, {
            test: /\.json$/,
            loader: 'json-loader',
        }, {
            test: /\.less$/,
            loaders: [
                'style-loader',
                'css-loader',
                'less-loader',
            ],
        }, {
            test: /\.(png|gif|ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
            loader: 'file-loader',
        }],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(nodeEnv),
            },
        }),
    ],
    target: 'electron-renderer',
    externals: {
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
            umd: 'react',
        },
    },
};
