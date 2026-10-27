import "./App.css"
import { Credentials } from "./Credentials"
import { Dashboard } from "./Dashboard";
import { useState } from "react"

function App() {

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
        onLoginSuccess={onLoginSuccess}/>
      )}
      
    </div>
  )
}

export default App
