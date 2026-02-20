'use client';

import { IUser } from '@/types';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

// Subcomponent for User Avatar
interface UserAvatarProps {
  readonly user: IUser | null;
  readonly fallbackSrc?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, fallbackSrc = "/man.jpeg" }) => {
  return (
    <Image 
      src={fallbackSrc} 
      height={100} 
      width={100} 
      alt={user ? `Profile of ${user.email}` : "Default user"} 
      className='w-10 h-10 object-cover object-center rounded-full' 
      priority={false}
      loading="lazy"
    />
  );
};

// Subcomponent for User Info Display
interface UserInfoDisplayProps {
  readonly displayName: string;
  readonly companyName: string;
}

const UserInfoDisplay: React.FC<UserInfoDisplayProps> = ({ displayName, companyName }) => {
  return (
    <div>
      <div className="font-medium text-sm">
        {displayName}
      </div>
      <div className="text-xs text-[#002F70]">
        {companyName}
      </div>
    </div>
  );
};

// Utility functions (memoized to prevent recreation)
const formatEmailToDisplayName = (email: string): string => {
  if (!email) return 'User';
  
  const username = email.split('@')[0];
  
  if (username.includes('.')) {
    return username
      .split('.')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  return username.charAt(0).toUpperCase() + username.slice(1);
};

const formatRoleToCompanyName = (role: string): string => {
  if (!role) return 'User Account';
  
  const roleToCompanyMap: Readonly<Record<string, string>> = {
    'admin': 'Administrator Account',
    'user': 'User Account',
    'client': 'Client Account',
    'specialist': 'Specialist Account',
    'manager': 'Manager Account'
  };
  
  return roleToCompanyMap[role] || `${role.charAt(0).toUpperCase() + role.slice(1)} Account`;
};

// Main component
const UserProfile: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  
  // Parse user data from localStorage
  const parseUserFromLocalStorage = useCallback((): IUser | null => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }, []);
  
  // Handle storage events
  const handleStorageChange = useCallback((event: StorageEvent) => {
    if (event.key === 'user') {
      if (event.newValue) {
        try {
          setUser(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Error parsing user data from storage event:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }
  }, []);
  
  // Load user data on component mount
  useEffect(() => {
    const userData = parseUserFromLocalStorage();
    setUser(userData);
    
    // Add storage event listener
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [parseUserFromLocalStorage, handleStorageChange]);
  
  // Default user info for fallback state
  const defaultUserInfo = {
    displayName: 'Gwen Lam',
    companyName: '17 Ceres Holdings Sdn Bhd'
  };
  
  // Current user info (based on actual user or default)
  const currentDisplayName = user 
    ? formatEmailToDisplayName(user.email) 
    : defaultUserInfo.displayName;
  
  const currentCompanyName = user 
    ? formatRoleToCompanyName(user.role) 
    : defaultUserInfo.companyName;
  
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="text-lg font-semibold mb-3 font-bold leading-none">Profile</div>
      <div className="flex items-center gap-3 mt-6">
        <UserAvatar user={user} />
        <UserInfoDisplay 
          displayName={currentDisplayName}
          companyName={currentCompanyName}
        />
      </div>
    </div>
  );
};

export default UserProfile;