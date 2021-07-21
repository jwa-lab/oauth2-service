import AuthnCommand from "../commands/authn/authnCommand";
import { ConnectorResponse } from "../network/config/connector";

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
