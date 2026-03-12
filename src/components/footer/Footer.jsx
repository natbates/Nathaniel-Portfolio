import React from "react";
import messages from "./footer.messages";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../theme/ThemeToggle";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`py-4 flex gap-4 justify-between md:justify-center md:max-[1400px]:justify-end md:max-[1400px]:text-right px-4 md:max-[1400px]:pr-16 text-left md:text-center ${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
      <div className="flex items-center space-x-4">
        <small>© {new Date().getFullYear()} {messages.name}</small>
        <div className="flex items-center space-x-3">
          <a
            href="www.linkedin.com/in/nathaniel-bates-69b8b9266"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity text-[color:var(--text-colour)]"
          >
            <FaLinkedin size={14} />
          </a>
          <a
            href="https://github.com/natbates"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity text-[color:var(--text-colour)]"
          >
            <FaGithub size={14} />
          </a>
          <a
            href="https://www.instagram.com/nat_bates_boy?igsh=MTd6ODdyaGhtNTVvZQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity text-[color:var(--text-colour)]"
          >
            <FaInstagram size={14} />
          </a>
        </div>
      </div>
      <div className="md:hidden">
        <ThemeToggle />
      </div>
    </footer>
  );
}
