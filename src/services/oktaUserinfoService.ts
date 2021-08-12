import UserinfoCommand from "../commands/userinfo/userinfoCommand";
import { USERINFO_ENDPOINT } from "../config";
import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { UserinfoResponse } from "../private/userinfoPrivateHandler";

interface UserinfoServiceInterface {
    userinfo: (userinfoCommand: UserinfoCommand) => Promise<ConnectorResponse>;
}

export default class OktaUserinfoService implements UserinfoServiceInterface {
    private readonly restConnector: ConnectorInterface;

    constructor(restConnector: ConnectorInterface) {
        if (!restConnector) {
            throw new Error("No valid REST connector.");
        }

        this.restConnector = restConnector;
    }

    public async userinfo(
        userinfoCommand: UserinfoCommand
    ): Promise<UserinfoResponse> {
        const { bearerToken } = userinfoCommand;

        return this.restConnector.get(USERINFO_ENDPOINT, undefined, {
            headers: {
                authorization: bearerToken
            }
        }) as Promise<UserinfoResponse>;
    }
}
