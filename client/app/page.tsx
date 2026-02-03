'use client'

import { useState, useEffect, useCallback, type FC } from "react";
import { Search, ChevronDown, Bell, Mail, Home, User, Star, MapPin, Calendar, Menu, X } from "lucide-react";
import { IPriceOption, ISortOption, ISpecialist } from "./types";
import { VerificationStatus } from "./types/enums";
import { useToast } from "./hooks/useToast";
import { SpecialistApiService } from "./api/specialist.api";
import { ToastContainer } from "./components/ul/Toast";
import { ApiError } from "./api/apiClient";
import Pagination from "./components/ul/Pagination";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type PriceFilterId = "all" | "under-1000" | "1000-2000" | "2000-3000" | "over-3000";
type SortId = "recommended" | "price_asc" | "price_desc" | "newest";

interface IUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

interface PillDropdownProps {
  readonly label: string;
  readonly options: readonly IPriceOption[];
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
}

interface SpecialistCardProps {
  readonly specialist: ISpecialist;
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PRICE_OPTIONS: readonly IPriceOption[] = [
  { id: "all", label: "All Prices" },
  { id: "under-1000", label: "Under RM 1,000", max: 1000 },
  { id: "1000-2000", label: "RM 1,000 – 2,000", min: 1000, max: 2000 },
  { id: "2000-3000", label: "RM 2,000 – 3,000", min: 2000, max: 3000 },
  { id: "over-3000", label: "Over RM 3,000", min: 3000 },
];

const SORT_OPTIONS: readonly ISortOption[] = [
  { id: "recommended", label: "Recommended", value: "recommended" },
  { id: "price_asc", label: "Price: Low to High", value: "price_asc" },
  { id: "price_desc", label: "Price: High to Low", value: "price_desc" },
  { id: "newest", label: "Newest", value: "newest" },
];

const SPECIALIZATIONS = [
  'Company Registration',
  'Tax Consultation',
  'Legal Services',
  'Accounting',
  'Business Planning',
  'Compliance',
];

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8;

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** "1600" → "1,600" */
function formatPrice(value: number): string {
  return value.toLocaleString("en-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatDuration(days: number): string {
  return `${days} Day${days !== 1 ? 's' : ''}`;
}

function getRandomSpecializations(count: number = 2): string[] {
  const shuffled = [...SPECIALIZATIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function mapVerificationStatus(status: VerificationStatus): string {
  switch (status) {
    case 'approved':
      return 'Verified';
    case 'pending':
      return 'Under Review';
    case 'rejected':
      return 'Not Verified';
    default:
      return 'Pending';
  }
}

/**
 * Pure function — applies the active price filter then sorts.
 */
function filterAndSort(
  list: readonly ISpecialist[],
  priceId: PriceFilterId,
  sortId: SortId,
  searchQuery: string
): ISpecialist[] {
  let result: ISpecialist[] = [...list];

  // Filter out draft specialists for public view
  result = result.filter(specialist => !specialist.is_draft);

  // Apply search filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    result = result.filter(specialist => 
      specialist.title.toLowerCase().includes(query) ||
      specialist.description?.toLowerCase().includes(query) ||
      specialist.verification_status?.toLowerCase().includes(query)
    );
  }

  // Apply price filter
  if (priceId !== "all") {
    const rule = PRICE_OPTIONS.find((o) => o.id === priceId);
    if (rule) {
      result = result.filter((specialist: ISpecialist): boolean => {
        const price = parseFloat(specialist.final_price.toString());
        const hasMin: boolean = rule.min !== undefined;
        const hasMax: boolean = rule.max !== undefined;

        if (hasMin && hasMax) return price >= rule.min! && price <= rule.max!;
        if (hasMin) return price >= rule.min!;
        if (hasMax) return price <= rule.max!;
        return true;
      });
    }
  }

  // Apply sorting
  switch (sortId) {
    case "price_asc":
      result.sort((a, b) => parseFloat(a.final_price.toString()) - parseFloat(b.final_price.toString()));
      break;
    case "price_desc":
      result.sort((a, b) => parseFloat(b.final_price.toString()) - parseFloat(a.final_price.toString()));
      break;
    case "newest":
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    default: // "recommended" - mix of rating and reviews
      result.sort((a, b) => {
        const scoreA = a.average_rating * Math.log(a.total_number_of_ratings + 1);
        const scoreB = b.average_rating * Math.log(b.total_number_of_ratings + 1);
        return scoreB - scoreA;
      });
      break;
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pill-shaped dropdown.
 */
const PillDropdown: FC<PillDropdownProps> = ({ label, options, selectedId, onSelect }) => {
  const [open, setOpen] = useState<boolean>(false);

  const isDefault: boolean = selectedId === options[0]?.id;
  const display: string = isDefault
    ? label
    : options.find((o): boolean => o.id === selectedId)?.label ?? label;

  return (
    <div className="relative">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setOpen((prev: boolean) => !prev)}
        className="inline-flex items-center gap-1.5 border border-gray-300 rounded-full bg-white px-3.5 py-1.5 text-sm text-gray-700 hover:border-gray-400 transition-colors w-full sm:w-auto justify-between sm:justify-start"
      >
        <span className="font-medium text-xs sm:text-sm">{display}</span>
        <ChevronDown
          size={13}
          className={`text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"}`}
        />
      </button>

      {/* Click-away backdrop */}
      {open && <div className="fixed inset-0 z-[9]" onClick={() => setOpen(false)} />}

      {/* Menu */}
      {open && (
        <div className="absolute top-full left-0 mt-1.5 z-[10] w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {options.map((opt: IPriceOption) => {
            const active: boolean = opt.id === selectedId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => { onSelect(opt.id); setOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors
                  ${active ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-50"}`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/**
 * Single specialist card for home page.
 */
const SpecialistCard: FC<SpecialistCardProps> = ({ specialist }) => {
  const [hovered, setHovered] = useState<boolean>(false);

  // Generate deterministic image based on specialist ID
  const imageSeed = specialist.id.replace(/[^a-zA-Z0-9]/g, '');
  const imgUrl = `https://picsum.photos/seed/${imageSeed}/400/320`;

  const specializations = getRandomSpecializations(2);
  const isVerified = specialist.verification_status === 'approved';
  const price = parseFloat(specialist.final_price.toString());

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white cursor-pointer transition-all duration-200 ${hovered ? "shadow-md transform -translate-y-1" : "shadow-none"}`}
    >
      {/* Cover image with aspect ratio */}
      <div className="w-full overflow-hidden" style={{ aspectRatio: "5 / 4" }}>
        <img
          src={imgUrl}
          alt={specialist.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-300 ${hovered ? "scale-[1.04]" : "scale-100"}`}
        />
      </div>

      {/* Card content */}
      <div className="px-4 pt-4 pb-5">
        {/* Title and verification status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-1">{specialist.title}</h3>
          {isVerified && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium flex-shrink-0 ml-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Verified
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{specialist.description}</p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2 mb-3">
          {specializations.map((spec) => (
            <span
              key={spec}
              className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="font-medium">{specialist.average_rating}</span>
            <span className="text-xs sm:text-sm">({specialist.total_number_of_ratings} reviews)</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs sm:text-sm">{formatDuration(specialist.duration_days)}</span>
          </div>
        </div>

        {/* Specialist info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {specialist.title.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm truncate">
              {specialist.title.split(' ')[0]} - Company Secretary
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span>Kuala Lumpur</span>
            </div>
          </div>
        </div>

        {/* Price and action button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <div className="text-lg sm:text-xl font-bold text-gray-900">
              RM {formatPrice(price)}
            </div>
            <div className="text-xs text-gray-500">Starting price</div>
          </div>
          <button className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

// Loading skeleton component
const LoadingSkeleton: FC = () => {
  return (
    <div className="grid pb-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-white">
          <div className="w-full" style={{ aspectRatio: "5 / 4" }}>
            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          </div>
          <div className="px-4 pt-4 pb-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
              <div className="h-9 bg-gray-200 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Empty state component
const EmptyState: FC = () => {
  return (
    <div className="py-16 text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
        <User size={48} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No specialists found</h3>
      <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

const SpecialistsPage: FC = () => {
  const [search, setSearch] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<PriceFilterId>("all");
  const [sortFilter, setSortFilter] = useState<SortId>("recommended");
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toasts, error, removeToast } = useToast();

  // Check user authentication from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (err) {
      console.error('Error reading user from localStorage:', err);
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  // Fetch specialists on mount
  const fetchSpecialists = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await SpecialistApiService.getAll();
      setSpecialists(data);
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to load specialists');
      console.error('Error fetching specialists:', err);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchSpecialists();
  }, [fetchSpecialists]);

  // Filter and sort specialists
  const filteredSpecialists = filterAndSort(specialists, priceFilter, sortFilter, search);

  // Calculate pagination
  const totalPages = Math.ceil(filteredSpecialists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSpecialists = filteredSpecialists.slice(startIndex, endIndex);

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceFilter, sortFilter, search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f5", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* ════════════════════════════ NAVBAR ════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200" style={{ minHeight: 48 }}>
        <div className="h-full flex items-center justify-between px-4 sm:px-6 max-w-[1200px] mx-auto py-2 sm:py-0">
          {/* left – logo + nav links (desktop) */}
          <div className="flex items-center gap-4 sm:gap-8">
            <span className="text-base sm:text-[18px] font-[800] tracking-[-0.5px] text-gray-900">ANYCOMP</span>

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-5">
              <a href="#" className="text-[13px] text-gray-700 hover:text-blue-600 transition-colors font-medium">Register a company</a>
              <a href="#" className="text-[13px] text-gray-700 hover:text-blue-600 transition-colors font-medium">Appoint a Company Secretary</a>
              <a href="#" className="text-[13px] text-gray-700 hover:text-blue-600 transition-colors font-medium inline-flex items-center gap-1">
                Company Secretarial Services
                <ChevronDown size={12} className="text-gray-500" />
              </a>
              <a href="#" className="text-[13px] text-gray-700 hover:text-blue-600 transition-colors font-medium">How Anycomp Works</a>
            </nav>
          </div>

          {/* right – search bar + icon row + avatar (desktop) / mobile menu button */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Desktop search */}
            <div className="hidden md:flex border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                placeholder="Search for any service..."
                className="px-3 py-1.5 text-[13px] text-gray-700 outline-none bg-white placeholder-gray-400"
                style={{ width: 195 }}
              />
              <button type="button" className="bg-blue-600 hover:bg-blue-700 transition-colors px-2.5 flex items-center justify-center">
                <Search size={14} color="#fff" />
              </button>
            </div>

            {/* Desktop icons */}
            <Mail size={18} className="hidden sm:block text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
            <Bell size={18} className="hidden sm:block text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />

            {/* Desktop auth links / avatar */}
            {isLoggedIn && user ? (
              <>
                <a
                  href="/dashboard"
                  className="hidden sm:block text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Dashboard
                </a>
                <div
                  className="hidden sm:flex w-7 h-7 rounded-full items-center justify-center cursor-pointer"
                  style={{ background: "linear-gradient(135deg, #f59e0b 40%, #ef4444)" }}
                  title={user.email || user.name || 'User'}
                >
                  <User size={14} color="#fff" strokeWidth={2.5} />
                </div>
              </>
            ) : (
              <a
                href="/login"
                className="hidden sm:block px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium"
              >
                Login
              </a>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <nav className="flex flex-col px-4 py-3 space-y-2">
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">Register a company</a>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">Appoint a Company Secretary</a>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">Company Secretarial Services</a>
              <a href="#" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium py-2">How Anycomp Works</a>

              {/* Mobile search */}
              <div className="md:hidden flex border border-gray-300 rounded overflow-hidden mt-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  placeholder="Search for any service..."
                  className="flex-1 px-3 py-2 text-sm text-gray-700 outline-none bg-white placeholder-gray-400"
                />
                <button type="button" className="bg-blue-600 hover:bg-blue-700 transition-colors px-3 flex items-center justify-center">
                  <Search size={16} color="#fff" />
                </button>
              </div>

              {/* Mobile auth links */}
              {isLoggedIn && user ? (
                <>
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <p className="text-xs text-gray-500 mb-1">Logged in as</p>
                    <p className="text-sm font-medium text-gray-900">{user.email || user.name || 'User'}</p>
                  </div>
                  <a
                    href="/dashboard"
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium py-2"
                  >
                    Go to Dashboard
                  </a>
                </>
              ) : (
                <a
                  href="/login"
                  className="text-sm text-center px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium mt-2"
                >
                  Login
                </a>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* ════════════════════════════ BODY ═════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* ── breadcrumb ── */}
        <div className="flex items-center gap-1 pt-4 sm:pt-5 pb-1 overflow-x-auto whitespace-nowrap">
          <Home size={13} className="text-gray-500 flex-shrink-0" />
          <span className="text-[12px] text-gray-400 mx-0.5">/</span>
          <a href="#" className="text-[12px] text-gray-500 hover:text-blue-600 transition-colors">Specialists</a>
          <span className="text-[12px] text-gray-400 mx-0.5">/</span>
          <span className="text-[12px] text-gray-600 font-medium">Register a New Company</span>
        </div>

        {/* ── page heading ── */}
        <h1 className="text-xl sm:text-[26px] font-bold text-gray-900 mt-2 mb-0.5">Register a New Company</h1>
        <p className="text-xs sm:text-[13px] text-gray-400 mb-4">Get Your Company Registered with a Trusted Specialist</p>

        {/* ── filter pills ── */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2.5 mb-4 sm:mb-5">
          <PillDropdown
            label="Price"
            options={PRICE_OPTIONS}
            selectedId={priceFilter}
            onSelect={(id: string) => setPriceFilter(id as PriceFilterId)}
          />
          <PillDropdown
            label="Sort by"
            options={SORT_OPTIONS}
            selectedId={sortFilter}
            onSelect={(id: string) => setSortFilter(id as SortId)}
          />
        </div>

        {/* ── results count ── */}
        <div className="mb-4">
          <p className="text-xs sm:text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredSpecialists.length)} of {filteredSpecialists.length} specialists
          </p>
        </div>

        {/* ── responsive grid ── */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredSpecialists.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid pb-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedSpecialists.map((specialist: ISpecialist) => (
                <SpecialistCard key={specialist.id} specialist={specialist} />
              ))}
            </div>

            {/* Pagination */}
            {filteredSpecialists.length > ITEMS_PER_PAGE && (
              <div className="pb-8 sm:pb-16">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
};

export default SpecialistsPage;