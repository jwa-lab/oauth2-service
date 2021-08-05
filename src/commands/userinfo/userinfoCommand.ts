interface UserinfoInterface {
    bearerToken: string;
}

export default class UserinfoCommand implements UserinfoInterface {
    readonly bearerToken: string;

    constructor(payload: unknown) {
        const { bearerToken } = payload as UserinfoInterface;

        if (typeof bearerToken !== "string") {
            throw new Error("Invalid bearerToken");
        }

        this.bearerToken = bearerToken;
    }
}
