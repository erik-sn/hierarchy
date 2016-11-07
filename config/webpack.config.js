/* eslint-disable */

/**
 * This config file is specific to development. When we run "node server.js"
 * the server.js file uses the WebpackDevServer with this file as a configuration.
 *
 * This webpack is configured for hot reloading and SASS transpiling.
 */

var path = require('path');
var webpack = require('webpack');

// automatically add vendor prefixes to transpiled css
var autoprefixer = require('autoprefixer');

module.exports = {
  eslint: {
    configFile: './.eslintrc.json',
  },
  // see https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'eval',
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

    /**
   *  This plugin is necessary because we are using a SASS compiler through
   *  webpack on the client side. Because our JS/ES6 code is also loaded through
   *  node in this server file, we will get syntax errors if the node server
   *  attemps to parse the css/scss files.
   *
   *  To bypass this, we set this process.env variable as true here and delete
   *  it in server.production.js. Then we only import/require the css/scss files
   *  in React components if this variable exists (and is true).
   *
   *  This is unique to Isomorphic applications, see here:
   *      http://stackoverflow.com/a/30355080/4396787
   *
   */
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
        test: /\.js$/,
        loaders: ['babel', 'eslint'],
        include: path.join(__dirname, '../src'),
      },
      {
        test: /\.js$/,
        loaders: ['eslint'],
        include: path.join(__dirname, '../test'),
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'postcss-loader', 'sass'],
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
      },
    ],
  },
  postcss: [autoprefixer],
};