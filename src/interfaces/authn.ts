import { ConnectorResponse } from "../network/config/connector";
import AuthnCommand from "../commands/authn/authnCommand";

interface AuthnServiceInterface {
    authn: (authnCommand: AuthnCommand) => Promise<ConnectorResponse>;
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
