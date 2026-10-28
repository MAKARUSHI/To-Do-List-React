import type { RegisterCredentials, RegisterCredentialsResponse, LoginCredentials, LoginCredentialsResponse } from './Types';

const API_BASE_URL = "http://webtrac.duckdns.org";

export async function registerUser(credentials: RegisterCredentials): Promise<RegisterCredentialsResponse> {
    const response = await fetch(`${API_BASE_URL}/server/auth/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginCredentialsResponse> {
    const response = await fetch(`${API_BASE_URL}/server/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
}

export async function logoutUser(userId: number, deleteAccount: boolean) {
    console.log("interval", deleteAccount, userId);
    const response = await fetch(`${API_BASE_URL}/server/auth/userHeartbeat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: userId, deleteAccount: deleteAccount }),
    });
    const data = await response.json();
    return data;
}