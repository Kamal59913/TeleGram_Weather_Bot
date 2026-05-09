import { type FC } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface EmailInputProps {
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
  maxLength?: number;
  autoFocus?: boolean;
}

const EmailInput: FC<EmailInputProps> = ({
  type = "email",
  id,
  placeholder,
  value,
  className = "",
  min,
  max,
  step,
  disabled = false,
  hint,
  register,
  registerOptions,
  errors,
  maxLength,
  autoFocus = false,
}) => {
  let inputClasses = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors ${className}`;

  if (disabled) {
    inputClasses += ` text-gray-400 bg-white border-gray-300 cursor-not-allowed opacity-80 dark:bg-black dark:text-gray-500 dark:border-gray-700`;
  } else {
    inputClasses += `bg-white dark:bg-black text-black border-gray-300 placeholder-gray-400 focus:border-[#000000] focus:ring-[#000000]/20  dark:text-white dark:border-gray-800 dark:placeholder-gray-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-700/20`;
  }

  // Email-specific registration
  const emailRegister = register(registerOptions, {
    setValueAs: (value: unknown) =>
      typeof value === "string" ? value.replace(/\s+/g, "").trim() : value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const cursorPos = e.target.selectionStart;
      const newValue = e.target.value.replace(/\s/g, "");
      if (e.target.value !== newValue) {
        e.target.value = newValue;
        e.target.setSelectionRange(cursorPos, cursorPos);
      }
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.trim();
    },
  });

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const originalValue = input.value;

    // Remove all spaces
    let cleanedValue = originalValue.replace(/\s/g, "");

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    if (originalValue !== cleanedValue) {
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = beforeCursor.replace(/\s/g, "");
      const removedBeforeCursor =
        beforeCursor.length - cleanedBeforeCursor.length;

      let newCursorPosition = Math.max(0, cursorPosition - removedBeforeCursor);

      // ✅ Don't let cursor go beyond maxLength
      if (maxLength && newCursorPosition > maxLength) {
        newCursorPosition = maxLength;
      }

      input.value = cleanedValue;
      input.setSelectionRange(newCursorPosition, newCursorPosition);

      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    }
  };

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

    // Remove all spaces
    let cleanedValue = newValue.replace(/\s/g, "");

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = pastedText.replace(/\s/g, "");
    const cleanedBeforeCursor = beforeCursor.replace(/\s/g, "");
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    // ✅ Adjust cursor position if we truncated due to maxLength
    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    input.value = cleanedValue;
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // ✅ Trigger React Hook Form's onChange
    if (emailRegister.onChange) {
      emailRegister.onChange({
        target: input,
        currentTarget: input,
        type: "change",
      } as any);
    }
  };

  const errorMessage = errors?.[registerOptions]?.message as string | undefined;

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
        onInput={handleInput}
        onPaste={handlePaste}
        {...emailRegister}
        {...(maxLength ? { maxLength } : {})}
        autoFocus={autoFocus}
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

export default EmailInput;
