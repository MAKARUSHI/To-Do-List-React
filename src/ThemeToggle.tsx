import {useEffect, useState} from "react";
import "./ThemeToggle.css"

export function ThemeToggle() {
    const [theme, setTheme] = useState<string>(() => {
        return localStorage.getItem("theme") || "dark";
    });

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    // If theme changes updates storage
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Text for screen readers
    const nextThemeText = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

    return (
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label={nextThemeText}>
            <span role="img" aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
        </button>
    )
}