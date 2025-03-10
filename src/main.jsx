import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "next-themes";
import App from "./App.jsx";
import "./i18n";
import { DialogProvider } from "./components/ui/Dialog.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DialogProvider>
    <ThemeProvider attribute="class">
        <App />
    </ThemeProvider>
    </DialogProvider>
  </StrictMode>,
);
