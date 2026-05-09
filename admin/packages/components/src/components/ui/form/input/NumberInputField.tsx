import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  placeholder,
  value,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  register,
  registerOptions,
  errors,
}) => {
  let inputClasses = `h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-black dark:text-white/90 dark:placeholder:text-white/30 ${className}`;

  if (disabled) {
    inputClasses += `text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-black dark:text-gray-400 dark:border-gray-700 opacity-40`;
  } else if (error || errors?.[registerOptions]) {
    inputClasses += ` border-error-500 focus:border-primary focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-primary`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-primary focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-primary`;
  } else {
    inputClasses += ` bg-transparent text-black border-gray-300 focus:border-primary focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-primary`;
  }

  // Type guard to ensure error message is a string
  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div className="relative">
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        {...register(registerOptions)}
      />

      {errorMessage && (
        <p className="mt-1.5 text-xs text-error-500">{errorMessage}</p>
      )}

      {hint && !errorMessage && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default Input;
