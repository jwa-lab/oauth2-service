interface CreateSessionInterface {
    sessionToken: string;
}

export default class CreateSessionCommand implements CreateSessionInterface {
    readonly sessionToken: string;

    constructor(payload: unknown) {
        const { sessionToken } = payload as CreateSessionInterface;

        if (typeof sessionToken !== "string") {
            throw new Error("Invalid session token");
        }

        this.sessionToken = sessionToken;
    }
}
