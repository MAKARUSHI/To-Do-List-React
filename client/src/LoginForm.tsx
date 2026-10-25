// props define data type of passed variables
import { useState } from "react"
import { loginUser } from './api';

type LoginGormProps = {
    oClickToRegister: () => void;
    onLoginSuccess: (user: any) => void;
}

export function LoginForm({ oClickToRegister, onLoginSuccess }: LoginGormProps) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            const result = await loginUser({ username, password });
            onLoginSuccess(result.user);  
        } catch (err: any) {
            console.log(err.message);
        }
        
    }
    
    return (
        <form onSubmit={handleSubmit} className="credentials-form">
            <h1 className="credentials-form-title">User Login</h1>

            <input type="text" name="username" className="credentials-input" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/>

            <input type="password" name="password" className="credentials-input" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>

            <hr className="form-divide-line"/>

            <div className="credentials-button-box">
                <button type="submit" className="credentials-submit">Log In</button>
            </div>
            
            <button onClick={oClickToRegister} className="credentials-switch-form">Click to create an account</button>
        </form>
    )
}