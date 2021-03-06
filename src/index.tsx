import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { default as App, Marco } from "./App-test-external-data-update";
import * as serviceWorker from "./serviceWorker";

(window as any).Marco = Marco;

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
