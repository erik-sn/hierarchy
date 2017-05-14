"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-var-requires object-literal-sort-keys */
var autoprefixer = require("autoprefixer");
var path = require("path");
var webpack = require("webpack");
var configuration = {
    devtool: 'eval',
    entry: [
        'webpack-dev-server/client?http://localhost:3000',
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        './src/index.tsx',
    ],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/static/media/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify('development'),
            },
        }),
        new webpack.LoaderOptionsPlugin({ options: { postcss: [autoprefixer] } }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    ],
    module: {
        rules: [
            {
                test: /\.test.js$|\.test.ts$|\.test.tsx$/,
                use: 'ignore-loader',
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
            {
                test: /\.ts(x?)$/,
                include: path.join(__dirname, '../src'),
                use: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
            },
            {
                test: /\.json$/,
                use: ['json-loader'],
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
                use: ['file-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['*', '.ts', '.tsx', '.json', '.', '.js', '.jsx'],
    },
    externals: {
        'cheerio': 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true,
    },
};
exports.default = configuration;
