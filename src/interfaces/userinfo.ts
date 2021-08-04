import { ConnectorResponse } from "../network/config/connector";
import UserinfoCommand from "../commands/userinfo/userinfoCommand";

interface UserinfoServiceInterface {
    userinfo: (userinfoCommand: UserinfoCommand) => Promise<ConnectorResponse>;
}

interface UserinfoResponse extends ConnectorResponse {
    data: Record<never, unknown>;
}

interface UserinfoInterface {
    bearerToken: string;
}

export { UserinfoServiceInterface, UserinfoResponse, UserinfoInterface };
