import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={[
        "pointer-events-auto",
        "px-3 py-2 border",
        isDark ? "border-gray-500/50" : "border-gray-300",
        "bg-[color:var(--background-colour)]",
        "text-[color:var(--text-colour)]",
        "text-sm font-medium",
        "flex items-center gap-2",
      ].join(" ")}
    >
      {isDark ? <FaSun /> : <FaMoon />}
    </button>
  );
}