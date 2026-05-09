"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useEffect, useRef } from "react";

interface TextareaProps {
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  noOfSpaceAllowed?: number;
  isSpaceAtStart?: boolean;
  isSpaceAtEnd?: boolean;
  maxLength?: number;
  autoFocus?: boolean;
  errorSingleMessage?: string;
}

const TextArea: FC<TextareaProps> = ({
  placeholder = "Enter your message",
  rows = 3,
  value,
  className = "",
  disabled = false,
  register,
  registerOptions,
  errors,
  noOfSpaceAllowed = 1,
  isSpaceAtStart = false,
  isSpaceAtEnd = true,
  maxLength,
  autoFocus = false,
  errorSingleMessage = "",
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  let textareaClasses = `w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-colors resize-none ${className}`;

  if (disabled) {
    textareaClasses += ` text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed opacity-40 dark:bg-black dark:text-gray-500 dark:border-gray-700`;
  } else {
    textareaClasses += ` bg-white text-black border-gray-300 placeholder-gray-400 focus:border-[#000000] focus:ring-[#000000]/20 dark:bg-black dark:text-white dark:border-gray-800 dark:placeholder-gray-600 dark:focus:border-zinc-700 dark:focus:ring-zinc-700/20`;
  }

  const cleanTextareaValue = (inputValue: string): string => {
    let cleanedValue = inputValue;

    if (noOfSpaceAllowed === 0) {
      cleanedValue = cleanedValue.replace(/\s/g, "");
    } else if (noOfSpaceAllowed > 0) {
      const spacePattern = new RegExp(`\\s{${noOfSpaceAllowed + 1},}`, "g");
      const replacementSpaces = " ".repeat(noOfSpaceAllowed);
      cleanedValue = cleanedValue.replace(spacePattern, replacementSpaces);
    }

    if (!isSpaceAtStart) {
      cleanedValue = cleanedValue.replace(/^\s+/, "");
    }

    if (!isSpaceAtEnd) {
      cleanedValue = cleanedValue.replace(/\s+$/, "");
    }

    return cleanedValue;
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart || 0;
    const originalValue = textarea.value;
    let cleanedValue = cleanTextareaValue(originalValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    if (originalValue !== cleanedValue) {
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = cleanTextareaValue(beforeCursor);
      const removedBeforeCursor =
        beforeCursor.length - cleanedBeforeCursor.length;

      let newCursorPosition = Math.max(0, cursorPosition - removedBeforeCursor);

      // ✅ Don't let cursor go beyond maxLength
      if (maxLength && newCursorPosition > maxLength) {
        newCursorPosition = maxLength;
      }

      textarea.value = cleanedValue;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);

      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };

  const registerProps = register(registerOptions);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const textarea = e.currentTarget;
    const pastedText = e.clipboardData.getData("text");
    const cursorStart = textarea.selectionStart || 0;
    const cursorEnd = textarea.selectionEnd || cursorStart;
    const currentValue = textarea.value;

    const beforeCursor = currentValue.substring(0, cursorStart);
    const afterCursor = currentValue.substring(cursorEnd);
    const newValue = beforeCursor + pastedText + afterCursor;

    let cleanedValue = cleanTextareaValue(newValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = cleanTextareaValue(pastedText);
    const cleanedBeforeCursor = cleanTextareaValue(beforeCursor);
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    // ✅ Adjust cursor position if we truncated due to maxLength
    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    textarea.value = cleanedValue;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);

    if (registerProps.onChange) {
      registerProps.onChange({
        target: textarea,
        currentTarget: textarea,
        type: "change",
      } as any);
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleAutoFill = () => {
      const cleanedValue = cleanTextareaValue(textarea.value);
      if (textarea.value !== cleanedValue) {
        textarea.value = cleanedValue;
        const event = new Event("input", { bubbles: true });
        textarea.dispatchEvent(event);
      }
    };

    const interval = setInterval(handleAutoFill, 100);

    textarea.addEventListener("animationstart", handleAutoFill);

    return () => {
      clearInterval(interval);
      textarea.removeEventListener("animationstart", handleAutoFill);
    };
  }, [noOfSpaceAllowed, isSpaceAtStart, isSpaceAtEnd]);

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div className="relative">
      <textarea
        {...registerProps}
        ref={(e) => {
          registerProps.ref(e);
          textareaRef.current = e;
        }}
        placeholder={placeholder}
        rows={rows}
        value={value}
        disabled={disabled}
        className={textareaClasses}
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

export default TextArea;