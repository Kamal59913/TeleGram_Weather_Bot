"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useEffect, useRef } from "react";

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
  step?: number | string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  doesExist?: boolean;
  noOfSpaceAllowed?: number; // Maximum consecutive spaces allowed (0 = no spaces allowed)
  isSpaceAtStart?: boolean; // Allow spaces at the beginning
  isSpaceAtEnd?: boolean; // Allow spaces at the end
  maxLength?: number;
  autoFocus?: boolean;
  errorSingleMessage?: string;
  showArrows?: boolean;
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
  register,
  registerOptions,
  errors,
  noOfSpaceAllowed = 1, // Default: allow single spaces
  isSpaceAtStart = false, // Default: no leading spaces
  isSpaceAtEnd = true, // Default: no trailing spaces
  maxLength,
  autoFocus = false,
  errorSingleMessage = "",
  showArrows = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  let inputClasses = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed opacity-40 dark:bg-black dark:text-gray-500 dark:border-gray-700`;
  } else {
    inputClasses += ` bg-white text-black border-gray-300 placeholder-gray-400 focus:border-[#000000] focus:ring-[#000000]/20 dark:bg-black dark:text-white dark:border-gray-800 dark:placeholder-gray-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-700/20`;
  }

  if (type === "number" && !showArrows) {
    inputClasses += " [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  }

  // Function to clean the input value based on space rules
  const cleanInputValue = (inputValue: string): string => {
    let cleanedValue = inputValue;

    // Handle consecutive spaces
    if (noOfSpaceAllowed === 0) {
      // Remove all spaces
      cleanedValue = cleanedValue.replace(/\s/g, "");
    } else if (noOfSpaceAllowed > 0) {
      // Replace multiple consecutive spaces with allowed number of spaces
      const spacePattern = new RegExp(`\\s{${noOfSpaceAllowed + 1},}`, "g");
      const replacementSpaces = " ".repeat(noOfSpaceAllowed);
      cleanedValue = cleanedValue.replace(spacePattern, replacementSpaces);
    }

    // Handle leading spaces
    if (!isSpaceAtStart) {
      cleanedValue = cleanedValue.replace(/^\s+/, "");
    }

    // Handle trailing spaces
    if (!isSpaceAtEnd) {
      cleanedValue = cleanedValue.replace(/\s+$/, "");
    }

    return cleanedValue;
  };

  // Handle input events (typing, pasting, etc.)
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const originalValue = input.value;
    let cleanedValue = cleanInputValue(originalValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    if (originalValue !== cleanedValue) {
      // Calculate how many characters were removed before the cursor
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = cleanInputValue(beforeCursor);
      const removedBeforeCursor =
        beforeCursor.length - cleanedBeforeCursor.length;

      // New cursor position should account for removed characters
      let newCursorPosition = Math.max(0, cursorPosition - removedBeforeCursor);

      // ✅ Don't let cursor go beyond maxLength
      if (maxLength && newCursorPosition > maxLength) {
        newCursorPosition = maxLength;
      }

      // Update the input value
      input.value = cleanedValue;

      // Restore cursor position
      input.setSelectionRange(newCursorPosition, newCursorPosition);

      // Trigger change event for form validation
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

    let cleanedValue = cleanInputValue(newValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = cleanInputValue(pastedText);
    const cleanedBeforeCursor = cleanInputValue(beforeCursor);
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    // ✅ Adjust cursor position if we truncated due to maxLength
    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    input.value = cleanedValue;
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // Trigger React Hook Form's onChange directly
    if (registerProps.onChange) {
      registerProps.onChange({
        target: input,
        currentTarget: input,
        type: "change",
      } as any);
    }
  };
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleAutoFill = () => {
      const cleanedValue = cleanInputValue(input.value);
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
  }, [noOfSpaceAllowed, isSpaceAtStart, isSpaceAtEnd]);

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
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
        onInput={handleInput}
        onPaste={handlePaste}
        autoFocus={autoFocus}
        {...(maxLength ? { maxLength } : {})}
      />

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

export default Input;
