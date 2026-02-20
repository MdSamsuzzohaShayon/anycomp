export const CURRENCIES = [
    { code: "USD", label: "🇺🇸 USD" },
    { code: "EUR", label: "🇪🇺 EUR" },
    { code: "GBP", label: "🇬🇧 GBP" },
    { code: "BDT", label: "🇧🇩 BDT" },
    { code: "MYR", label: "🇲🇾 MYR" }, // Malaysian Ringgit
];



export const OFFERINGS = [
    {
        id: "fast_delivery",
        icon: "⚡",
        title: "Fast Delivery",
        subtitle: "Get work in 24 hours",
    },
    {
        id: "extra_revision",
        icon: "🔁",
        title: "Extra Revision",
        subtitle: "Add one more revision",
    },
    {
        id: "premium_support",
        icon: "⭐",
        title: "Premium Support",
        subtitle: "Priority communication",
    },
];


// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const PRICE_OPTIONS = [
    { id: "any", label: "All Prices" },
    { id: "low", label: "Under RM 1,000", max: 1000 },
    { id: "medium", label: "RM 1,000 – 2,000", min: 1000, max: 2000 },
    { id: "high", label: "Over RM 3,000", min: 3000 },
] as const;


export const ITEMS_PER_PAGE = 10;

export const BREADCRUMB_ITEMS = [
    { label: "Specialists", href: "#" },
    { label: "Register a New Company" },
];

export const SORT_OPTIONS = [
    { id: "recommended", label: "Recommended", value: "recommended" },
    { id: "price_asc", label: "Price: Low to High", value: "price_asc" },
    { id: "price_desc", label: "Price: High to Low", value: "price_desc" },
    { id: "newest", label: "Newest", value: "newest" },
    { id: "oldest", label: "Oldest", value: "oldest" }, // new
] as const;
