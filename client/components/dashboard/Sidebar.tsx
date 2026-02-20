'use client';

import Image from "next/image";
import NavigationItem from "./NavigationItem";
import UserProfile from "./UserProfile";
import {
    X,
    HelpCircle,
    Settings,
    Wrench
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";

/**
 * ===============================
 * Navigation Configuration
 * ===============================
 * Moved outside component → not recreated every render.
 */

const MAIN_NAV_ITEMS = [
    { href: '/specialists', label: 'Specialist', icon: <Image src="/icons/tag.svg" height="50" width="50" alt="tag-logo" className="w-5 h-5" /> },
    { href: '/services', label: 'Services', icon: <Wrench className="w-5 h-5" /> },
    { href: '#', label: 'Clients', icon: <Image src="/icons/user.svg" height="50" width="50" alt="user-logo" className="w-5 h-5" /> },
    { href: '#', label: 'Service Orders', icon: <Image src="/icons/orders.svg" height="50" width="50" alt="orders-logo" className="w-5 h-5" /> },
    { href: '#', label: 'eSignature', icon: <Image src="/icons/signature.svg" height="50" width="50" alt="signature-logo" className="w-5 h-5" /> },
    { href: '#', label: 'Messages', icon: <Image src="/icons/message.svg" height="50" width="50" alt="message-logo" className="w-5 h-5" /> },
    { href: '#', label: 'Invoices & Receipts', icon: <Image src="/icons/invoice.svg" height="50" width="50" alt="invoice-logo" className="w-5 h-5" /> },
];

const FOOTER_NAV_ITEMS = [
    { href: '#', label: 'Help', icon: <HelpCircle className="w-5 h-5" /> },
    { href: '#', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

/**
 * ===============================
 * Sub Component → NavSection
 * ===============================
 * Reusable mapping logic.
 */
function NavSection({
    items,
    checkIsRouteActive,
    className = "",
}: {
    items: typeof MAIN_NAV_ITEMS;
    checkIsRouteActive: (href: string) => boolean;
    className?: string;
}) {
    // Check url
    const pathname = usePathname();

    const itemList = useMemo(() => {
        let list = [...items];
        if (pathname.includes('services')) {
            list = list.filter((i) => i.href !== '/specialists');
        } else if (pathname.includes("specialist")) {
            list = list.filter((i) => i.href !== '/services');
        }

        return list;
    }, [items, pathname]);
    return (
        <div className={className}>
            {itemList.map((item) => (
                <NavigationItem
                    key={item.label}
                    {...item}
                    isActive={checkIsRouteActive(item.href)}
                />
            ))}
        </div>
    );
}

function Sidebar({
    isOpen = false,
    onClose,
}: {
    isOpen?: boolean;
    onClose?: () => void;
}) {
    const pathname = usePathname();

    /**
     * Clear & predictable route matching.
     */
    const checkIsRouteActive = (href: string): boolean => {
        if (!href || href === '#') return false;
        if (pathname === href) return true;
        return pathname?.startsWith(`${href}/`) ?? false;
    };

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`
                            fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col
                            transition-transform duration-300 ease-in-out
                            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                            md:static md:translate-x-0 md:z-auto
                            `}
            >
                {/* Mobile header */}
                <div className="flex items-center justify-between md:hidden">
                    <UserProfile />
                    <button
                        onClick={onClose}
                        className="mr-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close sidebar"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Desktop profile */}
                <div className="hidden md:block pl-8 mt-6">
                    <UserProfile />
                </div>

                {/* Main navigation */}
                <nav className="mt-4">
                    <Link href="/specialists" className="text-gray-600 pl-8 " >Dashboard</Link>

                    <div className="nav-wrapper pl-8 mt-4">
                        <NavSection
                            items={MAIN_NAV_ITEMS}
                            checkIsRouteActive={checkIsRouteActive}

                        />
                    </div>
                </nav>

                {/* Bottom navigation */}
                <div className="pl-8 mt-32">
                    <NavSection
                        items={FOOTER_NAV_ITEMS}
                        checkIsRouteActive={checkIsRouteActive}
                    />
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
