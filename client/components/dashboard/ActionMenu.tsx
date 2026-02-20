import { IActionMenuProps } from "@/types";
import { Edit2, Trash2 } from "lucide-react";

// Action Menu Component
// Action Menu Component
function ActionMenu({ isOpen, onEdit, onDelete, onPublish, isDraft = false }: IActionMenuProps & { onPublish?: () => void; isDraft?: boolean }) {
    if (!isOpen) return null;
  
    return (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
        <button
          onClick={onEdit}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        {isDraft && onPublish && (
          <button
            onClick={onPublish}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Publish
          </button>
        )}
        <button
          onClick={onDelete}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    );
  }
  

export default ActionMenu;