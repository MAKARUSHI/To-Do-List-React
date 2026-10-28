import "./Credentials.css";
import logo from "./assets/to-do-app-logo.png";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ThemeToggle } from "./ThemeToggle"
import { useState } from 'react';

type CredentialsProps = {
    onAuthSuccess: (user: any) => void;
    setTheme: (theme: string) => void;
    theme: string;
}

export function Credentials({  onAuthSuccess, setTheme, theme }:CredentialsProps) {
    // for knowing which to display (login or register)
    const [isLoginVisible, setLoginVisible] = useState(true);

    // dispalying pop-up message
    const [showAlert, setShowAlert] = useState(false);

    const onAlertClose = () => {
        setShowAlert(false);
    }

    return (
        <div>
            <ThemeToggle setTheme={setTheme} theme={theme} source="credentials"/>
            <div className="credentials-container">
                
                <img src={logo} className="credentials-logo"/>
                <hr className="credentials-vertical-line"/>
                
                {isLoginVisible ? (
                    <LoginForm onClickToRegister={() => setLoginVisible(false)} onAuthSuccess={onAuthSuccess} setShowAlert={setShowAlert} onAlertClose={onAlertClose} showAlert={showAlert}/>
                ) : 
                (<RegisterForm onClickToLogin={() => setLoginVisible(true)} onAuthSuccess={onAuthSuccess} setShowAlert={setShowAlert} onAlertClose={onAlertClose} showAlert={showAlert}/>
                )}
                
            </div>
        </div>
    )
}