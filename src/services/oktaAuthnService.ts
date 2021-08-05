import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { AUTHN_ENDPOINT } from "../config";
import AuthnCommand from "../commands/authn/authnCommand";

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

    public async authn(authnCommand: AuthnCommand): Promise<ConnectorResponse> {
        const { username, password } = authnCommand;
        const payload = {
            username: username,
            password: password,
            options: {
                multiOptionalFactorEnroll: false,
                warnBeforePasswordExpired: false
            }
        };

        return this.restConnector.post(AUTHN_ENDPOINT, payload);
    }
}
