import React from "react";
import { Link } from "react-router-dom";

export default function ContentCard({ item, to, className = "" }) {
  return (
    <Link
      to={to}
      className={`w-full h-full md:min-h-0 border p-3 !no-underline opacity-100 md:opacity-70 md:hover:opacity-100 transition-opacity flex flex-col md:flex-row md:items-center gap-4 ${className}`}
    >
      <img src={item.image} alt={item.title} className="w-full min-h-[200px] md:min-h-0 h-auto md:w-28 md:h-20 lg:w-36 lg:h-24 object-cover bg-gray-100/10 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm opacity-50 !text-[color:var(--text-colour)]">{item.date}</p>
        <h3 className="text-lg md:text-xl mt-1 truncate tracking-[0.18em] md:tracking-[0.24em]">{item.title}</h3>
        <p className="text-sm mt-1 opacity-80 line-clamp-2 !text-[color:var(--text-colour)]">{item.description}</p>
      </div>
    </Link>
  );
}
