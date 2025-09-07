
import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import Button from '../ui/Button';
import { SunIcon, MoonIcon, MenuIcon } from '../icons/LucideIcons';

// This is a placeholder for a real sidebar state management
const toggleSidebar = () => {
    const sidebar = document.getElementById('sidebar');
    sidebar?.classList.toggle('-translate-x-full');
};

const BananaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
	<path fill="#ffe8b6" d="M28 2c2.684-1.342 5 4 3 13c-1.106 4.977-5 9-9 12s-11-1-7-5s8-7 10-13c1.304-3.912 1-6 3-7"></path>
	<path fill="#ffd983" d="M31 8c0 3-1 9-4 13s-7 5-4 1s5-7 6-11s2-7 2-3"></path>
	<path fill="#ffcc4d" d="M22 20c-.296.592 1.167-3.833-3-6c-1.984-1.032-10 1-4 1c3 0 4 2 2 4a2.9 2.9 0 0 0-.622.912c-.417.346-.873.709-1.378 1.088c-2.263 1.697-5.84 4.227-10 7c-3 2-4 3-4 4c0 3 9 3 14 1s10-7 10-7l4-4c-3-4-7-2-7-2"></path>
	<path fill="#ffe8b6" d="M22 20s1.792-4.729-3-7c-4.042-1.916-8-1-11 1s-2 4-3 5s1 2 3 0s8.316-4.895 11-4c3 1 2 2.999 3 5"></path>
	<path fill="#a6d388" d="M26 35h-4c-2 0-3 1-4 1s-2-2 0-2s4 0 5-1s5 2 3 2"></path>
	<circle cx={18} cy={35} r={1} fill="#3e721d"></circle>
	<path fill="#ffcc4d" d="M32.208 28S28 35 26 35h-4c-2 0 0-1 1-2s5 0 5-6c0-3 4.208 1 4.208 1"></path>
	<path fill="#ffe8b6" d="M26 19c3 0 8 3 7 9s-5 7-7 7h-2c-2 0-1-1 0-2s4 0 4-6c0-3-4-7-6-7c0 0 2-1 4-1"></path>
	<path fill="#ffd983" d="M17 21c3 0 5 1 3 3c-1.581 1.581-6 5-10 6s-8 1-5-1s9.764-8 12-8"></path>
	<path fill="#c1694f" d="M2 31c1 0 1 0 1 .667C3 32.333 3 33 2 33s-1-1.333-1-1.333S1 31 2 31"></path>
</svg>
);


const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-30 w-full shrink-0">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleSidebar}>
                <MenuIcon className="w-6 h-6"/>
            </Button>
             <div className="hidden md:flex items-center gap-2">
                <BananaIcon className={`w-8 h-8`} />
                <h1 className="text-xl font-bold font-serif text-foreground">Super Banana</h1>
            </div>
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
