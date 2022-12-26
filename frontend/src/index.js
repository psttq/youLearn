import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "antd/dist/antd.min.css";
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers["Access-Control-Allow-Origin"] = "localhost:3000";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>
);
