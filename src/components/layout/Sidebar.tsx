import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts';
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/search', icon: Search, label: 'Search Scores' },
    { to: '/reports', icon: BarChart3, label: 'Reports' },
    { to: '/top10', icon: Trophy, label: 'Top 10 Group A' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-yellow-400 text-gray-900 font-semibold'
                : 'text-gray-700 hover:bg-yellow-100'
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-yellow-400 rounded-lg shadow-lg"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-yellow-400 to-yellow-500 transform transition-transform duration-300 lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-yellow-600/20">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <NavLinks />
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-yellow-600/20">
            <div className="flex items-center gap-3 mb-4 px-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.username || 'User'}</p>
                <p className="text-sm text-gray-700">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
