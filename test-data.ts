export type Credentials = {
    email: string;
    password: string;
    role?: string
};

export const validUser: Credentials = {
    email: "valid_user@gmail.com",
    password: "validPassword",
    role: "employee"
};

export function getLoginUrl(env: string): string {
    return `https://${env}.example.com/login`;
}