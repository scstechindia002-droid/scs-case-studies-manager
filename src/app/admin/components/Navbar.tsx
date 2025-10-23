import { Bell, Settings, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUsers } from '../hooks/useUsers';

export default function Navbar() {
  const { handleLogout } = useUsers ? useUsers() : { handleLogout: null };
  const logout = async () => {
    if (handleLogout) {
      await handleLogout();
    } else {
      // Remove tokens from storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      // Call backend to clear HttpOnly cookies
      await fetch('/api/auth/logout', { method: 'POST' });
      // Redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <nav className="bg-slate-800 shadow-lg border-b border-slate-700">
      <div className="w-full px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand - flush left */}
          <div className="flex items-center pl-0">
            <Link href="/" className="block">
              <div 
                className="w-[120px] h-[42px] relative"
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

          {/* Right side items - flush right */}
          <div className="flex items-center space-x-4 pr-0">
            <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
              <Bell className="h-6 w-6" />
            </button>
            <button className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-slate-700">
              <Settings className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full border-2 border-red-500 bg-slate-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Admin</span>
            </div>
            <button
              className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-slate-700"
              onClick={logout}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}