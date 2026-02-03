'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { 
  ISpecialist 
} from '../types';
import PublishConfirmationModal from '../components/PublishConfirmationModal';
import { useToast } from '../hooks/useToast';
import { SpecialistApiService } from '../api/specialist.api';
import { ApiError } from '../api/apiClient';
import Loader from '../components/ul/Loader';
import { ToastContainer } from '../components/ul/Toast';
import CreateSpecialistPanel from '../components/CreateSpecialistPanel';
import EditSpecialistPanel from '../components/EditSpecialistPanel';
import Sidebar from '../components/dashboard/Sidebar';
import PageHeader from '../components/dashboard/PageHeader';
import Pagination from '../components/ul/Pagination';
import SpecialistTableRow, { SpecialistMobileCard } from '../components/SpecialistTableRow';
import { useRouter } from 'next/navigation';



// ==================== Main Component ====================
export default function SpecialistPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [specialists, setSpecialists] = useState<ISpecialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<ISpecialist | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishingSpecialist, setPublishingSpecialist] = useState<ISpecialist | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { toasts, success, error, removeToast } = useToast();
  
  const ITEMS_PER_PAGE = 10;

  // Fetch all specialists on mount
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

  // Calculate pagination based on filtered specialists
  const filteredSpecialists = specialists.filter(specialist =>
    specialist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    specialist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSpecialists.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSpecialists = filteredSpecialists.slice(startIndex, endIndex);

  const handleToggleMenu = (specialistId: string) => {
    setOpenMenuId((prevId) => (prevId === specialistId ? null : specialistId));
  };

  const handleEdit = (specialistId: string) => {
    const specialist = specialists.find(s => s.id === specialistId);
    if (specialist) {
      setEditingSpecialist(specialist);
      setIsEditPanelOpen(true);
    }
    setOpenMenuId(null);
  };

  const handleDelete = async (specialistId: string) => {
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
  };

  const handleCreateSpecialist = async (data: Omit<ISpecialist, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsCreating(true);
      await SpecialistApiService.create(data);
      success('Specialist created successfully!');
      setIsCreatePanelOpen(false);
      await fetchSpecialists();
      setCurrentPage(1);
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to create specialist');
      console.error('Error creating specialist:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditSpecialist = async (id: string, data: Partial<ISpecialist>) => {
    try {
      setIsEditing(true);
      await SpecialistApiService.update(id, data);
      success('Specialist updated successfully!');
      setIsEditPanelOpen(false);
      setEditingSpecialist(null);
      await fetchSpecialists();
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to update specialist');
      console.error('Error updating specialist:', err);
      throw err;
    } finally {
      setIsEditing(false);
    }
  };

  const handlePublish = (specialistId: string) => {
    const specialist = specialists.find(s => s.id === specialistId);
    if (specialist) {
      setPublishingSpecialist(specialist);
      setIsPublishModalOpen(true);
    }
    setOpenMenuId(null);
  };

  const handleConfirmPublish = async () => {
    if (!publishingSpecialist) return;

    try {
      setIsPublishing(true);
      await SpecialistApiService.update(publishingSpecialist.id, { 
        is_draft: false,
        verification_status: 'approved'
      });
      success('Specialist published successfully!');
      setIsPublishModalOpen(false);
      setPublishingSpecialist(null);
      await fetchSpecialists();
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to publish specialist');
      console.error('Error publishing specialist:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExport = () => {
    console.log('Export specialists');
    error('Export functionality coming soon!');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
        router.push('/login');
    }
  }, []);

  // Panel overlay backdrop
  const isPanelOpen = isCreatePanelOpen || isEditPanelOpen;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar – receives open/close control for mobile drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto relative min-w-0">
        {/* Panel backdrop – opacity 60 as requested */}
        {isPanelOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            onClick={() => {
              if (isCreatePanelOpen) setIsCreatePanelOpen(false);
              if (isEditPanelOpen) setIsEditPanelOpen(false);
            }}
          />
        )}
        
        {/* PageHeader – passes hamburger callback */}
        <PageHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 md:p-8">
          {/* Page Title Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Specialists</h2>
            <p className="text-sm text-gray-500">Create and manage your specialist listings</p>
          </div>

          {/* Specialists Table Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative">
            {/* Loading Overlay */}
            {isLoading && <Loader />}

            {/* Search and Action Buttons */}
            <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200">
              <div className="relative w-full sm:flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Specialists"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  aria-label="Search specialists"
                />
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsCreatePanelOpen(true)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* ────────────── DESKTOP TABLE (md+) ────────────── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-12 px-6 py-3">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        aria-label="Select all specialists"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Specialist Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedSpecialists.length === 0 && !isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-gray-500 text-sm">No specialists found</p>
                          <button
                            onClick={() => setIsCreatePanelOpen(true)}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Create your first specialist
                          </button>
                        </div>
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

            {/* ────────────── MOBILE CARD LIST (< md) ────────────── */}
            <div className="md:hidden">
              {paginatedSpecialists.length === 0 && !isLoading ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-gray-500 text-sm mb-2">No specialists found</p>
                  <button
                    onClick={() => setIsCreatePanelOpen(true)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Create your first specialist
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {paginatedSpecialists.map((specialist) => (
                    <SpecialistMobileCard
                      key={specialist.id}
                      specialist={specialist}
                      isMenuOpen={openMenuId === specialist.id}
                      onToggleMenu={() => handleToggleMenu(specialist.id)}
                      onEdit={() => handleEdit(specialist.id)}
                      onDelete={() => handleDelete(specialist.id)}
                      onPublish={() => handlePublish(specialist.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {filteredSpecialists.length > 0 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>

      {/* Create Specialist Panel (Right Panel / full-screen mobile) */}
      <CreateSpecialistPanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onSubmit={handleCreateSpecialist}
        isSubmitting={isCreating}
      />

      {/* Edit Specialist Panel (Right Panel / full-screen mobile) */}
      <EditSpecialistPanel
        isOpen={isEditPanelOpen}
        onClose={() => {
          setIsEditPanelOpen(false);
          setEditingSpecialist(null);
        }}
        onSubmit={handleEditSpecialist}
        isSubmitting={isEditing}
        specialist={editingSpecialist}
      />

      {/* Publish Confirmation Modal */}
      <PublishConfirmationModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setPublishingSpecialist(null);
        }}
        onConfirm={handleConfirmPublish}
        isPublishing={isPublishing}
        specialistTitle={publishingSpecialist?.title || ''}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}