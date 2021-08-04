import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { AuthnInterface, AuthnServiceInterface } from "../interfaces/authn";
import { AUTHN_ENDPOINT } from "../config";
import AuthnCommand from "../commands/authn/authnCommand";

export default class OktaAuthnService implements AuthnServiceInterface {
    private readonly _restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        this._restConnector = restConnector;
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
        } as AuthnInterface;

        return this._restConnector.post(AUTHN_ENDPOINT, payload);
    }
}
