'use strict'
const webpack = require('webpack')
const path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')

const BUILD_DIR = path.resolve(__dirname, '../dist')
const APP_DIR = path.resolve(__dirname, '../app')
const NODE_MODULES_DIR = path.resolve(__dirname, '../node_modules')

const config = {
  /* entry: [
    'webpack-dev-server/client?http://localhost:3000', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    `${APP_DIR}/app` // Your appʼs entry point
  ], */
  context: path.resolve(__dirname, '../'),
  entry: path.resolve(__dirname, '../index.js'),
  devtool: 'source-map',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js' /// /this is the default name, so you can skip it
    // at this directory our bundle file will be available
    // make sure port 3000 is used when launching webpack-dev-server
    // In our example we will access our index.html from
    // http://localhost:3000/dist/index.html
    // publicPath: '/dist'
  },
  externals: {
    // Possible drivers for knex - we'll ignore them
    'sqlite3': 'sqlite3',
    'mariasql': 'mariasql',
    'mssql': 'mssql',
    'mysql': 'mysql',
    'oracle': 'oracle',
    'strong-oracle': 'strong-oracle',
    'oracledb': 'oracledb',
   // 'pg': 'pg',
   // 'pg-native': 'pg-native',
    'pg-query-stream': 'pg-query-stream',
    'syntax-object-rest-spread': 'syntax-object-rest-spread',
    'mysql2': 'mysql2'

  },
  // Important! Do not remove ''. If you do, imports without
  // an extension won't work anymore!
  resolve: {
    extensions: ['*', '.js', '.jsx', '.json'], /*,
    root: [
      path.resolve('../')
    ] */
    modules: [ path.resolve(__dirname, '../'), path.resolve(__dirname, '../node_modules'), 'node_modules'],
    alias: {
      controllers: '../app/controllers',
      enroutenExpress: 'express-enrouten/lib/index.js',
      rootPath: path.resolve(__dirname, '../')
    }
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // Enable caching for improved performance during development
        // It uses default OS directory by default. If you need
        // something more custom, pass a path to it.
        // I.e., babel?cacheDirectory=<path>
        loaders: ['babel-loader?cacheDirectory']
        // Parse only app files! Without this it will go through
        // the entire project. In addition to being slow,
        // that will most likely result in an error.
       // include: APP_DIR,
       // exclude: [NODE_MODULES_DIR]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },
  devServer: {
// IF YOU ARE DOING ONLY JAVASCRIPT(MODULE) RELOADING AND NOT BOTH JAVASCRIPT(MODULE) AND HTML RELOADING,
// THEN UNCOMMENT 'hot: true' BELOW. IF YOU ARE DOING BOTH JAVASCRIPT(MODULE) AND HTML RELOADING, THEN
// YOU MUST LEAVE 'hot: true' UNCOMMENTED OTHERWISE HTML RELOADING WILL NOT WORK AND ONLY JAVASCRIPT MODULE
// WILL WORK
// hot: true,
    contentBase: BUILD_DIR,
    port: 3000,
    historyApiFallback: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
   /* new HtmlWebpackPlugin({
      filename: `index.html`,
      inject: 'body',
      template: `${APP_DIR}/index.html`
    }), */
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].js.map',
      sourceRoot: '/',
      noSources: true,
      moduleFilenameTemplate: '[absolute-resource-path]',
      fallbackModuleFilenameTemplate: '[absolute-resource-path]'
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: __dirname,
        output: {path: BUILD_DIR}
      }
    }),
    new webpack.ProvidePlugin({
      'require.extensions': null
    })
  ]
}

module.exports = config
