
import React from 'react';

const iconProps = {
    strokeWidth: "2",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as "round",
    strokeLinejoin: "round" as "round",
};

export const ImagePlusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><line x1="16" x2="22" y1="5" y2="5" /><line x1="19" x2="19" y1="2" y2="8" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
);
export const Wand2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z" /><path d="m14 7 3 3" /><path d="M5 6v4" /><path d="M19 14v4" /><path d="M10 2v2" /><path d="M7 8H3" /><path d="M21 16h-4" /><path d="M11 3H9" /></svg>
);
export const LayoutTemplateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><rect width="18" height="7" x="3" y="3" rx="1" /><rect width="9" height="7" x="3" y="14" rx="1" /><rect width="5" height="7" x="16" y="14" rx="1" /></svg>
);
export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>
);
export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6"></path></svg>
);
export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
);
export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);

export const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><polyline points="20 6 9 17 4 12" /></svg>
);

// Fix: Add SigmaIcon for the Math Visualizer page.
export const SigmaIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><path d="M4 7V4h16v3l-8 7 8 7v3H4v-3l8-7-8-7z"/></svg>
);

export const BananaIcon: React.FC<{ className?: string }> = ({ className }) => (
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
