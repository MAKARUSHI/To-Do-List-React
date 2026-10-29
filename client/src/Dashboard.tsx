import { useState, useEffect } from "react";
import "./App.css";
import "./Dashboard.css"
import { logoutUser } from "./Api";
import { Settings } from "./Settings";
import { Menu } from "./Menu";
import profileMale from "./assets/profile-male.png";
import profileFemale from "./assets/profile-female.png";
import profileOther from "./assets/profile-other.png";
import settings from "./assets/settings.png";

type DashboardProps = {
    user: {
        id_user: number;
        username: string;
        first_name: string;
        email: string;
        gender: string;
    };
    onUserLogout: (action: string) => void;
    setTheme: (theme: string) => void;
    theme: string;
}

export default function useActivityHeartbeat(userId: number) {
    useEffect(() => {
        if (!userId) return;

        logoutUser(userId, "heartbeat");

        const interval = setInterval(() => {logoutUser(userId, "heartbeat");}, 60000); 

        return () => clearInterval(interval);
    }, [userId]);
}

export function Dashboard({ user, onUserLogout, setTheme, theme }: DashboardProps) {

  const [showSettings, setShowSettings] = useState(false);

  useActivityHeartbeat(user?.id_user);

  const [showWarning, setShowWarning] = useState(false);

  let profileIcon = profileOther;
  if (user.gender === "m") {
    profileIcon = profileMale;
  } else if (user.gender === "w") {
    profileIcon = profileFemale;
  }

  function toggleSettings() {
    setShowSettings((prev) => !prev);
  }

  

  return (
    <div className="dashboard-container">
      {showSettings && (
          <Settings onUserLogout={onUserLogout} toggleSettings={toggleSettings} showSettings={showSettings} setTheme={setTheme} theme={theme} />
      )}

        <div className="dashboard-top-box">
          <img src={profileIcon} alt="User profile icon" className="dashboard-top-profile"/>
          <h1 className="dashboard-top-text">Wellcome back, {user.first_name}</h1>
          <img src={settings} alt="Settings icon" onClick={toggleSettings} className="dashboard-top-profile"/>
        </div>

        <Menu idUser={user.id_user} username={user.username} setShowWarning={setShowWarning} showWarning={showWarning}/>
      
    </div>
  )
}