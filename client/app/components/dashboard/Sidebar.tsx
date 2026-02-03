'use client';

import NavigationItem from "./NavigationItem";
import UserProfile from "./UserProfile";
import {
    X,
    LayoutDashboard,
    Briefcase,
    Users,
    FileText,
    PenSquare,
    MessageSquare,
    HelpCircle,
    Settings,
    InboxIcon,
    Wrench
} from "lucide-react";
import { usePathname } from "next/navigation";

function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    
    const navigationItems = [
        {
            href: '/dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            href: '/specialists',
            label: 'Specialist',
            icon: <Briefcase className="w-5 h-5" />,
        },
        {
            href: '/service-offerings',
            label: 'Services',
            icon: <Wrench className="w-5 h-5" />,
        },
        {
            href: '#',
            label: 'Clients',
            icon: <Users className="w-5 h-5" />,
        },
        {
            href: '#',
            label: 'Service Orders',
            icon: <FileText className="w-5 h-5" />,
        },
        {
            href: '#',
            label: 'eSignature',
            icon: <PenSquare className="w-5 h-5" />,
        },
        {
            href: '#',
            label: 'Messages',
            icon: <MessageSquare className="w-5 h-5" />,
        },
        {
            href: '#',
            label: 'Invoices & Receipts',
            icon: <InboxIcon className="w-5 h-5" />,
        },
    ];

    const bottomNavigationItems = [
        {
            href: '#',
            label: 'Help',
            icon: <HelpCircle className="w-5 h-5" />,
        },
        {
            href: '#',
            label: 'Settings',
            icon: <Settings className="w-5 h-5" />,
        },
    ];

    // Function to check if a navigation item is active
    const isItemActive = (href: string) => {
        if (href === '#') return false;
        
        // Exact match
        if (pathname === href) return true;
        
        // Handle sub-paths (e.g., /service-offerings/123 should still highlight Services)
        if (href !== '/' && pathname?.startsWith(`${href}/`)) return true;
        
        // Special case for root
        if (href === '/' && pathname === '/') return true;
        
        return false;
    };

    return (
        <>
            {/* Mobile backdrop — only rendered when drawer is open */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/*
              Sidebar element:
              • Mobile  – fixed drawer, slides in/out via translate-x, z-40 so it sits above content
              • Desktop – static column, always visible, translate reset
            */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:static md:translate-x-0 md:z-auto
                `}
            >
                {/* Close button – mobile only */}
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

                {/* Profile – desktop only (mobile version rendered above with close btn) */}
                <div className="hidden md:block">
                    <UserProfile />
                </div>

                <nav className="flex-1 p-4">
                    <div className="space-y-1">
                        {navigationItems.map((item) => (
                            <NavigationItem 
                                key={item.label} 
                                {...item} 
                                isActive={isItemActive(item.href)}
                            />
                        ))}
                    </div>
                </nav>

                <div className="p-4 border-t border-gray-200 space-y-1">
                    {bottomNavigationItems.map((item) => (
                        <NavigationItem 
                            key={item.label} 
                            {...item} 
                            isActive={isItemActive(item.href)}
                        />
                    ))}
                </div>
            </aside>
        </>
    );
}

export default Sidebar;