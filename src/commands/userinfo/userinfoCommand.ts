import { UserinfoInterface } from "../../interfaces/userinfo";

export default class UserinfoCommand implements UserinfoInterface {
    readonly bearerToken: string;

    constructor(payload: UserinfoInterface) {
        const { bearerToken } = payload;

        if (typeof bearerToken !== "string") {
            throw new Error("Invalid bearerToken");
        }

        this.bearerToken = bearerToken;
    }
}
