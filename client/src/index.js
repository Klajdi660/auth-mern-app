import React from "react";
import ReactDOM from "react-dom/client";
import Context from "./common/loadingContext";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
	<Context>
		<App />
	</Context>
);
