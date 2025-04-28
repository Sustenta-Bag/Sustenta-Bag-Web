import React from "react";
import clsx from "clsx";

interface FormInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  error,
  required = false,
  className,
  disabled = false,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx(
          "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all",
          error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-300",
          disabled && "bg-gray-100 cursor-not-allowed opacity-75"
        )}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
