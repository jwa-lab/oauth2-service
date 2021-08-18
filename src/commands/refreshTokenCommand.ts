interface RefreshTokenInterface {
    grant_type: string;
    refresh_token: string;
    basic_auth: string;
    scope?: string;
}

export default class RefreshTokenCommand implements RefreshTokenInterface {
    readonly grant_type: string;
    readonly refresh_token: string;
    readonly basic_auth: string;
    readonly scope?: string;

    constructor(data: Record<string, unknown> | RefreshTokenInterface) {
        const { grant_type, refresh_token, basic_auth, scope } =
            data;

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

            this.scope = scope;
        }

        this.grant_type = grant_type;
        this.refresh_token = refresh_token;
        this.basic_auth = basic_auth;
    }
}
