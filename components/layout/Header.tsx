
import React from 'react';
import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme';
import Button from '../ui/Button';
import { SunIcon, MoonIcon, MenuIcon, BananaIcon } from '../icons/LucideIcons';

// This is a placeholder for a real sidebar state management
const toggleSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  sidebar?.classList.toggle('-translate-x-full');
};


const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-30 w-full shrink-0">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleSidebar}>
          <MenuIcon className="w-6 h-6" />
        </Button>
        <Link to={"/"}>
          <div className="flex items-center gap-2">
            <BananaIcon className={`w-8 h-8`} />
            <h1 className="text-xl font-bold font-serif text-foreground">Super Banana</h1>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
