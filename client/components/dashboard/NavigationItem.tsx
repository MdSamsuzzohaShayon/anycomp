import { INavItemProps } from "@/types";
import Link from "next/link";

// Navigation Item Component
function NavigationItem({ href, icon, label, isActive = false }: INavItemProps) {
    const baseClasses = 'flex items-center gap-3 pr-4 pl-2 py-2 rounded-sm transition-colors text-lg font-medium';
    const activeClasses = isActive
        ? 'bg-[#002F70] text-white'
        : 'text-gray-600 hover:bg-gray-50';

    return (
        <Link href={String(href)} className={`${baseClasses} ${activeClasses}`}>
            {icon}
            <span>{label}</span>
        </Link>
    );
}

export default NavigationItem;
