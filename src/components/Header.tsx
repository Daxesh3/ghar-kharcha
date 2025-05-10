import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { currentUser } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          
          <div className="ml-4 md:ml-0">
            <div className="text-lg md:text-xl font-semibold text-gray-800">
              Family Finance
            </div>
            <div className="text-sm text-gray-500 hidden md:block">
              Manage your household expenses
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-1.5 flex-1 max-w-md mx-6">
          <Search size={18} className="text-gray-500 mr-2" />
          <input 
            type="text" 
            placeholder="Search expenses, categories..." 
            className="bg-transparent border-none outline-none w-full text-sm text-gray-700"
          />
        </div>
        
        <div className="flex items-center">
          <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
          </button>
          
          <div className="ml-3 relative">
            <div className="flex items-center">
              <button className="flex items-center rounded-full focus:outline-none">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800 font-medium">
                  {currentUser?.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                  {currentUser?.displayName || 'User'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;