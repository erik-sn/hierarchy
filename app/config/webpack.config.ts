import * as CopyWebpackPlugin from 'copy-webpack-plugin';
import * as path from 'path';
import * as webpack from 'webpack';
 
const autoprefixer = require('autoprefixer');

module.exports = {
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
    publicPath: '/static/media/',
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
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
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
        loaders: ['style', 'css', 'postcss', 'sass'],
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx', '.json'],
  },
  postcss: [autoprefixer],
  // allow for dynamic requires
  externals: {
    'cheerio': 'window',
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
};
