import "./Settings.css";
import closeIcon from "./assets/close.png";
import { ThemeToggle } from "./ThemeToggle";

type SettingsProps = {
    onUserLogout: () => void;
    toggleSettings: () => void;
    showSettings: boolean;
    setTheme: (theme: string) => void;
    theme: string;
}


export function Settings({ onUserLogout, toggleSettings, showSettings, setTheme, theme } : SettingsProps) {
    return (
        <div className="settings-main-container">
            <div className="settings-close-back-box" onClick={() => {
                                showSettings && toggleSettings()}}></div>
            <div className="settings-container">
                
                <div className="setting-box settings-top-box">
                    <h2 className="settings-title">Settings</h2>
                    <img src={closeIcon} alt="Close settings" onClick={toggleSettings} className="close-icon"/>
                </div>
                <div className="setting-box">
                    <h3 className="setting-title">Theme:</h3>
                    <ThemeToggle setTheme={setTheme} theme={theme} source="settings"/>
                </div>
                <div className="setting-box settings-bottom-box">
                    <button className="settings-logout" onClick={onUserLogout}>Log Out</button>
                </div>
            </div>
        </div>
    )
}