import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import Context from "./common/loadingContext";

ReactDOM.render(
	<Context>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Context>,
	document.getElementById("root")
);


