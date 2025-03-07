import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "next-themes";
import App from "./App.jsx";
import "./i18n";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider attribute="class">
        <App />
    </ThemeProvider>
  </StrictMode>,
);
