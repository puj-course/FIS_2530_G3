import './styles.css'
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { setToken } from "./api/client";
import "./index.css";
import "./App.css";


const t = localStorage.getItem("token");
if (t) setToken(t);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
