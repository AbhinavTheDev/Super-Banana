
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useHistory } from '../../hooks/useHistory';
import { ImagePlusIcon, LayoutTemplateIcon, TrashIcon } from '../icons/LucideIcons';

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

const NavSection: React.FC<{ to: string, icon: React.ReactNode, label: string, children?: React.ReactNode }> = ({ to, icon, label, children }) => (
    <div>
        <Link to={to} className="flex items-center px-4 py-2.5 rounded-lg transition-colors duration-200 text-sidebar-foreground hover:bg-accent font-semibold text-lg mb-2">
            <span className="w-6 h-6 mr-3">{icon}</span>
            <span>{label}</span>
        </Link>
        <div className="pl-4 border-l-2 border-border ml-7">
            {children}
        </div>
    </div>
);

const HistoryItemLink: React.FC<{ to: string; title: string; onDelete: () => void }> = ({ to, title, onDelete }) => {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex-1 truncate pr-2 py-1.5 ${isActive ? 'text-sidebar-primary font-semibold' : ''}`;
    
    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this item?')) {
            onDelete();
        }
    };

    return (
        <div className="flex items-center justify-between text-sm group text-muted-foreground hover:text-foreground">
            <NavLink to={to} className={navLinkClass} title={title}>
                {title}
            </NavLink>
            <button onClick={handleDelete} className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 shrink-0">
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

const Sidebar: React.FC = () => {
    const { thumbnailHistory, productHistory, deleteThumbnail, deleteProductPhoto } = useHistory();

    return (
        <aside id="sidebar" className="bg-sidebar w-72 h-[calc(100vh-4rem)] p-4 border-r border-sidebar-border
            absolute md:static -translate-x-full md:translate-x-0 
            transition-transform duration-300 ease-in-out z-20 overflow-y-auto">
            <div className="md:hidden flex items-center mb-8 px-4">
                <BananaIcon className={`w-8 h-8`} />
                <h1 className="text-2xl font-bold font-serif text-sidebar-foreground">Super Banana</h1>
            </div>
            <nav className="flex flex-col gap-6">
                <NavSection to="/editor" icon={<LayoutTemplateIcon />} label="Thumbnail Builder">
                   {thumbnailHistory.length > 0 ? (
                        <ul className="space-y-1">
                           {thumbnailHistory.slice().reverse().map(item => (
                               <li key={item.id}>
                                   <HistoryItemLink to={`/editor/${item.id}`} title={item.title} onDelete={() => deleteThumbnail(item.id)} />
                               </li>
                           ))}
                       </ul>
                   ) : <p className="text-xs text-muted-foreground pl-2">No thumbnails created yet.</p>}
                </NavSection>
                 <NavSection to="/product" icon={<ImagePlusIcon />} label="Product Photos">
                   {productHistory.length > 0 ? (
                       <ul className="space-y-1">
                           {productHistory.slice().reverse().map(item => (
                               <li key={item.id}>
                                   <HistoryItemLink to={`/product/${item.id}`} title={item.title} onDelete={() => deleteProductPhoto(item.id)} />
                               </li>
                           ))}
                       </ul>
                   ) : <p className="text-xs text-muted-foreground pl-2">No product photos created yet.</p>}
                </NavSection>
            </nav>
        </aside>
    );
};

export default Sidebar;
