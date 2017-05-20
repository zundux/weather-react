"use strict";

let path = require("path");
let webpack = require("webpack");
let baseConfig = require("./base");
let defaultSettings = require("./defaults");
let BowerWebpackPlugin = require("bower-webpack-plugin");

let config = Object.assign({}, baseConfig, {
  entry: path.join(__dirname, "../src/index"),
  cache: false,
  devtool: "sourcemap",
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": "production"
    }),
    // new BowerWebpackPlugin({
    //   searchResolveModulesDirectories: false
    // }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: true
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: defaultSettings.getDefaultModules()
});

config.module.rules.push({
  test: /\.(js|jsx)$/,
  use: {
    loader: "babel-loader",
    include: [].concat(
      // config.additionalPaths,
      [path.join(__dirname, "/../src")]
    )
  }
});

module.exports = config;
