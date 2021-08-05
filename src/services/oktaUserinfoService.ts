import ConnectorInterface, {
    ConnectorResponse
} from "../network/config/connector";
import { USERINFO_ENDPOINT } from "../config";
import UserinfoCommand from "../commands/userinfo/userinfoCommand";

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
    ): Promise<ConnectorResponse> {
        const { bearerToken } = userinfoCommand;

        return this.restConnector.get(USERINFO_ENDPOINT, undefined, {
            headers: {
                authorization: bearerToken
            }
        });
    }
}
