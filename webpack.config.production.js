/**
 * Build config for electron 'Renderer Process' file
 */

import path from 'path'
import webpack from 'webpack'
import validate from 'webpack-validator'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import BabiliPlugin from 'babili-webpack-plugin'
import baseConfig from './webpack.config.base'

export default validate(merge(baseConfig, {
  devtool: 'cheap-module-source-map',

  entry: ['babel-polyfill', './src/index'],

  output: {
    path: path.join(__dirname, 'src/dist'),
    publicPath: '../dist/',
  },

  module: {
    loaders: [
      // Extract all .global.css to style.css as is
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader',
          'sass-loader'
        ),
      },

      // Fonts
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' },

      // Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        loader: 'url-loader',
      },
    ],
  },

  plugins: [
    /**
     * Assign the module and chunk ids by occurrence count
     * Reduces total file size and is recommended
     */
    new webpack.optimize.OccurrenceOrderPlugin(),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

    /**
     * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
     */
    new BabiliPlugin({
      // Disable deadcode until https://github.com/babel/babili/issues/385 fixed
      deadcode: false,
    }),

    new ExtractTextPlugin('style.css', { allChunks: true }),

    /**
     * Dynamically generate index.html page
     */
    new HtmlWebpackPlugin({
      filename: '../app.html',
      template: 'src/app.html',
      inject: false,
    }),
  ],

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-renderer',
}))