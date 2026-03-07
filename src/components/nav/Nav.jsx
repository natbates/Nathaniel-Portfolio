import React from "react";
import { NavLink } from "react-router-dom";
import messages from "./nav.messages";

import { ReactComponent as Blog } from "../../assets/nav/blog.svg";
import { ReactComponent as Projects } from "../../assets/nav/projects.svg";
import { ReactComponent as Experience } from "../../assets/nav/experience.svg";
import { ReactComponent as Contact } from "../../assets/nav/contact.svg";

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
      "hover:opacity-100",
    ].join(" ");

  const dividerClass = "pl-4 ml-4 border-l border-gray-500/50";

  const navItems = [
    { to: "/blog", label: messages.blog, Icon: Blog },
    { to: "/projects", label: messages.projects, Icon: Projects },
    { to: "/experience", label: messages.experience, Icon: Experience },
    { to: "/contact", label: messages.contact, Icon: Contact },
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

      <nav className="md:hidden flex items-center justify-end gap-2" aria-label="Mobile navigation">
        {navItems.map((item, index) => (
          <div key={item.to} className="nav-item-anim" style={{ animationDelay: `${index * 100}ms` }}>
            <NavLink to={item.to} className={mobileLinkClass} aria-label={item.label} title={item.label}>
              <item.Icon className="w-5 h-5 text-[color:var(--text-colour)]" />
            </NavLink>
          </div>
        ))}
      </nav>
    </>
  );
}
