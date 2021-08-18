import CreateSessionCommand from "../commands/createSessionCommand";
import { SESSIONS_ENDPOINT } from "../config";
import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { CreateSessionResponse } from "../private/sessionPrivateHandler";

interface SessionServiceInterface {
    createSession: (
        createSessionCommand: CreateSessionCommand
    ) => Promise<ConnectorResponse<CreateSessionResponse>>;
}

export default class OktaSessionService implements SessionServiceInterface {
    private readonly restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        if (!restConnector) {
            throw new Error("No valid REST connector.");
        }

        this.restConnector = restConnector;
    }

    public async createSession(
        createSessionCommand: CreateSessionCommand
    ): Promise<ConnectorResponse<CreateSessionResponse>> {
        const { sessionToken } = createSessionCommand;
        const payload = {
            sessionToken
        };

        return this.restConnector.post<CreateSessionResponse>(
            SESSIONS_ENDPOINT,
            payload
        );
    }
}
