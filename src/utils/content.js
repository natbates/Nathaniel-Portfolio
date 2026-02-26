export function getAvailableYears(items) {
    const years = new Set(
        items
            .map((item) => new Date(item.date))
            .filter((date) => !Number.isNaN(date.getTime()))
            .map((date) => String(date.getFullYear()))
    );

    return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

export function getSortedFilteredItems(items, { search, sort, year }) {
    let filtered = [...items];

    if (search.trim()) {
        const query = search.trim().toLowerCase();
        filtered = filtered.filter((item) => item.title.toLowerCase().includes(query));
    }

    if (year !== "all") {
        filtered = filtered.filter((item) => {
            const date = new Date(item.date);
            return !Number.isNaN(date.getTime()) && String(date.getFullYear()) === year;
        });
    }

    filtered.sort((first, second) => {
        if (sort === "title-asc") {
            return first.title.localeCompare(second.title);
        }

        if (sort === "title-desc") {
            return second.title.localeCompare(first.title);
        }

        const firstDate = new Date(first.date);
        const secondDate = new Date(second.date);

        if (sort === "date-asc") {
            return firstDate - secondDate;
        }

        return secondDate - firstDate;
    });

    return filtered;
}

export function getMostRecentItem(items) {
    if (!items.length) {
        return null;
    }

    return [...items].sort((first, second) => new Date(second.date) - new Date(first.date))[0];
}

export function paginateItems(items, page, perPage = 10) {
    const totalPages = Math.max(1, Math.ceil(items.length / perPage));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * perPage;
    const pagedItems = items.slice(start, start + perPage);

    return {
        totalPages,
        currentPage,
        pagedItems,
    };
}
