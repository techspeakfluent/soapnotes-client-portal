import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppProvider from "./provider/AppProvider";
import AppRouter from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <AppRouter />
    </AppProvider>
  </StrictMode>,
);
