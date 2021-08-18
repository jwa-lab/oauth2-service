interface UserinfoInterface {
    bearerToken: string;
}

export default class UserinfoCommand implements UserinfoInterface {
    readonly bearerToken: string;

    constructor(data: Record<string, unknown> | UserinfoInterface) {
        const { bearerToken } = data;

        if (typeof bearerToken !== "string") {
            throw new Error("INVALID_BEARER");
        }

        this.bearerToken = bearerToken;
    }
}
