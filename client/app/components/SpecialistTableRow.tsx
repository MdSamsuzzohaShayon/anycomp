import { MoreVertical, Calendar, DollarSign, Star } from 'lucide-react';
import { ISpecialist } from '../types';

interface SpecialistRowProps {
  specialist: ISpecialist;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => void;
}

// Desktop Table Row Component
export default function SpecialistTableRow({
  specialist,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onPublish,
}: SpecialistRowProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = () => {
    if (specialist.is_draft) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Draft
        </span>
      );
    }
    
    if (specialist.verification_status === 'approved' && specialist.is_verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Published
        </span>
      );
    }
    
    if (specialist.verification_status === 'pending') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Rejected
      </span>
    );
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          aria-label={`Select ${specialist.title}`}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{specialist.title}</span>
          <span className="text-xs text-gray-500 mt-1 line-clamp-2">
            {specialist.description}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            {specialist.duration_days} days • {specialist.slug}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          {formatDate(specialist.created_at)}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
            <DollarSign className="w-4 h-4 text-gray-400" />
            {specialist?.final_price && specialist.final_price}
          </div>
          <span className="text-xs text-gray-500 mt-1">
            Base: ${specialist.base_price} + Fee: ${specialist.platform_fee}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-medium text-gray-900">
            {specialist.average_rating}
          </span>
          <span className="text-xs text-gray-500">
            ({specialist.total_number_of_ratings})
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        {getStatusBadge()}
      </td>
      <td className="px-6 py-4 relative">
        <button
          onClick={onToggleMenu}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
        
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={onToggleMenu}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
              <button
                onClick={onEdit}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              {specialist.is_draft && (
                <button
                  onClick={onPublish}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  Publish
                </button>
              )}
              <button
                onClick={onDelete}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </td>
    </tr>
  );
}

// Mobile Card Component
export function SpecialistMobileCard({
  specialist,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onPublish,
}: SpecialistRowProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = () => {
    if (specialist.is_draft) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Draft
        </span>
      );
    }
    
    if (specialist.verification_status === 'approved' && specialist.is_verified) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Published
        </span>
      );
    }
    
    if (specialist.verification_status === 'pending') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        Rejected
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {specialist.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {specialist.description}
          </p>
        </div>
        <div className="relative ml-2">
          <button
            onClick={onToggleMenu}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={onToggleMenu}
              />
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <button
                  onClick={onEdit}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
                {specialist.is_draft && (
                  <button
                    onClick={onPublish}
                    className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-gray-50"
                  >
                    Publish
                  </button>
                )}
                <button
                  onClick={onDelete}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(specialist.created_at)}
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            {specialist.duration_days} days
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">
              ${specialist.final_price}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium text-gray-900">
              {specialist.average_rating}
            </span>
            <span className="text-xs text-gray-500">
              ({specialist.total_number_of_ratings})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{specialist.slug}</span>
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
}