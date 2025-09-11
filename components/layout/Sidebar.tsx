import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useHistory } from '../../hooks/useHistory';
import { ImagePlusIcon, LayoutTemplateIcon, TrashIcon, SigmaIcon } from '../icons/LucideIcons';

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
    const { 
        thumbnailHistory, 
        productPhotoShootHistory, 
        mathVisualizerHistory,
        deleteThumbnail, 
        deleteProductPhotoShoot,
        deleteMathVisualization
    } = useHistory();

    return (
        <aside id="sidebar" className="bg-sidebar w-74 h-[calc(100vh-4rem)] p-4 border-r border-sidebar-border
            absolute md:static -translate-x-full md:translate-x-0 
            transition-transform duration-300 ease-in-out z-20 overflow-y-auto">
            <nav className="flex flex-col gap-6">
                <NavSection to="/editor" icon={<LayoutTemplateIcon />} label="Thumbnails">
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
                 <NavSection to="/product" icon={<ImagePlusIcon />} label="Product Photoshoot">
                   {productPhotoShootHistory.length > 0 ? (
                       <ul className="space-y-1">
                           {productPhotoShootHistory.slice().reverse().map(item => (
                               <li key={item.id}>
                                   <HistoryItemLink to={`/product/${item.id}`} title={item.title} onDelete={() => deleteProductPhotoShoot(item.id)} />
                               </li>
                           ))}
                       </ul>
                   ) : <p className="text-xs text-muted-foreground pl-2">No product photos created yet.</p>}
                </NavSection>
                <NavSection to="/visualizer" icon={<SigmaIcon />} label="Math Visualizer">
                   {mathVisualizerHistory.length > 0 ? (
                       <ul className="space-y-1">
                           {mathVisualizerHistory.slice().reverse().map(item => (
                               <li key={item.id}>
                                   <HistoryItemLink to={`/visualizer/${item.id}`} title={item.title} onDelete={() => deleteMathVisualization(item.id)} />
                               </li>
                           ))}
                       </ul>
                   ) : <p className="text-xs text-muted-foreground pl-2">No visualizations created yet.</p>}
                </NavSection>
            </nav>
        </aside>
    );
};

export default Sidebar;
