import React from "react";
import clsx from "clsx";

interface PrimaryButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  className,
  children,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "py-2 px-6 rounded-lg shadow-md transition-colors duration-300",
        disabled
          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
          : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white hover:cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
