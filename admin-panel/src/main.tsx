import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import Providers from "@/redux/provider";
import { routes } from "@/routes/routes.config";
import { queryClient } from "@/utils/queryClient";
import "./styles.css";

document.documentElement.classList.remove("dark");
document.documentElement.style.colorScheme = "light";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <Providers>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Providers>
    </HelmetProvider>
  </React.StrictMode>,
);
