import CreateSessionCommand from "../commands/session/createSessionCommand";
import { SESSIONS_ENDPOINT } from "../config";
import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";

interface SessionServiceInterface {
    createSession: (
        createSessionCommand: CreateSessionCommand
    ) => Promise<ConnectorResponse>;
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
    ): Promise<ConnectorResponse> {
        const { sessionToken } = createSessionCommand;
        const payload = {
            sessionToken: sessionToken
        };

        return this.restConnector.post(SESSIONS_ENDPOINT, payload);
    }
}
