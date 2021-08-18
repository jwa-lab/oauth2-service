interface RefreshTokenInterface {
    grant_type: string;
    refresh_token: string;
    authorization: string;
    scope?: string;
}

export default class RefreshTokenCommand implements RefreshTokenInterface {
    readonly grant_type: string;
    readonly refresh_token: string;
    readonly authorization: string;
    readonly scope?: string;

    constructor({
        grant_type,
        refresh_token,
        authorization,
        scope
    }: RefreshTokenInterface) {
        if (typeof grant_type !== "string") {
            throw new Error("INVALID_GRANT_TYPE");
        }

        if (typeof refresh_token !== "string") {
            throw new Error("INVALID_REFRESH_TOKEN");
        }

        if (typeof authorization !== "string") {
            throw new Error("INVALID_BASIC");
        }

        if (scope) {
            if (typeof scope !== "string") {
                throw new Error("INVALID_SCOPE");
            }

            this.scope = scope;
        }

        this.grant_type = grant_type;
        this.refresh_token = refresh_token;
        this.authorization = authorization;
    }
}
