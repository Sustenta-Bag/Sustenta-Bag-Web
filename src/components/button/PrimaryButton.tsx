import React from "react";
import clsx from "clsx";

interface PrimaryButtonProps {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  onClick,
  className,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-2 px-6 rounded-lg hover:cursor-pointer shadow-md transition-colors duration-300",
        className
      )}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
