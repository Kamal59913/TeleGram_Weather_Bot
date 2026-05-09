import { useState, useEffect } from "react";
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";

interface CountryCode {
  code: string;
  label: string;
}

interface PhoneInputProps {
  countries: CountryCode[];
  placeholder?: string;
  onChange?: (phoneNumber: string) => void;
  selectPosition?: "start" | "end";
  id?: string;
  disabled?: boolean;
  success?: boolean;
  hint?: string;
  // Form integration props
  register: UseFormRegister<any>;
  registerOptions: string;
  setValue: UseFormSetValue<any>;
  errors?: FieldErrors;
  className?: string;
  preValue?:string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  placeholder = "+91",
  onChange,
  selectPosition = "start",
  id,
  disabled = false,
  success = false,
  hint,
  register,
  registerOptions,
  setValue,
  errors,
  className = "",
  preValue = ""
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("IN");
  const [displayValue, setDisplayValue] = useState<string>("+91");
  
  const countryPrefix = "+91";

  useEffect(() => {
    if(preValue) {
      setDisplayValue(preValue)
    }
  }, [preValue]);


  const countryCodes: Record<string, string> = countries.reduce(
    (acc, { code, label }) => ({ ...acc, [code]: label }),
    {}
  );

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log("clicked this part")
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);
    
    // Update the form value when country changes
    const newPhoneNumber = countryCodes[newCountry];
    setValue(registerOptions, newPhoneNumber, { shouldValidate: true });
    setDisplayValue(newPhoneNumber);
    
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  // Clean input to only allow digits, +, and spaces
  const sanitizePhoneInput = (value: string) => {

     // Ensure the value always starts with the country prefix
     if (!value.startsWith(countryPrefix)) {
      value = countryPrefix + value.replace(/^\+?\d*/, '');
    }

    // Remove anything that's not a digit, +, or space
    return value.replace(/[^\d+ ]/g, '')
      // Keep only one '+' at the beginning
      .replace(/^\+?|\+/g, (_match, offset) => offset === 0 ? '+' : '');
  };

  // Format phone number for display (with spaces)
  const formatPhoneNumber = (value: string) => {
    // This is a simple formatter - add more sophisticated formatting as needed
    return value;
  };

  // Process input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Clean the input value
    const sanitizedValue = sanitizePhoneInput(rawValue);
    
    // Set display value (with spaces allowed)
    setDisplayValue(formatPhoneNumber(sanitizedValue));
    
    // Store clean value (no spaces) in form
    const storageValue = sanitizedValue.replace(/\s/g, '');
    setValue(registerOptions, storageValue, { shouldValidate: true });
    
    if (onChange) {
      onChange(storageValue);
    }
  };

  // Determine styling based on state
  let inputClasses = `h-11 w-full ${
    selectPosition === "start" ? "pl-[84px]" : "pr-[84px]"
  } rounded-lg border py-3 px-4 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-black dark:text-gray-400 dark:border-gray-700 dark:opacity-40`;
  } else if (errors?.[registerOptions]) {
    inputClasses += ` border-error-500 focus:border-primary focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-primary`;
  } else if (success) {
    inputClasses += ` border-success-500 focus:border-primary focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-primary`;
  } else {
    inputClasses += ` bg-transparent text-black border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-black dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800`;
  }

  // Type guard to ensure error message is a string
  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  const selectClasses = `appearance-none bg-none ${
    selectPosition === "start" ? "rounded-l-lg border-r" : "rounded-r-lg border-l"
  } border-0 border-gray-200 bg-transparent py-3 pl-3.5 pr-8 leading-tight text-gray-700 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:text-gray-400`;

  // For the actual registration, we don't use the standard register directly
  // Instead we apply the ref manually and handle change events ourselves
  const { ref, ...registerRest } = register(registerOptions, {
    pattern: {
      value: /^[+]?\d+$/,
      message: "Phone number can only contain digits and a '+' symbol at the beginning"
    }
  });

  return (
    <div className="relative">
      <div className="relative flex">
        {/* Dropdown position: Start */}
        {selectPosition === "start" && (
          <div className="absolute">
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={true}
              className={selectClasses}
            >
              {countries.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  className="text-gray-700 dark:bg-black dark:text-gray-400"
                >
                  {country.code}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none bg-none right-3 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}

        {/* Input field with controlled value and custom change handler */}
        <input
          type="tel"
          id={id}
          ref={ref}
          {...registerRest}
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          onKeyDown={(e) => {
            // Allow digits, +, space, and control keys
            const allowedKeys = ['+', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
            const value = e.currentTarget.value;
            
            // Only allow '+' at the beginning of the input
            if (e.key === '+' && (value.includes('+ ') || value.length > 0)) {
              e.preventDefault();
            }
            
            // Prevent any other characters
            if (!allowedKeys.includes(e.key) && !e.ctrlKey) {
              e.preventDefault();
            }
          }}
        />

        {/* Dropdown position: End */}
        {selectPosition === "end" && (
          <div className="absolute right-0">
            <select
              value={selectedCountry}
              onChange={handleCountryChange}
              disabled={disabled}
              className={selectClasses}
            >
              {countries.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  className="text-gray-700 dark:bg-black dark:text-gray-400"
                >
                  {country.code}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 flex items-center text-gray-700 pointer-events-none right-3 dark:text-gray-400">
              <svg
                className="stroke-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Error message display */}
      {errorMessage && (
        <p className="mt-1.5 text-xs text-error-500">{errorMessage}</p>
      )}

      {/* Hint text (only shown when no error) */}
      {hint && !errorMessage && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default PhoneInput;