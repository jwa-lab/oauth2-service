interface RefreshTokenInterface {
    grant_type: string;
    refresh_token: string;
    basic_auth: string;
    scope?: string | undefined;
}

export default class RefreshTokenCommand implements RefreshTokenInterface {
    readonly grant_type: string;
    readonly refresh_token: string;
    readonly basic_auth: string;
    readonly scope?: string | undefined;

    constructor(data: unknown) {
        const { grant_type, refresh_token, basic_auth, scope } =
            data as RefreshTokenInterface;

        if (typeof grant_type !== "string") {
            throw new Error("INVALID_GRANT_TYPE");
        }

        if (typeof refresh_token !== "string") {
            throw new Error("INVALID_REFRESH_TOKEN");
        }

        if (typeof basic_auth !== "string") {
            throw new Error("INVALID_BASIC");
        }

        if (scope) {
            if (typeof scope !== "string") {
                throw new Error("INVALID_SCOPE");
            }
        }

        this.grant_type = grant_type;
        this.refresh_token = refresh_token;
        this.basic_auth = basic_auth;
        this.scope = scope;
    }
}
