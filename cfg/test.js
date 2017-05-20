"use strict";

let path = require("path");
let srcPath = path.join(__dirname, "/../src/");
let baseConfig = require("./base");
let BowerWebpackPlugin = require("bower-webpack-plugin");

module.exports = {
  devtool: "eval",
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        use: {
          loader: "isparta-instrumenter-loader"
        },
        enforce: "pre",
        include: [
          path.join(__dirname, "/../src")
        ]
      },
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        use: {
          loader: "null-loader"
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader",
        }
        include: [].concat(
          // baseConfig.additionalPaths,
          [
            path.join(__dirname, "/../src"),
            path.join(__dirname, "/../test")
          ]
        )
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      actions: srcPath + "actions/",
      helpers: path.join(__dirname, "/../test/helpers"),
      components: srcPath + "components/",
      sources: srcPath + "sources/",
      stores: srcPath + "stores/",
      styles: srcPath + "styles/",
      config: srcPath + "config/" + process.env.REACT_WEBPACK_ENV
    }
  },
  plugins: [
    // new BowerWebpackPlugin({
    //   searchResolveModulesDirectories: false
    // })
  ]
};
