import { MoreVertical, Calendar, DollarSign, Star } from 'lucide-react';
import { ApprovalStatus, ISpecialist, StatusValue } from '../types';
import { useMemo, type FC, type MouseEvent } from 'react';

// ==================== Types ====================
interface SpecialistRowProps {
  readonly specialist: ISpecialist;
  readonly isMenuOpen: boolean;
  readonly onToggleMenu: () => void;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onPublish: () => void;
}


interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

// ==================== Constants ====================
const STATUS_CONFIGS: Record<ApprovalStatus, StatusConfig> = {
  draft: {
    label: 'Draft',
    bgColor: 'bg-gray-300',
    textColor: 'text-gray-800',
  },
  approved: {
    label: 'Published',
    bgColor: 'bg-green-300',
    textColor: 'text-green-800',
  },
  pending: {
    label: 'Under Review',
    bgColor: 'bg-teal-300',
    textColor: 'text-teal-800',
  },
  rejected: {
    label: 'Rejected',
    bgColor: 'bg-red-300',
    textColor: 'text-red-800',
  }
} as const;

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
} as const;

// ==================== Utility Functions ====================
/**
 * Format date string to readable format
 * Time Complexity: O(1)
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
};



// ==================== Sub Components ====================

// Status Badge Component
interface StatusBadgeProps {
  readonly status: ApprovalStatus;
  readonly size?: 'sm' | 'md';
}



// Action Menu Component
interface ActionMenuProps {
  readonly isOpen: boolean;
  readonly isDraft: boolean;
  readonly onToggle: () => void;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onPublish: () => void;
  readonly size?: 'sm' | 'md';
}

const ActionMenu: FC<ActionMenuProps> = ({
  isOpen,
  isDraft,
  onToggle,
  onEdit,
  onDelete,
  onPublish,
  size = 'md',
}) => {
  const menuWidth = size === 'sm' ? 'w-40' : 'w-48';
  const buttonPadding = size === 'sm' ? 'px-3 py-2' : 'px-4 py-2';
  const iconPadding = size === 'sm' ? 'p-1' : 'p-2';

  const handleEdit = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onDelete();
  };

  const handlePublish = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onPublish();
  };

  const handleToggle = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`${iconPadding} hover:bg-gray-100 rounded-lg transition-colors`}
        aria-label="More options"
      >
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div
            className={`absolute right-0 ${size === 'sm' ? 'mt-1' : 'mt-2'} ${menuWidth} bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20`}
          >
            <button
              onClick={handleEdit}
              className={`w-full ${buttonPadding} text-left text-sm hover:bg-gray-50 transition-colors`}
            >
              Edit
            </button>
            {isDraft && (
              <button
                onClick={handlePublish}
                className={`w-full ${buttonPadding} text-left text-sm hover:bg-gray-50 transition-colors`}
              >
                Publish
              </button>
            )}
            <button
              onClick={handleDelete}
              className={`w-full ${buttonPadding} text-left text-sm hover:bg-gray-50 transition-colors`}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Price Display Component
interface PriceDisplayProps {
  readonly finalPrice: number;
  readonly basePrice: number;
  readonly platformFee: number;
  readonly showBreakdown?: boolean;
  readonly compact?: boolean;
}

const PriceDisplay: FC<PriceDisplayProps> = ({
  finalPrice,
  basePrice,
  platformFee,
  showBreakdown = false,
  compact = false,
}) => (
  <div className="flex flex-col">
    <div className={`flex items-center gap-1 ${compact ? 'text-sm font-semibold' : 'text-sm font-medium'} text-gray-900`}>
      {/* <DollarSign className="w-4 h-4 text-gray-400" /> */}
      <span>RM {finalPrice}</span>
    </div>
    {/* {showBreakdown && (
      <span className="text-xs text-gray-500 mt-1">
        Base: ${basePrice} + Fee: ${platformFee}
      </span>
    )} */}
  </div>
);

// Rating Display Component
interface RatingDisplayProps {
  readonly rating: number;
  readonly totalRatings: number;
  readonly size?: 'sm' | 'md';
}

const RatingDisplay: FC<RatingDisplayProps> = ({ rating, totalRatings, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-1">
      <Star className={`${iconSize} text-yellow-400 fill-yellow-400`} />
      <span className="text-sm font-medium text-gray-900">{rating}</span>
      <span className="text-xs text-gray-500">({totalRatings})</span>
    </div>
  );
};

// Date Display Component
interface DateDisplayProps {
  readonly date: string;
  readonly size?: 'sm' | 'md';
}

const DateDisplay: FC<DateDisplayProps> = ({ date, size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`flex items-center gap-2 ${textSize} text-gray-600`}>
      <Calendar className={`${iconSize} text-gray-400`} />
      {formatDate(date)}
    </div>
  );
};

// Title Display Component
interface TitleDisplayProps {
  readonly title: string;
  readonly className?: string;
}

const TitleDisplay: FC<TitleDisplayProps> = ({ title, className = '' }) => (
  <div className="flex flex-col">
    <span className={`text-sm font-medium text-gray-900 ${className}`}>{title}</span>
  </div>
);

// ==================== Main Components ====================



// Mobile Card Component
export const SpecialistMobileCard: FC<SpecialistRowProps> = ({
  specialist,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onPublish,
}) => {

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{specialist.title}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{specialist.description}</p>
        </div>
        <div className="ml-2">
          <ActionMenu
            isOpen={isMenuOpen}
            isDraft={specialist.is_draft}
            onToggle={onToggleMenu}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={onPublish}
            size="sm"
          />
        </div>
      </div>

      {/* Details Section */}
      <div className="space-y-2">
        {/* Date and Duration Row */}
        <div className="flex items-center justify-between text-xs">
          <DateDisplay date={specialist.created_at} size="sm" />
          <div className="flex items-center gap-1 text-gray-600">
            {specialist.duration_days} days
          </div>
        </div>

        {/* Price and Rating Row */}
        <div className="flex items-center justify-between">
          <PriceDisplay
            finalPrice={specialist.final_price}
            basePrice={specialist.base_price}
            platformFee={specialist.platform_fee}
            compact
          />
          <RatingDisplay
            rating={specialist.average_rating}
            totalRatings={specialist.total_number_of_ratings}
            size="sm"
          />
        </div>

        {/* Slug and Status Row */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">{specialist.slug}</span>
        </div>
      </div>
    </div>
  );
};


// Desktop Table Row Component
const SpecialistTableRow: FC<SpecialistRowProps> = ({
  specialist,
  isMenuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
  onPublish,
}) => {

  const approvalStatus = useMemo(() => {
    let bgColor = "bg-red-500/40 text-red-900";
  
    switch (specialist.verification_status) {
      case "approved":
        bgColor = "bg-green-500/40 text-green-900";
        break;
      case "draft":
      case "pending":
        bgColor = "bg-teal-500/40 text-teal-900";
        break;
      case "rejected":
        bgColor = "bg-red-500/40 text-red-900";
        break;
    }
  
    return (
      <p
        className={`${bgColor} w-[140px] px-3 py-1 rounded-lg text-center`}
      >
        {specialist.verification_status}
      </p>
    );
  }, [specialist.verification_status]);
  

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-2">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          aria-label={`Select ${specialist.title}`}
        />
      </td>
      <td className="px-6 py-2">
        <TitleDisplay title={specialist.title} />
      </td>
      <td className="px-6 py-2">
        <PriceDisplay
          finalPrice={specialist.final_price}
          basePrice={specialist.base_price}
          platformFee={specialist.platform_fee}
        />
      </td>
      <td className="px-6 py-2">
        {Math.floor(Math.random() * 51)}
      </td>
      <td className="px-6 py-2">

        {specialist.duration_days > 1 ? `${specialist.duration_days} days` : `${specialist.duration_days} day`}
      </td>
      <td className="px-6 py-2 capitalize text-center">

        {approvalStatus}
      </td>
      <td className="px-6 py-2 capitalize text-center">
        {/* <StatusBadge status={status} /> */}
        {specialist.is_draft ? (<p className='bg-red-500 text-white w-[140px] px-3 py-1 rounded-lg'>
          Not Published
        </p>) : (<p className='bg-green-500 text-white w-[140px] px-3 py-1 rounded-lg'>
          Published
        </p>)}
      </td>
      <td className="px-6 py-2">
        <ActionMenu
          isOpen={isMenuOpen}
          isDraft={specialist.is_draft}
          onToggle={onToggleMenu}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
        />
      </td>
    </tr>
  );
};


export default SpecialistTableRow;