import AuthnCommand from "../commands/authn/authnCommand";
import { AUTHN_ENDPOINT } from "../config";
import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { AuthnResponseInterface } from "../private/authnPrivateHandler";

interface AuthnServiceInterface {
    authn: (authnCommand: AuthnCommand) => Promise<ConnectorResponse>;
}

export default class OktaAuthnService implements AuthnServiceInterface {
    private readonly restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        if (!restConnector) {
            throw new Error("No valid REST connector.");
        }

        this.restConnector = restConnector;
    }

    public async authn(
        authnCommand: AuthnCommand
    ): Promise<AuthnResponseInterface> {
        const { username, password } = authnCommand;
        const payload = {
            username: username,
            password: password,
            options: {
                multiOptionalFactorEnroll: false,
                warnBeforePasswordExpired: false
            }
        };

        return this.restConnector.post(
            AUTHN_ENDPOINT,
            payload
        ) as Promise<AuthnResponseInterface>;
    }
}
