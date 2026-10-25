import "./App.css"
import { Credentials } from "./Credentials"
import { Dashboard } from "./Dashboard";
import { useState } from "react"

function App() {

  const [user, setUser] = useState<any>(null);

  return (
    <div style={{width: "100%", height: "100vh"}}>
      {user ? (
        <Dashboard user={user}/>
      ) : (
        <Credentials onRegisterSuccess={(loggedInUser) => setUser(loggedInUser)} 
        onLoginSuccess={(loggedInUser) => setUser(loggedInUser)}/>
      )}
      
    </div>
  )
}

export default App
