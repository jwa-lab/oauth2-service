interface UserinfoInterface {
    bearerToken: string;
}

export default class UserinfoCommand implements UserinfoInterface {
    readonly bearerToken: string;

    constructor(data: unknown) {
        const { bearerToken } = data as UserinfoInterface;

        if (typeof bearerToken !== "string") {
            throw new Error("Invalid bearerToken");
        }

        this.bearerToken = bearerToken;
    }
}
