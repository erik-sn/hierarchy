/* eslint-disable */
var path = require('path');
var webpack = require('webpack');
require('es6-promise').polyfill();

// automatically add vendor prefixes to transpiled css
var autoprefixer = require('autoprefixer');

module.exports = {
  eslint: {
    configFile: './.eslintrc.json',
  },
  // see https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    'react-hot-loader/patch',
    './src/index',
  ],
  output: {
    // this output is virtual/in memory when using WebpackDevServer
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    // enable hot module replacement
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  module: {
    /**
     * Run linting to generate warnings, then transpile through babel
     */
    loaders: [
      {
        test: /\.test.js$/,
        loader: 'ignore',
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, '../src'),
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss'],
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss', 'sass'],
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".js", ".ts", ".tsx"],
  },
  postcss: [autoprefixer],
};