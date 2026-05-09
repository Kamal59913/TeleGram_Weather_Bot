"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useRef } from "react";
import { Clock } from "lucide-react";
import { cn } from "../../../../utils/cn-merge";

interface TimeInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  register?: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  autoFocus?: boolean;
  errorSingleMessage?: string;
  useNativePicker?: boolean;
  use24HourFormat?: boolean;
  min?: string;
  max?: string;
  step?: number | string;
  style?: React.CSSProperties;
  required?: boolean;
}

const TimeInput: FC<TimeInputProps> = ({
  id,
  placeholder = "00:00",
  value,
  className = "",
  disabled = false,
  register,
  registerOptions,
  errors,
  autoFocus = false,
  errorSingleMessage = "",
  useNativePicker = true,
  use24HourFormat = true,
  min,
  max,
  step,
  style,
  required,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayValue = value ?? "";

  const formatTime = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;

    const h = Math.min(23, parseInt(digits.slice(0, 2)));
    const m = Math.min(59, parseInt(digits.slice(2, 4)));

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const registerProps = register ? register(registerOptions) : ({} as any);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (useNativePicker) {
      if (onChange) {
        onChange(e);
      } else if (registerProps.onChange) {
        registerProps.onChange(e);
      }
      return;
    }

    const input = e.currentTarget;
    const cursor = input.selectionStart || 0;
    const prevValue = input.value;

    const formatted = formatTime(prevValue);

    const newEvent = {
      ...e,
      target: { ...e.target, value: formatted },
    };

    if (onChange) {
      onChange(newEvent as any);
    } else if (registerProps.onChange) {
      registerProps.onChange(newEvent);
    }

    setTimeout(() => {
      const isColonInserted = formatted.length === 5 && prevValue.length === 4;

      input.setSelectionRange(
        isColonInserted && cursor === 2 ? 3 : cursor,
        isColonInserted && cursor === 2 ? 3 : cursor
      );
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (useNativePicker) return;

    const key = e.key;
    const input = e.currentTarget;

    if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(key))
      return;

    if (!/^\d$/.test(key)) {
      e.preventDefault();
      return;
    }

    const digits = input.value.replace(/\D/g, "");

    if (digits.length >= 4 && input.selectionStart === input.selectionEnd) {
      e.preventDefault();
    }
  };

  let inputClasses = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed opacity-40 dark:bg-black dark:text-gray-500 dark:border-gray-700`;
  } else {
    inputClasses += ` bg-white text-black border-gray-300 placeholder-gray-400 focus:border-[#000000] focus:ring-[#000000]/20 dark:bg-black dark:text-white dark:border-gray-800 dark:placeholder-gray-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-700/20`;
  }

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div className="relative">
      <input
        {...registerProps}
        ref={(e) => {
          if (registerProps.ref) {
            registerProps.ref(e);
          }
          inputRef.current = e;
        }}
        type={useNativePicker ? "time" : "text"}
        id={id}
        placeholder={placeholder}
        value={displayValue}
        disabled={disabled}
        className={cn(
          "pr-10 [&::-webkit-calendar-picker-indicator]:hidden",
          inputClasses
        )}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        maxLength={5}
        min={min}
        max={max}
        step={step ?? (use24HourFormat ? 60 : undefined)}
        style={style}
        required={required}
      />

      {!disabled && (
        <Clock
          className={cn(
            "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer transition-colors",
            "text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white"
          )}
          onClick={() => {
            inputRef.current?.showPicker?.();
            inputRef.current?.focus();
          }}
        />
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

export default TimeInput;

export const timeToMinutes = (timeString: string): number => {
  if (!timeString) return 0;
  const [h, m] = timeString.split(":").map(Number);
  if (h === undefined || m === undefined) return 0;
  return h * 60 + m;
};

export const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};