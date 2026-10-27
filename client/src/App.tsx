import "./App.css"
import { Credentials } from "./Credentials"
import { Dashboard } from "./Dashboard";
import { useState, useEffect } from "react"

function App() {

  const [theme, setTheme] = useState<string>(() => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
          console.log("theme to dark");
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

  const onLoginSuccess = (user: any) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const onUserLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <div style={{width: "100%", height: "100vh"}}>
      {user ? (
        <Dashboard user={user} onUserLogout={onUserLogout}/>
      ) : (
        <Credentials onRegisterSuccess={(loggedInUser) => setUser(loggedInUser)} 
        onLoginSuccess={onLoginSuccess} setTheme={setTheme} theme={theme}/>
      )}
      
    </div>
  )
}

export default App
