import type {
    RegisterCredentials, RegisterCredentialsResponse, LoginCredentials,
    LoginCredentialsResponse, GetTasks, GetTasksResponse, CreateTask, CheckMemberResponse
} from './Types';

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

export async function logoutUser(userId: number, action: string) {
    await fetch(`${API_BASE_URL}/server/auth/userHeartbeat.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_user: userId, action: action }),
    });
    return;
}

export async function getTasks(credentials: GetTasks): Promise<GetTasksResponse> {
    const response = await fetch(`${API_BASE_URL}/server/dashboard/getTasks.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });
    const data = await response.json();
    return data;
}

export async function checkMember(username: string): Promise<CheckMemberResponse> {
    const url = `${API_BASE_URL}/server/dashboard/createTask.php?username=${encodeURIComponent(username)}`;
    const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data;
}

export async function createTask(task: CreateTask) {
    await fetch(`${API_BASE_URL}/server/dashboard/createTask.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
    });
    return
}