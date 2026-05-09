import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { FieldError } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface SingleSelectDropdownProps {
  options: Option[];
  value: string | "" | string | undefined;
  onChange: (value: string | "") => void;
  errorMessage?: FieldError | undefined
  title?: string;
  disabled?: boolean;
  placeholder?: string;
  width?: string;
  notFoundText?: string;
  border?: string;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  options,
  value,
  onChange,
  errorMessage,
  title,
  disabled = false,
  width = "w-full",
  notFoundText = "No options match your search",
  border
}) => {


  let inputClasses = `items-center gap-2`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-black dark:text-gray-400 dark:border-gray-700 opacity-40`;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options?.find(opt => opt.value === value) || null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    onChange(option.value === value ? "" : option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) onChange("");
  };

  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(prev => !prev);
    setSearchTerm("");
  };

  const filteredOptions = options?.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${inputClasses}`}>

      <div className="items-center gap-2">
        <div className={`${width} relative`} ref={dropdownRef}>
          <div
            className={`${border ? ``: `cstm-select`} items-center h-11 w-full ${border} border appearance-none px-4 py-2.5 text-sm  placeholder:text-gray-400 focus:outline-hidden   dark:bg-black dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-black border-gray-300 focus:border-primary focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-primary cursor-pointer flex transition duration-150 ${isOpen
                ? "ring-2 ring-blue-500 border-blue-500 dark:ring-blue-400 dark:border-blue-400"
                : disabled
                  ? "cursor-not-allowed"
                  : "hover:border-gray-400 dark:hover:border-gray-700 cursor-pointer"
              }`}
            onClick={toggleDropdown}
          >
            {!selectedOption ? (
              <span className="dark:text-white/60 text-gray-500 text-sm ">
                {title ? `Select ${title}...` : "Select..."}
              </span>
            ) : (
              <div className="flex justify-between items-center w-full py-2">
                <span className="text-black dark:text-white text-sm">
                  {selectedOption.label}
                </span>
                {selectedOption && !disabled && (
                  <button
                    onClick={clearSelection}
                    className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            )}
            <div className="ml-auto flex items-center">

              <ChevronDown
                size={18}
                className={`ml-auto text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""
                  }`}
              />
            </div>

          </div>

          {isOpen && (
            <div className="absolute mt-1 w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10">
              <div className="p-2 sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white/90 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Search options..."
                  />
                </div>
              </div>

              <div className="p-2">
              {filteredOptions?.length > 0 ? (
                filteredOptions?.map((option: Option) => {
                  const isSelected: boolean = selectedOption?.value === option.value;
                  return (
                    <div
                      key={option.value}
                      className={`px-3 py-2 rounded-md flex items-center ${isSelected
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                          : "hover:bg-gray-100 dark:hover:bg-black/50 dark:text-white/90 cursor-pointer text-sm"
                        }`}
                      onClick={() => handleSelect(option)}
                    >
                      <div className="mr-3 flex-shrink-0">
                        <div
                          className={`w-5 h-5 rounded-sm border flex items-center justify-center ${isSelected
                              ? "bg-primary border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                              : "border-gray-300 dark:border-gray-600"
                            }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <span> {option.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                  {notFoundText}
                </div>
              )}
            </div>
            </div>
          )}
        </div>
        {errorMessage && (
          <p className="mt-1.5 text-xs text-error-500">{errorMessage?.message}</p>
        )}
      </div>
    </div>
  );
};

export default SingleSelectDropdown;