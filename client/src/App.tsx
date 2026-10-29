import "./App.css"
import { Credentials } from "./Credentials"
import { Dashboard } from "./Dashboard";
import { useState, useEffect } from "react"
import { logoutUser } from "./Api";

function App() {

  const [theme, setTheme] = useState<string>(() => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
          localStorage.setItem("theme", "dark");
          return "dark"
      }

      return savedTheme;
  });

  // If theme changes updates storage
  useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

  const [user, setUser] = useState<any>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const onAuthSuccess = (user: any) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const onUserLogout = async (action: string) => {
    try {
        if (user?.username) {
          await logoutUser(user.id_user, action);
        }
    } catch (error) {
        console.error("Logout request failed:", error);
    } finally {
        setUser(null);
        localStorage.removeItem("user");
    }
};

  return (
    <div className="app-container">
      {user ? (
        <Dashboard user={user} onUserLogout={onUserLogout} setTheme={setTheme} theme={theme}/>
      ) : (
        <Credentials onAuthSuccess={onAuthSuccess} setTheme={setTheme} theme={theme}/>
      )}
      
    </div>
  )
}

export default App
