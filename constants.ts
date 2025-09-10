import { Preset } from './types';

export const THUMBNAIL_PRESETS: Preset[] = [
    { name: 'YouTube', width: 1280, height: 720 },
    { name: 'Twitch', width: 1920, height: 1080 },
    { name: 'Facebook Post', width: 1200, height: 630 },
    { name: 'Widescreen (16:9)', width: 1280, height: 720 },
    { name: 'Square (1:1)', width: 1080, height: 1080 },
    { name: 'Portrait (9:16)', width: 1080, height: 1920 },
];