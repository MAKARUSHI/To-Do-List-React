import "./ThemeToggle.css"

type ThemeToggleProps = {
    setTheme: (theme: string) => void;
    theme: string;
}

export function ThemeToggle({setTheme, theme}: ThemeToggleProps) {
    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
    };
    

    // Text for screen readers
    const nextThemeText = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

    return (
        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label={nextThemeText}>
            <span role="img" aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
        </button>
    )
}