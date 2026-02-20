import { MoreVertical } from "lucide-react";
import { IServiceOfferingMasterList } from "../types";
import { formatDate, mapDraftToPublish } from "../utils/helpers";
import StatusBadge from "./dashboard/StatusBadge";
import ActionMenu from "./dashboard/ActionMenu";

// ==================== Types ====================
interface ServiceOfferingMasterWithCount extends IServiceOfferingMasterList {
  service_offerings_count: number;
}

function ServiceTableRow({
  service,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onPublish,
}: {
  service: ServiceOfferingMasterWithCount;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => void;
}) {
  const isDraft = !service.s3_key;
  const publishStatus = mapDraftToPublish(service.s3_key);

  /* ── shared action-menu button + menu ── */
  const actionButton = (
    <div className="relative">
      <button
        onClick={onToggleMenu}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        aria-label="Open actions menu"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
      <ActionMenu
        isOpen={isMenuOpen}
        onEdit={onEdit}
        onDelete={onDelete}
        onPublish={isDraft ? onPublish : undefined}
        isDraft={isDraft}
      />
    </div>
  );

  /* ─────────────────────────────────────────────
     MOBILE  – card layout (rendered inside a <div> wrapper)
     The parent <tbody> won't actually contain this on mobile;
     the page switches the whole <table> off via md: classes.
     We export a second component MobileCard that the page
     uses directly inside a card-list container.
     ───────────────────────────────────────────── */

  /* ── DESKTOP row (unchanged) ── */
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          aria-label={`Select ${service.title}`}
        />
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{service.title}</div>
        <div className="text-xs text-gray-500 truncate max-w-xs">{service.description}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{formatDate(service.created_at)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">
          {service.service_offerings?.length || 0} offerings
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{service.bucket_name || 'N/A'}</div>
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={publishStatus} type="publish" />
      </td>
      <td className="px-6 py-4">
        {actionButton}
      </td>
    </tr>
  );
}

/* ─────────────────────────────────────────────────
   Mobile-only card – same props, card layout.
   Import & render this inside the mobile card-list.
   ───────────────────────────────────────────────── */
export function ServiceMobileCard({
  service,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onPublish,
}: {
  service: ServiceOfferingMasterWithCount;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => void;
}) {
  const isDraft = !service.s3_key;
  const publishStatus = mapDraftToPublish(service.s3_key);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header row: title + action menu */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-gray-900 truncate">{service.title}</div>
          <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{service.description}</div>
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={onToggleMenu}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Open actions menu"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>
          <ActionMenu
            isOpen={isMenuOpen}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={isDraft ? onPublish : undefined}
            isDraft={isDraft}
          />
        </div>
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Created</span>
          <div className="text-sm text-gray-700">{formatDate(service.created_at)}</div>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Offerings</span>
          <div className="text-sm text-gray-700">
            {service.service_offerings?.length || 0}
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Bucket</span>
          <div className="text-sm text-gray-700 truncate">{service.bucket_name || 'N/A'}</div>
        </div>

        <div>
          <span className="text-xs text-gray-400 uppercase tracking-wide">Status</span>
          <div className="mt-0.5">
            <StatusBadge status={publishStatus} type="publish" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceTableRow;