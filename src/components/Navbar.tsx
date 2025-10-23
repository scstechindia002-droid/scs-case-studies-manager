'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaUsers, FaSignOutAlt, FaUser } from 'react-icons/fa';

interface NavbarProps {
  rightText?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export default function Navbar({ 
  rightText = "SCS Tech Case Studies",
  showBackButton = false,
  backHref = "/"
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string; name?: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Try to get user info from localStorage or sessionStorage
    const getUser = () => {
      const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userStr) {
        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
    };
    getUser();
    // Listen for storage changes (multi-tab support)
    window.addEventListener('storage', getUser);
    return () => window.removeEventListener('storage', getUser);
  }, []);

  const handleLogout = async () => {
    // Call the API to clear HttpOnly cookies
    await fetch('/api/auth/logout', { method: 'POST' });
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    setUser(null); // Immediately update Navbar state
    router.push('/login');
  };

  const handleUserList = () => {
    setShowUserMenu(false);
    router.push('/admin/users-list');
  };

  return (
    <nav className="bg-[#1a2332] border-b border-gray-700/30 sticky top-0 z-50 backdrop-blur-sm">
      {/* Full width container with no max-width constraint */}
      <div className="w-full px-5 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo - Far Left */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <div 
                className="w-[150px] h-[52px] lg:w-[206px] lg:h-[71px] relative"
                style={{ aspectRatio: '206/71.053' }}
              >
                <Image
                  src="/images/logo.png"
                  alt="SCS Tech Logo"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </Link>
          </div>
                    
          {/* Right side content - Far Right */}
          <div className="flex-shrink-0 flex items-center gap-4">
            {showBackButton ? (
              <Link 
                href={backHref}
                className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back to Case Studies</span>
              </Link>
            ) : (
              <h1 
                className="text-white font-bold tracking-[1px]"
                style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 'clamp(14px, 2.5vw, 24px)',
                  fontWeight: 700,
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}
              >
                {rightText}
              </h1>
            )}
            {/* User Icon and Menu */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowUserMenu(v => !v)}
                className="text-white focus:outline-none"
                aria-label="User menu"
              >
                <FaUserCircle size={32} />
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl z-50 p-0 overflow-hidden border border-gray-100">
                  {user ? (
                    <>
                      {/* User Info Header */}
                      <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="bg-blue-100 rounded-full p-2">
                          <FaUser size={24} className="text-blue-500" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base">{user.name || user.email}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400 capitalize">{user.role}</div>
                        </div>
                      </div>
                      {/* Menu Items */}
                      <div className="py-2">
                        {user.role === 'admin' && (
                          <button
                            className="flex items-center w-full px-5 py-2 text-gray-700 hover:bg-blue-50 transition rounded-none gap-3 text-sm"
                            onClick={handleUserList}
                          >
                            <FaUsers className="text-blue-500" />
                            User List
                          </button>
                        )}
                        <button
                          className="flex items-center w-full px-5 py-2 text-red-600 hover:bg-red-50 transition rounded-none gap-3 text-sm font-semibold"
                          onClick={handleLogout}
                        >
                          <FaSignOutAlt className="text-red-500" />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-5 py-4 text-gray-500 text-center">Not logged in</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}