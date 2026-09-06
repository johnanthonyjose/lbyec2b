import React from "react";
import { createRoot } from "react-dom/client";
import CourseOverview from "./pages/CourseOverview.jsx";
import "./styles/site.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CourseOverview />
  </React.StrictMode>
);
