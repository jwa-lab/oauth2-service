import { ConnectorResponse } from "../network/config/connector";

interface UserinfoServiceInterface {
    userinfo: (userinfoCommand: UserinfoInterface) => Promise<ConnectorResponse>;
}

interface UserinfoResponse extends ConnectorResponse {
    data: Record<never, unknown>;
}

interface UserinfoInterface {
    bearerToken: string;
}

export { UserinfoServiceInterface, UserinfoResponse, UserinfoInterface };
