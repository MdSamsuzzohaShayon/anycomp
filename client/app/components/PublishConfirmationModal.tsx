import { Loader2 } from 'lucide-react';

interface PublishConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isPublishing: boolean;
  specialistTitle: string;
}

export default function PublishConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isPublishing,
  specialistTitle,
}: PublishConfirmationModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={isPublishing ? undefined : onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fade-in">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Confirm Publish</h3>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to publish <span className="font-medium text-gray-900">&quot;{specialistTitle}&quot;</span>?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Once published, this service will be visible to all clients and companies.
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPublishing}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isPublishing}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPublishing ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}