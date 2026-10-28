import type { RegisterCredentials, RegisterCredentialsResponse, LoginCredentials, LoginCredentialsResponse, LogoutCredentials } from './Types';

const API_BASE_URL = 'http://webtrac.duckdns.org';

export async function registerUser(credentials: RegisterCredentials): Promise<RegisterCredentialsResponse> {
    const response = await fetch(`${API_BASE_URL}/server/auth/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
}

export async function loginUser(credentials: LoginCredentials): Promise<LoginCredentialsResponse> {
    const response = await fetch(`${API_BASE_URL}/server/auth/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
}

export async function logoutUser(credentials: LogoutCredentials) {
    const response = await fetch(`${API_BASE_URL}/server/auth/logout.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
}