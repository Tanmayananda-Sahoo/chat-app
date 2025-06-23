import {create} from 'zustand';

const useThemeStore = create((set) => ({
    themeSelected: "retro",
    setTheme: async (theme) => {
        await set({themeSelected: theme});
        // console.log('themeSelected at useThemeStore: ', theme);
    }
}))

export {useThemeStore};