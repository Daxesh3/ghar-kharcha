import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart, PlusCircle, Lightbulb, Users } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/reports', icon: <BarChart size={20} />, label: 'Reports' },
    { path: '/add-expense', icon: <PlusCircle size={24} />, label: 'Add', primary: true },
    { path: '/suggestions', icon: <Lightbulb size={20} />, label: 'Tips' },
    { path: '/family', icon: <Users size={20} />, label: 'Family' },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-30">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex flex-col items-center px-3 py-1
              ${isActive 
                ? 'text-primary-600' 
                : 'text-gray-600'
              }
              ${item.primary ? '-mt-6' : ''}
            `}
          >
            {item.primary ? (
              <div className="bg-primary-600 text-white p-3 rounded-full shadow-lg">
                {item.icon}
              </div>
            ) : (
              <div>{item.icon}</div>
            )}
            <span className={`text-xs mt-1 ${item.primary ? 'mt-1.5' : ''}`}>
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;