import "./ThemeToggle.css"

type ThemeToggleProps = {
    setTheme: (theme: string) => void;
    theme: string;
    source: string;
}

export function ThemeToggle({setTheme, theme, source}: ThemeToggleProps) {
    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    };
    
    document.documentElement.setAttribute("source-theme", source);
    

    // Text for screen readers
    const nextThemeText = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

    return (
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label={nextThemeText}>
            <span role="img" aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
        </button>
    )
}