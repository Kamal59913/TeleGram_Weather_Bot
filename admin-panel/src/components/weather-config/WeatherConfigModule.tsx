import { FormEvent, useEffect, useState } from "react";
import apiClient from "@/api/clients/apiClient";

type WeatherConfig = {
  _id?: string;
  api: string;
};

const WeatherConfigModule = () => {
  const [config, setConfig] = useState<WeatherConfig>({ api: "" });
  const [message, setMessage] = useState("");

  const loadConfig = async () => {
    try {
      const response = await apiClient.get<WeatherConfig | null>("/api/config");
      if (response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      setMessage("No existing weather API key found.");
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!config.api.trim()) {
      setMessage("API key is required.");
      return;
    }

    try {
      if (config._id) {
        await apiClient.put(`/api/updateApi/${config._id}`, { api: config.api });
      } else {
        const response = await apiClient.post<any>("/api/createapi", {
          api: config.api,
        });
        setConfig(response.data);
      }
      setMessage("Weather API key saved successfully.");
    } catch (error) {
      setMessage("Failed to save weather API key.");
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-2xl font-semibold">Weather Configuration</h1>
      <p className="text-sm text-gray-600">
        Manage the OpenWeather API key used by the Telegram weather bot.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border p-5">
        <label className="block text-sm font-medium text-gray-700">
          OpenWeather API key
        </label>
        <input
          type="text"
          value={config.api}
          onChange={(event) =>
            setConfig((prev) => ({ ...prev, api: event.target.value }))
          }
          className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none"
          placeholder="Enter API key"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white"
        >
          Save configuration
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
};

export default WeatherConfigModule;
