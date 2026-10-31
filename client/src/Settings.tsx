import "./Settings.css";
import closeIcon from "./assets/close.png";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { Warning } from "./Warning";

type SettingsProps = {
    onUserLogout: (action: string) => void;
    toggleSettings: () => void;
    showSettings: boolean;
    setTheme: (theme: string) => void;
    theme: string;
}

export function Settings({ onUserLogout, toggleSettings, setTheme, theme } : SettingsProps) {
    const [deleteWarning, setDeleteWarning] = useState(false);

    // Clean event handler instead of running code during render
    const handleWarningAction = (action: string) => {
        if (action === "cancel") {
            setDeleteWarning(false);
        } else if (action === "submit") {
            onUserLogout("delete");
        }
    };

    return (
        <div className="settings-main-container">
            {!deleteWarning && 
                <div className="settings-close-back-box" onClick={toggleSettings}></div>
            }

            

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
                    <button className="settings-logout" onClick={() => {onUserLogout("logout")}}>Log Out</button>
                </div>

                <div className="setting-box settings-bottom-box">
                    <button className="settings-logout" onClick={() => setDeleteWarning(true)}>Delete account</button>
                </div>
            </div>

            {deleteWarning && (
                        <Warning func={handleWarningAction} title="Delete account?" firstButtonText="Cancel" secondButtontext="Submit"/>
                    )}
        </div>
    )
}