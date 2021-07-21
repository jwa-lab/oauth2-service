interface UserinfoInterface {
    bearerToken: string;
}

export default class UserinfoCommand implements UserinfoInterface {
    readonly bearerToken: string;

    constructor({ bearerToken }: UserinfoInterface) {
        if (typeof bearerToken !== "string") {
            throw new Error("INVALID_BEARER");
        }

        this.bearerToken = bearerToken;
    }
}
