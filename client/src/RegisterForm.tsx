import { useState } from "react"
import { registerUser } from "./Api";
import { Alert } from "./Alert";
import eyeOpened from "./assets/eye-opened.png";
import eyeClosed from "./assets/eye-closed.png";

// props define data type of passed variables
type RegisterFormProps = {
    onClickToLogin: () => void;
    onRegisterSuccess: (user: any) => void;
    setShowAlert: (showAlert: boolean) => void;
    onAlertClose: () => void;
    showAlert: boolean;
}

export function RegisterForm({ onClickToLogin, onRegisterSuccess, setShowAlert, onAlertClose, showAlert } : RegisterFormProps) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [birthDay, setBirthDay] = useState("01");
    const [birthMonth, setBirthMonth] = useState("01");
    const [birthYear, setBirthYear] = useState("2026");
    const [gender, setGender] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
 

    // For knowing which box of register to display
    const [visibleBoxIndex, setVisibleBoxIndex] = useState(0);

    const [showPassword, setShowPassword] = useState(false);

    const toggleVisiblePassword = () => {
        setShowPassword((prev) => {return !prev;});
    }

    const showNextBox = () =>  {
        setVisibleBoxIndex((prev) => prev + 1);
    }

    const showPreviousBox = () =>  {
        setVisibleBoxIndex((prev) => prev - 1);
    }

    const formattedBirthday = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!firstName.trim() || !lastName.trim() || !username.trim() || !email.trim() || !gender || !password || !confirmPassword) {
            setError("Please fill in all required fields");
            setShowAlert(true);
        } else if (password !== confirmPassword) {
            setError("Passwords are not matching");
            setShowAlert(true);
        } else {
            try {
                const result = await registerUser({ firstName, lastName, username, email, formattedBirthday, gender, password, confirmPassword });
                if (!result.status) {
                    setError(result.error);
                    setShowAlert(true);
                } else {
                    setError(null);
                    setShowAlert(false);
                    onRegisterSuccess(result.user);
                }

            } catch (err: any) {
                console.log(error);
            }
        }
    };

    

    return (
        <form onSubmit={handleSubmit} className="credentials-form" noValidate>
            <h1 className="credentials-form-title">User Register</h1>
            <Alert message={error} isOpen={showAlert} onClose={onAlertClose}/>

            {
            // if true it shows first box
            }
            {visibleBoxIndex === 0 && (
            <div className="register-box">
                <input type="text" 
                className="credentials-input" 
                placeholder="First Name *"
                required
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}/>

                <input type="text" 
                className="credentials-input" 
                placeholder="Last Name *"
                required
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)}/>
                
                <input type="text" 
                className="credentials-input" 
                placeholder="Username *"
                required 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}/>

                <hr className="form-divide-line"/>
                <div className="credentials-button-box">
                    <button type="button" className="credentials-submit" onClick={showNextBox}>Next</button>
                </div>
            </div>
            )}
            {visibleBoxIndex === 1 && (
            <div className="register-box">

                <input type="email" 
                className="credentials-input" 
                placeholder="Email *"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}/>
                
                <div>
                    <label className="credentials-label">Birthday</label>
                    <div className="credentials-input-date-box">
                        <select className="credentials-input" 
                        name="birthday-day"
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                            <option value="24">24</option>
                            <option value="25">25</option>
                            <option value="26">26</option>
                            <option value="27">27</option>
                            <option value="28">28</option>
                            <option value="29">29</option>
                            <option value="30">30</option>
                            <option value="31">31</option>
                        </select>

                        <select className="credentials-input" 
                        name="birthday-month"
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                        </select>

                        <select className="credentials-input" 
                        name="birthday-year"
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}>
                            <option value="2026">2026</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                            <option value="2019">2019</option>
                            <option value="2018">2018</option>
                            <option value="2017">2017</option>
                            <option value="2016">2016</option>
                            <option value="2015">2015</option>
                            <option value="2014">2014</option>
                            <option value="2013">2013</option>
                            <option value="2012">2012</option>
                            <option value="2011">2011</option>
                            <option value="2010">2010</option>
                            <option value="2009">2009</option>
                            <option value="2008">2008</option>
                            <option value="2007">2007</option>
                            <option value="2006">2006</option>
                            <option value="2005">2005</option>
                            <option value="2004">2004</option>
                            <option value="2003">2003</option>
                            <option value="2002">2002</option>
                            <option value="2001">2001</option>
                            <option value="2000">2000</option>
                            <option value="1999">1999</option>
                            <option value="1998">1998</option>
                            <option value="1997">1997</option>
                            <option value="1996">1996</option>
                            <option value="1995">1995</option>
                            <option value="1994">1994</option>
                            <option value="1993">1993</option>
                            <option value="1992">1992</option>
                            <option value="1991">1991</option>
                            <option value="1990">1990</option>
                            <option value="1989">1989</option>
                            <option value="1988">1988</option>
                            <option value="1987">1987</option>
                            <option value="1986">1986</option>
                            <option value="1985">1985</option>
                            <option value="1984">1984</option>
                            <option value="1983">1983</option>
                            <option value="1982">1982</option>
                            <option value="1981">1981</option>
                            <option value="1980">1980</option>
                            <option value="1979">1979</option>
                            <option value="1978">1978</option>
                            <option value="1977">1977</option>
                            <option value="1976">1976</option>
                            <option value="1975">1975</option>
                            <option value="1974">1974</option>
                            <option value="1973">1973</option>
                            <option value="1972">1972</option>
                            <option value="1971">1971</option>
                            <option value="1970">1970</option>
                            <option value="1969">1969</option>
                            <option value="1968">1968</option>
                            <option value="1967">1967</option>
                            <option value="1966">1966</option>
                            <option value="1965">1965</option>
                            <option value="1964">1964</option>
                            <option value="1963">1963</option>
                            <option value="1962">1962</option>
                            <option value="1961">1961</option>
                            <option value="1960">1960</option>
                            <option value="1959">1959</option>
                            <option value="1958">1958</option>
                            <option value="1957">1957</option>
                            <option value="1956">1956</option>
                            <option value="1955">1955</option>
                            <option value="1954">1954</option>
                            <option value="1953">1953</option>
                            <option value="1952">1952</option>
                            <option value="1951">1951</option>
                            <option value="1950">1950</option>
                            <option value="1949">1949</option>
                            <option value="1948">1948</option>
                            <option value="1947">1947</option>
                            <option value="1946">1946</option>
                            <option value="1945">1945</option>
                            <option value="1944">1944</option>
                            <option value="1943">1943</option>
                            <option value="1942">1942</option>
                            <option value="1941">1941</option>
                            <option value="1940">1940</option>
                            <option value="1939">1939</option>
                            <option value="1938">1938</option>
                            <option value="1937">1937</option>
                            <option value="1936">1936</option>
                            <option value="1935">1935</option>
                            <option value="1934">1934</option>
                            <option value="1933">1933</option>
                            <option value="1932">1932</option>
                            <option value="1931">1931</option>
                            <option value="1930">1930</option>
                            <option value="1929">1929</option>
                            <option value="1928">1928</option>
                            <option value="1927">1927</option>
                            <option value="1926">1926</option>
                            <option value="1925">1925</option>
                            <option value="1924">1924</option>
                            <option value="1923">1923</option>
                            <option value="1922">1922</option>
                            <option value="1921">1921</option>
                            <option value="1920">1920</option>
                            <option value="1919">1919</option>
                            <option value="1918">1918</option>
                            <option value="1917">1917</option>
                            <option value="1916">1916</option>
                            <option value="1915">1915</option>
                            <option value="1914">1914</option>
                            <option value="1913">1913</option>
                            <option value="1912">1912</option>
                            <option value="1911">1911</option>
                            <option value="1910">1910</option>
                            <option value="1909">1909</option>
                            <option value="1908">1908</option>
                            <option value="1907">1907</option>
                            <option value="1906">1906</option>
                            <option value="1905">1905</option>
                            <option value="1904">1904</option>
                            <option value="1903">1903</option>
                            <option value="1902">1902</option>
                            <option value="1901">1901</option>
                        </select>
                    </div>
                </div>
                
                <div>
                    <label className="credentials-label">Gender</label>
                    <div className="credentials-input-gender-box">
                        <label className="credentials-input-gender" 
                        htmlFor="gender-input-man">
                            <input type="radio" 
                            name="gender" 
                            value="m"
                            required
                            checked={gender === "m"}
                            id="gender-input-man"
                            onChange={(e) => setGender(e.target.value)}/>
                            Man
                        </label>

                        <label className="credentials-input-gender" 
                        htmlFor="gender-input-woman">
                            <input type="radio"
                            name="gender"
                            value="w"
                            required 
                            checked={gender === "w"}
                            id="gender-input-woman" 
                            onChange={(e) => setGender(e.target.value)}/>
                            Woman
                        </label>

                        <label className="credentials-input-gender" 
                        htmlFor="gender-input-other">
                            <input type="radio" 
                            name="gender"
                            value="o"
                            required
                            checked={gender === "o"}
                            id="gender-input-other" 
                            onChange={(e) => setGender(e.target.value)}/>
                            Other
                        </label>
                    </div>

                </div>
                
                <hr className="form-divide-line"/>

                <div className="credentials-button-box">
                    <button type="button" className="credentials-submit" onClick={showPreviousBox}>Back</button>
                    <button type="button" className="credentials-submit" onClick={showNextBox}>Next</button>
                </div>
            </div>
            )}

            {visibleBoxIndex === 2 && (
            <div className="register-box">
                
                <input type={showPassword ? "text" : "password"} 
                className="credentials-input" 
                placeholder="Password *"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
                
                <div className="credentials-password-box">
                    <input type={showPassword ? "text" : "password"}
                    className="credentials-input" 
                    placeholder="Confirm Password *"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <button type="button" className="credentials-input-toggle-password" onClick={toggleVisiblePassword}>
                        <img src={showPassword ? eyeClosed : eyeOpened} alt="Password visibility toggle" />
                    </button>
                </div>

                <hr className="form-divide-line"/>

                <div className="credentials-button-box">
                    <button type="button" className="credentials-submit" onClick={showPreviousBox}>Back</button>
                    <button type="submit" className="credentials-submit">Register</button>
                </div>
                
            </div>
            )}

            <button onClick={() => {
                    setShowAlert(false);
                    setError(null);
                    onClickToLogin();
                }} className="credentials-switch-form">Have an account, click</button>
        </form>
    )
}