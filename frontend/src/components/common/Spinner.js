const Spinner = ({ size = "md", color = "red" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  const colors = { red: "border-red-600", blue: "border-blue-600", white: "border-white" };
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};
export default Spinner;
