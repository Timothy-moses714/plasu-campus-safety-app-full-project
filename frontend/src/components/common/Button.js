const Button = ({
  children, onClick, type = "button", variant = "primary",
  size = "md", disabled = false, fullWidth = false, className = "",
}) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none active:scale-95";
  const variants = {
    primary: "bg-red-600 text-white hover:bg-red-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-100 text-red-700 hover:bg-red-200",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
  };
  const sizes = {
    sm: "text-xs sm:text-sm px-3 py-1.5",
    md: "text-sm sm:text-base px-4 py-2",
    lg: "text-base sm:text-lg px-5 sm:px-6 py-2.5 sm:py-3",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
