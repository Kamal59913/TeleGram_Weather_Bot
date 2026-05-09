// components/ui/ConditionalClickWrapper.tsx
import React from 'react';
import Tooltip from '../ui/tooltip/tooltip';

interface ConditionalClickWrapperProps {
  children: React.ReactNode;
  disabled: boolean;
  onClick?: () => void;
  className?: string;
  disabledClassName?: string;
  tooltipText?: string;
  disabledTooltipText?: string;
}

const ConditionalClickWrapper: React.FC<ConditionalClickWrapperProps> = ({
  children,
  disabled,
  onClick,
  className = '',
  disabledClassName = '',
  tooltipText,
  disabledTooltipText,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.();
  };

  const wrapperClassName = `
    ${className}
    ${disabled ? disabledClassName : ''}
    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
  `.trim();

  const tooltipContent = disabled && disabledTooltipText ? disabledTooltipText : tooltipText;

  return (
    <Tooltip text={tooltipContent!}>
      <div
        className={wrapperClassName}
        onClick={handleClick}
        role={disabled ? undefined : "button"}
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default ConditionalClickWrapper; 