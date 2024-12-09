import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TrashSortingGame from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TrashSortingGame />
  </StrictMode>
);