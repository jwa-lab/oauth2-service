import { ConnectorResponse } from "../network/config/connector";

interface AuthnServiceInterface {
    authn: (authnCommand: AuthnInterface) => Promise<ConnectorResponse>;
}

interface AuthnResponseInterface extends ConnectorResponse {
    data: {
        sessionToken: string;
    };
}

interface AuthnInterface {
    username: string;
    password: string;
}

export { AuthnServiceInterface, AuthnResponseInterface, AuthnInterface };
