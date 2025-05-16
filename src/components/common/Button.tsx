// src/components/common/Button.tsx
import React from "react";


type ButtonProps = {
  primary?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
};

const Button: React.FC<ButtonProps> = ({
  primary = true,
  children,
  onClick,
  disabled = false,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-md font-medium transition-all ${
        primary
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
