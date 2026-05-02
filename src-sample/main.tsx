import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@shared/common/style/index.css";
import "@shared/common/style/style.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import Providers from "./redux/provider.tsx";
import { Toaster } from "react-hot-toast";
import { PageLoader } from "./components/auth/routes/PageLoaderWrapper.tsx";
import ModalContainer from "./compmanager/modalContainer.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/queryClient.ts";
import "mapbox-gl/dist/mapbox-gl.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <QueryClientProvider client={queryClient}>
          <Providers>
            <App />
            <PageLoader />
            <ModalContainer />
            <Toaster
              position="top-center"
              containerStyle={{ zIndex: 999999 }}
            />
          </Providers>
        </QueryClientProvider>
      </AppWrapper>
    </ThemeProvider>
  </StrictMode>
);
