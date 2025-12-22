import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, useLanguage } from '@/contexts';
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

interface SidebarProps {
  onHoverChange?: (isHovered: boolean) => void;
}

const Sidebar = ({ onHoverChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    onHoverChange?.(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, labelKey: 'dashboard' as const },
    { to: '/search', icon: Search, labelKey: 'searchScores' as const },
    { to: '/reports', icon: BarChart3, labelKey: 'reports' as const },
    { to: '/top10', icon: Trophy, labelKey: 'top10GroupA' as const },
    { to: '/settings', icon: Settings, labelKey: 'settings' as const },
  ];

  const isExpanded = isOpen || isHovered;

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              isActive
                ? 'bg-[var(--color-sidebar-active)] text-white font-medium'
                : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]'
            }`
          }
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span 
            className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${
              isExpanded ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
            }`}
          >
            {t(item.labelKey)}
          </span>
        </NavLink>
      ))}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--color-primary)] text-white rounded-lg shadow-lg"
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 z-40 bg-[var(--color-sidebar-bg)] shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isHovered ? 'lg:w-64' : 'lg:w-16'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-[var(--color-sidebar-hover)] flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span 
              className={`font-bold text-[var(--color-sidebar-text)] whitespace-nowrap transition-all duration-300 overflow-hidden ${
                isExpanded ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
              }`}
            >
              {t('menu')}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <NavLinks />
          </nav>

          {/* User Section */}
          <div className="p-3 flex-shrink-0 border-t border-[var(--color-sidebar-hover)]">
            <div className={`flex items-center mt-3 mb-3 px-2 min-h-[48px] ${
              isExpanded ? 'gap-3' : 'lg:justify-center'
            }`}>
              <div className="w-9 h-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0 lg:max-w-0'
                }`}
              >
                <p className="font-medium text-[var(--color-sidebar-text)] text-sm truncate whitespace-nowrap">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">{t('administrator')}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${
                isExpanded ? '' : 'lg:justify-center'
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span 
                className={`whitespace-nowrap transition-all duration-300 ${
                  isExpanded ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0'
                }`}
              >
                {t('logout')}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
