import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import weatherConfigValidation from "../validation/weatherConfig.validator";

export const useWeatherConfigForm = (initialData?: { api: string }) => {
  const formMethods = useForm({
    defaultValues: {
      api: "",
    },
    shouldFocusError: false,
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(weatherConfigValidation),
  });

  useEffect(() => {
    if (initialData?.api) {
      formMethods.setValue("api", initialData.api);
    }
  }, [initialData, formMethods]);

  return formMethods;
};
