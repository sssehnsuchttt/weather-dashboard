import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SkeletonTheme } from "react-loading-skeleton";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SkeletonTheme
      baseColor="#4a5565"
      highlightColor="#6a7282"
      borderRadius="0.4rem"
    >
      <App />
    </SkeletonTheme>
  </StrictMode>,
);
