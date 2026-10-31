export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    formattedBirthday: string;
    gender: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterCredentialsResponse {
    status: boolean;
    message: string;
    error: string;
    user: {
        id: number;
        first_name: string;
        username: string;
        email: string;
        gender: string;
    };
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginCredentialsResponse {
    status: boolean;
    message: string;
    error: string;
    user: {
        id: number;
        first_name: string;
        username: string;
        email: string;
        gender: string;
    };
}

export interface GetTasks {
    idUser: number;
}

export interface Task {
    id_quest: number;
    title: string;
    description: string;
}

export interface GetTasksResponse {
    status: boolean;
    tasks: Task[];
    count: number | null;
}

export interface CheckMemberResponse {
    status: boolean;
    message: string;
    error: string;
}

export interface CreateTask {
    action: string;
    username: string;
    members: string[];
    title: string;
    description: string;
    shared: boolean;
}

export interface taskAction {
    action: string;
    idUser: number;
    idQuest: number;
}

