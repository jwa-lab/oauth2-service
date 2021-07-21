import { ConnectorResponse } from "../network/config/connector";

interface AuthorizeServiceInterface {
    authorize: (
        authorizeCommand: AuthorizeInterface
    ) => Promise<ConnectorResponse>;
}

interface AuthorizeInterface {
    state: string;
    client_id: string;
    redirect_uri: string;
    scope: string;
    cookie?: string | undefined;
    sessionToken?: string | undefined;
}

interface AuthorizeResponseInterface extends ConnectorResponse {
    data: {
        code: string;
        state: string;
        redirect_uri: string;
    };
}

interface AuthorizeCodeInterface {
    code: string;
    state?: string;
}

export {
    AuthorizeServiceInterface,
    AuthorizeInterface,
    AuthorizeResponseInterface,
    AuthorizeCodeInterface
};
