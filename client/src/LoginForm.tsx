// props define data type of passed variables
import { useState } from "react"
import { loginUser } from './Api';
import { Alert } from "./Alert";
import eyeOpened from "./assets/eye-opened.png";
import eyeClosed from "./assets/eye-closed.png";

type LoginFormProps = {
    onClickToRegister: () => void;
    onAuthSuccess: (user: any) => void;
    setShowAlert: (showAlert: boolean) => void;
    onAlertClose: () => void;
    showAlert: boolean;
}

export function LoginForm({ onClickToRegister, onAuthSuccess, setShowAlert, onAlertClose, showAlert }: LoginFormProps) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!username.trim() || !password) {
            setError("Fill in all required fields");
            setShowAlert(true);   
        } else {
            try {
                const result = await loginUser({ username, password });
                if (!result.status) {
                    setError(result.error);
                    setShowAlert(true); 
                } else {
                    setShowAlert(false);
                    setError(null);
                    onAuthSuccess(result.user);  
                }
            } catch (err: any) {
                console.log(err.message);
            }
        }
    }

    const toggleVisiblePassword = () => {
        setShowPassword((prev) => {return !prev;});
    }

    return (
        <form onSubmit={handleSubmit} className="credentials-form" noValidate>
            <h1 className="credentials-form-title">User Login</h1>
            <Alert message={error} isOpen={showAlert} onClose={onAlertClose}/>

            <input type="text" name="username" className="credentials-input" placeholder="Username *" required autoComplete="username" onChange={(e) => setUsername(e.target.value)}/>

            <div className="credentials-password-box">
                <input type={showPassword ? "text" : "password"} name="password" className="credentials-input" placeholder="Password *" required onChange={(e) => setPassword(e.target.value)}/>
                <button type="button" className="credentials-input-toggle-password" onClick={toggleVisiblePassword}>
                    <img src={showPassword ? eyeClosed : eyeOpened} alt="Password visibility toggle" />
                </button>
            </div>

            <hr className="form-divide-line"/>

            <div className="credentials-button-box">
                <button type="submit" className="credentials-submit">Log In</button>
            </div>
            
            <button onClick={() => {
                    setShowAlert(false);
                    setError(null);
                    onClickToRegister();
                }} className="credentials-switch-form">Click to create an account</button>
        </form>
    )
}