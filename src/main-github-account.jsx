import React from "react";
import { createRoot } from "react-dom/client";
import GitHubAccount from "./pages/GitHubAccount.jsx";
import "./styles/site.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GitHubAccount />
  </React.StrictMode>
);
