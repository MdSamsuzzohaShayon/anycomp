'use client'

import { useState, type FC, useRef, useEffect } from "react";
import { Search, ChevronDown, Bell, Mail, User, Menu, X, LogOut } from "lucide-react";
import { IUser } from "../types";
import Link from "next/link";
import Image from "next/image";

interface NavbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  user: IUser | null;
  isLoggedIn: boolean;
  onLogout?: () => void;
}

// Subcomponent for Desktop Navigation Links
const DesktopNavigation: FC = () => (
  <nav className="hidden lg:flex items-center gap-5">
    <Link href="/" className="font-['Proxima_Nova'] font-semibold text-sm leading-none tracking-normal hover:text-gray-600 transition-colors">
      Register a company
    </Link>
    <Link href="/" className="font-['Proxima_Nova'] font-semibold text-sm leading-none tracking-normal hover:text-gray-600 transition-colors">
      Appoint a Company Secretary
    </Link>
    <Link href="/" className="font-['Proxima_Nova'] font-semibold text-sm leading-none tracking-normal inline-flex items-center gap-1 hover:text-gray-600 transition-colors">
      Company Secretarial Services
      <ChevronDown size={12} className="text-gray-500" />
    </Link>
    <Link href="/" className="font-['Proxima_Nova'] font-semibold text-sm leading-none tracking-normal hover:text-gray-600 transition-colors">
      How Anycomp Works
    </Link>
  </nav>
);

// Subcomponent for Mobile Navigation Menu
interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  user: IUser | null;
  onLogout?: () => void;
}

const MobileNavigation: FC<MobileNavigationProps> = ({ 
  isOpen, 
  onClose, 
  isLoggedIn, 
  user, 
  onLogout 
}) => {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-x-0 top-[73px] z-40 bg-white border-t border-gray-200 shadow-lg animate-slideDown">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        {/* Mobile navigation links */}
        <nav className="flex flex-col gap-3 mb-4">
          <Link 
            href="/" 
            className="text-black font-['Proxima_Nova'] font-semibold text-sm py-2 hover:text-blue-600 transition-colors"
            onClick={onClose}
          >
            Register a company
          </Link>
          <Link 
            href="/" 
            className="text-black font-['Proxima_Nova'] font-semibold text-sm py-2 hover:text-blue-600 transition-colors"
            onClick={onClose}
          >
            Appoint a Company Secretary
          </Link>
          <Link 
            href="/" 
            className="text-black font-['Proxima_Nova'] font-semibold text-sm py-2 hover:text-blue-600 transition-colors flex items-center justify-between"
            onClick={onClose}
          >
            Company Secretarial Services
            <ChevronDown size={14} className="text-gray-500" />
          </Link>
          <Link 
            href="/" 
            className="text-black font-['Proxima_Nova'] font-semibold text-sm py-2 hover:text-blue-600 transition-colors"
            onClick={onClose}
          >
            How Anycomp Works
          </Link>
        </nav>

        {/* Mobile user section */}
        {isLoggedIn && user ? (
          <div className="border-t border-gray-200 pt-3">
            <Link
              href="/specialist"
              className="block text-gray-700 hover:text-blue-600 transition-colors font-medium py-2"
              onClick={onClose}
            >
              Dashboard
            </Link>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Image 
                  src="/man.jpeg" 
                  height={32} 
                  width={32} 
                  className="w-8 h-8 rounded-full object-cover" 
                  alt="User profile" 
                />
                <span className="text-sm text-gray-600 font-medium">{user.email || "User"}</span>
              </div>
              <button
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-3">
            <Link
              href="/login"
              className="block px-4 py-2.5 text-center text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium"
              onClick={onClose}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponent for Search Bar
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isMobile?: boolean;
}

const SearchBar: FC<SearchBarProps> = ({ value, onChange, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="md:hidden flex border border-gray-300 rounded-lg overflow-hidden my-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for any services"
          className="px-3 py-2.5 text-sm text-gray-700 outline-none bg-white placeholder-gray-400 flex-1"
        />
        <button 
          type="button" 
          className="bg-[#002F70] hover:bg-blue-700 transition-colors px-3 flex items-center justify-center"
          aria-label="Search"
        >
          <Search size={16} color="#fff" />
        </button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex border border-gray-300 rounded overflow-hidden">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for any services"
        className="px-3 py-1.5 text-[13px] text-gray-700 outline-none bg-white placeholder-gray-400"
        style={{ width: 195 }}
      />
      <button 
        type="button" 
        className="bg-[#002F70] hover:bg-blue-700 transition-colors px-2.5 flex items-center justify-center"
        aria-label="Search"
      >
        <Search size={14} color="#fff" />
      </button>
    </div>
  );
};

// Subcomponent for User Dropdown
interface UserDropdownProps {
  user: IUser;
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

const UserDropdown: FC<UserDropdownProps> = ({ user, isOpen, onClose, onLogout }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900">{user.email || "User"}</p>
        <p className="text-xs text-gray-500 truncate">{user.email || ""}</p>
      </div>
      
      <Link
        href="/specialists"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        onClick={onClose}
      >
        Dashboard
      </Link>
      
      <div className="border-t border-gray-100 mt-2 pt-2">
        <button
          onClick={() => {
            onLogout?.();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </div>
  );
};

// Subcomponent for Mobile Menu Button
interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const MobileMenuButton: FC<MobileMenuButtonProps> = ({ isOpen, onClick }) => (
  <button
    className="lg:hidden p-2 -mr-2"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
    aria-expanded={isOpen}
  >
    {isOpen ? (
      <X size={24} className="text-gray-700" />
    ) : (
      <Menu size={24} className="text-gray-700" />
    )}
  </button>
);

const Navbar: FC<NavbarProps> = ({ 
  search, 
  onSearchChange, 
  user, 
  isLoggedIn,
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsMobileMenuOpen(false);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-md shadow-gray-200/70">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main navbar container */}
        <div className="flex items-center justify-between py-4 min-h-[45px]">
          {/* Left section: Menu button, Logo and Desktop Navigation */}
          <div className="flex items-center gap-3 sm:gap-6">
            <MobileMenuButton 
              isOpen={isMobileMenuOpen} 
              onClick={toggleMobileMenu} 
            />
            
            {/* Logo */}
            <Link href="/" className="flex-shrink-0" onClick={closeAllMenus}>
              <Image 
                src="/logo.png" 
                height={100} 
                width={100} 
                className="w-28" 
                alt="Anycomp logo" 
                priority
              />
            </Link>

            <DesktopNavigation />

            {/* Desktop Search - hidden on mobile */}
            <SearchBar value={search} onChange={onSearchChange} />
          </div>

          {/* Right section: Search, icons, and user actions */}
          <div className="flex items-center gap-2 sm:gap-3.5">

            {/* Desktop icons for logged-in users */}
            {isLoggedIn && (
              <>
                <Mail
                  size={18}
                  className="hidden sm:block text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                  aria-label="Messages"
                />
                <Bell
                  size={18}
                  className="hidden sm:block text-gray-500 cursor-pointer hover:text-gray-700 transition-colors"
                  aria-label="Notifications"
                />
              </>
            )}

            {/* User area */}
            {isLoggedIn && user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center gap-2 focus:outline-none"
                  aria-label="User menu"
                  aria-expanded={isUserDropdownOpen}
                >
                  <Image 
                    src="/man.jpeg" 
                    height={24} 
                    width={24} 
                    className="w-6 h-6 rounded-full object-cover border border-gray-300" 
                    alt="User profile" 
                  />
                </button>
                
                <UserDropdown 
                  user={user}
                  isOpen={isUserDropdownOpen}
                  onClose={() => setIsUserDropdownOpen(false)}
                  onLogout={onLogout}
                />
              </div>
            ) : (
              // Login button for desktop when not logged in
              <Link
                href="/login"
                className="hidden sm:block px-4 py-1.5 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors font-medium"
                onClick={closeAllMenus}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Bar - Below navbar on mobile */}
        <div className="md:hidden">
          <SearchBar value={search} onChange={onSearchChange} isMobile={true} />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation 
        isOpen={isMobileMenuOpen}
        onClose={closeAllMenus}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={onLogout}
      />
    </header>
  );
};

export default Navbar;