interface AuthorizeInterface {
    state: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    cookie?: string;
    sessionToken?: string;
}

export default class AuthorizeCommand implements AuthorizeInterface {
    readonly state: string;
    readonly client_id: string;
    readonly redirect_uri: string;
    readonly scope: string;
    readonly cookie?: string | undefined;
    readonly sessionToken?: string | undefined;

    constructor(data: unknown) {
        const { state, client_id, redirect_uri, scope, sessionToken, cookie } =
            data as AuthorizeInterface;

        if (typeof state !== "string") {
            throw new Error("INVALID_STATE");
        }

        if (typeof client_id !== "string") {
            throw new Error("INVALID_CLIENT_ID");
        }

        if (typeof redirect_uri !== "string") {
            throw new Error("INVALID_REDIRECT_URI");
        }

        if (typeof scope !== "string") {
            throw new Error("INVALID_SCOPE");
        }

        if (!cookie && !sessionToken) {
            throw new Error("MISSING_AUTHENTICATION_FACTOR");
        }

        if (cookie) {
            if (typeof cookie !== "string") {
                throw new Error("INVALID_COOKIE");
            }
        }

        if (sessionToken) {
            if (typeof sessionToken !== "string") {
                throw new Error("INVALID_SESSION_TOKEN");
            }
        }

        this.state = state;
        this.client_id = client_id;
        this.redirect_uri = redirect_uri;
        this.scope = scope;
        this.cookie = cookie;
        this.sessionToken = sessionToken;
    }
}
