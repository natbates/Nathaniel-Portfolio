import React from "react";
import { NavLink } from "react-router-dom";
import { FiFileText, FiBriefcase, FiAward, FiMail } from "react-icons/fi";
import messages from "./nav.messages";

export default function Nav() {
  const desktopLinkClass = ({ isActive }) =>
    [
      "font-medium transition-colors",
      "!no-underline",
      "!text-[color:var(--text-colour)]",
      isActive ? "opacity-100" : "opacity-60",
      "hover:opacity-100",
    ].join(" ");

  const mobileLinkClass = ({ isActive }) =>
    [
      "font-medium transition-colors",
      "!no-underline",
      "!text-[color:var(--text-colour)]",
      "inline-flex items-center justify-center",
      "w-9 h-9",
      isActive ? "opacity-100" : "opacity-60",
      "hover:opacity-100",
    ].join(" ");

  const dividerClass = "pl-4 ml-4 border-l border-gray-500/50";

  const navItems = [
    { to: "/blog", label: messages.blog, Icon: FiFileText },
    { to: "/projects", label: messages.projects, Icon: FiBriefcase },
    { to: "/experience", label: messages.experience, Icon: FiAward },
    { to: "/contact", label: messages.contact, Icon: FiMail },
  ];

  return (
    <>
      <nav className="hidden md:flex items-center justify-end" aria-label="Main navigation">
        {navItems.map((item, index) => (
          <div key={item.to} className="nav-item-anim" style={{ animationDelay: `${index * 100}ms` }}>
            <NavLink
              to={item.to}
              className={({ isActive }) => `${index === 0 ? "" : dividerClass} ${desktopLinkClass({ isActive })}`}
            >
              {item.label}
            </NavLink>
          </div>
        ))}
      </nav>

      <nav className="md:hidden flex items-end w-full justify-end gap-2" aria-label="Mobile navigation">
        {navItems.map((item, index) => (
          <div key={item.to} className="nav-item-anim" style={{ animationDelay: `${index * 100}ms` }}>
            <NavLink to={item.to} className={mobileLinkClass} aria-label={item.label} title={item.label}>
              <item.Icon className="w-5 h-5" />
            </NavLink>
          </div>
        ))}
      </nav>
    </>
  );
}
