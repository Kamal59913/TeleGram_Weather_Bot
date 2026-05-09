import { useState } from "react";
import Input from "./InputField";

interface PasswordInputProps {
  register: any;
  registerOptions: string;
  errors: any;
  placeholder: string;
  maxLength?: number;
  autoFocus?: boolean;
  errorSingleMessage?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  register,
  registerOptions,
  errors,
  placeholder,
  maxLength,
  autoFocus,
  errorSingleMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          register={register}
          registerOptions={registerOptions}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          className=""
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
          onClick={togglePassword}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {errorSingleMessage && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
          {errorSingleMessage}
        </p>
      )}
    </div>
  );
};
