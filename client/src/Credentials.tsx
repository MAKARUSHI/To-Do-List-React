import "./Credentials.css";
import logo from "./assets/to-do-app-logo.png";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ThemeToggle } from "./ThemeToggle"
import { useState } from 'react';

type CredentialsProps = {
    onRegisterSuccess: (user: any) => void;
    onLoginSuccess: (user: any) => void;
    setTheme: (theme: string) => void;
    theme: string;
}

export function Credentials({ onRegisterSuccess, onLoginSuccess, setTheme, theme }:CredentialsProps) {
    // for knowing which to display (login or register)
    const [isLoginVisible, setLoginVisible] = useState(true);

    // dispalying pop-up message
    const [showAlert, setShowAlert] = useState(false);

    const onAlertClose = () => {
        setShowAlert(false);
    }

    return (
        <div>
            <ThemeToggle setTheme={setTheme} theme={theme}/>
            <div className="credentials-container">
                
                <img src={logo} className="credentials-logo"/>
                <hr className="credentials-vertical-line"/>
                
                {isLoginVisible ? (
                    <LoginForm onClickToRegister={() => setLoginVisible(false)} onLoginSuccess={onLoginSuccess} setShowAlert={setShowAlert} onAlertClose={onAlertClose} showAlert={showAlert}/>
                ) : 
                (<RegisterForm onClickToLogin={() => setLoginVisible(true)} onRegisterSuccess={onRegisterSuccess} setShowAlert={setShowAlert} onAlertClose={onAlertClose} showAlert={showAlert}/>
                )}
                
            </div>
        </div>
    )
}