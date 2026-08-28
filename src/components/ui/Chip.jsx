export default function Chip({ active, onClick, className = "", children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-[13px] transition-all ${
        active
          ? "text-white shadow-md"
          : "bg-white text-gray-600 ring-1 ring-gray-200 hover:text-gray-900 hover:ring-gray-300"
      } ${className}`}
      style={
        active
          ? {
              background: "var(--color-primary)",
              boxShadow: "0 6px 16px -8px var(--color-primary)",
            }
          : undefined
      }
    >
      {children}
    </button>
  );
}
