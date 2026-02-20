'use client'

import { useState, useEffect, useCallback, type FC, useMemo } from "react";
import { ISpecialist, IUser, PriceFilter, SortBy } from "@/types";
import { SpecialistApiService } from "@/api/specialist.api";
import { ApiError } from "@/api/apiClient";
import Pagination from "@/components/ul/Pagination";
import Loader from "@/components/ul/Loader";
import { useToast } from "@/lib/ToastContext";
import SpecialistCard from "@/components/SpecialistCard";
import Navbar from "@/components/Navbar";
import Breadcrumb from "@/components/Breadcrumb";
import FilterPills from "@/components/FilterPills";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { BREADCRUMB_ITEMS, ITEMS_PER_PAGE, PRICE_OPTIONS, SORT_OPTIONS } from "@/utils/constants";



// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function filterAndSort(
  list: readonly ISpecialist[],
  priceId: PriceFilter,
  sortId: SortBy,
  searchQuery: string
): ISpecialist[] {
  let result: ISpecialist[] = [...list];

  // Remove drafts
  result = result.filter(specialist => !specialist.is_draft);

  // Search by title, slug, description
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase();
    result = result.filter(specialist =>
      specialist.title.toLowerCase().includes(query) ||
      specialist.slug?.toLowerCase().includes(query) ||
      specialist.description?.toLowerCase().includes(query)
    );
  }

  // Price filter
  if (priceId !== "any") {
    const rule = PRICE_OPTIONS.find(o => o.id === priceId);
    if (rule && rule.id !== "any") {
      const min = 'min' in rule ? rule.min : undefined;
      const max = 'max' in rule ? rule.max : undefined;
      result = result.filter(specialist => {
        const price = parseFloat(specialist.final_price.toString());
        if (min !== undefined && max !== undefined) return price >= min && price <= max;
        if (min !== undefined) return price >= min;
        if (max !== undefined) return price <= max;
        return true;
      });
    }
  }

  // Sorting
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
    case "oldest":
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      break;
    case "recommended":
    default:
      // recommended = average_rating * log(total_number_of_ratings + 1)
      result.sort((a, b) => {
        const scoreA = (a.average_rating || 0) * Math.log((a.total_number_of_ratings || 0) + 1);
        const scoreB = (b.average_rating || 0) * Math.log((b.total_number_of_ratings || 0) + 1);
        return scoreB - scoreA;
      });
      break;
  }

  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT
// ─────────────────────────────────────────────────────────────────────────────

/*
✅ Summary: What comes from the DB

Main Table: specialists

id, title, description, final_price, is_draft, created_at, average_rating, total_number_of_ratings

Related Tables / Arrays:

service_offerings → serviceOfferingMaster.title

media → file_url, media_type (cover/avatar)

*/

const SpecialistsPage: FC = () => {
  const [search, setSearch] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("any");
  const [sortFilter, setSortFilter] = useState<SortBy>("newest");
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { error } = useToast();

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

  // console.log(specialists);


  // Filter and sort specialists
  const filteredSpecialists = useMemo(
    () => filterAndSort(specialists, priceFilter, sortFilter, search),
    [specialists, priceFilter, sortFilter, search]
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredSpecialists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredSpecialists.length);

  // Reset to first page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceFilter, sortFilter, search]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen" >
      {/* ════════════════════════════ NAVBAR ════════════════════════════ */}
      <Navbar
        search={search}
        onSearchChange={setSearch}
        user={user}
        isLoggedIn={isLoggedIn}
      />

      {/* ════════════════════════════ BODY ═════════════════════════════ */}
      <div className="container mx-auto px-4 sm:px-6 mt-14">
        {/* ── breadcrumb ── */}
        <Breadcrumb items={BREADCRUMB_ITEMS} />

        {/* ── page heading ── */}
        <PageHeader
          title="Register a New Company"
          subtitle="Get Your Company Registered with a Trusted Specialist"
        />

        {/* ── filter pills ── */}
        <FilterPills
          priceFilter={priceFilter}
          sortFilter={sortFilter}
          onPriceFilterChange={setPriceFilter}
          onSortFilterChange={setSortFilter}
          priceOptions={PRICE_OPTIONS}
          sortOptions={SORT_OPTIONS}
        />

        {/* ── results count ── */}
        {/* <ResultsCount
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredSpecialists.length}
        /> */}

        {/* ── responsive grid ── */}
        {isLoading ? (
          <Loader />
        ) : filteredSpecialists.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid pb-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredSpecialists.slice(startIndex, endIndex).map((specialist: ISpecialist) => (
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
    </div>
  );
};

export default SpecialistsPage;