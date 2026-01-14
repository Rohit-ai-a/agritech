import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Sprout,
    ClipboardList,
    Users,
    LogOut,
    Menu,
    ChevronLeft,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, path, active, onClick, collapsed }) => (
    <button
        onClick={onClick}
        className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative
            ${active
                ? 'bg-primary-50 text-primary-700 font-semibold'
                : 'text-secondary-600 hover:bg-gray-50 hover:text-secondary-900'
            }
        `}
    >
        <Icon size={20} className={active ? 'text-primary-600' : 'text-gray-400 group-hover:text-secondary-600'} />

        {!collapsed && (
            <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="whitespace-nowrap"
            >
                {label}
            </motion.span>
        )}

        {/* Active Indicator */}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-r-full"
            />
        )}
    </button>
);

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { role: ['FARMER', 'BUYER', 'INSPECTOR'], label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { role: ['FARMER'], label: 'My Crops', icon: Sprout, path: '/my-listings' }, // Hypothetical path mapping
        { role: ['BUYER'], label: 'Marketplace', icon: ShoppingCart, path: '/marketplace' },
        { role: ['INSPECTOR'], label: 'Inspections', icon: ClipboardList, path: '/inspections' },
        { role: ['ADMIN'], label: 'Overview', icon: LayoutDashboard, path: '/admin' },
        { role: ['ADMIN'], label: 'User Management', icon: Users, path: '/admin/users' },
        { role: ['ADMIN'], label: 'Disputes', icon: Shield, path: '/admin/disputes' },
    ];

    const filteredItems = menuItems.filter(item => item.role.includes(user.role));

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 80 : 260 }}
                className="bg-white border-r border-gray-200 flex flex-col z-20 shadow-lg shadow-gray-100/50"
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shrink-0">
                            <Sprout className="text-white" size={20} />
                        </div>
                        {!collapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-xl text-secondary-900 tracking-tight"
                            >
                                AgriTrade
                            </motion.span>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {filteredItems.map((item, idx) => (
                        <SidebarItem
                            key={idx}
                            {...item}
                            active={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            collapsed={collapsed}
                        />
                    ))}
                </div>

                {/* User Profile & Logout */}
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-secondary-900 truncate">{user.name}</p>
                                <p className="text-xs text-secondary-500 truncate capitalize">{user.role.toLowerCase()}</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button
                                onClick={logout}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <LogOut size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-2 -ml-2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </button>

                    <div className="flex items-center gap-4">
                        {/* Placeholder for notifications or breadcrumbs */}
                        <span className="text-sm text-gray-400">Welcome back, {user.name}</span>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
