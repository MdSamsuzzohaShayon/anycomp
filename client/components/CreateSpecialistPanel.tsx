import { useState } from "react";
import { ApprovalStatus, ISpecialist } from "../types";
import { X } from "lucide-react";

// Create Specialist Panel Component (Right Panel)
function CreateSpecialistPanel({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting
}: { 
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ISpecialist, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    base_price: 0,
    platform_fee: 0,
    final_price: 0,
    average_rating: 0,
    total_number_of_ratings: 0,
    duration_days: 0,
    verification_status: 'pending' as ApprovalStatus,
    is_verified: false,
    is_draft: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.base_price <= 0) {
      newErrors.base_price = 'Base price must be greater than 0';
    }

    if (formData.duration_days <= 0) {
      newErrors.duration_days = 'Duration must be greater than 0';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await onSubmit(formData as unknown as Omit<ISpecialist, 'id' | 'created_at' | 'updated_at'>);
      resetForm();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      base_price: 0,
      platform_fee: 0,
      final_price: 0,
      average_rating: 0,
      total_number_of_ratings: 0,
      duration_days: 0,
      verification_status: 'pending',
      is_verified: false,
      is_draft: true,
    });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const calculateFinalPrice = (basePrice: number, platformFee: number) => {
    return basePrice + platformFee;
  };

  const handleBasePriceChange = (value: number) => {
    const finalPrice = calculateFinalPrice(value, formData.platform_fee);
    setFormData(prev => ({ ...prev, base_price: value, final_price: finalPrice }));
    if (errors.base_price) setErrors(prev => ({ ...prev, base_price: '' }));
  };

  const handlePlatformFeeChange = (value: number) => {
    const finalPrice = calculateFinalPrice(formData.base_price, value);
    setFormData(prev => ({ ...prev, platform_fee: value, final_price: finalPrice }));
  };

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-y-0 right-0 z-50 bg-white shadow-xl border-l border-gray-200 flex flex-col
        w-full md:w-96
      `}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Create New Specialist</h2>
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
                Title *
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
                placeholder="e.g., Full Stack Web Developer"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, slug: e.target.value }));
                  if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="e.g., full-stack-web-developer"
                disabled={isSubmitting}
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
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
                placeholder="Describe the specialist profile in detail..."
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => handleBasePriceChange(parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                  errors.base_price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="1750.50"
                disabled={isSubmitting}
              />
              {errors.base_price && (
                <p className="mt-1 text-sm text-red-600">{errors.base_price}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Fee ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.platform_fee}
                onChange={(e) => handlePlatformFeeChange(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                placeholder="131.29"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Price ($)
              </label>
              <input
                type="number"
                value={formData.final_price.toFixed(2)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-900"
                disabled
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">
                Calculated automatically (Base Price + Platform Fee)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.duration_days}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, duration_days: parseInt(e.target.value) || 0 }));
                  if (errors.duration_days) setErrors(prev => ({ ...prev, duration_days: '' }));
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                  errors.duration_days ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="21"
                disabled={isSubmitting}
              />
              {errors.duration_days && (
                <p className="mt-1 text-sm text-red-600">{errors.duration_days}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Status
              </label>
              <select
                value={formData.verification_status}
                onChange={(e) => setFormData(prev => ({ ...prev, verification_status: e.target.value as ApprovalStatus }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                disabled={isSubmitting}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_verified"
                checked={formData.is_verified}
                onChange={(e) => setFormData(prev => ({ ...prev, is_verified: e.target.checked }))}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <label htmlFor="is_verified" className="ml-2 text-sm text-gray-700">
                Is Verified
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_draft"
                checked={formData.is_draft}
                onChange={(e) => setFormData(prev => ({ ...prev, is_draft: e.target.checked }))}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                disabled={isSubmitting}
              />
              <label htmlFor="is_draft" className="ml-2 text-sm text-gray-700">
                Save as Draft
              </label>
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
            {isSubmitting ? 'Creating...' : 'Create Specialist'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSpecialistPanel;