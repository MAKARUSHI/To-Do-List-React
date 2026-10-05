// props define data type of passed variables
type LoginGormProps = {
    oClickToRegister: () => void;
}

export function LoginForm({ oClickToRegister }: LoginGormProps) {

    return (
        <form className="credentials-form">
            <h1 className="credentials-form-title">User Login</h1>

            <input type="email" className="credentials-input" placeholder="Email"/>

            <input type="password" className="credentials-input" placeholder="Password"/>

            <hr className="form-divide-line"/>

            <div className="credentials-button-box">
                <button type="submit" className="credentials-submit">Log In</button>
            </div>
            
            <button onClick={oClickToRegister} className="credentials-switch-form">Click to create an account</button>
        </form>
    )
}