import React from "react";
import { createRoot } from "react-dom/client";
import AssignmentWorkflow from "./pages/AssignmentWorkflow.jsx";
import "./styles/site.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AssignmentWorkflow />
  </React.StrictMode>
);
