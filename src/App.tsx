import "./App.css"
import { ThemeToggle } from "./ThemeToggle"
import { Credentials } from "./Credentials"

function App() {
  return (
    <div style={{width: "100%", height: "100vh"}}>
      <ThemeToggle/>
      <Credentials/>
    </div>
  )
}

export default App
