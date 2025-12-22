import { useTheme } from '@/contexts';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isSidebarHovered?: boolean;
}

const Header = ({ isSidebarHovered }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-[var(--color-primary)] text-white h-16 px-6 shadow-lg sticky top-0 z-30">
      <div className={`flex items-center justify-between h-full max-w-7xl mx-auto transition-all duration-300 ${isSidebarHovered ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <h1 className="text-xl font-bold tracking-wide">G-Scores</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
