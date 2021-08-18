interface ExchangeTokenInterface {
    grant_type: string;
    client_id: string;
    client_secret: string;
    code: string;
    redirect_uri?: string;
}
export default class ExchangeTokenCommand implements ExchangeTokenInterface {
    readonly grant_type: string;
    readonly client_id: string;
    readonly client_secret: string;
    readonly code: string;
    readonly redirect_uri?: string;

    constructor({
        grant_type,
        client_id,
        client_secret,
        code,
        redirect_uri
    }: ExchangeTokenInterface) {
        if (typeof grant_type !== "string") {
            throw new Error("INVALID_GRANT_TYPE");
        }

        if (typeof client_id !== "string") {
            throw new Error("INVALID_CLIENT_ID");
        }

        if (typeof client_secret !== "string") {
            throw new Error("INVALID_CLIENT_SECRET");
        }

        if (typeof code !== "string") {
            throw new Error("INVALID_CODE");
        }

        if (redirect_uri) {
            if (typeof redirect_uri !== "string") {
                throw new Error("INVALID_REDIRECT_URI");
            }

            this.redirect_uri = redirect_uri;
        }

        this.grant_type = grant_type;
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.code = code;
    }
}
