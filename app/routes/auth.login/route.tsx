import { useState } from "react";
import { CustomInput } from "~/ui/CustomInput";
import Cookies from "js-cookie";

const COOKIE_EXPIRY = 0.5;
const AUTH_COOKIE_NAME = "auth_token";
const USER_DATA_COOKIE_NAME = "user_data";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    
    const validateInputs = () => {
        if (!email) {
            setError("Email is required.");
            return false;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }
        if (!password) {
            setError("Password is required.");
            return false;
        }
        return true;
    };


    const loginUser = async () => {
        if (!validateInputs()) return;
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
        console.log("Response status:", res);

        const data = await res.json();
        console.log('the data', data);
        
        if (res.ok) {
            setError("");
            Cookies.set(AUTH_COOKIE_NAME, data.data.token, { expires: COOKIE_EXPIRY });
            Cookies.set(USER_DATA_COOKIE_NAME, JSON.stringify(data.data.user), { expires: COOKIE_EXPIRY });
            window.location.href = "/";
        } else {
            setError(data.error || "Login failed");
        }
    };
    return (
        <div className="login_page">
            <h1>Login</h1>
            <p>This is a placeholder for the login page. You can implement your login form here.</p>
            <form className="login_form"  onSubmit={(e) => { e.preventDefault(); loginUser(); }}>
                <CustomInput label="Email" name="email" type="email" placeholder="Email" onChange={e=> setEmail(e.target.value)} required />
                <CustomInput label="Password" name="password" type="password" placeholder="Password" onChange={e=> setPassword(e.target.value)} required />

                
                <button className="btn login_btn" type="submit">Login</button>
            </form>
            {error && <p className="error_text">{error}</p>}
        </div>
  )
}
