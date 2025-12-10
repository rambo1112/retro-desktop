import { createCalculator } from './src/apps/calculator/index.js';
import { createNotepad } from './src/apps/notepad/index.js';
import { createWallpaperPicker } from './src/apps/wallpaper-picker/index.js';
import { createCalendar } from './src/apps/calendar/index.js';
import { createTypingTest } from './src/apps/typing-test/index.js';
import { createSnakeGame } from './src/apps/snake/index.js';

export const INSTALLED_APPS = [
    {
        id: 'calc',
        title: 'Calculator',
        icon: '🧮', // Using emoji as placeholder for images
        component: createCalculator 
    },
    {
        id: 'notepad',
        title: 'Notepad',
        icon: '📝',
        component: createNotepad
    },
    {
        id: 'wallpapers',
        title: 'Wallpapers',
        icon: '🖼️',
        component: createWallpaperPicker
    },
    {
        id: 'calendar',
        title: 'Calendar',
        icon: '📅',
        component: createCalendar
    },
    {
        id: 'typing-test',
        title: 'Typing Test',
        icon: '⌨️',
        component: createTypingTest
    ,
    { 
        id: 'snake', 
        title: 'Snake', 
        icon: '🐍', 
        component: createSnakeGame 
    }

];
