import "babel-polyfill";
import "core-js/fn/object/assign";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

ReactDOM.render(<App />, document.getElementById("app"));
