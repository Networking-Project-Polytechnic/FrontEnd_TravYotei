'use client'

import React from "react"

interface ButtonProps {
  label?: string
  className?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  type?: "button" | "submit" | "reset"
}

const Button: React.FC<ButtonProps> = ({
  label,
  className = "",
  onClick,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  type = "button",
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg 
        transition-all duration-200 
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"}
        ${className}
      `}
    >
      {/* Loading spinner */}
      {loading && (
        <span className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full"></span>
      )}

      {/* Left icon */}
      {!loading && leftIcon}

      {/* Label */}
      {label && <span>{label}</span>}

      {/* Right icon */}
      {!loading && rightIcon}
    </button>
  )
}

export default Button

