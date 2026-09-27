import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Tipografías auto-alojadas (no dependen de Google Fonts)
import "@fontsource/anton/400.css";
import "@fontsource/yellowtail/400.css";
import "@fontsource/work-sans/400.css";
import "@fontsource/work-sans/500.css";
import "@fontsource/work-sans/600.css";
import "@fontsource/work-sans/700.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
