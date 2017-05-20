"use strict";
const path = require("path");
const srcPath = path.join(__dirname, "/../src");
const dfltPort = 8080;

const stylePostCssLoaders = [{
  loader: 'style-loader'
}, {
  loader: 'css-loader'
}, {
  loader: 'postcss-loader',
  options: {
    plugins: [
      require("postcss-cssnext"),
      require("precss")
    ]
  }
}]

function getDefaultModules() {
  return {
    rules: [{
        test: /\.(js|jsx)$/,
        include: srcPath,
        enforce: "pre",
        use: [{
          loader: "eslint-loader"
        }]
      }, {
        test: /\.js?$/,
        include: [
          path.join(__dirname, "/../node_modules/react-native-storage")
        ],
        exclude: /node-modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            // presets: ["es2015","react", "flow"],
            plugins: ["transform-runtime"]
          }
        }
      },
      {
        test: /\.css$/,
        use: stylePostCssLoaders
      },
      {
        test: /\.s(a|c)ss/,
        use: [].concat(stylePostCssLoaders, [{
          loader: 'sass-loader',
          options: {
            outputStyle: 'expanded',
            indentedSyntax: true
          }
        }])
      },
      {
        test: /\.less/,
        use: [].concat(stylePostCssLoaders, [{
          loader: "less-loader"
        }])
      },
      {
        test: /\.styl/,
        use: [].concat(stylePostCssLoaders, [{
          loader: "stylus-loader"
        }])
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: "url-loader?limit=8192"
      },
      {
        test: /\.(mp4|ogg|svg)$/,
        loader: "file-loader"
      }
    ]
  };
}
module.exports = {
  srcPath: srcPath,
  publicPath: "/assets/",
  port: dfltPort,
  getDefaultModules: getDefaultModules
};
