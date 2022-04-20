import React, { createContext, useState } from "react";

const userMedia = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)");

const getInitialTheme = (_) => {
  if (typeof window !== undefined /* && window.localStorage */) {
    // const storedPrefs = window.localStorage.getItem("color-theme");
    // if (typeof storedPrefs === "string") {
    //   return storedPrefs;
    // }

    if (userMedia.matches) {
      return "dark";
    }
  }

  // If you want to use light theme as the default,
  // return "light" instead
  return "light";
};

export const ThemeContext = createContext();

export const ThemeProvider = ({ initialTheme, children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  const rawSetTheme = (theme) => {
    const root = window.document.documentElement;
    const isDark = theme === "dark";

    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(theme);

    // localStorage.setItem("color-theme", theme);
  };

  if (initialTheme) {
    rawSetTheme(initialTheme);
  }

  React.useEffect(
    (_) => {
      userMedia.addEventListener("change", ({ matches }) => (matches ? rawSetTheme("dark") : rawSetTheme("light")));
      rawSetTheme(theme);
    },
    [theme]
  );

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
