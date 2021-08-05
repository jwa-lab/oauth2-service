interface AuthorizeInterface {
    state: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    cookie?: string | undefined;
    sessionToken?: string | undefined;
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
        console.log(data);
        if (typeof state !== "string") {
            throw new Error("Invalid state");
        }

        if (typeof client_id !== "string") {
            throw new Error("Invalid client_id");
        }

        if (typeof redirect_uri !== "string") {
            throw new Error("Invalid redirect_uri");
        }

        if (typeof scope !== "string") {
            throw new Error("Invalid scope");
        }

        if (!cookie && !sessionToken) {
            throw new Error("Missing authentication factor.");
        }

        if (cookie) {
            if (typeof cookie !== "string") {
                throw new Error("Invalid cookie");
            }
        }

        if (sessionToken) {
            if (typeof sessionToken !== "string") {
                throw new Error("Invalid session token");
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
