import "./Credentials.css";
import logo from "./assets/to-do-app-logo.png";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ThemeToggle } from "./ThemeToggle"
import { useState } from 'react';

type CredentialsProps = {
    onRegisterSuccess: (user: any) => void;
    onLoginSuccess: (user: any) => void;
}

export function Credentials({ onRegisterSuccess, onLoginSuccess }:CredentialsProps) {
    // for knowing which to display (login or register)
    const [isLoginVisible, setLoginVisible] = useState(true);
    return (
        <div>
            <ThemeToggle/>
            <div className="credentials-container">
                
                <img src={logo} className="credentials-logo"/>
                <hr className="credentials-vertical-line"/>
                
                {isLoginVisible ? (
                    <LoginForm oClickToRegister={() => setLoginVisible(false)} onLoginSuccess={onLoginSuccess}/>
                ) : 
                (<RegisterForm oClickToLogin={() => setLoginVisible(true)} onRegisterSuccess={onRegisterSuccess}/>
                )}
                
            </div>
        </div>
    )
}