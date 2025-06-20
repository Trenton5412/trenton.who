import './index.css';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Box } from "./screens/Box/Box";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Box />
  </StrictMode>,
);
