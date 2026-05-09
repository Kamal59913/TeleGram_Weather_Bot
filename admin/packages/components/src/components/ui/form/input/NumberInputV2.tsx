"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useEffect, useRef } from "react";

interface NumberInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  allowPlus?: boolean;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
}

const NumberInputV2: FC<NumberInputProps> = ({
  id,
  placeholder = "Enter number",
  value,
  className = "",
  min,
  max,
  disabled = false,
  success = false,
  error = false,
  hint,
  register,
  registerOptions,
  errors,
  allowPlus = false,
  allowDecimal = false,
  allowNegative = false,
  maxLength,
  autoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  let inputClasses = `w-full px-4 py-3.5 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed opacity-40 dark:bg-black dark:text-gray-500 dark:border-gray-700`;
  } else if (error || errors?.[registerOptions]) {
    inputClasses += ` bg-white text-black border-red-500 placeholder-gray-400 focus:border-red-500 focus:ring-red-500/20 dark:bg-zinc-900 dark:text-white dark:border-red-500 dark:placeholder-zinc-600 dark:focus:border-red-500 dark:focus:ring-red-500/20`;
  } else if (success) {
    inputClasses += ` bg-white text-black border-green-500 placeholder-gray-400 focus:border-green-500 focus:ring-green-500/20 dark:bg-zinc-900 dark:text-white dark:border-green-500 dark:placeholder-zinc-600 dark:focus:border-green-500 dark:focus:ring-green-500/20`;
  } else {
    inputClasses += ` bg-white text-black border-gray-300 placeholder-gray-400 focus:border-black focus:ring-black/20 dark:bg-zinc-900 dark:text-white dark:border-zinc-800 dark:placeholder-zinc-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-800`;
  }

  const cleanNumberValue = (inputValue: string): string => {
    let cleanedValue = inputValue;

    if (allowPlus) {
      if (cleanedValue.includes("+")) {
        const hasLeadingPlus = cleanedValue.startsWith("+");
        cleanedValue = cleanedValue.replace(/\+/g, "");
        if (hasLeadingPlus) {
          cleanedValue = "+" + cleanedValue;
        }
      }
    } else {
      cleanedValue = cleanedValue.replace(/\+/g, "");
    }

    if (allowNegative) {
      if (cleanedValue.includes("-")) {
        const hasLeadingMinus =
          cleanedValue.startsWith("-") ||
          (allowPlus && cleanedValue.startsWith("+-"));
        cleanedValue = cleanedValue.replace(/-/g, "");
        if (hasLeadingMinus) {
          if (cleanedValue.startsWith("+")) {
            cleanedValue = "+" + "-" + cleanedValue.slice(1);
          } else {
            cleanedValue = "-" + cleanedValue;
          }
        }
      }
    } else {
      cleanedValue = cleanedValue.replace(/-/g, "");
    }

    if (allowDecimal) {
      const decimalParts = cleanedValue.split(".");
      if (decimalParts.length > 2) {
        cleanedValue = decimalParts[0] + "." + decimalParts.slice(1).join("");
      }
    } else {
      cleanedValue = cleanedValue.replace(/\./g, "");
    }

    let allowedChars = "0-9";
    if (allowPlus) allowedChars += "\\+";
    if (allowNegative) allowedChars += "-";
    if (allowDecimal) allowedChars += "\\.";

    const regex = new RegExp(`[^${allowedChars}]`, "g");
    cleanedValue = cleanedValue.replace(regex, "");

    return cleanedValue;
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const originalValue = input.value;
    let cleanedValue = cleanNumberValue(originalValue);

    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    if (originalValue !== cleanedValue) {
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = cleanNumberValue(beforeCursor);
      const removedBeforeCursor =
        beforeCursor.length - cleanedBeforeCursor.length;

      let newCursorPosition = Math.max(0, cursorPosition - removedBeforeCursor);

      if (maxLength && newCursorPosition > maxLength) {
        newCursorPosition = maxLength;
      }

      input.value = cleanedValue;
      input.setSelectionRange(newCursorPosition, newCursorPosition);

      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const registerProps = register(registerOptions);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const input = e.currentTarget;
    const pastedText = e.clipboardData.getData("text");
    const cursorStart = input.selectionStart || 0;
    const cursorEnd = input.selectionEnd || cursorStart;
    const currentValue = input.value;

    const beforeCursor = currentValue.substring(0, cursorStart);
    const afterCursor = currentValue.substring(cursorEnd);
    const newValue = beforeCursor + pastedText + afterCursor;

    let cleanedValue = cleanNumberValue(newValue);

    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = cleanNumberValue(pastedText);
    const cleanedBeforeCursor = cleanNumberValue(beforeCursor);
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    input.value = cleanedValue;
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    if (registerProps.onChange) {
      registerProps.onChange({
        target: input,
        currentTarget: input,
        type: "change",
      } as any);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      return;
    }

    if (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
      return;
    }

    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const currentValue = input.value;

    if (
      e.key === "+" &&
      allowPlus &&
      cursorPosition === 0 &&
      !currentValue.includes("+")
    ) {
      return;
    }

    if (
      e.key === "-" &&
      allowNegative &&
      cursorPosition === 0 &&
      !currentValue.includes("-")
    ) {
      return;
    }

    if (e.key === "." && allowDecimal && !currentValue.includes(".")) {
      return;
    }

    if (/[0-9]/.test(e.key)) {
      return;
    }

    e.preventDefault();
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleAutoFill = () => {
      const cleanedValue = cleanNumberValue(input.value);
      if (input.value !== cleanedValue) {
        input.value = cleanedValue;
        const event = new Event("input", { bubbles: true });
        input.dispatchEvent(event);
      }
    };

    const interval = setInterval(handleAutoFill, 100);
    input.addEventListener("animationstart", handleAutoFill);

    return () => {
      clearInterval(interval);
      input.removeEventListener("animationstart", handleAutoFill);
    };
  }, [allowPlus, allowDecimal, allowNegative]);

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div className="relative">
      <input
        {...registerProps}
        ref={(e) => {
          registerProps.ref(e);
          inputRef.current = e;
        }}
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        className={inputClasses}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        {...(maxLength ? { maxLength } : {})}
      />

      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {hint && !errorMessage && (
        <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
};

export default NumberInputV2;
