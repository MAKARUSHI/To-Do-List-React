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
        username: string;
        email: string;
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
        username: string;
        firstName: string;
        gender: string;
    };
}