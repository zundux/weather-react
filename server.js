/* eslint no-console:0 */
"use strict";

require("core-js/fn/object/assign");

const webpack = require("webpack");
const webpackDevServer = require("webpack-dev-server");
const config = require("./webpack.config");
const defaultSettings = require("./cfg/defaults");
const open = require("open");

new webpackDevServer(webpack(config), config.devServer)
  .listen(defaultSettings.port, "localhost", (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Listening at localhost:" + defaultSettings.port);
    // console.log("Opening your system browser...");
    // open("http://localhost:" + config.port + "/webpack-dev-server/");
  });
