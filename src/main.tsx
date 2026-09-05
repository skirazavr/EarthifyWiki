import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/earthify.css";
import "./styles/grid.css";
import "./styles/preview.css";
import "./styles/recipe.css";
import "./styles/code.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
