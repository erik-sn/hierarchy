import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as ExtractTextPlugin from 'extract-text-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const appconfig = require('../package.json');
const autoprefixer = require('autoprefixer');
require('es6-promise').polyfill();


module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.min.' + appconfig.version + '.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    }),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('bundle.min.' + appconfig.version + '.css', {
      allChunks: true,
    }),
    // copy images from the media folder to the dist folder
    new CopyWebpackPlugin([
        { context: './static/media/', from: '*' },
    ]),
    new BundleAnalyzerPlugin(),
  ],
  module: {
    loaders: [
      {
        test: /\.test.js$|\.test.ts$|\.test.tsx$/,
        loader: 'ignore',
      },
      {
        include: path.join(__dirname, '../src'),
        loader: 'awesome-typescript-loader',
        test: /\.tsx$|\.ts$/,
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!postcss!sass'),
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx'],
  },
  postcss: [autoprefixer],
};
