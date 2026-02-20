'use client';

import { useState, useEffect, useCallback, useMemo, type ChangeEvent } from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { ISpecialist } from '@/types';
import { SpecialistApiService } from '@/api/specialist.api';
import { ApiError } from '@/api/apiClient';
import Loader from '@/components/ul/Loader';
import Sidebar from '@/components/dashboard/Sidebar';
import PageHeader from '@/components/dashboard/PageHeader';
import Pagination from '@/components/ul/Pagination';
import SpecialistTableRow from '@/components/SpecialistTableRow';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/ToastContext';
import Link from 'next/link';

type TTabFilter = 'All' | 'Drafts' | 'Published';

// Constants
const ITEMS_PER_PAGE = 10;
const TABLE_COLUMNS = [
  'Service',
  'Price',
  'Purchases',
  'Duration',
  'Approval Status',
  'Publish Status',
  'Action',
] as const;

// ==================== Helper Functions ====================
/**
 * Filter specialists based on tab and search query
 * Time Complexity: O(n) where n is number of specialists
 */
const filterSpecialists = (
  specialists: ISpecialist[],
  selectedTab: TTabFilter,
  searchQuery: string
): ISpecialist[] => {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return specialists.filter((specialist) => {
    // Tab filter
    if (selectedTab === 'Drafts' && !specialist.is_draft) return false;
    if (selectedTab === 'Published' && specialist.is_draft) return false;

    // Search filter
    if (!normalizedQuery) return true;

    const title = specialist.title.toLowerCase();
    const description = specialist.description?.toLowerCase() ?? '';

    return title.includes(normalizedQuery) || description.includes(normalizedQuery);
  });
};

/**
 * Calculate pagination data
 * Time Complexity: O(1)
 */
const getPaginationData = (
  filteredSpecialists: ISpecialist[],
  currentPage: number,
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(filteredSpecialists.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredSpecialists.slice(startIndex, endIndex);

  return { totalPages, paginatedItems };
};

// ==================== Sub Components ====================
interface TabButtonProps {
  label: TTabFilter;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-32 pb-2 text-sm font-medium transition-colors ${isActive
      ? 'border-b-3 border-[#002F70] text-[#002F70]'
      : 'text-gray-900 hover:text-gray-700'
      }`}
  >
    {label}
  </button>
);

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onChange(e.target.value);
  };

  return (
    <div className="relative w-full sm:flex-1 sm:max-w-xs bg-gray-100">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search Services"
        value={value}
        onChange={handleChange}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        aria-label="Search Services"
      />
    </div>
  );
};

interface ActionButtonsProps {
  onExportClick: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onExportClick }) => (
  <div className="flex gap-2 flex-shrink-0">
    <Link href="/services"
      className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#002F70] text-white rounded-sm hover:bg-blue-900 transition-colors text-sm font-medium"
    >
      <span className="plus-wrapper rounded-full border border-white w-4 h-4 flex justify-center items-center">
        <Plus className="w-4 h-4" />
      </span>
      <span>Create</span>
    </Link>
    <button
      onClick={onExportClick}
      className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#222222] text-white rounded-sm hover:bg-blue-900 transition-colors text-sm font-medium"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Export</span>
    </button>
  </div>
);

interface EmptyStateProps {
  onCreateClick: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateClick }) => (
  <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
    <p className="text-gray-500 text-sm">No specialists found</p>
    <button onClick={onCreateClick} className="text-blue-600 text-sm hover:underline">
      Create your first specialist
    </button>
  </div>
);

interface TableHeaderProps {
  columns: readonly string[];
}


const TableHeader: React.FC<TableHeaderProps> = ({ columns }) => (
  <thead>
    <tr className="border-b border-gray-200">
      <th className="w-12 px-6 py-3">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          aria-label="Select all specialists"
        />
      </th>
      {columns.map((column) => (
        <th
          key={column}
          className="px-6 py-3 text-left text-sm font-bold text-gray-500 uppercase"
        >
          {column}
        </th>
      ))}
    </tr>
  </thead>
);

// ==================== Main Component ====================
export default function SpecialistPageContainer() {
  const router = useRouter();
  const { success, error } = useToast();

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<TTabFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Data State
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Create Panel State
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState<boolean>(false);


  // Edit Panel State
  const [isEditPanelOpen, setIsEditPanelOpen] = useState<boolean>(false);




  // ==================== Data Fetching ====================
  const fetchSpecialists = useCallback(async (): Promise<void> => {
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

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Initial fetch
  useEffect(() => {
    fetchSpecialists();
  }, [fetchSpecialists]);

  // Reset to first page when search query or tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTab]);

  // ==================== Computed Values ====================
  // Memoized filtered specialists - O(n) time complexity
  const filteredSpecialists = useMemo(
    () => filterSpecialists(specialists, selectedTab, searchQuery),
    [specialists, selectedTab, searchQuery]
  );

  // Memoized pagination - O(1) time complexity
  const { totalPages, paginatedItems: paginatedSpecialists } = useMemo(
    () => getPaginationData(filteredSpecialists, currentPage, ITEMS_PER_PAGE),
    [filteredSpecialists, currentPage]
  );

  // Check if any panel is open
  const isPanelOpen = isCreatePanelOpen || isEditPanelOpen;

  // Check if list is empty
  const isEmpty = paginatedSpecialists.length === 0 && !isLoading;

  // ==================== Event Handlers ====================
  const handleToggleMenu = useCallback((specialistId: string): void => {
    setOpenMenuId((prevId) => (prevId === specialistId ? null : specialistId));
  }, []);

  const handleEdit = useCallback(
    (specialistId: string): void => {
      const specialist = specialists.find((s) => s.id === specialistId);
      if (specialist) {
        setIsEditPanelOpen(true);
      }
      setOpenMenuId(null);
    },
    [specialists]
  );

  const handleDelete = useCallback(
    async (specialistId: string): Promise<void> => {
      setOpenMenuId(null);

      if (!confirm('Are you sure you want to delete this specialist?')) {
        return;
      }

      try {
        await SpecialistApiService.delete(specialistId);
        success('Specialist deleted successfully');
        await fetchSpecialists();
      } catch (err) {
        const apiError = err as ApiError;
        error(apiError.message || 'Failed to delete specialist');
        console.error('Error deleting specialist:', err);
      }
    },
    [error, fetchSpecialists, success]
  );

  const handlePublish = useCallback(
    (specialistId: string): void => {
      const specialist = specialists.find((s) => s.id === specialistId);
      if (specialist) {

      }
      setOpenMenuId(null);
    },
    [specialists]
  );







  const handleExport = useCallback((): void => {
    console.log('Export specialists');
    error('Export functionality coming soon!');
  }, [error]);

  const handlePageChange = useCallback((page: number): void => {
    setCurrentPage(page);
  }, []);

  const handleTabChange = useCallback((tab: TTabFilter): void => {
    setSelectedTab(tab);
  }, []);

  const handleSidebarToggle = useCallback((): void => {
    setSidebarOpen(true);
  }, []);

  const handleSidebarClose = useCallback((): void => {
    setSidebarOpen(false);
  }, []);

  const handleCreatePanelOpen = useCallback((): void => {
    setIsCreatePanelOpen(true);
  }, []);



  const handleBackdropClick = useCallback((): void => {
    if (isCreatePanelOpen) setIsCreatePanelOpen(false);
    if (isEditPanelOpen) setIsEditPanelOpen(false);
  }, [isCreatePanelOpen, isEditPanelOpen]);

  // ==================== Render ====================
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />

      <main className="flex-1 overflow-auto relative min-w-0">
        {/* Panel backdrop */}
        {isPanelOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            onClick={handleBackdropClick}
          />
        )}

        {/* Page Header */}
        <div className="header-wrapper p-4">
          <PageHeader onMenuClick={handleSidebarToggle} />
        </div>

        {/* Page Title */}
        <div className="p-4">
          <div className="text-sm text-gray-500 mb-0.5 md:mb-1">Dashboard</div>
          <h1 className="text-lg md:text-2xl font-bold">Services</h1>
        </div>



        {/* Main Content */}
        <div className="p-4 rounded-lg">
          <div className="bg-white">
            {/* Section Header */}
            <div className="p-4">
              <h2 className="font-[Red_Hat_Display] text-xl md:text-4xl font-bold text-gray-900 mb-3">Specialists</h2>
              <p className="text-sm text-gray-500 font-semibold">
                Create and publish your services for Client's & Companies
              </p>
            </div>

            {/* Tabs */}
            <nav className="tabs flex border-b border-gray-300/50 items-center mt-2 gap-x-4">
              <TabButton
                label="All"
                isActive={selectedTab === 'All'}
                onClick={() => handleTabChange('All')}
              />
              <TabButton
                label="Drafts"
                isActive={selectedTab === 'Drafts'}
                onClick={() => handleTabChange('Drafts')}
              />
              <TabButton
                label="Published"
                isActive={selectedTab === 'Published'}
                onClick={() => handleTabChange('Published')}
              />
            </nav>

            {/* Specialists Table Section */}
            <div className="relative">
              {/* Loading Overlay */}
              {isLoading && <Loader />}

              {/* Search and Action Buttons */}
              <div className=" p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <SearchBar value={searchQuery} onChange={setSearchQuery} />
                <ActionButtons
                  onExportClick={handleExport}
                />
              </div>


              <div className="block overflow-x-auto">
                <table className="w-full">
                  <TableHeader columns={TABLE_COLUMNS} />
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isEmpty ? (
                      <tr>
                        <td colSpan={7}>
                          <EmptyState onCreateClick={handleCreatePanelOpen} />
                        </td>
                      </tr>
                    ) : (
                      paginatedSpecialists.map((specialist) => (
                        <SpecialistTableRow
                          key={specialist.id}
                          specialist={specialist}
                          isMenuOpen={openMenuId === specialist.id}
                          onToggleMenu={() => handleToggleMenu(specialist.id)}
                          onEdit={() => handleEdit(specialist.id)}
                          onDelete={() => handleDelete(specialist.id)}
                          onPublish={() => handlePublish(specialist.id)}
                        />
                      ))
                    )}
                  </tbody>
                </table>
              </div>



              {/* Pagination */}
              {filteredSpecialists.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </main>


    </div>
  );
}