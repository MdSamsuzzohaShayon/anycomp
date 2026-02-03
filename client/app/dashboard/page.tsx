'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Download } from 'lucide-react';
import { 
  IServiceOfferingMasterList, 
  IServiceOffering 
} from '../types';
import PublishConfirmationModal from '../components/PublishConfirmationModal';
import { useToast } from '../hooks/useToast';
import { ServiceOfferingMasterApiService } from '../api/service-offering-master.api';
import { ApiError } from '../api/apiClient';
import { ServiceOfferingApiService } from '../api/service-offering.api';
import Loader from '../components/ul/Loader';
import { ToastContainer } from '../components/ul/Toast';
import CreateServiceMasterPanel from '../components/CreateServiceMasterPanel';
import EditServiceMasterPanel from '../components/EditServiceMasterPanel';
import Sidebar from '../components/dashboard/Sidebar';
import PageHeader from '../components/dashboard/PageHeader';
import ServiceTableRow, { ServiceMobileCard } from '../components/ServiceTableRow';
import Pagination from '../components/ul/Pagination';
import { useRouter } from 'next/navigation';



// ==================== Main Component ====================
export default function ServiceMasterPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [services, setServices] = useState<IServiceOfferingMasterList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [editingService, setEditingService] = useState<IServiceOfferingMasterList | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishingService, setPublishingService] = useState<IServiceOfferingMasterList | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceOfferings, setServiceOfferings] = useState<IServiceOffering[]>([]);
  const { toasts, success, error, removeToast } = useToast();
  
  const ITEMS_PER_PAGE = 10;

  // Fetch service offerings for the create/edit forms
  const fetchServiceOfferings = useCallback(async () => {
    try {
      const data = await ServiceOfferingApiService.getAll();
      setServiceOfferings(data);
    } catch (err) {
      console.error('Error fetching service offerings:', err);
    }
  }, []);

  // Fetch all service offering masters on mount
  const fetchServiceOfferingMaster = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await ServiceOfferingMasterApiService.getAll();
      setServices(data);
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to load services');
      console.error('Error fetching services:', err);
    } finally {
      setIsLoading(false);
    }
  }, [error]);

  useEffect(() => {
    fetchServiceOfferingMaster();
    fetchServiceOfferings();
  }, [fetchServiceOfferingMaster, fetchServiceOfferings]);

  // Calculate pagination based on filtered services
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);

  const handleToggleMenu = (serviceId: string) => {
    setOpenMenuId((prevId) => (prevId === serviceId ? null : serviceId));
  };

  const handleEdit = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setEditingService(service);
      setIsEditPanelOpen(true);
    }
    setOpenMenuId(null);
  };

  const handleDelete = async (serviceId: string) => {
    setOpenMenuId(null);
    
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await ServiceOfferingMasterApiService.delete(serviceId);
      success('Service deleted successfully');
      await fetchServiceOfferingMaster();
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to delete service');
      console.error('Error deleting service:', err);
    }
  };

  const handleCreateService = async (data: Omit<IServiceOfferingMasterList, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsCreating(true);
      await ServiceOfferingMasterApiService.create(data);
      success('Service created successfully!');
      setIsCreatePanelOpen(false);
      await fetchServiceOfferingMaster();
      setCurrentPage(1);
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to create service');
      console.error('Error creating service:', err);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditService = async (id: string, data: Partial<IServiceOfferingMasterList>) => {
    try {
      setIsEditing(true);
      await ServiceOfferingMasterApiService.update(id, data);
      success('Service updated successfully!');
      setIsEditPanelOpen(false);
      setEditingService(null);
      await fetchServiceOfferingMaster();
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to update service');
      console.error('Error updating service:', err);
      throw err;
    } finally {
      setIsEditing(false);
    }
  };

  const handlePublish = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setPublishingService(service);
      setIsPublishModalOpen(true);
    }
    setOpenMenuId(null);
  };

  const handleConfirmPublish = async () => {
    if (!publishingService) return;

    try {
      setIsPublishing(true);
      await ServiceOfferingMasterApiService.update(publishingService.id, { 
        s3_key: `published/${publishingService.id}.json`
      });
      success('Service published successfully!');
      setIsPublishModalOpen(false);
      setPublishingService(null);
      await fetchServiceOfferingMaster();
    } catch (err) {
      const apiError = err as ApiError;
      error(apiError.message || 'Failed to publish service');
      console.error('Error publishing service:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleExport = () => {
    console.log('Export services');
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
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">Service Offering Master</h2>
            <p className="text-sm text-gray-500">Create and manage your service offering master list</p>
          </div>

          {/* Services Table Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative">
            {/* Loading Overlay */}
            {isLoading && <Loader />}

            {/* Search and Action Buttons */}
            <div className="px-4 md:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200">
              <div className="relative w-full sm:flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Services"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                  aria-label="Search services"
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
                        aria-label="Select all services"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Service Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Service Offerings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Bucket Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Publish Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedServices.length === 0 && !isLoading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-gray-500 text-sm">No services found</p>
                          <button
                            onClick={() => setIsCreatePanelOpen(true)}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            Create your first service
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedServices.map((service) => (
                      <ServiceTableRow
                        key={service.id}
                        service={{
                          ...service,
                          service_offerings_count: service.service_offerings?.length || 0
                        }}
                        isMenuOpen={openMenuId === service.id}
                        onToggleMenu={() => handleToggleMenu(service.id)}
                        onEdit={() => handleEdit(service.id)}
                        onDelete={() => handleDelete(service.id)}
                        onPublish={() => handlePublish(service.id)}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* ────────────── MOBILE CARD LIST (< md) ────────────── */}
            <div className="md:hidden">
              {paginatedServices.length === 0 && !isLoading ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-gray-500 text-sm mb-2">No services found</p>
                  <button
                    onClick={() => setIsCreatePanelOpen(true)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Create your first service
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {paginatedServices.map((service) => (
                    <ServiceMobileCard
                      key={service.id}
                      service={{
                        ...service,
                        service_offerings_count: service.service_offerings?.length || 0
                      }}
                      isMenuOpen={openMenuId === service.id}
                      onToggleMenu={() => handleToggleMenu(service.id)}
                      onEdit={() => handleEdit(service.id)}
                      onDelete={() => handleDelete(service.id)}
                      onPublish={() => handlePublish(service.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {filteredServices.length > 0 && (
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>

      {/* Create Service Panel (Right Panel / full-screen mobile) */}
      <CreateServiceMasterPanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        onSubmit={handleCreateService}
        isSubmitting={isCreating}
        serviceOfferings={serviceOfferings}
      />

      {/* Edit Service Panel (Right Panel / full-screen mobile) */}
      <EditServiceMasterPanel
        isOpen={isEditPanelOpen}
        onClose={() => {
          setIsEditPanelOpen(false);
          setEditingService(null);
        }}
        onSubmit={handleEditService}
        isSubmitting={isEditing}
        service={editingService}
        serviceOfferings={serviceOfferings}
      />

      {/* Publish Confirmation Modal */}
      <PublishConfirmationModal
        isOpen={isPublishModalOpen}
        onClose={() => {
          setIsPublishModalOpen(false);
          setPublishingService(null);
        }}
        onConfirm={handleConfirmPublish}
        isPublishing={isPublishing}
        specialistTitle={publishingService?.title || ''}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}