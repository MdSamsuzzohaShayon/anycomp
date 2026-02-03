import { INavItemProps } from "@/app/types";
import Link from "next/link";

// Navigation Item Component
function NavigationItem({ href, icon, label, isActive = false }: INavItemProps) {
    const baseClasses = 'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium';
    const activeClasses = isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-50';

    return (
        <Link href={href} className={`${baseClasses} ${activeClasses}`}>
            {icon}
            <span>{label}</span>
        </Link>
    );
}

export default NavigationItem;
