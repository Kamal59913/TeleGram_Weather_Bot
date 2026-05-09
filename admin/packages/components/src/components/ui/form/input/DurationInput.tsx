"use client";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DurationInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  register?: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  autoFocus?: boolean;
  errorSingleMessage?: string;
}

const DurationInput: FC<DurationInputProps> = ({
  placeholder = "Select duration",
  value,
  className = "",
  disabled = false,
  registerOptions,
  errors,
  errorSingleMessage = "",
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // Parse value prop into hours and minutes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setSelectedHour(h || 0);
      setSelectedMinute(m || 0);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Scroll to selected values when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (hourScrollRef.current) {
          const hourElement = hourScrollRef.current.querySelector(`[data-hour="${selectedHour}"]`);
          if (hourElement) {
            hourElement.scrollIntoView({ block: "center", behavior: "auto" });
          }
        }
        if (minuteScrollRef.current) {
          const minuteElement = minuteScrollRef.current.querySelector(`[data-minute="${selectedMinute}"]`);
          if (minuteElement) {
            minuteElement.scrollIntoView({ block: "center", behavior: "auto" });
          }
        }
      }, 50);
    }
  }, [isOpen, selectedHour, selectedMinute]);

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    updateDuration(hour, selectedMinute);
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    updateDuration(selectedHour, minute);
  };

  const updateDuration = (hour: number, minute: number) => {
    const formattedValue = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    if (onChange) {
      onChange(formattedValue);
    }
  };

  const displayValue = value 
    ? `${String(selectedHour).padStart(2, "0")}:${String(selectedMinute).padStart(2, "0")}`
    : "";

  // Generate hours array (0-23)
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Generate minutes array (0-59)
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  let containerClasses = `relative flex items-center justify-between gap-2 w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors cursor-pointer ${className}`;

  if (disabled) {
    containerClasses += ` text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed opacity-40 dark:bg-black dark:text-gray-500 dark:border-gray-700`;
  } else {
    containerClasses += ` bg-white text-black border-gray-300 placeholder-gray-400 focus:border-[#000000] focus:ring-[#000000]/20 dark:bg-black dark:text-white dark:border-gray-800 dark:placeholder-gray-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-700/20`;
  }

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className={containerClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={`flex-1 text-left ${displayValue ? '' : 'text-gray-400 dark:text-gray-600'}`}>
          {displayValue || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="flex">
            {/* Hours Column */}
            <div className="flex-1 flex flex-col">
              <div className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800 text-center bg-gray-50 dark:bg-black">
                HH
              </div>
              <div 
                ref={hourScrollRef}
                className="h-[240px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    data-hour={hour}
                    onClick={() => handleHourSelect(hour)}
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors text-center ${
                      selectedHour === hour
                        ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    {String(hour).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-200 dark:bg-gray-800" />

            {/* Minutes Column */}
            <div className="flex-1 flex flex-col">
              <div className="px-3 py-2.5 text-xs text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800 text-center bg-gray-50 dark:bg-black">
                MM
              </div>
              <div 
                ref={minuteScrollRef}
                className="h-[240px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    data-minute={minute}
                    onClick={() => handleMinuteSelect(minute)}
                    className={`px-4 py-3 text-sm cursor-pointer transition-colors text-center ${
                      selectedMinute === minute
                        ? 'bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-medium'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900'
                    }`}
                  >
                    {String(minute).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

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

export default DurationInput;

export const timeToMinutes = (timeString: string): number => {
  if (!timeString) return 0;
  const [h, m] = timeString.split(":").map(Number);
  if (h === undefined || m === undefined) return 0;
  return h * 60 + m;
};

export const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};