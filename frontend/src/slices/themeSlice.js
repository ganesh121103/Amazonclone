import { createSlice } from '@reduxjs/toolkit';

const isDark = localStorage.getItem('theme') === 'dark';

const themeSlice = createSlice({
  name: 'theme',
  initialState: { isDark },
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
      localStorage.setItem('theme', state.isDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', state.isDark);
    },
    initTheme: (state) => {
      document.documentElement.classList.toggle('dark', state.isDark);
    },
  },
});

export const { toggleTheme, initTheme } = themeSlice.actions;
export default themeSlice.reducer;
