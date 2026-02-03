import { useEffect, useState } from "react";
import { IServiceOffering, IServiceOfferingMasterList } from "../types";
import { X } from "lucide-react";

// Edit Service Master Panel Component (Right Panel)
function EditServiceMasterPanel({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting,
  service,
  serviceOfferings 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<IServiceOfferingMasterList>) => Promise<void>;
  isSubmitting: boolean;
  service: IServiceOfferingMasterList | null;
  serviceOfferings: IServiceOffering[];
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bucket_name: 'services',
    s3_key: '',
    service_offerings: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        bucket_name: service.bucket_name || 'services',
        s3_key: service.s3_key || '',
        service_offerings: service.service_offerings?.map(so => so.id) || [],
      });
    }
  }, [service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!service) return;
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onSubmit(service.id, {
        ...formData,
        service_offerings: formData.service_offerings
      } as unknown as Partial<IServiceOfferingMasterList>);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleServiceOfferingChange = (serviceOfferingId: string) => {
    setFormData(prev => ({
      ...prev,
      service_offerings: prev.service_offerings.includes(serviceOfferingId)
        ? prev.service_offerings.filter(id => id !== serviceOfferingId)
        : [...prev.service_offerings, serviceOfferingId]
    }));
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl border-l border-gray-200 flex flex-col z-50">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Edit Service Master</h2>
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={isSubmitting}
          type="button"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., Legal Consultation Service"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, description: e.target.value }));
                  if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                }}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your service master in detail..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bucket Name
              </label>
              <input
                type="text"
                value={formData.bucket_name}
                onChange={(e) => setFormData(prev => ({ ...prev, bucket_name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="services"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                S3 Key (Optional)
              </label>
              <input
                type="text"
                value={formData.s3_key}
                onChange={(e) => setFormData(prev => ({ ...prev, s3_key: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="path/to/service.json"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Offerings
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 bg-white">
                {serviceOfferings.length === 0 ? (
                  <p className="text-sm text-gray-500">No service offerings available</p>
                ) : (
                  serviceOfferings.map((offering) => (
                    <div key={offering.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edit-offering-${offering.id}`}
                        checked={formData.service_offerings.includes(offering.id)}
                        onChange={() => handleServiceOfferingChange(offering.id)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        disabled={isSubmitting}
                      />
                      <label
                        htmlFor={`edit-offering-${offering.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        Service Offering ID: {offering.id.substring(0, 8)}...
                      </label>
                    </div>
                  ))
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.service_offerings.length} service offerings selected
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Service Master'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditServiceMasterPanel;