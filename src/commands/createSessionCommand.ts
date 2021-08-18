interface CreateSessionInterface {
    sessionToken: string;
}

export default class CreateSessionCommand implements CreateSessionInterface {
    readonly sessionToken: string;

    constructor({ sessionToken }: CreateSessionInterface) {
        if (typeof sessionToken !== "string") {
            throw new Error("INVALID_SESSION_TOKEN");
        }

        this.sessionToken = sessionToken;
    }
}
