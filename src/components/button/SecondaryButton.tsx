import React from "react";
import clsx from "clsx";

interface SecondaryButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  onClick,
  className,
  children,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md hover:cursor-pointer shadow-sm transition-colors duration-200 flex items-center justify-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
