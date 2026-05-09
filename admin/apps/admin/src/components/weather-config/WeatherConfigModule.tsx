import { useEffect, useState } from "react";
import PageMeta from "../common/PageMeta";
import { HEADER_CONFIG } from "../../config/headerName";
import ModuleHeader from "../common/ModuleHeader";
import apiClient from "@/api/clients/apiClient";
import Button from "@shared/common/components/ui/button/Button.tsx";
import Label from "@shared/common/components/ui/form/Label.tsx";
import Input from "@shared/common/components/ui/form/input/InputField.tsx";
import { ToastService } from "../../../utils/toastService";
import { useWeatherConfigForm } from "./hook/useWeatherConfig.form.hook";

type WeatherConfig = {
  _id?: string;
  api: string;
};

const WeatherConfigModule: React.FC = () => {
  const [configId, setConfigId] = useState<string | undefined>(undefined);
  const [initialData, setInitialData] = useState<{ api: string } | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const formMethods = useWeatherConfigForm(initialData);

  const loadConfig = async () => {
    try {
      const response = await apiClient.get<WeatherConfig | null>("/api/config");
      if (response.data) {
        setConfigId(response.data._id);
        setInitialData({ api: response.data.api });
      }
    } catch (error) {
      // No config exists yet — that's fine, user can create one
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleFormSubmit = async (formData: { api: string }) => {
    setIsLoading(true);
    try {
      if (configId) {
        await apiClient.put(`/api/updateApi/${configId}`, {
          api: formData.api,
        });
      } else {
        const response = await apiClient.post<any>("/api/createapi", {
          api: formData.api,
        });
        setConfigId(response.data._id);
      }
      ToastService.success("Weather API key saved successfully.", "config-success");
    } catch (error) {
      ToastService.error("Failed to save weather API key.", "config-error");
    } finally {
      setIsLoading(false);
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
          <form
            onSubmit={formMethods.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <div>
              <Label>OpenWeather API Key</Label>
              <Input
                type="text"
                register={formMethods.register}
                registerOptions="api"
                errors={formMethods.formState.errors}
                placeholder="Enter API key"
                maxLength={100}
              />
            </div>
            <div>
              <Button type="submit" loadingState={isLoading}>
                Save Configuration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default WeatherConfigModule;
