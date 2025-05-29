import React, { useState } from "react";
import clsx from "clsx";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = "",
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const shouldFloat = isFocused || (value && value !== "");

  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={clsx(
          "w-full bg-transparent outline-none pt-6 pb-2 pl-2 appearance-none cursor-pointer",
          shouldFloat ? "border-orange-300 border-b-2" : "border-black border-b"
        )}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        className={clsx(
          "absolute left-0 text-sm transition-all duration-200 pointer-events-none",
          shouldFloat
            ? "font-bold top-0 text-xs text-orange-300"
            : "font-semibold top-8 text-black"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

export default SelectInput;
