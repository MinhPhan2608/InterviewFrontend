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
import { useState, useMemo } from 'react';

const Sidebar = ({ onHoverChange }: { onHoverChange?: (hovered: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { logout, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const navItems = useMemo(() => [
    { to: '/dashboard', icon: LayoutDashboard, label: 'dashboard' as const },
    { to: '/search', icon: Search, label: 'searchScores' as const },
    { to: '/reports', icon: BarChart3, label: 'reports' as const },
    { to: '/top10', icon: Trophy, label: 'top10GroupA' as const },
    { to: '/settings', icon: Settings, label: 'settings' as const },
  ], []);

  const expanded = isOpen || hovered;

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
        onMouseEnter={() => {
          setHovered(true);
          if (onHoverChange) onHoverChange(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
          if (onHoverChange) onHoverChange(false);
        }}
        className={`fixed inset-y-0 left-0 z-40 bg-[var(--color-sidebar-bg)] shadow-xl transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${hovered ? 'lg:w-64' : 'lg:w-16'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-[var(--color-sidebar-hover)] flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span 
              className={`font-bold text-[var(--color-sidebar-text)] whitespace-nowrap transition-all duration-300 overflow-hidden ${
                expanded ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0'
              }`}
            >
              {t('menu') || 'Menu'}
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-[var(--color-sidebar-active)] text-white font-medium'
                      : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]'
                  } ${expanded ? 'gap-3' : 'gap-0'}`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span 
                  className={`whitespace-nowrap overflow-hidden transition-all ${
                    expanded ? 'opacity-100 max-w-[150px] ml-3' : 'opacity-0 max-w-0'
                  }`}
                  style={{ transitionDuration: '280ms' }}
                >
                  {t(item.label) || item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-3 flex-shrink-0 border-t border-[var(--color-sidebar-hover)]">
            <div className={`flex items-center mt-3 mb-3 px-2 min-h-[48px] ${
              expanded ? 'gap-3' : 'lg:justify-center'
            }`}>
              <div className="w-9 h-9 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
              <div 
                className={`overflow-hidden transition-all ${
                  expanded ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0 lg:max-w-0'
                }`}
                style={{ transitionDuration: '280ms' }}
              >
                <p className="font-medium text-[var(--color-sidebar-text)] text-sm truncate whitespace-nowrap">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">{t('administrator') || 'Admin'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className={`flex items-center w-full px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ${
                expanded ? 'gap-3' : 'lg:justify-center'
              }`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span 
                className={`whitespace-nowrap transition-all ${
                  expanded ? 'opacity-100 max-w-[100px]' : 'opacity-0 max-w-0'
                }`}
                style={{ transitionDuration: '280ms' }}
              >
                {t('logout') || 'Logout'}
              </span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
