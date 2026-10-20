import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeName = "midnight" | "obsidian";

const STORAGE_KEY = "brand-festival-theme";

function readStoredTheme(): ThemeName {
  const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  return stored === "obsidian" ? "obsidian" : "midnight";
}

interface ThemeState {
  current: ThemeName;
}

const initialState: ThemeState = { current: readStoredTheme() };

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeName>) {
      state.current = action.payload;
      localStorage.setItem(STORAGE_KEY, action.payload);
      document.documentElement.setAttribute("data-theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
