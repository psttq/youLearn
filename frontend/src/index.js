import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "antd/dist/antd.min.css";
import { BrowserRouter } from "react-router-dom";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://localhost:3000'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
