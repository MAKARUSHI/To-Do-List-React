import "./Settings.css";
import closeIcon from "./assets/close.png";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

type SettingsProps = {
    onUserLogout: (deleteAccount: boolean) => void;
    toggleSettings: () => void;
    showSettings: boolean;
    setTheme: (theme: string) => void;
    theme: string;
}


export function Settings({ onUserLogout, toggleSettings, showSettings, setTheme, theme } : SettingsProps) {
    const savedUser = localStorage.getItem("user");
    
    const [deleteWarning, setDeleteWarning] = useState(false);

    console.log(savedUser);
    return (
        <div className="settings-main-container">
            <div className="settings-close-back-box" onClick={() => {
                                (showSettings && !deleteWarning) ? toggleSettings() : setDeleteWarning(false)}}>
            </div>
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
                    <button className="settings-logout" onClick={() => {onUserLogout(false)}}>Log Out</button>
                </div>

                <div className="setting-box settings-bottom-box">
                    <button className="settings-logout" onClick={() => {setDeleteWarning(true)}}>Delete account</button>
                    
                    {deleteWarning &&
                    <div className="setting-delete-warning">
                        <h3 className="setting-box-title">Delete account?</h3>
                        <div style={{"display": "flex", "justifyContent": "space-between", "width": "100%"}}>
                            <button className="setting-delete-button" onClick={() => {setDeleteWarning(false)}}>Cancel</button>
                            <button className="setting-delete-button" onClick={() => {onUserLogout(true)}}>Delete</button>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}