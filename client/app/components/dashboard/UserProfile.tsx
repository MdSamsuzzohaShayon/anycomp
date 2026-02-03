'use client';

import { IUser } from '@/app/types';
import { useEffect, useState } from 'react';

function UserProfile() {
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

    // Listen for storage changes (in case user logs in/out in another tab)
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
    
    // Extract the part before @ and get first letter
    const username = email.split('@')[0];
    
    // Get first two characters of the username
    const firstTwo = username.substring(0, 2).toUpperCase();
    
    // If first character is a letter, use it and next character
    if (firstTwo.match(/[A-Z]/i)) {
      return firstTwo;
    }
    
    // If no letters, use first character or fallback
    return username.charAt(0).toUpperCase() || 'U';
  };

  // Format email to display name (extract part before @)
  const getDisplayName = (email: string) => {
    if (!email) return 'User';
    
    const username = email.split('@')[0];
    
    // Capitalize first letter of each word if there are dots
    if (username.includes('.')) {
      return username
        .split('.')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    
    // Capitalize first letter
    return username.charAt(0).toUpperCase() + username.slice(1);
  };

  // Format user role to company name
  const getCompanyName = (role: string) => {
    if (!role) return 'User Account';
    
    const roleMap: Record<string, string> = {
      'admin': 'Administrator Account',
      'user': 'User Account',
      'client': 'Client Account',
      'specialist': 'Specialist Account',
      'manager': 'Manager Account'
    };
    
    return roleMap[role] || `${role.charAt(0).toUpperCase() + role.slice(1)} Account`;
  };

  // If no user, show default placeholder (same design)
  if (!user) {
    return (
      <div className="p-6 border-b border-gray-200">
        <div className="text-sm font-semibold text-gray-900 mb-3">Profile</div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            GL
          </div>
          <div>
            <div className="font-medium text-gray-900 text-sm">Gwen Lam</div>
            <div className="text-xs text-gray-500">17 Ceres Holdings Sdn Bhd</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="text-sm font-semibold text-gray-900 mb-3">Profile</div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
          {getInitials(user.email)}
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">
            {getDisplayName(user.email)}
          </div>
          <div className="text-xs text-gray-500">
            {getCompanyName(user.role)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;