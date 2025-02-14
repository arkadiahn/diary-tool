// @todo add dynamic session data interface

export interface User {
    id: string;
    name: string;
    preferred_username: string;
    email: string;
    picture: string;
    scopes: string[];
}

export interface Session {
    expires: number;
    user: User;
}
