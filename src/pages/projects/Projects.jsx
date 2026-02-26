import React, { useEffect, useMemo, useState } from "react";
import messages from "./projects.messages";
import projectsData from "../../config/projects";
import ContentListControls from "../../components/content/ContentListControls";
import ContentCard from "../../components/content/ContentCard";
import { getAvailableYears, getSortedFilteredItems, paginateItems } from "../../utils/content";

const ITEMS_PER_PAGE = 10;

export default function Projects() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState("date-desc");
  const [page, setPage] = useState(1);

  const clearFilters = () => {
    setSearch("");
    setYear("all");
    setSort("date-desc");
    setPage(1);
  };

  const years = useMemo(() => getAvailableYears(projectsData), []);

  const filteredItems = useMemo(
    () => getSortedFilteredItems(projectsData, { search, sort, year }),
    [search, sort, year]
  );

  const { pagedItems, totalPages, currentPage } = useMemo(
    () => paginateItems(filteredItems, page, ITEMS_PER_PAGE),
    [filteredItems, page]
  );

  useEffect(() => {
    setPage(1);
  }, [search, sort, year]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const applyMobileDefaults = () => {
      if (mediaQuery.matches) {
        setSearch("");
        setYear("all");
        setSort("date-desc");
        setPage(1);
      }
    };

    applyMobileDefaults();
    mediaQuery.addEventListener("change", applyMobileDefaults);

    return () => {
      mediaQuery.removeEventListener("change", applyMobileDefaults);
    };
  }, []);

  return (
    <section className="p-4">
      <h2 className="content-anim text-4xl md:text-5xl mb-6" style={{ "--content-delay": "80ms" }}>
        {messages.heading}
      </h2>

      <div className="content-anim" style={{ "--content-delay": "170ms" }}>
        <ContentListControls
          search={search}
          onSearchChange={setSearch}
          year={year}
          onYearChange={setYear}
          years={years}
          sort={sort}
          onSortChange={setSort}
          onClear={clearFilters}
          isClearDisabled={!search && year === "all" && sort === "date-desc"}
        />
      </div>

      <div className="flex flex-col gap-4">
        {filteredItems.length === 0 ? (
          <p className="content-anim opacity-70" style={{ "--content-delay": "240ms" }}>
            No project entries found.
          </p>
        ) : (
          pagedItems.map((item, index) => (
            <div key={item.slug} className="content-list-item-anim" style={{ "--item-delay": `${240 + index * 70}ms` }}>
              <ContentCard item={item} to={`/projects/${item.slug}`} />
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="content-anim flex items-center justify-center gap-3 mt-6" style={{ "--content-delay": "420ms" }}>
          <button className="pagination-btn" onClick={() => setPage((p) => p - 1)} disabled={currentPage === 1}>
            Prev
          </button>
          <span className="text-sm opacity-80">
            Page {currentPage} of {totalPages}
          </span>
          <button className="pagination-btn" onClick={() => setPage((p) => p + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}
