import { create } from "zustand";

export const useThemeStore = create((set) => {
      const storedTheme = localStorage.getItem("chat-theme") || "dark";

  // Apply theme to <html> immediately
    document.documentElement.setAttribute("data-theme", storedTheme);

  return {
    theme: storedTheme,
    setTheme: (theme) => {
      localStorage.setItem("chat-theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
      set({ theme });
    },
  };
});