import React from "react";
import { FieldErrors } from "react-hook-form";

interface SwitchProps {
  name: string;
  label?: string;
  value: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  errors?: FieldErrors;
  size?: "sm" | "md";
}

const Switch: React.FC<SwitchProps> = ({
  name,
  label = "",
  value,
  onChange,
  disabled = false,
  errors,
  size = "md",
}) => {
  const errorMessage = errors?.[name]?.message
    ? String(errors[name]?.message)
    : undefined;

  const handleToggle = () => {
    if (!disabled) onChange(!value);
  };

  // Size configurations
  const sizeConfig = {
    sm: {
      track: { height: "18px", width: "32px" },
      thumb: { height: "14px", width: "14px", translateX: "14px" },
      label: "text-xs",
    },
    md: {
      track: { height: "24px", width: "44px" },
      thumb: { height: "20px", width: "20px", translateX: "20px" },
      label: "text-sm",
    },
  };

  const config = sizeConfig[size];

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className={`flex cursor-pointer select-none items-center gap-3 ${config.label} font-medium ${
          disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400"
        }`}
        onClick={handleToggle}
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "block",
              height: config.track.height,
              width: config.track.width,
              borderRadius: "9999px",
              backgroundColor: disabled
                ? "#f3f4f6"
                : value
                ? "#000000"
                : "#ffffff",
              border: disabled
                ? "none"
                : value
                ? "none"
                : "1px solid #000000",
              transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
              pointerEvents: disabled ? "none" : "auto",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              left: "2px",
              top: "2px",
              height: config.thumb.height,
              width: config.thumb.width,
              borderRadius: "9999px",
              backgroundColor: value ? "#ffffff" : "#000000",
              boxShadow:
                "0 2px 4px 0 rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
              transform: value
                ? `translateX(${config.thumb.translateX})`
                : "translateX(0px)",
              transition:
                "transform 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          ></div>
        </div>
        {label && <span>{label}</span>}
      </label>

      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Switch;