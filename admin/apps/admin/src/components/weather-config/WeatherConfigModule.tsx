import { FormEvent, useEffect, useState } from "react";
import PageMeta from "../common/PageMeta";
import { HEADER_CONFIG } from "../../config/headerName";
import ModuleHeader from "../common/ModuleHeader";
import apiClient from "@/api/clients/apiClient";

type WeatherConfig = {
  _id?: string;
  api: string;
};

const WeatherConfigModule: React.FC = () => {
  const [config, setConfig] = useState<WeatherConfig>({ api: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const loadConfig = async () => {
    try {
      const response = await apiClient.get<WeatherConfig | null>("/api/config");
      if (response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      setMessage("No existing weather API key found.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!config.api.trim()) {
      setMessage("API key is required.");
      setMessageType("error");
      return;
    }

    try {
      if (config._id) {
        await apiClient.put(`/api/updateApi/${config._id}`, {
          api: config.api,
        });
      } else {
        const response = await apiClient.post<any>("/api/createapi", {
          api: config.api,
        });
        setConfig(response.data);
      }
      setMessage("Weather API key saved successfully.");
      setMessageType("success");
    } catch (error) {
      setMessage("Failed to save weather API key.");
      setMessageType("error");
    }
  };

  return (
    <>
      <PageMeta
        title={`Weather Configuration - ${HEADER_CONFIG.NAME}`}
        description="Manage weather API configuration for the Telegram bot."
      />
      <ModuleHeader pageTitle="Weather Configuration" />
      <div className="max-w-2xl">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Manage the OpenWeather API key used by the Telegram weather bot.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                OpenWeather API Key
              </label>
              <input
                type="text"
                value={config.api}
                onChange={(event) =>
                  setConfig((prev) => ({ ...prev, api: event.target.value }))
                }
                className="h-11 w-full rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                placeholder="Enter API key"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 transition-colors"
            >
              Save Configuration
            </button>
            {message && (
              <p
                className={`text-sm ${
                  messageType === "success"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default WeatherConfigModule;
