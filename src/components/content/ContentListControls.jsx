import React from "react";

export default function ContentListControls({
  search,
  onSearchChange,
  year,
  onYearChange,
  years,
  sort,
  onSortChange,
  onClear,
  isClearDisabled,
}) {
  return (
    <div className="hidden md:flex mb-6 gap-4 flex-wrap">
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="border p-2 bg-transparent !text-color-inherit flex-1"
      />

      <select value={year} onChange={(event) => onYearChange(event.target.value)} className="border p-2 min-w-[200px] bg-transparent !text-color-inherit">
        <option value="all">All years</option>
        {years.map((yearOption) => (
          <option key={yearOption} value={yearOption}>
            {yearOption}
          </option>
        ))}
      </select>

      <select value={sort} onChange={(event) => onSortChange(event.target.value)} className="border p-2 min-w-[200px] bg-transparent !text-color-inherit">
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
      </select>

      <button
        type="button"
        onClick={onClear}
        className="secondary w-fit"
        disabled={isClearDisabled}
      >
        Clear
      </button>
    </div>
  );
}
