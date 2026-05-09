import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  isRequired?: boolean;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className, isRequired }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        twMerge(
          "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
          className,
        ),
      )}
    >
      {children} {isRequired && <><span className="text-error-500">*</span>{" "}</>} 
    </label>
  );
};

export default Label;
