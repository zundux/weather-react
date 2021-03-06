"use strict";

let path = require("path");
let webpack = require("webpack");
let baseConfig = require("./base");
let defaultSettings = require("./defaults");
let BowerWebpackPlugin = require("bower-webpack-plugin");

let config = Object.assign({}, baseConfig, {
  entry: [
    "webpack-dev-server/client?http://127.0.0.1:" + defaultSettings.port,
    "webpack/hot/only-dev-server",
    "./src/index"
  ],
  cache: true,
  devtool: "eval-source-map",
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // new BowerWebpackPlugin({
    //   searchResolveModulesDirectories: false
    // })
  ],
  module: defaultSettings.getDefaultModules()
});

config.module.rules.push({
  test: /\.(js|jsx)$/,
  use: [{
    loader: "react-hot-loader/webpack",
  }, {
    loader: 'babel-loader'
  }],
  include: [].concat(
    // config.additionalPaths,
    [path.join(__dirname, "/../src")]
  )
});

module.exports = config;
