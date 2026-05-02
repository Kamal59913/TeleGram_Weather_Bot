import React, { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { EyeCloseIcon, EyeIcon } from "../../../../icons";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegister<any>;
  registerOptions?: string;
  errors?: FieldErrors<any>;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  register,
  registerOptions,
  errors,
  className = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isError = registerOptions && errors && errors[registerOptions];

  return (
    <div className="w-full">
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          {...(register && registerOptions ? register(registerOptions) : {})}
          className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 pr-10 text-sm outline-none transition-colors
            ${isError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'} 
            ${className}`}
          {...props}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeIcon className="h-5 w-5" />
          ) : (
            <EyeCloseIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {isError && (
        <p className="mt-1 text-sm text-red-500">
          {errors[registerOptions]?.message as string}
        </p>
      )}
    </div>
  );
};
