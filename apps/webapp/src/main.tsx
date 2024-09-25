import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@repo/ui/styles.css";
import "./tw.css";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const router = createRouter({ routeTree });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
