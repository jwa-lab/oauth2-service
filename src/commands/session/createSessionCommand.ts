import { CreateSessionInterface } from "../../interfaces/session";

export default class CreateSessionCommand {
    readonly sessionToken: string;

    constructor(payload: CreateSessionInterface) {
        const { sessionToken } = payload;

        if (typeof sessionToken !== "string") {
            throw new Error("Invalid session token");
        }

        this.sessionToken = sessionToken;
    }
}
