import "./Credentials.css";
import logo from "./assets/to-do-app-logo.png";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { useState } from 'react';

export function Credentials() {
    // for knowing which to display (login or register)
    const [isLoginVisible, setLoginVisible] = useState(true);
    return (
        <div className="credentials-container">
            <img src={logo} className="credentials-logo"/>
            <hr className="credentials-vertical-line"/>
            
            {isLoginVisible ? (
                <LoginForm oClickToRegister={() => setLoginVisible(false)}/>
                
            ) : 
            (<RegisterForm oClickToLogin={() => setLoginVisible(true)}/>)}
            
        </div>
    )
}