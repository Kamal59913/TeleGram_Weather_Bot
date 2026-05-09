// YesNoRadioButton.tsx
import type React from "react";
import { FieldErrors } from "react-hook-form";

interface YesNoRadioButtonProps {
  value: boolean | undefined;
  className?: string;
  id?: string;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  errors?: FieldErrors;
  name: string;
}

const YesNoRadioButton: React.FC<YesNoRadioButtonProps> = ({
  value,
  id,
  onChange,
  className = "",
  disabled = false,
  errors,
  name,
}) => {
  const errorMessage = errors?.[name]?.message
    ? String(errors[name].message)
    : undefined;

  return (
    <div className="space-y-3">
      <div className="flex space-x-6">
        {/* Yes Option */}
        <label
          className={`flex items-center space-x-3 group cursor-pointer ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <div className="relative w-5 h-5">
            <input
              id={`${id}-yes`}
              type="radio"
              className={`w-5 h-5 rounded-2xl appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-full checked:bg-brand-500 disabled:opacity-60 ${className}`}
              checked={value === true}
              onChange={() => onChange(true)}
              disabled={disabled}
              name={name}
            />
            {value === true && (
              <div className="absolute w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2" />
            )}
            {disabled && value === true && (
              <div className="absolute w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2" />
            )}
          </div>
          <span className="text-sm font-medium text-black dark:text-gray-200">
            Yes
          </span>
        </label>

        {/* No Option */}
        <label
          className={`flex items-center space-x-3 group cursor-pointer ${
            disabled ? "cursor-not-allowed opacity-60" : ""
          }`}
        >
          <div className="relative w-5 h-5">
            <input
              id={`${id}-no`}
              type="radio"
              className={`w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-full checked:bg-brand-500 disabled:opacity-60 ${className}`}
              checked={value === false}
              onChange={() => onChange(false)}
              disabled={disabled}
              name={name}
            />
            {value === false && (
              <div className="absolute w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2" />
            )}
            {disabled && value === false && (
              <div className="absolute w-2 h-2 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2" />
            )}
          </div>
          <span className="text-sm font-medium text-black dark:text-gray-200">
            No
          </span>
        </label>
      </div>

      {errorMessage && (
        <p className="mt-1.5 text-xs text-error-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default YesNoRadioButton;