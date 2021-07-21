import ConnectorInterface, { ConnectorResponse } from "../network/config/connector";
import { SESSIONS_ENDPOINT } from "../config";
import { CreateSessionInterface, SessionServiceInterface } from "../interfaces/session";

export default class OktaSessionService implements SessionServiceInterface {
    private readonly _restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        this._restConnector = restConnector;
    }

    public async createSession(
        createSessionCommand: CreateSessionInterface
    ): Promise<ConnectorResponse> {
        const { sessionToken } = createSessionCommand;
        const payload = {
            sessionToken: sessionToken
        } as CreateSessionInterface;

        return this._restConnector.post(SESSIONS_ENDPOINT, payload);
    }
}
