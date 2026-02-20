'use client';

import { useEffect, useState } from 'react';
import { Menu, MessageSquare, Bell, LogOut } from 'lucide-react';
import { IUser } from '@/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function PageHeader({ onMenuClick }: { onMenuClick?: () => void }) {
    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        // Check for user in localStorage on component mount
        const getUserFromStorage = () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        };

        getUserFromStorage();

        // Listen for storage changes
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'user') {
                if (e.newValue) {
                    try {
                        setUser(JSON.parse(e.newValue));
                    } catch (error) {
                        console.error('Error parsing user data from storage event:', error);
                    }
                } else {
                    setUser(null);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Cleanup
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Get initials from email
    const getInitials = (email: string) => {
        if (!email) return 'U';

        const username = email.split('@')[0];
        const firstTwo = username.substring(0, 2).toUpperCase();

        if (firstTwo.match(/[A-Z]/i)) {
            return firstTwo;
        }

        return username.charAt(0).toUpperCase() || 'U';
    };

    // Handle logout
    const handleLogout = () => {
        // Remove user and token from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Clear state
        setUser(null);

        // Dispatch storage event to update other components
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'user',
            newValue: null
        }));


        // Optional: Show success message
        router.push('/login');
    };

    return (
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-0">
                {/* Hamburger – mobile only */}
                <button
                    onClick={onMenuClick}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="flex items-center gap-x-2">
                <button className="hover:bg-gray-100 rounded-lg transition-colors" aria-label="Messages">
                    {/* <MessageSquare className="w-5 h-5 text-gray-600" /> */}
                    <Image height={50} width={50} alt='message-logo' src="/icons/message.svg" className="w-4 h-4" />
                </button>
                <button className="hover:bg-gray-100 rounded-lg transition-colors" aria-label="Notifications">
                    <Image height={50} width={50} alt='notification-logo' src="/icons/notification.svg" className="w-4 h-4" />
                </button>

                {/* User profile with logout dropdown */}
                {user ? (
                    <div className="relative group">
                        {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                            {getInitials(user.email)}
                        </div> */}

                        <Image height={100} width={100} alt='man-logo' src="/man.jpeg" className="w-8 h-8 rounded-full object-center object-cover" />

                        {/* Logout dropdown */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <div className="text-sm font-medium text-gray-900 truncate">{user.email}</div>
                                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        U
                    </div>
                )}
            </div>
        </header>
    );
}

export default PageHeader;