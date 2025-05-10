import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, BarChart, Lightbulb, Users, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    mobile?: boolean;
    onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobile = false, onClose }) => {
    const { signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Failed to sign out', error);
        }
    };

    const navItems = [
        { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/add-expense', icon: <PlusCircle size={20} />, label: 'Add Expense' },
        { path: '/reports', icon: <BarChart size={20} />, label: 'Reports' },
        { path: '/suggestions', icon: <Lightbulb size={20} />, label: 'Suggestions' },
        { path: '/family', icon: <Users size={20} />, label: 'Family' },
        { path: '/budgets', icon: <Users size={20} />, label: 'Budgets' },
        { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        <div className={`flex flex-col h-full ${mobile ? 'w-64' : 'w-64'} bg-white border-r border-gray-200`}>
            {mobile && (
                <div className='flex items-center justify-between p-4 border-b border-gray-200'>
                    <h2 className='text-xl font-semibold text-gray-800'>Ghar Kharcha</h2>
                    <button onClick={onClose} className='p-1 rounded-lg text-gray-600 hover:bg-gray-100' aria-label='Close sidebar'>
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className={`p-3 ${mobile ? '' : 'pt-6'}`}>
                <div className={`${mobile ? 'hidden' : 'mb-8 mx-4'}`}>
                    <h1 className='text-xl font-semibold text-gray-800'>Ghar Kharcha</h1>
                    <p className='text-sm text-gray-500 mt-1'>Ab kharche pe full control, AI banaye smart goal</p>
                </div>

                <nav className='mt-4 space-y-1'>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={mobile ? onClose : undefined}
                            className={({ isActive }) => `
                flex items-center px-4 py-2.5 text-sm font-medium rounded-lg
                ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'} 
                transition-colors
              `}
                        >
                            <span className='mr-3'>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className='mt-auto p-4 border-t border-gray-200'>
                <button
                    onClick={handleSignOut}
                    className='flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors'
                >
                    <LogOut size={20} className='mr-3' />
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
