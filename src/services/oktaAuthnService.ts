import AuthnCommand from "../commands/authnCommand";
import { AUTHN_ENDPOINT } from "../config";
import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { AuthnResponse } from "../private/authnPrivateHandler";

interface AuthnServiceInterface {
    authn: (
        authnCommand: AuthnCommand
    ) => Promise<ConnectorResponse<AuthnResponse>>;
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
    ): Promise<ConnectorResponse<AuthnResponse>> {
        const { username, password } = authnCommand;
        const payload = {
            username: username,
            password: password,
            options: {
                multiOptionalFactorEnroll: false,
                warnBeforePasswordExpired: false
            }
        };

        return this.restConnector.post<AuthnResponse>(AUTHN_ENDPOINT, payload);
    }
}
