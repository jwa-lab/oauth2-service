interface CreateSessionInterface {
    sessionToken: string;
}

export default class CreateSessionCommand implements CreateSessionInterface {
    readonly sessionToken: string;

    constructor(data: unknown) {
        const { sessionToken } = data as CreateSessionInterface;

        if (typeof sessionToken !== "string") {
            throw new Error("Invalid session token");
        }

        this.sessionToken = sessionToken;
    }
}
