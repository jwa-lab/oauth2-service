interface AuthnInterface {
    username: string;
    password: string;
}

export default class AuthnCommand implements AuthnInterface {
    readonly username: string;
    readonly password: string;

    constructor({ username, password }: AuthnInterface) {
        if (typeof username !== "string") {
            throw new Error("INVALID_USERNAME");
        }

        if (typeof password !== "string") {
            throw new Error("INVALID_PASSWORD");
        }

        this.username = username;
        this.password = password;
    }
}
