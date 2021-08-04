import { AuthnInterface } from "../../interfaces/authn";

export default class AuthnCommand implements AuthnInterface {
    readonly username: string;
    readonly password: string;

    constructor(payload: AuthnInterface) {
        const { username, password } = payload;

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
