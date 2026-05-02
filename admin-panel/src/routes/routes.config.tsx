import { AuthWrapper } from "@/components/auth/routes/AuthWrapper";
import { PublicRoute } from "@/components/auth/routes/ProtectedRoute";
import DashboardModule from "@/components/dashboard/DashboardModule";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import SettingsModule from "@/components/settings/SettingsModule";
import SubscribersModule from "@/components/subscribers/SubscribersModule";
import WeatherConfigModule from "@/components/weather-config/WeatherConfigModule";
import AppLayout from "@/layout/AppLayout";
import SignIn from "@/pages/SignIn";
import { RouteObject } from "react-router-dom";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <PublicRoute>
        <SignIn />
      </PublicRoute>
    ),
  },
  {
    element: (
      <AuthWrapper>
        <ScrollToTop />
        <AppLayout />
      </AuthWrapper>
    ),

    children: [
      { path: "dashboard", element: <DashboardModule /> },
      { path: "subscribers", element: <SubscribersModule /> },
      { path: "weather-config", element: <WeatherConfigModule /> },
      { path: "settings", element: <SettingsModule /> },
      { path: "*", element: <DashboardModule /> },
    ],
  },
];
