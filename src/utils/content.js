function parseDateToken(token) {
    const trimmedToken = token.trim();

    const dmyMatch = trimmedToken.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (dmyMatch) {
        const day = Number(dmyMatch[1]);
        const monthIndex = Number(dmyMatch[2]) - 1;
        const year = Number(dmyMatch[3]);
        const parsed = new Date(year, monthIndex, day);

        if (
            parsed.getFullYear() === year &&
            parsed.getMonth() === monthIndex &&
            parsed.getDate() === day
        ) {
            return parsed;
        }
    }

    const parsed = new Date(trimmedToken);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function extractDatesFromString(dateString) {
    if (!dateString) {
        return [];
    }

    const tokenMatches = dateString.match(/\d{1,2}-\d{1,2}-\d{4}|\d{4}-\d{2}-\d{2}/g) || [];
    const parsedTokens = tokenMatches
        .map((token) => parseDateToken(token))
        .filter(Boolean);

    if (parsedTokens.length > 0) {
        return parsedTokens;
    }

    const fallbackDate = parseDateToken(dateString);
    return fallbackDate ? [fallbackDate] : [];
}

function getDateSortValue(item) {
    const parsedDates = extractDatesFromString(item.date);

    if (parsedDates.length === 0) {
        return Number.NEGATIVE_INFINITY;
    }

    return parsedDates[parsedDates.length - 1].getTime();
}

function getItemYears(item) {
    const parsedDates = extractDatesFromString(item.date);
    return parsedDates.map((date) => String(date.getFullYear()));
}

export function getAvailableYears(items) {
    const years = new Set(items.flatMap((item) => getItemYears(item)));
    return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

export function getSortedFilteredItems(items, { search, sort, year }) {
    let filtered = [...items];

    if (search.trim()) {
        const query = search.trim().toLowerCase();
        filtered = filtered.filter((item) => item.title.toLowerCase().includes(query));
    }

    if (year !== "all") {
        filtered = filtered.filter((item) => getItemYears(item).includes(year));
    }

    filtered.sort((first, second) => {
        if (sort === "title-asc") {
            return first.title.localeCompare(second.title);
        }

        if (sort === "title-desc") {
            return second.title.localeCompare(first.title);
        }

        const firstDate = getDateSortValue(first);
        const secondDate = getDateSortValue(second);

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

    return [...items].sort((first, second) => getDateSortValue(second) - getDateSortValue(first))[0];
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
