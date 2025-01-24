import { createContext, useContext, useEffect, useState } from "react";
import { LoadTheme, SaveTheme } from "../../wailsjs/go/main/App";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await LoadTheme();
        if (savedTheme) {
          setTheme(savedTheme as Theme);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    loadSavedTheme();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = async (e: MediaQueryListEvent) => {
      try {
        const savedTheme = await LoadTheme();
        if (!savedTheme) {
          setTheme(e.matches ? "dark" : "light");
        }
      } catch (error) {
        console.error("Failed to check saved theme:", error);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    SaveTheme(theme).catch((error) => {
      console.error("Failed to save theme:", error);
    });
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
