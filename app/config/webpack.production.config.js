/* eslint-disable */

var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
require('es6-promise').polyfill();
var autoprefixer = require('autoprefixer');

var version = '0.0.1';

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.min.' + version + '.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    }),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('bundle.min.' + version + '.css', {
      allChunks: true,
    }),
    // copy images from the media folder to the dist folder
    new CopyWebpackPlugin([
        { context: './static/media/', from: '*' },
    ]),
  ],
  module: {
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
        loader: ExtractTextPlugin.extract('css!postcss!sass'),
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
  version: version,
};