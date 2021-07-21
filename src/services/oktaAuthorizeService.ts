import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { AUTHORIZE_ENDPOINT, INTERNAL_REDIRECT_URI } from "../config";
import {
    AuthorizeInterface,
    AuthorizeServiceInterface
} from "../interfaces/authorize";

export default class OktaAuthorizeService implements AuthorizeServiceInterface {
    private readonly _restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        this._restConnector = restConnector;
    }

    public async authorize(
        authorizeCommand: AuthorizeInterface
    ): Promise<ConnectorResponse> {
        const { state, client_id, scope, cookie, sessionToken } =
            authorizeCommand;

        return this._restConnector.get(
            AUTHORIZE_ENDPOINT,
            {
                client_id: client_id,
                redirect_uri: INTERNAL_REDIRECT_URI,
                response_type: "code",
                scope: scope,
                prompt: "none",
                state: state,
                nonce: "RandomNonce",
                ...(sessionToken && { sessionToken: sessionToken })
            },
            {
                headers: {
                    ...(cookie && { cookie: cookie })
                }
            }
        );
    }
}
