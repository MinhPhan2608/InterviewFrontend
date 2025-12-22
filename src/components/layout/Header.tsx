import { useTheme } from '@/contexts';
import { Sun, Moon } from 'lucide-react';

const Header = ({ sidebarHovered }: { sidebarHovered?: boolean }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="bg-[var(--color-primary)] text-white h-16 px-6 shadow-lg sticky top-0 z-30">
      <div 
        className={`flex items-center justify-between h-full transition-all ${sidebarHovered ? 'lg:ml-64' : 'lg:ml-16'}`}
        style={{ transitionDuration: '320ms' }}
      >
        <h1 className="text-xl font-bold tracking-wide lg:ml-0 ml-12">G-Scores</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
