import React from "react";
import messages from "./footer.messages";
import { useTheme } from "../../context/ThemeContext";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`py-4 pr-0 md:pr-16 ml-2 text-left md:text-right ${isDark ? "text-gray-400" : "text-gray-600"} text-sm`}>
      <div className="flex items-center justify-start md:justify-end space-x-4">
        <small>© {new Date().getFullYear()} {messages.name}</small>
        <div className="flex items-center space-x-3">
          <a
            href="https://www.linkedin.com/in/your-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity text-[color:var(--text-colour)]"
          >
            <FaLinkedin size={14} />
          </a>
          <a
            href="https://github.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity text-[color:var(--text-colour)]"
          >
            <FaGithub size={14} />
          </a>
          <a
            href="https://www.instagram.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-50 hover:opacity-100 transition-opacity text-[color:var(--text-colour)]"
          >
            <FaInstagram size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
