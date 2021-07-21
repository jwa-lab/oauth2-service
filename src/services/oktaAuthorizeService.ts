import { v4 as uuidv4 } from "uuid";
import AuthorizeCommand from "../commands/authorizeCommand";
import { AUTHORIZE_ENDPOINT, INTERNAL_REDIRECT_URI } from "../config";
import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { AuthorizeResponse } from "../private/authorizePrivateHandler";

interface AuthorizeServiceInterface {
    authorize: (
        authorizeCommand: AuthorizeCommand
    ) => Promise<ConnectorResponse<AuthorizeResponse>>;
}

export default class OktaAuthorizeService implements AuthorizeServiceInterface {
    private readonly restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        if (!restConnector) {
            throw new Error("No valid REST connector.");
        }

        this.restConnector = restConnector;
    }

    public async authorize({
        state,
        client_id,
        scope,
        cookie,
        sessionToken
    }: AuthorizeCommand): Promise<ConnectorResponse<AuthorizeResponse>> {
        return this.restConnector.get<AuthorizeResponse>(
            AUTHORIZE_ENDPOINT,
            {
                client_id,
                redirect_uri: INTERNAL_REDIRECT_URI,
                response_type: "code",
                scope,
                prompt: "none",
                state,
                nonce: uuidv4(),
                sessionToken
            },
            {
                headers: {
                    cookie
                }
            }
        );
    }
}
