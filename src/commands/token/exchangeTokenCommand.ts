interface ExchangeTokenInterface {
    grant_type: string;
    redirect_uri?: string | undefined;
    client_id: string;
    client_secret: string;
    code: string;
}
export default class ExchangeTokenCommand implements ExchangeTokenInterface {
    readonly grant_type: string;
    readonly client_id: string;
    readonly client_secret: string;
    readonly code: string;
    readonly redirect_uri: string | undefined;

    constructor(data: unknown) {
        const { grant_type, client_id, client_secret, code, redirect_uri } =
            data as ExchangeTokenInterface;

        if (typeof grant_type !== "string") {
            throw new Error("Invalid grant_type");
        }

        if (typeof client_id !== "string") {
            throw new Error("Invalid client_id");
        }

        if (typeof client_secret !== "string") {
            throw new Error("Invalid client_secret");
        }

        if (typeof code !== "string") {
            throw new Error("Invalid code");
        }

        if (redirect_uri) {
            if (typeof redirect_uri !== "string") {
                throw new Error("Invalid redirect_uri");
            }
        }

        this.grant_type = grant_type;
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.code = code;
        this.redirect_uri = redirect_uri;
    }
}
