import { IStatusBadgeProps, PublishStatus } from "@/app/types";

// ==================== Constants ====================
const PUBLISH_STATUS_STYLES: Record<PublishStatus, string> = {
    'published': 'bg-green-500 text-white',
    'not_published': 'bg-red-500 text-white',
};

// Status Badge Component
function StatusBadge({ status, type = 'publish' }: IStatusBadgeProps & { type?: 'publish' }) {
    const styles = PUBLISH_STATUS_STYLES[status as PublishStatus];

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${styles}`}>
            {status.replace('_', ' ')}
        </span>
    );
}

export default StatusBadge;