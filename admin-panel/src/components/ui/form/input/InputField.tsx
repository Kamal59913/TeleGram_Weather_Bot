import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegister<any>;
  registerOptions?: string;
  errors?: FieldErrors<any>;
}

const InputField: React.FC<InputFieldProps> = ({
  register,
  registerOptions,
  errors,
  className = "",
  ...props
}) => {
  const isError = registerOptions && errors && errors[registerOptions];
  
  return (
    <div className="w-full">
      <input
        {...(register && registerOptions ? register(registerOptions) : {})}
        className={`h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm outline-none transition-colors 
          ${isError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-brand-500'} 
          ${className}`}
        {...props}
      />
      {isError && (
        <p className="mt-1 text-sm text-red-500">
          {errors[registerOptions]?.message as string}
        </p>
      )}
    </div>
  );
};

export default InputField;
