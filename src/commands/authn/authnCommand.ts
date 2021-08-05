interface AuthnInterface {
    username: string;
    password: string;
}

export default class AuthnCommand implements AuthnInterface {
    readonly username: string;
    readonly password: string;

    constructor(payload: unknown) {
        const { username, password } = payload as AuthnInterface;

        if (typeof username !== "string") {
            throw new Error("Invalid username");
        }

        if (typeof password !== "string") {
            throw new Error("Invalid password");
        }

        this.username = username;
        this.password = password;
    }
}
