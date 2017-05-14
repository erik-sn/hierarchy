"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-var-requires object-literal-sort-keys */
var autoprefixer = require("autoprefixer");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");
var webpack = require("webpack");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var configuration = {
    devtool: 'hidden-source-map',
    entry: [
        './src/index.tsx',
    ],
    output: {
        filename: 'hierarchy.min.js',
        path: path.join(__dirname, '../dist'),
        publicPath: '/dist/',
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '/hierarchy.min.css',
            allChunks: true,
        }),
        new webpack.LoaderOptionsPlugin({ options: { postcss: [autoprefixer] } }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                }),
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$/i,
                use: 'file-loader?name=/img/[name].[ext]',
            },
            {
                test: /\.ts$|\.tsx$/,
                use: ['awesome-typescript-loader'],
                include: path.join(__dirname, '../src'),
            },
            {
                test: /\.json$/,
                use: 'json-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.js', '.ts', '.tsx', '.json'],
    },
    externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
    },
};
exports.default = configuration;
