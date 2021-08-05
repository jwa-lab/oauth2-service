import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { AUTHORIZE_ENDPOINT, INTERNAL_REDIRECT_URI } from "../config";
import AuthorizeCommand from "../commands/authorize/authorizeCommand";

interface AuthorizeServiceInterface {
    authorize: (
        authorizeCommand: AuthorizeCommand
    ) => Promise<ConnectorResponse>;
}

export default class OktaAuthorizeService implements AuthorizeServiceInterface {
    private readonly restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        if (!restConnector) {
            throw new Error("No valid REST connector.");
        }

        this.restConnector = restConnector;
    }

    public async authorize(
        authorizeCommand: AuthorizeCommand
    ): Promise<ConnectorResponse> {
        const { state, client_id, scope, cookie, sessionToken } =
            authorizeCommand;
        const parameters = {
            client_id: client_id,
            redirect_uri: INTERNAL_REDIRECT_URI,
            response_type: "code",
            scope: scope,
            prompt: "none",
            state: state,
            nonce: "RandomNonce",
            ...(sessionToken && { sessionToken: sessionToken })
        };

        return this.restConnector.get(AUTHORIZE_ENDPOINT, parameters, {
            headers: {
                ...(cookie && { cookie: cookie })
            }
        });
    }
}
