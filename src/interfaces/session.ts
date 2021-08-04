import { ConnectorResponse } from "../network/config/connector";

interface SessionServiceInterface {
    createSession: (
        createSessionCommand: SessionInterface
    ) => Promise<ConnectorResponse>;
}

interface CreateSessionInterface {
    sessionToken: string;
}

interface CreateSessionResponse extends ConnectorResponse {
    data: {
        id: string;
    };
}

interface SessionInterface {
    sessionToken: string;
}

export {
    SessionServiceInterface,
    CreateSessionInterface,
    CreateSessionResponse,
    SessionInterface
};
