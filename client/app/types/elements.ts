// ==================== Status Types ====================

export type ApprovalStatus =
    | "approved"
    | "draft"
    | "pending";

export type PublishStatus =
    | "published"
    | "not_published";

/**
 * Useful when you need to handle both in one component
 */
export type StatusType = "approval" | "publish";

export type StatusValue = ApprovalStatus | PublishStatus;



export interface INavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
}


export interface IStatusBadgeProps {
    status: StatusValue;
    type: StatusType;
}


export interface IActionMenuProps {
    isOpen: boolean;
    onEdit: () => void;
    onDelete: () => void;
}


export interface ITabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}



export interface IPriceOption {
    id: string;
    label: string;
    min?: number;
    max?: number;
}


export interface ISortOption<T = string> {
    id: string;
    label: string;
    value: T;
}

export type PriceFilter =
    | "any"
    | "low"
    | "medium"
    | "high";

export type DurationFilter =
    | "any"
    | "short"
    | "medium"
    | "long";

export type RatingFilter =
    | "any"
    | "4_plus"
    | "3_plus";

export type SortBy =
    | "newest"
    | "price_low_high"
    | "price_high_low"
    | "rating";



export interface IFilterState {
    price: PriceFilter;
    duration: DurationFilter;
    rating: RatingFilter;
    sortBy: SortBy;
}



export interface IFormFieldProps {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

export interface IButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
}
