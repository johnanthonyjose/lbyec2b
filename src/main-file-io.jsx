import React from "react";
import { createRoot } from "react-dom/client";
import FileIO from "./pages/FileIO.jsx";
import "./styles/site.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <FileIO />
  </React.StrictMode>
);
