/* eslint-disable */

var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
require('es6-promise').polyfill();
var autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './src/index',
  ],
  output: {
    /**
    * output defines where our bundle.min.js and bundle.min.css
      * files will be put. In this configuration we are putting them
      * in the '/dist' folder in our root directory. In our
    * server.production.js we define this '/dist' folder as a static
    * resource, and our Isomorphic html points to it to retrieve these
    * files.
    */
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.min.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.DefinePlugin({
      /**
      *   tell React we are in production mode, this will eliminate
      *   some development tools we don't need in production
      */
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    }),
    new webpack.optimize.DedupePlugin(),
    /**
    * this will analyze all of the SASS files and bundle them into
    * one css file. This file is placed after the 'path' in the output
    * configuration above - so for this project, '/dist/bundle.min.css'
    */
    new ExtractTextPlugin('/bundle.min.css', {
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